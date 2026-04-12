/**
 * Stride Serialize — Manifest Emission from Canonical Math
 *
 * Emits the contract.manifest.json bridge artifact.
 * Generated artifact — do not edit by hand.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  type StrideContractInput,
  validateContract,
  computeTypeMetrics,
  computeRawField,
  computeShellField,
  validGutterAnchors,
  isValidGutterAnchor,
  divisorGrouping,
  STANDARD_VIEWS,
  isDegenerate,
  type AlignMode,
  type FieldGeometry,
  type TypeMetrics,
} from './core'

// ---------------------------------------------------------------------------
// Manifest Types
// ---------------------------------------------------------------------------

export interface ManifestTokenEntry {
  name: string
  cssRef: string
  kind: 'authored' | 'derived'
}

export interface ManifestHelperRange {
  prefix: string
  min: number
  max: number
  cssProperty: string
  cssValueTemplate: string
}

export interface ManifestGutterAnchor {
  name: string
  index: number
  valid: boolean
}

export interface ManifestAlignMode {
  name: string
  mode: AlignMode
  label: 'exact' | 'approximate' | 'independent' | 'shell' | 'raw' | 'adaptive'
}

export interface ManifestBoundary {
  name: string
  cssLineName: string
  description: string
}

export interface ManifestViewEntry {
  viewCols: number
  alignMode: AlignMode
  divisorGrouping: number[][]
}

export interface ManifestFixtureEntry {
  id: string
  name: string
  path: string
}

export interface StrideManifest {
  version: 1
  generatedAt: string
  contract: StrideContractInput
  tokens: ManifestTokenEntry[]
  typeMetrics: TypeMetrics
  rawFieldSample: FieldGeometry
  shellFieldSample: FieldGeometry
  helperRanges: ManifestHelperRange[]
  gutterAnchors: ManifestGutterAnchor[]
  alignModes: ManifestAlignMode[]
  boundaries: ManifestBoundary[]
  views: ManifestViewEntry[]
  fixtures: ManifestFixtureEntry[]
}

// ---------------------------------------------------------------------------
// Token Definitions
// ---------------------------------------------------------------------------

function buildTokens(_input: StrideContractInput): ManifestTokenEntry[] {
  return [
    // Authored
    { name: 'cols', cssRef: '--g-cols', kind: 'authored' },
    { name: 'gutter', cssRef: '--g-gutter', kind: 'authored' },
    { name: 'frame', cssRef: '--g-frame', kind: 'authored' },
    { name: 'maxWidth', cssRef: '--g-max-width', kind: 'authored' },
    { name: 'minAutoTrack', cssRef: '--g-min', kind: 'authored' },
    { name: 'typeBase', cssRef: '--g-type-base', kind: 'authored' },
    { name: 'baseline', cssRef: '--g-baseline', kind: 'authored' },
    { name: 'leadingSteps', cssRef: '--g-leading-steps', kind: 'authored' },
    { name: 'scaleRatio', cssRef: '--g-scale-ratio', kind: 'authored' },
    { name: 'measureBody', cssRef: '--g-measure-body', kind: 'authored' },
    { name: 'measureTight', cssRef: '--g-measure-tight', kind: 'authored' },
    { name: 'measureUi', cssRef: '--g-measure-ui', kind: 'authored' },
    // Derived
    { name: 'rhythm', cssRef: '--g-rhythm', kind: 'derived' },
    { name: 'proseLineHeight', cssRef: '--g-prose', kind: 'derived' },
    { name: 'gapTotal', cssRef: '--g-gap-total', kind: 'derived' },
    { name: 'colUnitRaw', cssRef: '--g-col-unit-raw', kind: 'derived' },
    { name: 'stride', cssRef: '--g-stride', kind: 'derived' },
    { name: 'colUnit', cssRef: '--g-col-unit', kind: 'derived' },
    { name: 'contentInline', cssRef: '--g-content-inline', kind: 'derived' },
    { name: 'alignMode', cssRef: '--g-align-mode', kind: 'derived' },
  ]
}

// ---------------------------------------------------------------------------
// Helper Ranges
// ---------------------------------------------------------------------------

function buildHelperRanges(cols: number): ManifestHelperRange[] {
  const ranges: ManifestHelperRange[] = []

  // Column span helpers: col-1..col-{cols}
  // span N / span N works correctly with gap-based grids (gap is not a track).
  ranges.push({
    prefix: 'col-',
    min: 1,
    max: cols,
    cssProperty: 'grid-column',
    cssValueTemplate: 'span {n} / span {n}',
  })

  // Column start helpers: col-start-1..col-start-{cols}
  // Uses nth-occurrence of named line 'col': 'col 1' = first col line, 'col 3' = third.
  // Works in both .g-shell (with [col] in repeat) and .g (same repeat pattern).
  ranges.push({
    prefix: 'col-start-',
    min: 1,
    max: cols,
    cssProperty: 'grid-column-start',
    cssValueTemplate: 'col {n}',
  })

  // Column end helpers: col-end-1..col-end-{cols+1}
  // col-end-{cols+1} maps to content-end boundary (after last column).
  ranges.push({
    prefix: 'col-end-',
    min: 1,
    max: cols + 1,
    cssProperty: 'grid-column-end',
    cssValueTemplate: 'col {n}',
  })

  // Stack spacing helpers: g-stack-1..g-stack-6
  ranges.push({
    prefix: 'g-stack-',
    min: 1,
    max: 6,
    cssProperty: 'margin-block-start',
    cssValueTemplate: 'calc(var(--g-rhythm) * {n})',
  })

  return ranges
}

// ---------------------------------------------------------------------------
// Gutter Anchors
// ---------------------------------------------------------------------------

function buildGutterAnchors(cols: number): ManifestGutterAnchor[] {
  const valid = validGutterAnchors(cols)
  return valid.map((n) => ({
    name: `gutter-${n}`,
    index: n,
    valid: isValidGutterAnchor(n, cols),
  }))
}

// ---------------------------------------------------------------------------
// Align Modes
// ---------------------------------------------------------------------------

function buildAlignModes(): ManifestAlignMode[] {
  return [
    { name: 'g-sub', mode: 'exact', label: 'exact' },
    { name: 'g-shell', mode: 'shell', label: 'shell' },
    { name: 'g', mode: 'raw', label: 'raw' },
    { name: 'g-view-*', mode: 'approximate', label: 'approximate' },
    { name: 'g-align-independent', mode: 'independent', label: 'independent' },
    { name: 'g-fit / g-fill', mode: 'adaptive', label: 'adaptive' },
  ]
}

// ---------------------------------------------------------------------------
// Boundaries
// ---------------------------------------------------------------------------

function buildBoundaries(): ManifestBoundary[] {
  return [
    {
      name: 'full-start',
      cssLineName: 'full-start',
      description: 'Left edge of the full grid area (including frame)',
    },
    {
      name: 'content-start',
      cssLineName: 'content-start',
      description: 'Left edge of the content area (inside frame)',
    },
    {
      name: 'content-end',
      cssLineName: 'content-end',
      description: 'Right edge of the content area (inside frame)',
    },
    {
      name: 'full-end',
      cssLineName: 'full-end',
      description: 'Right edge of the full grid area (including frame)',
    },
  ]
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function buildViews(baseCols: number): ManifestViewEntry[] {
  return STANDARD_VIEWS.filter((v) => baseCols % v.viewCols === 0).map((v) => ({
    viewCols: v.viewCols,
    alignMode: v.alignMode,
    divisorGrouping: divisorGrouping(baseCols, v.viewCols),
  }))
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function buildFixtures(): ManifestFixtureEntry[] {
  return [
    { id: 'raw-grid', name: 'Raw Grid Reference', path: 'reference-fixtures/raw-grid/' },
    { id: 'shell', name: 'Shell Reference', path: 'reference-fixtures/shell/' },
    {
      id: 'exact-inheritance',
      name: 'Exact Inheritance (g-sub)',
      path: 'reference-fixtures/exact-inheritance/',
    },
    {
      id: 'approximate-reinterpretation',
      name: 'Approximate Reinterpretation (g-view-*)',
      path: 'reference-fixtures/approximate-reinterpretation/',
    },
    {
      id: 'independent-local-field',
      name: 'Independent Local Field (g-align-independent)',
      path: 'reference-fixtures/independent-local-field/',
    },
    {
      id: 'asymmetry-breakout',
      name: 'Asymmetry/Breakout Reference',
      path: 'reference-fixtures/asymmetry-breakout/',
    },
    {
      id: 'type-and-stress',
      name: 'Type and Stress Reference',
      path: 'reference-fixtures/type-and-stress/',
    },
  ]
}

// ---------------------------------------------------------------------------
// Emission
// ---------------------------------------------------------------------------

/**
 * Emit the full Stride manifest from canonical contract input.
 * Throws on invalid input — never emits for invalid contracts.
 */
