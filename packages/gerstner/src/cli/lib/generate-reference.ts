/**
 * Reference Metadata Generator — Emits reference fixture metadata from Stride manifest
 *
 * Phase C expansion: Reference metadata provides fixture data for the
 * dev-only reference page used in visual testing.
 *
 * Generated artifact — do not edit by hand.
 *
 * SPDX-License-Identifier: MIT
 */

import type { StrideManifest } from '../../stride/serialize'

export interface ReferenceFixtureMeta {
  id: string
  name: string
  path: string
  contractCols: number
  viewModes: { viewCols: number; grouping: number[][] }[]
  alignModes: { name: string; mode: string }[]
}

export function buildReferenceMetadata(manifest: StrideManifest): ReferenceFixtureMeta[] {
  return manifest.fixtures.map((f) => ({
    id: f.id,
    name: f.name,
    path: f.path,
    contractCols: manifest.contract.cols,
    viewModes: manifest.views.map((v) => ({
      viewCols: v.viewCols,
      grouping: v.divisorGrouping,
    })),
    alignModes: manifest.alignModes.map((a) => ({
      name: a.name,
      mode: a.mode,
    })),
  }))
}

export function emitReferenceMetadataJson(manifest: StrideManifest): string {
  const meta = buildReferenceMetadata(manifest)
  return JSON.stringify(meta, null, 2)
}
