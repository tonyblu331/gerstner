/**
 * Stride Observer — Manifest-aware debug metrics
 *
 * Replaces drift.ts heuristic with manifest-truth observation.
 * Reads resolved CSS custom properties from the DOM (set by stride/index.css)
 * and publishes them as debug overlay pixel values.
 *
 * No layout math lives here. All derived values come from stride tokens.
 *
 * SPDX-License-Identifier: MIT
 */

export interface ObserverMetrics {
  colPx: number
  gutterPx: number
  stridePx: number
  framePx: number
  baselinePx: number
  rhythmPx: number
  cols: number
}

export interface DriftReport {
  parentColPx: number
  childColPx: number
  driftPx: number
  aligned: boolean
}

const SCOPE_SELECTOR = '.g-shell, .g, .g-fit, .g-fill, .g-sub'

/**
 * Read resolved stride metrics from a scope element.
 *
 * Registered @property tokens (--g-cols, --g-gutter, --g-frame, --g-baseline,
 * --g-max-width, --g-leading-steps) resolve to computed values via getComputedStyle.
 * Unregistered derived tokens (--g-stride, --g-rhythm, --g-col-unit-raw) do NOT —
 * they return raw calc() strings. So we compute derived values from resolved inputs
 * plus the element's actual inline size.
 */
function toPx(val: string, rootFontSize: number): number {
  const trimmed = val.trim()
  if (!trimmed) return 0
  if (trimmed.endsWith('rem')) return parseFloat(trimmed) * rootFontSize
  if (trimmed.endsWith('px')) return parseFloat(trimmed)
  return parseFloat(trimmed) || 0
}

export function readMetrics(scope: HTMLElement): ObserverMetrics | null {
  const cs = getComputedStyle(scope)
  // Read actual root font-size — never assume 16px
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

  // Registered properties — resolve to computed values, convert rem→px
  const cols = parseInt(cs.getPropertyValue('--g-cols')) || 12
  const gutterPx = toPx(cs.getPropertyValue('--g-gutter'), rootFontSize) || 16
  const baselinePx = toPx(cs.getPropertyValue('--g-baseline'), rootFontSize) || 8
  const leadingSteps = parseFloat(cs.getPropertyValue('--g-leading-steps')) || 3
  const framePx = toPx(cs.getPropertyValue('--g-frame'), rootFontSize) || 16
  const maxwidthPx = toPx(cs.getPropertyValue('--g-max-width'), rootFontSize) || 1440

  // Derived: rhythm = baseline × leading-steps
  const rhythmPx = baselinePx * leadingSteps

  // Derived: stride from resolved inputs + element dimensions
  // Mirrors stride/index.css :root formula but uses pixel values
  const contentInline = Math.min(maxwidthPx, scope.clientWidth - framePx * 2)
  const gapTotal = gutterPx * (cols - 1)
  const colUnitRaw = (contentInline - gapTotal) / cols
  const stridePx = colUnitRaw + gutterPx
  const colPx = colUnitRaw

  if (colPx <= 0) return null

  return { colPx, gutterPx, stridePx, framePx, baselinePx, rhythmPx, cols }
}

/**
 * Detect alignment drift between parent and child grids.
 * Uses stride tokens (manifest truth) instead of heuristic track parsing.
 */
export function detectDrift(child: HTMLElement): DriftReport | null {
  const parent = child.closest<HTMLElement>(SCOPE_SELECTOR)
  if (!parent || parent === child) return null

  const parentMetrics = readMetrics(parent)
  const childMetrics = readMetrics(child)
  if (!parentMetrics || !childMetrics) return null

  const driftPx = Math.abs(parentMetrics.colPx - childMetrics.colPx)
  const aligned = driftPx < 1

  return {
    parentColPx: parentMetrics.colPx,
    childColPx: childMetrics.colPx,
    driftPx,
    aligned,
  }
}

/**
 * Apply drift detection to all subgrid children.
 * Sets data attributes for CSS visualization.
 */
export function applyDriftDetection(): void {
  const subgrids = document.querySelectorAll<HTMLElement>('.g-sub')
  subgrids.forEach((subgrid) => {
    const report = detectDrift(subgrid)
    if (report && !report.aligned) {
      subgrid.setAttribute('data-g-debug-drift-px', report.driftPx.toFixed(2))
      subgrid.setAttribute('data-g-debug-drift-label', subgrid.tagName.toLowerCase())
    } else {
      subgrid.removeAttribute('data-g-debug-drift-px')
      subgrid.removeAttribute('data-g-debug-drift-label')
    }
  })
}

/**
 * Sync debug overlay pixel values from stride tokens.
 * Sets --g-debug-col-px, --g-debug-gutter-px, --g-debug-stride-px
 * on the debug root for CSS gradient overlays.
 */
export function syncDebugMetrics(debugRoot: HTMLElement, scope: HTMLElement): void {
  const metrics = readMetrics(scope)
  if (!metrics) return

  debugRoot.style.setProperty('--g-debug-col-px', `${metrics.colPx}px`)
  debugRoot.style.setProperty('--g-debug-gutter-px', `${metrics.gutterPx}px`)
  debugRoot.style.setProperty('--g-debug-stride-px', `${metrics.stridePx}px`)
  debugRoot.style.setProperty('--g-debug-frame-px', `${metrics.framePx}px`)
  debugRoot.style.setProperty('--g-cols', String(metrics.cols))
}

const COL_OVERLAY_CLASS = 'g-debug-col-overlay'

/**
 * Inject or update per-shell column overlay divs.
 * Each .g-shell gets its own absolutely-positioned overlay reflecting its actual
 * resolved tokens — not a global fixed overlay using :root defaults.
 *
 * Called when the cols layer is active. Removes all overlays when inactive.
 */
export function syncShellOverlays(colsActive: boolean): void {
  // Remove existing overlays on all shells first
  document.querySelectorAll<HTMLElement>(`.${COL_OVERLAY_CLASS}`).forEach((el) => el.remove())

  if (!colsActive) return

  const shells = document.querySelectorAll<HTMLElement>('.g-shell')
  shells.forEach((shell) => {
    // Ensure shell has position context for the absolute overlay
    const pos = getComputedStyle(shell).position
    if (pos === 'static') {
      shell.style.position = 'relative'
    }

    const metrics = readMetrics(shell)
    if (!metrics) return

    const overlay = document.createElement('div')
    overlay.className = COL_OVERLAY_CLASS
    overlay.setAttribute('aria-hidden', 'true')
    overlay.style.cssText = [
      'position:absolute',
      // Inset by frame so overlay sits on content area, not padding area
      `inset-inline:${metrics.framePx}px`,
      'inset-block:0',
      'pointer-events:none',
      'z-index:9998',
      `--g-debug-col-px:${metrics.colPx}px`,
      `--g-debug-gutter-px:${metrics.gutterPx}px`,
      `--g-debug-stride-px:${metrics.stridePx}px`,
      `--g-cols:${metrics.cols}`,
    ].join(';')

    shell.appendChild(overlay)
  })
}
