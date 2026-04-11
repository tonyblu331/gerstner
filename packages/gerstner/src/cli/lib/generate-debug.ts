/**
 * Debug Label Generator — Emits debug label metadata from Stride manifest
 *
 * Phase C expansion: Debug labels provide column/gutter/rhythm metadata
 * for the debug overlay panel.
 *
 * Generated artifact — do not edit by hand.
 *
 * SPDX-License-Identifier: MIT
 */

import type { StrideManifest } from '../../stride/serialize'

export interface DebugLabelSet {
  columns: { index: number; name: string; lineName: string }[]
  gutters: { index: number; name: string; lineName: string }[]
  boundaries: { name: string; lineName: string; description: string }[]
  views: { viewCols: number; name: string; grouping: number[][] }[]
  scales: { step: number; name: string; cssRef: string }[]
}

export function buildDebugLabels(manifest: StrideManifest): DebugLabelSet {
  const columns = Array.from({ length: manifest.contract.cols }, (_, i) => ({
    index: i + 1,
    name: `col-${i + 1}`,
    lineName: `col-${i + 1}`,
  }))

  const gutters = Array.from({ length: manifest.contract.cols - 1 }, (_, i) => ({
    index: i + 1,
    name: `gutter-${i + 1}`,
    lineName: `gutter-${i + 1}`,
  }))

  const boundaries = manifest.boundaries.map((b) => ({
    name: b.name,
    lineName: b.cssLineName,
    description: b.description,
  }))

  const views = manifest.views.map((v) => ({
    viewCols: v.viewCols,
    name: `g-view-${v.viewCols}`,
    grouping: v.divisorGrouping,
  }))

  const scales = [
    { step: -2, name: 'scale--2', cssRef: '--g-scale--2' },
    { step: -1, name: 'scale--1', cssRef: '--g-scale--1' },
    { step: 0, name: 'scale-0', cssRef: '--g-scale-0' },
    { step: 1, name: 'scale-1', cssRef: '--g-scale-1' },
    { step: 2, name: 'scale-2', cssRef: '--g-scale-2' },
    { step: 3, name: 'scale-3', cssRef: '--g-scale-3' },
    { step: 4, name: 'scale-4', cssRef: '--g-scale-4' },
    { step: 5, name: 'scale-5', cssRef: '--g-scale-5' },
  ]

  return { columns, gutters, boundaries, views, scales }
}

export function emitDebugLabelsJson(manifest: StrideManifest): string {
  const labels = buildDebugLabels(manifest)
  return JSON.stringify(labels, null, 2)
}
