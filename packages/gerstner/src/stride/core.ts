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
  /** Gutter width. >= 0. */
  gutter: number
  /** Frame (outer margin). >= 0. */
  frame: number
  /** Max content width. >= 0. */
  maxWidth: number
  /** Minimum auto-track size. >= 0. */
  minAutoTrack: number

  /** Type base size (e.g. 1rem). > 0. */
  typeBase: number
  /** Baseline unit (e.g. 0.5rem). > 0. */
  baseline: number
  /** Leading multiplier. > 0. */
  leadingSteps: number
  /** Type scale ratio. > 0. */
  scaleRatio: number

  /** Body measure (e.g. 70ch). > 0. */
  measureBody: number
  /** Tight measure (e.g. 45ch). > 0. */
  measureTight: number
  /** UI measure (e.g. 35ch). > 0. */
  measureUi: number
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
    gutter,
    frame,
    maxWidth,
    minAutoTrack,
    typeBase,
    baseline,
    leadingSteps,
    scaleRatio,
    measureBody,
    measureTight,
    measureUi,
  } = input

  if (!Number.isInteger(cols) || cols < 1)
    throw new StrideValidationError(`cols must be integer >= 1, got ${cols}`)
  if (gutter < 0) throw new StrideValidationError(`gutter must be >= 0, got ${gutter}`)
  if (frame < 0) throw new StrideValidationError(`frame must be >= 0, got ${frame}`)
  if (maxWidth < 0) throw new StrideValidationError(`maxWidth must be >= 0, got ${maxWidth}`)
  if (minAutoTrack < 0)
    throw new StrideValidationError(`minAutoTrack must be >= 0, got ${minAutoTrack}`)
  if (typeBase <= 0) throw new StrideValidationError(`typeBase must be > 0, got ${typeBase}`)
  if (baseline <= 0) throw new StrideValidationError(`baseline must be > 0, got ${baseline}`)
  if (leadingSteps <= 0)
    throw new StrideValidationError(`leadingSteps must be > 0, got ${leadingSteps}`)
  if (scaleRatio <= 0) throw new StrideValidationError(`scaleRatio must be > 0, got ${scaleRatio}`)
  if (measureBody <= 0)
    throw new StrideValidationError(`measureBody must be > 0, got ${measureBody}`)
  if (measureTight <= 0)
    throw new StrideValidationError(`measureTight must be > 0, got ${measureTight}`)
  if (measureUi <= 0) throw new StrideValidationError(`measureUi must be > 0, got ${measureUi}`)
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
  const { baseline, leadingSteps, typeBase, scaleRatio } = input

  const rhythm = baseline * leadingSteps
  const proseLineHeight = rhythm / typeBase

  const scaleNeg2 = typeBase / (scaleRatio * scaleRatio)
  const scaleNeg1 = typeBase / scaleRatio
  const scale0 = typeBase
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
  gapTotal: number
  unit: number
  stride: number
  fullStart: number
  contentStart: number
  contentEnd: number
  fullEnd: number
  linePositions: number[]
  gutterCenters: number[]
}

// ---------------------------------------------------------------------------
// Raw Field
// ---------------------------------------------------------------------------

export function computeRawField(inlineSize: number, input: StrideContractInput): FieldGeometry {
  const { cols, gutter } = input

  const gapTotal = gutter * (cols - 1)
  const unit = (inlineSize - gapTotal) / cols
  const stride = unit + gutter

  const fullStart = 0
  const contentStart = 0
  const contentEnd = inlineSize
  const fullEnd = inlineSize

  const linePositions = Array.from({ length: cols }, (_, i) => i * stride)
  const gutterCenters = Array.from(
    { length: cols - 1 },
    (_, i) => (i + 1) * unit + i * gutter + gutter / 2,
  )

  return {
    gapTotal,
    unit,
    stride,
    fullStart,
    contentStart,
    contentEnd,
    fullEnd,
    linePositions,
    gutterCenters,
  }
}

// ---------------------------------------------------------------------------
// Shell Field
// ---------------------------------------------------------------------------

export function computeShellField(
  outerInlineSize: number,
  input: StrideContractInput,
): FieldGeometry {
  const { cols, gutter, frame, maxWidth } = input

  const contentInline = Math.max(0, Math.min(maxWidth, outerInlineSize - frame * 2))
  const gapTotal = gutter * (cols - 1)
  const unit = (contentInline - gapTotal) / cols
  const stride = unit + gutter

  const fullStart = 0
  const contentStart = frame
  const contentEnd = frame + contentInline
  const fullEnd = outerInlineSize

  const linePositions = Array.from({ length: cols }, (_, i) => contentStart + i * stride)
  const gutterCenters = Array.from(
    { length: cols - 1 },
    (_, i) => contentStart + (i + 1) * unit + i * gutter + gutter / 2,
  )

  return {
    gapTotal,
    unit,
    stride,
    fullStart,
    contentStart,
    contentEnd,
    fullEnd,
    linePositions,
    gutterCenters,
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
  return field.unit <= 0
}

export function clampDegenerate(field: FieldGeometry): FieldGeometry {
  if (!isDegenerate(field)) return field
  return {
    ...field,
    unit: 0,
    stride: field.gapTotal >= 0 ? field.stride : 0,
    linePositions: field.linePositions.map(() => 0),
    gutterCenters: field.gutterCenters.map(() => 0),
  }
}
