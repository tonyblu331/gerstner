/**
 * Stride Core Tests — Canonical Mathematical Source
 *
 * These tests verify every formula in core.ts against known values.
 * When CSS and TS disagree, TS wins and the phase stops.
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vite-plus/test'
import {
  validateContract,
  StrideValidationError,
  computeTypeMetrics,
  computeRawField,
  computeShellField,
  validGutterAnchors,
  isValidGutterAnchor,
  divisorGrouping,
  isDegenerate,
  clampDegenerate,
  type StrideContractInput,
} from '../core'
import { emitManifest, serializeManifest } from '../serialize'

// ---------------------------------------------------------------------------
// Default contract matching CSS :root defaults (px equivalents)
// ---------------------------------------------------------------------------

const DEFAULT_CONTRACT: StrideContractInput = {
  cols: 12,
  gutter: 24,
  frame: 80,
  maxWidth: 1440,
  minAutoTrack: 256,
  typeBase: 16,
  baseline: 8,
  leadingSteps: 3,
  scaleRatio: 1.25,
  measureBody: 70,
  measureTight: 45,
  measureUi: 35,
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe('validateContract', () => {
  it('accepts valid contract', () => {
    expect(() => validateContract(DEFAULT_CONTRACT)).not.toThrow()
  })

  it('rejects cols < 1', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, cols: 0 })).toThrow(StrideValidationError)
    expect(() => validateContract({ ...DEFAULT_CONTRACT, cols: -1 })).toThrow(StrideValidationError)
  })

  it('rejects non-integer cols', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, cols: 1.5 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects negative gutter', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, gutter: -1 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero typeBase', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, typeBase: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero baseline', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, baseline: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero leadingSteps', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, leadingSteps: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero scaleRatio', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, scaleRatio: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero measure', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, measureBody: 0 })).toThrow(
      StrideValidationError,
    )
    expect(() => validateContract({ ...DEFAULT_CONTRACT, measureTight: 0 })).toThrow(
      StrideValidationError,
    )
    expect(() => validateContract({ ...DEFAULT_CONTRACT, measureUi: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('allows gutter = 0', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, gutter: 0 })).not.toThrow()
  })

  it('allows frame = 0', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, frame: 0 })).not.toThrow()
  })

  it('allows cols = 1', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, cols: 1 })).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// Type Metrics
// ---------------------------------------------------------------------------

describe('computeTypeMetrics', () => {
  const metrics = computeTypeMetrics(DEFAULT_CONTRACT)

  it('computes rhythm = baseline * leadingSteps', () => {
    expect(metrics.rhythm).toBe(8 * 3) // 24
  })

  it('computes proseLineHeight = rhythm / typeBase', () => {
    expect(metrics.proseLineHeight).toBe(24 / 16) // 1.5
  })

  it('computes scaleNeg2 = typeBase / (scaleRatio^2)', () => {
    expect(metrics.scaleNeg2).toBeCloseTo(16 / (1.25 * 1.25), 10) // 10.24
  })

  it('computes scaleNeg1 = typeBase / scaleRatio', () => {
    expect(metrics.scaleNeg1).toBeCloseTo(16 / 1.25, 10) // 12.8
  })

  it('computes scale0 = typeBase', () => {
    expect(metrics.scale0).toBe(16)
  })

  it('computes scale1 = scale0 * scaleRatio', () => {
    expect(metrics.scale1).toBeCloseTo(16 * 1.25, 10) // 20
  })

  it('computes scale2 = scale1 * scaleRatio', () => {
    expect(metrics.scale2).toBeCloseTo(20 * 1.25, 10) // 25
  })

  it('computes scale3 = scale2 * scaleRatio', () => {
    expect(metrics.scale3).toBeCloseTo(25 * 1.25, 10) // 31.25
  })

  it('computes scale4 = scale3 * scaleRatio', () => {
    expect(metrics.scale4).toBeCloseTo(31.25 * 1.25, 10) // 39.0625
  })

  it('computes scale5 = scale4 * scaleRatio', () => {
    expect(metrics.scale5).toBeCloseTo(39.0625 * 1.25, 10) // 48.828125
  })

  it('computes densityTight = rhythm * 3', () => {
    expect(metrics.densityTight).toBe(24 * 3) // 72
  })

  it('computes densityStandard = rhythm * 6', () => {
    expect(metrics.densityStandard).toBe(24 * 6) // 144
  })

  it('computes densityLoose = rhythm * 10', () => {
    expect(metrics.densityLoose).toBe(24 * 10) // 240
  })
})

// ---------------------------------------------------------------------------
// Raw Field
// ---------------------------------------------------------------------------

describe('computeRawField', () => {
  const field = computeRawField(1440, DEFAULT_CONTRACT)

  it('computes gapTotal = gutter * (cols - 1)', () => {
    expect(field.gapTotal).toBe(24 * 11) // 264
  })

  it('computes unit = (inlineSize - gapTotal) / cols', () => {
    expect(field.unit).toBeCloseTo((1440 - 264) / 12, 10) // 98
  })

  it('computes stride = unit + gutter', () => {
    expect(field.stride).toBeCloseTo(98 + 24, 10) // 122
  })

  it('raw field has no frame offset', () => {
    expect(field.fullStart).toBe(0)
    expect(field.contentStart).toBe(0)
    expect(field.contentEnd).toBe(1440)
    expect(field.fullEnd).toBe(1440)
  })

  it('computes linePositions[n] = n * stride', () => {
    expect(field.linePositions).toHaveLength(12)
    expect(field.linePositions[0]).toBe(0)
    expect(field.linePositions[1]).toBeCloseTo(122, 10)
    expect(field.linePositions[11]).toBeCloseTo(1342, 10)
  })

  it('computes gutterCenters correctly', () => {
    expect(field.gutterCenters).toHaveLength(11)
    // gutter center after col 1: 1*unit + 0.5*gutter = 98 + 12 = 110
    expect(field.gutterCenters[0]).toBeCloseTo(110, 10)
  })
})

// ---------------------------------------------------------------------------
// Shell Field
// ---------------------------------------------------------------------------

describe('computeShellField', () => {
  const field = computeShellField(1440, DEFAULT_CONTRACT)

  it('computes contentInline = max(0, min(maxWidth, outerInlineSize - frame*2))', () => {
    expect(field.contentEnd - field.contentStart).toBeLessThanOrEqual(DEFAULT_CONTRACT.maxWidth)
    // With frame=80, outerInline=1440: contentInline = min(1440, 1440-160) = 1280
    // But maxWidth=1440 so contentInline = min(1440, 1280) = 1280
  })

  it('computes gapTotal = gutter * (cols - 1)', () => {
    expect(field.gapTotal).toBe(24 * 11) // 264
  })

  it('shell field has frame offset', () => {
    expect(field.fullStart).toBe(0)
    expect(field.contentStart).toBe(80) // frame
    expect(field.fullEnd).toBe(1440)
  })

  it('computes linePositions with frame offset', () => {
    expect(field.linePositions).toHaveLength(12)
    expect(field.linePositions[0]).toBe(80) // contentStart
    // contentInline = min(1440, 1280) = 1280, stride = (1280-264)/12 + 24 = 108.667
    expect(field.linePositions[1]).toBeCloseTo(80 + (1280 - 264) / 12 + 24, 10)
  })

  it('clamps contentInline to 0 when outerInlineSize < frame*2', () => {
    const tiny = computeShellField(100, { ...DEFAULT_CONTRACT, frame: 80 })
    // outerInline=100, frame*2=160, so contentInline = max(0, min(1440, 100-160)) = 0
    expect(tiny.contentEnd - tiny.contentStart).toBe(0)
    expect(tiny.unit).toBeLessThanOrEqual(0)
  })

  it('clamps contentInline to maxWidth when viewport is huge', () => {
    const huge = computeShellField(3000, DEFAULT_CONTRACT)
    // outerInline=3000, frame*2=160, contentInline = min(1440, 2840) = 1440
    expect(huge.contentEnd - huge.contentStart).toBe(DEFAULT_CONTRACT.maxWidth)
  })
})

// ---------------------------------------------------------------------------
// Gutter Anchors
// ---------------------------------------------------------------------------

describe('gutter anchors', () => {
  it('validGutterAnchors returns 1..cols-1', () => {
    const anchors = validGutterAnchors(12)
    expect(anchors).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })

  it('returns empty for cols=1', () => {
    expect(validGutterAnchors(1)).toEqual([])
  })

  it('isValidGutterAnchor rejects 0', () => {
    expect(isValidGutterAnchor(0, 12)).toBe(false)
  })

  it('isValidGutterAnchor rejects cols (edge)', () => {
    expect(isValidGutterAnchor(12, 12)).toBe(false)
  })

  it('isValidGutterAnchor accepts 1..cols-1', () => {
    expect(isValidGutterAnchor(1, 12)).toBe(true)
    expect(isValidGutterAnchor(11, 12)).toBe(true)
  })

  it('isValidGutterAnchor rejects non-integer', () => {
    expect(isValidGutterAnchor(1.5, 12)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Divisor Grouping
// ---------------------------------------------------------------------------

describe('divisorGrouping', () => {
  it('groups 12 into 2 columns', () => {
    const groups = divisorGrouping(12, 2)
    expect(groups).toEqual([
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12],
    ])
  })

  it('groups 12 into 4 columns', () => {
    const groups = divisorGrouping(12, 4)
    expect(groups).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
    ])
  })

  it('groups 12 into 6 columns', () => {
    const groups = divisorGrouping(12, 6)
    expect(groups).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
      [11, 12],
    ])
  })

  it('throws when viewCols does not divide baseCols', () => {
    expect(() => divisorGrouping(12, 5)).toThrow()
    expect(() => divisorGrouping(12, 7)).toThrow()
  })

  it('throws when viewCols > baseCols', () => {
    expect(() => divisorGrouping(6, 12)).toThrow()
  })

  it('8 does not divide 12 — view-8 is excluded', () => {
    expect(() => divisorGrouping(12, 8)).toThrow()
  })
})

// ---------------------------------------------------------------------------
// Degenerate / Narrow-Width Behavior
// ---------------------------------------------------------------------------

describe('degenerate behavior', () => {
  it('detects degenerate field', () => {
    const tiny = computeRawField(100, { ...DEFAULT_CONTRACT, gutter: 24 })
    // 100 - 264 = -164, unit = -164/12 < 0
    expect(isDegenerate(tiny)).toBe(true)
  })

  it('non-degenerate field is not flagged', () => {
    const field = computeRawField(1440, DEFAULT_CONTRACT)
    expect(isDegenerate(field)).toBe(false)
  })

  it('clampDegenerate zeroes out unit and positions', () => {
    const tiny = computeRawField(100, DEFAULT_CONTRACT)
    const clamped = clampDegenerate(tiny)
    expect(clamped.unit).toBe(0)
    expect(clamped.linePositions.every((p) => p === 0)).toBe(true)
    expect(clamped.gutterCenters.every((g) => g === 0)).toBe(true)
  })

  it('clampDegenerate is identity for non-degenerate', () => {
    const field = computeRawField(1440, DEFAULT_CONTRACT)
    const clamped = clampDegenerate(field)
    expect(clamped).toEqual(field)
  })
})

// ---------------------------------------------------------------------------
// Manifest Emission
// ---------------------------------------------------------------------------

describe('emitManifest', () => {
  it('emits a valid manifest for default contract', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    expect(manifest.version).toBe(1)
    expect(manifest.tokens.length).toBeGreaterThan(0)
    expect(manifest.helperRanges.length).toBeGreaterThan(0)
    expect(manifest.gutterAnchors).toHaveLength(11)
    expect(manifest.views.length).toBeGreaterThan(0)
    expect(manifest.fixtures.length).toBe(7)
  })

  it('throws for invalid contract', () => {
    expect(() => emitManifest({ ...DEFAULT_CONTRACT, cols: 0 })).toThrow()
  })

  it('throws for degenerate sample geometry', () => {
    const tiny: StrideContractInput = { ...DEFAULT_CONTRACT, maxWidth: 10 }
    expect(() => emitManifest(tiny)).toThrow()
  })

  it('manifest typeMetrics match computeTypeMetrics', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    const metrics = computeTypeMetrics(DEFAULT_CONTRACT)
    expect(manifest.typeMetrics.rhythm).toBe(metrics.rhythm)
    expect(manifest.typeMetrics.proseLineHeight).toBeCloseTo(metrics.proseLineHeight, 10)
    expect(manifest.typeMetrics.scale0).toBe(metrics.scale0)
    expect(manifest.typeMetrics.scale5).toBeCloseTo(metrics.scale5, 10)
  })

  it('manifest rawFieldSample matches computeRawField', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    const field = computeRawField(1440, DEFAULT_CONTRACT)
    expect(manifest.rawFieldSample.gapTotal).toBe(field.gapTotal)
    expect(manifest.rawFieldSample.unit).toBeCloseTo(field.unit, 10)
    expect(manifest.rawFieldSample.stride).toBeCloseTo(field.stride, 10)
  })

  it('manifest shellFieldSample matches computeShellField', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    const field = computeShellField(1440, DEFAULT_CONTRACT)
    expect(manifest.shellFieldSample.gapTotal).toBe(field.gapTotal)
    expect(manifest.shellFieldSample.contentStart).toBe(field.contentStart)
  })

  it('excludes view-8 from views (8 does not divide 12)', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    const view8 = manifest.views.find((v) => v.viewCols === 8)
    expect(view8).toBeUndefined()
  })

  it('includes view-2, view-3, view-4, view-6, view-12', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    const viewCols = manifest.views.map((v) => v.viewCols)
    expect(viewCols).toContain(2)
    expect(viewCols).toContain(3)
    expect(viewCols).toContain(4)
    expect(viewCols).toContain(6)
    expect(viewCols).toContain(12)
  })
})

describe('serializeManifest', () => {
  it('produces valid JSON', () => {
    const json = serializeManifest(DEFAULT_CONTRACT)
    const parsed = JSON.parse(json)
    expect(parsed.version).toBe(1)
    expect(parsed.contract.cols).toBe(12)
  })

  it('is deterministic for same input', () => {
    // Strip generatedAt for comparison
    const json1 = serializeManifest(DEFAULT_CONTRACT)
    const json2 = serializeManifest(DEFAULT_CONTRACT)
    const p1 = JSON.parse(json1)
    const p2 = JSON.parse(json2)
    // Same contract, same computed values
    expect(p1.contract).toEqual(p2.contract)
    expect(p1.typeMetrics).toEqual(p2.typeMetrics)
    expect(p1.rawFieldSample).toEqual(p2.rawFieldSample)
  })
})
