/**
 * Stride Core — Canonical Mathematical Source
 *
 * This module owns every layout formula in the system.
 * CSS runtime and generated helpers must derive from these functions.
 * When CSS and TS disagree, TS wins and the phase stops.
 *
 * SPDX-License-Identifier: MIT
 */

// ---------------------------------------------------------------------------
// Authored Input Contract
// ---------------------------------------------------------------------------

export interface StrideContractInput {
  /** Column count. Integer >= 1. */
  cols: number
  /** Gutter width in px. >= 0. */
  gutterPx: number
  /** Frame (outer margin) in px. >= 0. */
  framePx: number
  /** Max content width in px. >= 0. */
  maxInlinePx: number
  /** Minimum auto-track size in px. >= 0. */
  minAutoTrackPx: number

  /** Type base size in px. > 0. */
  typeBasePx: number
  /** Baseline unit in px. > 0. */
  baselinePx: number
  /** Leading multiplier. > 0. */
  leadingSteps: number
  /** Type scale ratio. > 0. */
  scaleRatio: number

  /** Body measure in px. > 0. */
  measureBodyPx: number
  /** Tight measure in px. > 0. */
  measureTightPx: number
  /** UI measure in px. > 0. */
  measureUiPx: number
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export class StrideValidationError extends Error {
  constructor(message: string) {
    super(`Stride validation: ${message}`)
    this.name = 'StrideValidationError'
  }
}

export function validateContract(input: StrideContractInput): void {
  const {
    cols,
    gutterPx,
    framePx,
    maxInlinePx,
    minAutoTrackPx,
    typeBasePx,
    baselinePx,
    leadingSteps,
    scaleRatio,
    measureBodyPx,
    measureTightPx,
    measureUiPx,
  } = input

  if (!Number.isInteger(cols) || cols < 1)
    throw new StrideValidationError(`cols must be integer >= 1, got ${cols}`)
  if (gutterPx < 0) throw new StrideValidationError(`gutterPx must be >= 0, got ${gutterPx}`)
  if (framePx < 0) throw new StrideValidationError(`framePx must be >= 0, got ${framePx}`)
  if (maxInlinePx < 0)
    throw new StrideValidationError(`maxInlinePx must be >= 0, got ${maxInlinePx}`)
  if (minAutoTrackPx < 0)
    throw new StrideValidationError(`minAutoTrackPx must be >= 0, got ${minAutoTrackPx}`)
  if (typeBasePx <= 0) throw new StrideValidationError(`typeBasePx must be > 0, got ${typeBasePx}`)
  if (baselinePx <= 0) throw new StrideValidationError(`baselinePx must be > 0, got ${baselinePx}`)
  if (leadingSteps <= 0)
    throw new StrideValidationError(`leadingSteps must be > 0, got ${leadingSteps}`)
  if (scaleRatio <= 0) throw new StrideValidationError(`scaleRatio must be > 0, got ${scaleRatio}`)
  if (measureBodyPx <= 0)
    throw new StrideValidationError(`measureBodyPx must be > 0, got ${measureBodyPx}`)
  if (measureTightPx <= 0)
    throw new StrideValidationError(`measureTightPx must be > 0, got ${measureTightPx}`)
  if (measureUiPx <= 0)
    throw new StrideValidationError(`measureUiPx must be > 0, got ${measureUiPx}`)
}

// ---------------------------------------------------------------------------
// Type Metrics
// ---------------------------------------------------------------------------

export interface TypeMetrics {
  rhythm: number
  proseLineHeight: number
  scaleNeg2: number
  scaleNeg1: number
  scale0: number
  scale1: number
  scale2: number
  scale3: number
  scale4: number
  scale5: number
  densityTight: number
  densityStandard: number
  densityLoose: number
}

export function computeTypeMetrics(input: StrideContractInput): TypeMetrics {
  const { baselinePx, leadingSteps, typeBasePx, scaleRatio } = input

  const rhythm = baselinePx * leadingSteps
  const proseLineHeight = rhythm / typeBasePx

  const scaleNeg2 = typeBasePx / (scaleRatio * scaleRatio)
  const scaleNeg1 = typeBasePx / scaleRatio
  const scale0 = typeBasePx
  const scale1 = scale0 * scaleRatio
  const scale2 = scale1 * scaleRatio
  const scale3 = scale2 * scaleRatio
  const scale4 = scale3 * scaleRatio
  const scale5 = scale4 * scaleRatio

  const densityTight = rhythm * 3
  const densityStandard = rhythm * 6
  const densityLoose = rhythm * 10

  return {
    rhythm,
    proseLineHeight,
    scaleNeg2,
    scaleNeg1,
    scale0,
    scale1,
    scale2,
    scale3,
    scale4,
    scale5,
    densityTight,
    densityStandard,
    densityLoose,
  }
}

// ---------------------------------------------------------------------------
// Field Geometry
// ---------------------------------------------------------------------------

export interface FieldGeometry {
  gapTotalPx: number
  unitRawPx: number
  strideRawPx: number
  fullStartPx: number
  contentStartPx: number
  contentEndPx: number
  fullEndPx: number
  lineStartPx: number[]
  gutterCenterPx: number[]
}

// ---------------------------------------------------------------------------
// Raw Field
// ---------------------------------------------------------------------------

export function computeRawField(inlineSize: number, input: StrideContractInput): FieldGeometry {
  const { cols, gutterPx } = input

  const gapTotalPx = gutterPx * (cols - 1)
  const unitRawPx = Math.max(0, (inlineSize - gapTotalPx) / cols)
  const strideRawPx = unitRawPx + gutterPx

  const fullStartPx = 0
  const contentStartPx = 0
  const contentEndPx = inlineSize
  const fullEndPx = inlineSize

  const lineStartPx = Array.from({ length: cols }, (_, i) => i * strideRawPx)
  const gutterCenterPx = Array.from(
    { length: cols - 1 },
    (_, i) => (i + 1) * unitRawPx + i * gutterPx + gutterPx / 2,
  )

  return {
    gapTotalPx,
    unitRawPx,
    strideRawPx,
    fullStartPx,
    contentStartPx,
    contentEndPx,
    fullEndPx,
    lineStartPx,
    gutterCenterPx,
  }
}

// ---------------------------------------------------------------------------
// Shell Field
// ---------------------------------------------------------------------------

export function computeShellField(
  outerInlineSize: number,
  input: StrideContractInput,
): FieldGeometry {
  const { cols, gutterPx, framePx, maxInlinePx } = input

  const contentInlinePx = Math.max(0, Math.min(maxInlinePx, outerInlineSize - framePx * 2))
  const gapTotalPx = gutterPx * (cols - 1)
  const unitRawPx = Math.max(0, (contentInlinePx - gapTotalPx) / cols)
  const strideRawPx = unitRawPx + gutterPx

  const fullStartPx = 0
  const contentStartPx = framePx
  const contentEndPx = framePx + contentInlinePx
  const fullEndPx = outerInlineSize

  const lineStartPx = Array.from({ length: cols }, (_, i) => contentStartPx + i * strideRawPx)
  const gutterCenterPx = Array.from(
    { length: cols - 1 },
    (_, i) => contentStartPx + (i + 1) * unitRawPx + i * gutterPx + gutterPx / 2,
  )

  return {
    gapTotalPx,
    unitRawPx,
    strideRawPx,
    fullStartPx,
    contentStartPx,
    contentEndPx,
    fullEndPx,
    lineStartPx,
    gutterCenterPx,
  }
}

// ---------------------------------------------------------------------------
// Gutter Anchor Validation
// ---------------------------------------------------------------------------

export function validGutterAnchors(cols: number): number[] {
  if (cols < 2) return []
  return Array.from({ length: cols - 1 }, (_, i) => i + 1)
}

export function isValidGutterAnchor(n: number, cols: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= cols - 1
}

// ---------------------------------------------------------------------------
// Reinterpretation (Divisor Grouping)
// ---------------------------------------------------------------------------

export type AlignMode = 'exact' | 'shell' | 'raw' | 'approximate' | 'independent' | 'adaptive'

export interface Reinterpretation {
  viewCols: number
  alignMode: AlignMode
}

/** Standard view-column reinterpretations for a 12-col base grid. */
export const STANDARD_VIEWS: Reinterpretation[] = [
  { viewCols: 2, alignMode: 'approximate' },
  { viewCols: 3, alignMode: 'approximate' },
  { viewCols: 4, alignMode: 'approximate' },
  { viewCols: 6, alignMode: 'approximate' },
  { viewCols: 8, alignMode: 'approximate' },
  { viewCols: 12, alignMode: 'approximate' },
]

/** Divisor grouping: which base-grid columns map to view-grid columns. */
export function divisorGrouping(baseCols: number, viewCols: number): number[][] {
  if (viewCols > baseCols || baseCols % viewCols !== 0) {
    throw new StrideValidationError(
      `viewCols (${viewCols}) must evenly divide baseCols (${baseCols})`,
    )
  }
  const groupSize = baseCols / viewCols
  return Array.from({ length: viewCols }, (_, i) =>
    Array.from({ length: groupSize }, (_, j) => i * groupSize + j + 1),
  )
}

// ---------------------------------------------------------------------------
// Degenerate / Narrow-Width Behavior
// ---------------------------------------------------------------------------

export function isDegenerate(field: FieldGeometry): boolean {
  return field.unitRawPx <= 0
}

export function clampDegenerate(field: FieldGeometry): FieldGeometry {
  if (!isDegenerate(field)) return field
  return {
    ...field,
    unitRawPx: 0,
    strideRawPx: field.gapTotalPx >= 0 ? field.strideRawPx : 0,
    lineStartPx: field.lineStartPx.map(() => 0),
    gutterCenterPx: field.gutterCenterPx.map(() => 0),
  }
}
