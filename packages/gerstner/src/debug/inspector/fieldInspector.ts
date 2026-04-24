/**
 * Field Inspector — short label and summary helpers for the inspector panel.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from '../../stride/snapshot.js'

/**
 * Short one-line label: "g-shell · 12 cols · exact"
 */
export function renderFieldSummary(snap: GridDebugSnapshot): string {
  const kindLabel =
    snap.field.kind === 'shell'
      ? 'g-shell'
      : snap.field.kind === 'subgrid'
        ? 'g-sub'
        : snap.field.kind === 'view'
          ? `g-view-${snap.field.viewCols ?? snap.field.cols}`
          : snap.field.kind

  return `${kindLabel} · ${snap.field.cols} cols · ${snap.field.relationship}`
}

/**
 * Multi-line inspector text block (for copy-paste / tooltip).
 */
export function renderFieldDetail(snap: GridDebugSnapshot): string {
  const lines = [
    `Field:        ${snap.field.kind}`,
    `Relationship: ${snap.field.relationship}`,
    `Cols:         ${snap.authored.cols}`,
    `Gutter:       ${snap.authored.gutterPx.toFixed(1)}px`,
    `Frame:        ${snap.authored.framePx.toFixed(1)}px`,
    `Unit raw:     ${snap.derived.colUnitRawPx.toFixed(2)}px`,
    `Stride:       ${snap.derived.strideRawPx.toFixed(2)}px`,
    `Content:      ${snap.boundaries.contentStartPx.toFixed(0)}px → ${snap.boundaries.contentEndPx.toFixed(0)}px`,
    `Warnings:     ${snap.warnings.length > 0 ? snap.warnings.map((w) => w.code).join(', ') : 'none'}`,
  ]
  return lines.join('\n')
}
