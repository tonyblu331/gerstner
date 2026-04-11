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
 * Uses computed style to get pixel-resolved values of stride tokens.
 */
export function readMetrics(scope: HTMLElement): ObserverMetrics | null {
  const cs = getComputedStyle(scope)

  const cols = parseInt(cs.getPropertyValue('--g-cols')) || 12
  const baselinePx = parseFloat(cs.getPropertyValue('--g-baseline')) || 8
  const rhythmPx = parseFloat(cs.getPropertyValue('--g-rhythm')) || 24
  const gutterPx = parseFloat(cs.getPropertyValue('--g-gutter')) || 24
  const stridePx = parseFloat(cs.getPropertyValue('--g-stride')) || 0

  // Column unit from stride token — stride = col-unit + gutter
  const colPx = stridePx - gutterPx

  if (colPx <= 0) return null

  return { colPx, gutterPx, stridePx, baselinePx, rhythmPx, cols }
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
}
