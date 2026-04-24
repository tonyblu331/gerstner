/**
 * Stride Observer — Passive debug geometry reader
 *
 * Sources all geometry from stride/snapshot.ts (buildSnapshot).
 * Contains zero layout formulas. No drift heuristics.
 *
 * Debug reads truth. Debug never computes truth.
 *
 * SPDX-License-Identifier: MIT
 */

import { buildSnapshot, buildAllSnapshots, type GridDebugSnapshot } from 'gerstner/stride/snapshot'

export type { GridDebugSnapshot } from 'gerstner/stride/snapshot'
export type {
  AlignmentTruth,
  FieldKind,
  DebugWarning,
  DebugWarningCode,
} from 'gerstner/stride/snapshot'

export interface ObserverMetrics {
  colPx: number
  gutterPx: number
  stridePx: number
  framePx: number
  frameOffsetPx: number
  baselinePx: number
  rhythmPx: number
  cols: number
}

/**
 * Read metrics for a scope element by building a snapshot.
 * Returns an ObserverMetrics shape for backward compat with syncDebugMetrics callers.
 * All values come from buildSnapshot() — no layout math in observer.
 */
export function readMetrics(scope: HTMLElement): ObserverMetrics | null {
  const snap = buildSnapshot(scope)
  if (!snap || snap.derived.colUnitRawPx <= 0) return null

  const frameOffsetPx = (snap.rect.width - snap.derived.contentInlinePx) / 2

  return {
    colPx: snap.derived.colUnitRawPx,
    gutterPx: snap.authored.gutterPx,
    stridePx: snap.derived.strideRawPx,
    framePx: snap.authored.framePx,
    frameOffsetPx,
    baselinePx: snap.authored.baselinePx,
    rhythmPx: snap.derived.rhythmPx,
    cols: snap.authored.cols,
  }
}

/**
 * Find all Gerstner scope elements. Delegates to buildAllSnapshots.
 */
export function readScopes(): HTMLElement[] {
  const selector = '.g-shell, .g, .g-fit, .g-fill, .g-sub, [class*="g-view-"], .g-align-independent'
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
}

/**
 * Build snapshots for all scopes in the document.
 */
export { buildAllSnapshots }

/**
 * Sync debug overlay pixel values from a snapshot.
 * Sets --g-debug-col-px, --g-debug-gutter-px, --g-debug-stride-px
 * on the debug root for CSS gradient overlays.
 */
export function syncDebugMetrics(debugRoot: HTMLElement, scope: HTMLElement): void {
  const snap = buildSnapshot(scope)

  if (snap && snap.derived.colUnitRawPx > 0) {
    document.body.style.setProperty('--g-debug-baseline-px', `${snap.authored.baselinePx}px`)
    document.body.style.setProperty('--g-debug-rhythm-px', `${snap.derived.rhythmPx}px`)
    debugRoot.style.setProperty('--g-debug-col-px', `${snap.derived.colUnitRawPx}px`)
    debugRoot.style.setProperty('--g-debug-gutter-px', `${snap.authored.gutterPx}px`)
    debugRoot.style.setProperty('--g-debug-stride-px', `${snap.derived.strideRawPx}px`)
    debugRoot.style.setProperty('--g-debug-frame-px', `${snap.authored.framePx}px`)
    debugRoot.style.setProperty('--g-cols', String(snap.authored.cols))
    return
  }

  // Fallback: publish typography-only metrics when grid is degenerate
  const cs = getComputedStyle(scope)
  const rootFontPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const baselinePx = parseFloat(cs.getPropertyValue('--g-baseline')) * rootFontPx || 8
  const leadingSteps = parseFloat(cs.getPropertyValue('--g-leading-steps')) || 3
  document.body.style.setProperty('--g-debug-baseline-px', `${baselinePx}px`)
  document.body.style.setProperty('--g-debug-rhythm-px', `${baselinePx * leadingSteps}px`)
}

const COL_OVERLAY_CLASS = 'g-debug-col-overlay'

/**
 * Inject or update per-shell column overlay driven by GridDebugSnapshot line positions.
 * Uses absolute positioning with gradient stripes. No layout shift.
 *
 * Called when the cols layer is active. Removes all overlays when inactive.
 */
export function syncShellOverlays(colsActive: boolean): void {
  document.querySelectorAll<HTMLElement>(`.${COL_OVERLAY_CLASS}`).forEach((el) => el.remove())

  if (!colsActive) return

  const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
  if (!debugRoot) return

  const shells = document.querySelectorAll<HTMLElement>('.g-shell')
  shells.forEach((shell) => {
    const snap = buildSnapshot(shell)
    if (!snap || snap.derived.colUnitRawPx <= 0) return

    const overlay = document.createElement('div')
    overlay.className = COL_OVERLAY_CLASS
    overlay.setAttribute('aria-hidden', 'true')

    const { colUnitRawPx, strideRawPx } = snap.derived
    const cols = snap.authored.cols

    const stops: string[] = []
    for (let i = 0; i < cols; i++) {
      const colStart = i * strideRawPx
      const gutterStart = colStart + colUnitRawPx

      stops.push(
        `transparent ${colStart}px`,
        `var(--g-debug-col-tint) ${colStart}px`,
        `var(--g-debug-col-tint) ${gutterStart}px`,
        `transparent ${gutterStart}px`,
      )
    }

    const rect = shell.getBoundingClientRect()
    const frameOffsetPx = snap.boundaries.contentStartPx - snap.boundaries.fullStartPx
    overlay.style.cssText = [
      'position:absolute',
      `top:${rect.top + window.scrollY}px`,
      `left:${rect.left + window.scrollX + frameOffsetPx}px`,
      `width:${snap.boundaries.contentEndPx - snap.boundaries.contentStartPx}px`,
      `height:${rect.height}px`,
      'pointer-events:none',
      'z-index:9998',
      `background-image:linear-gradient(to right, ${stops.join(', ')})`,
    ].join(';')

    debugRoot.appendChild(overlay)
  })
}
