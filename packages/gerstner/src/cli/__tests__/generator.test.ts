/**
 * Generator Tests — Validates all generator outputs from Stride manifest
 *
 * Covers:
 * - CSS helpers emission (generate-helpers.ts)
 * - TW4 helpers emission (generate-tw4.ts)
 * - Debug labels emission (generate-debug.ts)
 * - Reference metadata emission (generate-reference.ts)
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vite-plus/test'
import { type StrideContractInput } from '../../stride/core'
import { emitManifest } from '../../stride/serialize'
import { emitCssHelpers } from '../lib/generate-helpers'
import { emitTw4Helpers } from '../lib/generate-tw4'
import { buildDebugLabels, emitDebugLabelsJson } from '../lib/generate-debug'
import { buildReferenceMetadata, emitReferenceMetadataJson } from '../lib/generate-reference'

const DEFAULT_CONTRACT: StrideContractInput = {
  cols: 12,
  gutterPx: 24,
  framePx: 80,
  maxInlinePx: 1440,
  minAutoTrackPx: 256,
  typeBasePx: 16,
  baselinePx: 8,
  leadingSteps: 3,
  scaleRatio: 1.25,
  measureBodyPx: 70,
  measureTightPx: 45,
  measureUiPx: 35,
}

const manifest = emitManifest(DEFAULT_CONTRACT)

// ---------------------------------------------------------------------------
// CSS Helpers
// ---------------------------------------------------------------------------

describe('emitCssHelpers', () => {
  const output = emitCssHelpers(manifest)

  it('includes @layer gerstner.helpers wrapper', () => {
    expect(output).toContain('@layer gerstner.helpers {')
    expect(output.trimEnd()).toContain('}')
  })

  it('includes GENERATED ARTIFACT header', () => {
    expect(output).toContain('GENERATED ARTIFACT')
  })

  it('emits col-* helpers as .class selectors', () => {
    expect(output).toContain('.col-1 {')
    expect(output).toContain('.col-12 {')
    expect(output).toContain('grid-column: span 12 / span 12')
  })

  it('emits col-start-* helpers', () => {
    expect(output).toContain('.col-start-1 {')
    expect(output).toContain('.col-start-12 {')
  })

  it('emits col-end-* helpers', () => {
    expect(output).toContain('.col-end-1 {')
    expect(output).toContain('.col-end-13 {')
  })

  it('emits col-start-* with nth-occurrence named lines', () => {
    expect(output).toContain('grid-column-start: col 1')
    expect(output).toContain('grid-column-start: col 12')
  })

  it('emits col-end-* with nth-occurrence named lines', () => {
    expect(output).toContain('grid-column-end: col 1')
    expect(output).toContain('grid-column-end: col 13')
  })

  it('emits gutter line aliases as col (k+1) (gap-based grid has no gutter- line names)', () => {
    expect(output).toContain('.col-from-gutter-1 {')
    expect(output).toContain('grid-column-start: col 2')
    expect(output).toContain('.col-to-gutter-11 {')
    expect(output).toContain('grid-column-end: col 12')
  })

  it('does not emit col-from-N / col-to-N numeric helpers (removed)', () => {
    expect(output).not.toContain('.col-from-1 {')
    expect(output).not.toContain('.col-to-1 {')
  })

  it('emits boundary helpers', () => {
    expect(output).toContain('.g-content {')
    expect(output).toContain('.g-breakout-l {')
    expect(output).toContain('.g-breakout-r {')
  })

  it('emits named line helpers', () => {
    expect(output).toContain('.col-from-content-start {')
    expect(output).toContain('.col-to-full-end {')
  })

  it('emits view helpers from manifest views', () => {
    expect(output).toContain('.g-view-2 {')
    expect(output).toContain('.g-view-12 {')
  })

  it('does not include g-view-8 (8 does not divide 12)', () => {
    expect(output).not.toContain('.g-view-8 {')
  })

  it('emits align mode helpers', () => {
    expect(output).toContain('.g-align-independent {')
  })

  it('emits density helpers', () => {
    expect(output).toContain('.g-tight {')
    expect(output).toContain('.g-standard {')
    expect(output).toContain('.g-loose {')
  })

  it('emits wrap helpers', () => {
    expect(output).toContain('.g-wrap-balance {')
    expect(output).toContain('.g-wrap-nowrap {')
  })

  it('does not emit col-offset-* (deleted)', () => {
    expect(output).not.toContain('col-offset')
  })

  it('emits g-stack helpers', () => {
    expect(output).toContain('.g-stack-1 {')
    expect(output).toContain('.g-stack-6 {')
  })
})

// ---------------------------------------------------------------------------
// TW4 Helpers
// ---------------------------------------------------------------------------

describe('emitTw4Helpers', () => {
  const output = emitTw4Helpers(manifest)

  it('includes GENERATED ARTIFACT header', () => {
    expect(output).toContain('GENERATED ARTIFACT')
  })

  it('emits col-* helpers as @utility selectors', () => {
    expect(output).toContain('@utility col-1 {')
    expect(output).toContain('@utility col-12 {')
  })

  it('emits col-start-* as @utility', () => {
    expect(output).toContain('@utility col-start-1 {')
    expect(output).toContain('@utility col-start-12 {')
  })

  it('emits col-end-* as @utility', () => {
    expect(output).toContain('@utility col-end-1 {')
    expect(output).toContain('@utility col-end-13 {')
  })

  it('emits col-start-* with nth-occurrence named lines as @utility', () => {
    expect(output).toContain('grid-column-start: col 1')
  })

  it('emits col-end-* with nth-occurrence named lines as @utility', () => {
    expect(output).toContain('grid-column-end: col 1')
  })

  it('emits gutter line aliases as @utility mapped to col lines', () => {
    expect(output).toContain('@utility col-from-gutter-1 {')
    expect(output).toContain('@utility col-to-gutter-11 {')
  })

  it('does not emit col-from-N / col-to-N numeric helpers (removed)', () => {
    expect(output).not.toContain('@utility col-from-1 {')
    expect(output).not.toContain('@utility col-to-1 {')
  })

  it('emits boundary helpers as @utility', () => {
    expect(output).toContain('@utility g-content {')
    expect(output).toContain('@utility g-breakout-l {')
  })

  it('emits named line helpers as @utility', () => {
    expect(output).toContain('@utility col-from-content-start {')
  })

  it('emits view helpers as @utility', () => {
    expect(output).toContain('@utility g-view-2 {')
  })

  it('does not include g-view-8', () => {
    expect(output).not.toContain('@utility g-view-8 {')
  })

  it('emits density helpers as @utility', () => {
    expect(output).toContain('@utility g-tight {')
    expect(output).toContain('@utility g-loose {')
  })

  it('emits wrap helpers as @utility', () => {
    expect(output).toContain('@utility g-wrap-balance {')
  })

  it('does not emit col-offset-*', () => {
    expect(output).not.toContain('col-offset')
  })

  it('uses @utility syntax, not .class syntax', () => {
    expect(output).not.toContain('.col-1 {')
    expect(output).toContain('@utility col-1 {')
  })
})

// ---------------------------------------------------------------------------
// Debug Labels
// ---------------------------------------------------------------------------

describe('buildDebugLabels', () => {
  const labels = buildDebugLabels(manifest)

  it('has 12 columns', () => {
    expect(labels.columns).toHaveLength(12)
    expect(labels.columns[0].name).toBe('col-1')
    expect(labels.columns[0].lineName).toBe('col 1')
    expect(labels.columns[11].name).toBe('col-12')
    expect(labels.columns[11].lineName).toBe('col 12')
  })

  it('has 11 gutters', () => {
    expect(labels.gutters).toHaveLength(11)
    expect(labels.gutters[0].name).toBe('gutter-1')
    expect(labels.gutters[0].lineName).toBe('col 2')
    expect(labels.gutters[10].name).toBe('gutter-11')
    expect(labels.gutters[10].lineName).toBe('col 12')
  })

  it('has 4 boundaries', () => {
    expect(labels.boundaries).toHaveLength(4)
    const names = labels.boundaries.map((b) => b.name)
    expect(names).toContain('full-start')
    expect(names).toContain('content-start')
    expect(names).toContain('content-end')
    expect(names).toContain('full-end')
  })

  it('has views matching manifest', () => {
    expect(labels.views).toHaveLength(manifest.views.length)
    expect(labels.views[0].viewCols).toBe(2)
  })

  it('has 8 scale steps', () => {
    expect(labels.scales).toHaveLength(8)
    expect(labels.scales[0].step).toBe(-2)
    expect(labels.scales[7].step).toBe(5)
  })
})

describe('emitDebugLabelsJson', () => {
  it('produces valid JSON', () => {
    const json = emitDebugLabelsJson(manifest)
    const parsed = JSON.parse(json)
    expect(parsed.columns).toHaveLength(12)
    expect(parsed.gutters).toHaveLength(11)
  })

  it('is deterministic', () => {
    const a = emitDebugLabelsJson(manifest)
    const b = emitDebugLabelsJson(manifest)
    expect(a).toBe(b)
  })
})

// ---------------------------------------------------------------------------
// Reference Metadata
// ---------------------------------------------------------------------------

describe('buildReferenceMetadata', () => {
  const meta = buildReferenceMetadata(manifest)

  it('has fixture for each manifest fixture', () => {
    expect(meta).toHaveLength(manifest.fixtures.length)
  })

  it('includes contract cols in each fixture', () => {
    for (const f of meta) {
      expect(f.contractCols).toBe(12)
    }
  })

  it('includes view modes', () => {
    expect(meta[0].viewModes.length).toBeGreaterThan(0)
    expect(meta[0].viewModes[0].viewCols).toBe(2)
  })

  it('includes align modes', () => {
    expect(meta[0].alignModes.length).toBeGreaterThan(0)
  })
})

describe('emitReferenceMetadataJson', () => {
  it('produces valid JSON', () => {
    const json = emitReferenceMetadataJson(manifest)
    const parsed = JSON.parse(json)
    expect(parsed).toHaveLength(manifest.fixtures.length)
  })

  it('is deterministic', () => {
    const a = emitReferenceMetadataJson(manifest)
    const b = emitReferenceMetadataJson(manifest)
    expect(a).toBe(b)
  })
})
