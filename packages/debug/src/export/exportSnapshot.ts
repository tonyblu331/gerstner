/**
 * Snapshot Export — serializes GridDebugSnapshot to JSON for clipboard/download.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from 'gerstner/stride/snapshot'

/**
 * Serialize a snapshot to a JSON string (element ref is omitted — not serializable).
 */
export function exportSnapshot(snap: GridDebugSnapshot): string {
  const { element: _el, ...rest } = snap
  return JSON.stringify(rest, null, 2)
}

/**
 * Copy a snapshot to the clipboard.
 * Returns the serialized string regardless of clipboard availability.
 */
export function copySnapshotToClipboard(snap: GridDebugSnapshot): string {
  const json = exportSnapshot(snap)
  navigator.clipboard?.writeText(json).catch(() => {})
  return json
}

/**
 * Build a CSS contract string from a snapshot's authored values.
 * Suitable for pasting into a stylesheet.
 */
export function exportContractFromSnapshot(snap: GridDebugSnapshot): string {
  const a = snap.authored
  return `:root {
  --g-cols: ${a.cols};
  --g-gutter: ${a.gutterPx}px;
  --g-frame: ${a.framePx}px;
  --g-max-width: ${a.maxInlinePx}px;
  --g-min: ${a.minAutoTrackPx}px;
  --g-type-base: ${a.typeBasePx}px;
  --g-baseline: ${a.baselinePx}px;
  --g-leading-steps: ${a.leadingSteps};
  --g-scale-ratio: ${a.scaleRatio};
  --g-measure-body: ${a.measureBodyPx}px;
  --g-measure-tight: ${a.measureTightPx}px;
  --g-measure-ui: ${a.measureUiPx}px;
}`
}
