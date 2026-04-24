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
    expect(() => validateContract({ ...DEFAULT_CONTRACT, gutterPx: -1 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero typeBase', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, typeBasePx: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('rejects zero baseline', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, baselinePx: 0 })).toThrow(
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
    expect(() => validateContract({ ...DEFAULT_CONTRACT, measureBodyPx: 0 })).toThrow(
      StrideValidationError,
    )
    expect(() => validateContract({ ...DEFAULT_CONTRACT, measureTightPx: 0 })).toThrow(
      StrideValidationError,
    )
    expect(() => validateContract({ ...DEFAULT_CONTRACT, measureUiPx: 0 })).toThrow(
      StrideValidationError,
    )
  })

  it('allows gutter = 0', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, gutterPx: 0 })).not.toThrow()
  })

  it('allows frame = 0', () => {
    expect(() => validateContract({ ...DEFAULT_CONTRACT, framePx: 0 })).not.toThrow()
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

  it('computes gapTotalPx = gutterPx * (cols - 1)', () => {
    expect(field.gapTotalPx).toBe(24 * 11) // 264
  })

  it('computes unitRawPx = (inlineSize - gapTotalPx) / cols', () => {
    expect(field.unitRawPx).toBeCloseTo((1440 - 264) / 12, 10) // 98
  })

  it('computes strideRawPx = unitRawPx + gutterPx', () => {
    expect(field.strideRawPx).toBeCloseTo(98 + 24, 10) // 122
  })

  it('raw field has no frame offset', () => {
    expect(field.fullStartPx).toBe(0)
    expect(field.contentStartPx).toBe(0)
    expect(field.contentEndPx).toBe(1440)
    expect(field.fullEndPx).toBe(1440)
  })

  it('computes lineStartPx[n] = n * strideRawPx', () => {
    expect(field.lineStartPx).toHaveLength(12)
    expect(field.lineStartPx[0]).toBe(0)
    expect(field.lineStartPx[1]).toBeCloseTo(122, 10)
    expect(field.lineStartPx[11]).toBeCloseTo(1342, 10)
  })

  it('computes gutterCenterPx correctly', () => {
    expect(field.gutterCenterPx).toHaveLength(11)
    // gutter center after col 1: 1*unitRawPx + 0.5*gutterPx = 98 + 12 = 110
    expect(field.gutterCenterPx[0]).toBeCloseTo(110, 10)
  })
})

// ---------------------------------------------------------------------------
// Shell Field
// ---------------------------------------------------------------------------

describe('computeShellField', () => {
  const field = computeShellField(1440, DEFAULT_CONTRACT)

  it('computes contentInlinePx = max(0, min(maxInlinePx, outerInlineSize - framePx*2))', () => {
    expect(field.contentEndPx - field.contentStartPx).toBeLessThanOrEqual(
      DEFAULT_CONTRACT.maxInlinePx,
    )
    // With framePx=80, outerInline=1440: contentInlinePx = min(1440, 1440-160) = 1280
    // But maxInlinePx=1440 so contentInlinePx = min(1440, 1280) = 1280
  })

  it('computes gapTotalPx = gutterPx * (cols - 1)', () => {
    expect(field.gapTotalPx).toBe(24 * 11) // 264
  })

  it('shell field has frame offset', () => {
    expect(field.fullStartPx).toBe(0)
    expect(field.contentStartPx).toBe(80) // framePx
    expect(field.fullEndPx).toBe(1440)
  })

  it('computes lineStartPx with frame offset', () => {
    expect(field.lineStartPx).toHaveLength(12)
    expect(field.lineStartPx[0]).toBe(80) // contentStartPx
    // contentInlinePx = min(1440, 1280) = 1280, strideRawPx = (1280-264)/12 + 24 = 108.667
    expect(field.lineStartPx[1]).toBeCloseTo(80 + (1280 - 264) / 12 + 24, 10)
  })

  it('clamps contentInlinePx to 0 when outerInlineSize < framePx*2', () => {
    const tiny = computeShellField(100, { ...DEFAULT_CONTRACT, framePx: 80 })
    // outerInline=100, framePx*2=160, so contentInlinePx = max(0, min(1440, 100-160)) = 0
    expect(tiny.contentEndPx - tiny.contentStartPx).toBe(0)
    expect(tiny.unitRawPx).toBeLessThanOrEqual(0)
  })

  it('clamps contentInlinePx to maxInlinePx when viewport is huge', () => {
    const huge = computeShellField(3000, DEFAULT_CONTRACT)
    // outerInline=3000, framePx*2=160, contentInlinePx = min(1440, 2840) = 1440
    expect(huge.contentEndPx - huge.contentStartPx).toBe(DEFAULT_CONTRACT.maxInlinePx)
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
    const tiny = computeRawField(100, { ...DEFAULT_CONTRACT, gutterPx: 24 })
    // 100 - 264 = -164, unitRawPx = -164/12 < 0
    expect(isDegenerate(tiny)).toBe(true)
  })

  it('non-degenerate field is not flagged', () => {
    const field = computeRawField(1440, DEFAULT_CONTRACT)
    expect(isDegenerate(field)).toBe(false)
  })

  it('clampDegenerate zeroes out unit and positions', () => {
    const tiny = computeRawField(100, DEFAULT_CONTRACT)
    const clamped = clampDegenerate(tiny)
    expect(clamped.unitRawPx).toBe(0)
    expect(clamped.lineStartPx.every((p: number) => p === 0)).toBe(true)
    expect(clamped.gutterCenterPx.every((g: number) => g === 0)).toBe(true)
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
    const tiny: StrideContractInput = { ...DEFAULT_CONTRACT, maxInlinePx: 10 }
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
    expect(manifest.rawFieldSample.gapTotalPx).toBe(field.gapTotalPx)
    expect(manifest.rawFieldSample.unitRawPx).toBeCloseTo(field.unitRawPx, 10)
    expect(manifest.rawFieldSample.strideRawPx).toBeCloseTo(field.strideRawPx, 10)
  })

  it('manifest shellFieldSample matches computeShellField', () => {
    const manifest = emitManifest(DEFAULT_CONTRACT)
    const field = computeShellField(1440, DEFAULT_CONTRACT)
    expect(manifest.shellFieldSample.gapTotalPx).toBe(field.gapTotalPx)
    expect(manifest.shellFieldSample.contentStartPx).toBe(field.contentStartPx)
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