export function emitManifest(input: StrideContractInput): StrideManifest {
  validateContract(input)

  const typeMetrics = computeTypeMetrics(input)

  // Sample fields at a representative inline size (1440px = 90rem)
  const sampleInlineSize = 1440
  const rawFieldSample = computeRawField(sampleInlineSize, input)
  const shellFieldSample = computeShellField(sampleInlineSize, input)

  // Reject degenerate geometry
  if (isDegenerate(rawFieldSample)) {
    throw new Error('Stride serialize: raw field is degenerate at sample inline size')
  }
  if (isDegenerate(shellFieldSample)) {
    throw new Error('Stride serialize: shell field is degenerate at sample inline size')
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    contract: input,
    tokens: buildTokens(input),
    typeMetrics,
    rawFieldSample,
    shellFieldSample,
    helperRanges: buildHelperRanges(input.cols),
    gutterAnchors: buildGutterAnchors(input.cols),
    alignModes: buildAlignModes(),
    boundaries: buildBoundaries(),
    views: buildViews(input.cols),
    fixtures: buildFixtures(),
  }
}

/**
 * Serialize manifest to JSON string.
 * Deterministic output for snapshot testing.
 */
export function serializeManifest(input: StrideContractInput): string {
  const manifest = emitManifest(input)
  return JSON.stringify(manifest, null, 2)
}
