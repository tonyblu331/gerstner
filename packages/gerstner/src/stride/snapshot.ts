/**
 * Stride Runtime Snapshot — Live DOM geometry observer
 *
 * Reads CSS custom properties from a live element, resolves them to numeric
 * Stride inputs, calls core.ts formulas, and returns a GridDebugSnapshot.
 *
 * This is the authoritative geometry source for the debug visualizer.
 * Debug reads this snapshot. Debug never recomputes geometry.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  computeRawField,
  computeShellField,
  computeTypeMetrics,
  validGutterAnchors,
  type FieldGeometry,
  type StrideContractInput,
} from './core.js'

// ---------------------------------------------------------------------------
// Public Types
// ---------------------------------------------------------------------------

export type AlignmentTruth = 'exact' | 'approximate' | 'independent'

export type FieldKind = 'raw' | 'shell' | 'subgrid' | 'view' | 'independent'

export type DebugWarningCode =
  | 'NON_DIVISOR_VIEW'
  | 'VIEW_IS_APPROXIMATE'
  | 'SHELL_FRAME_NOT_COLUMNS'
  | 'TRACK_BELOW_MIN'
  | 'NEGATIVE_CONTENT_INLINE'
  | 'ROUNDING_USED_IN_LAYOUT'
  | 'MISSING_DERIVED_VAR'
  | 'STALE_TOKEN'
  | 'PROSE_LINE_HEIGHT_IS_LENGTH'
  | 'GUTTER_ANCHOR_OUT_OF_RANGE'
  | 'DEBUG_MUTATION_DETECTED'

export interface DebugWarning {
  code: DebugWarningCode
  message: string
}

export interface GridDebugSnapshot {
  id: string
  element: Element

  field: {
    kind: FieldKind
    relationship: AlignmentTruth
    cols: number
    viewCols?: number
  }

  rect: {
    x: number
    y: number
    width: number
    height: number
    dpr: number
  }

  authored: {
    cols: number
    gutterPx: number
    framePx: number
    maxInlinePx: number
    minAutoTrackPx: number

    baselinePx: number
    typeBasePx: number
    leadingSteps: number
    scaleRatio: number

    measureBodyPx: number
    measureTightPx: number
    measureUiPx: number
  }

  derived: {
    contentInlinePx: number
    gapTotalPx: number
    colUnitRawPx: number
    colUnitRoundedPx: number
    strideRawPx: number

    rhythmPx: number
    proseLineHeight: number
  }

  boundaries: {
    fullStartPx: number
    contentStartPx: number
    contentEndPx: number
    fullEndPx: number
  }

  lines: {
    lineStartPx: number[]
    gutterCenterPx: number[]
  }

  warnings: DebugWarning[]
}

// ---------------------------------------------------------------------------
// Internal: CSS var resolution
// ---------------------------------------------------------------------------

/**
 * Resolve a custom property used as block-size via a probe element.
 * Handles calc(), clamp(), rem, em. Returns 0 in non-DOM environments.
 */
function resolveVarAsBlockSizePx(scope: HTMLElement, varName: string): number {
  const append = scope.appendChild?.bind(scope)
  const remove = scope.removeChild?.bind(scope)
  if (typeof append !== 'function' || typeof remove !== 'function') return 0

  let probe: HTMLDivElement | null = null
  try {
    probe = document.createElement('div')
    probe.setAttribute('data-g-snapshot-probe', '')
    probe.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'pointer-events:none',
      'inset-inline-start:-99999px',
      'inset-block-start:0',
      'inline-size:0',
      'margin:0',
      'padding:0',
      'border:none',
      'overflow:hidden',
      'box-sizing:border-box',
      'font:inherit',
      'line-height:inherit',
    ].join(';')
    probe.style.height = `var(${varName})`
    append(probe)
    const h = probe.getBoundingClientRect().height
    remove(probe)
    probe = null
    return Number.isFinite(h) && h > 0 ? h : 0
  } catch {
    if (probe) {
      try {
        remove!(probe)
      } catch {
        /* ignore */
      }
    }
    return 0
  }
}

function toPx(val: string, rootFontPx: number): number {
  const trimmed = val.trim()
  if (!trimmed) return 0
  if (trimmed.endsWith('rem')) return parseFloat(trimmed) * rootFontPx
  if (trimmed.endsWith('px')) return parseFloat(trimmed)
  return parseFloat(trimmed) || 0
}

interface ResolvedInputs {
  cols: number
  gutterPx: number
  framePx: number
  maxInlinePx: number
  minAutoTrackPx: number
  typeBasePx: number
  baselinePx: number
  leadingSteps: number
  scaleRatio: number
  measureBodyPx: number
  measureTightPx: number
  measureUiPx: number
}

function resolveInputs(scope: HTMLElement): ResolvedInputs {
  const cs = getComputedStyle(scope)
  const rootFontPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

  const cols = parseInt(cs.getPropertyValue('--g-cols')) || 12
  const leadingSteps = parseFloat(cs.getPropertyValue('--g-leading-steps')) || 3
  const scaleRatio = parseFloat(cs.getPropertyValue('--g-scale-ratio')) || 1.25

  let gutterPx = resolveVarAsBlockSizePx(scope, '--g-gutter')
  if (!(gutterPx > 0)) gutterPx = toPx(cs.getPropertyValue('--g-gutter'), rootFontPx) || 16

  let framePx = resolveVarAsBlockSizePx(scope, '--g-frame')
  if (!(framePx > 0)) framePx = toPx(cs.getPropertyValue('--g-frame'), rootFontPx) || 0

  let maxInlinePx = resolveVarAsBlockSizePx(scope, '--g-max-width')
  if (!(maxInlinePx > 0))
    maxInlinePx = toPx(cs.getPropertyValue('--g-max-width'), rootFontPx) || 1440

  let minAutoTrackPx = resolveVarAsBlockSizePx(scope, '--g-min')
  if (!(minAutoTrackPx > 0)) minAutoTrackPx = toPx(cs.getPropertyValue('--g-min'), rootFontPx) || 0

  let typeBasePx = resolveVarAsBlockSizePx(scope, '--g-type-base')
  if (!(typeBasePx > 0)) typeBasePx = toPx(cs.getPropertyValue('--g-type-base'), rootFontPx) || 16

  let baselinePx = resolveVarAsBlockSizePx(scope, '--g-baseline')
  if (!(baselinePx > 0)) baselinePx = toPx(cs.getPropertyValue('--g-baseline'), rootFontPx) || 8

  let measureBodyPx = resolveVarAsBlockSizePx(scope, '--g-measure-body')
  if (!(measureBodyPx > 0))
    measureBodyPx = toPx(cs.getPropertyValue('--g-measure-body'), rootFontPx) || 70 * 8

  let measureTightPx = resolveVarAsBlockSizePx(scope, '--g-measure-tight')
  if (!(measureTightPx > 0))
    measureTightPx = toPx(cs.getPropertyValue('--g-measure-tight'), rootFontPx) || 45 * 8

  let measureUiPx = resolveVarAsBlockSizePx(scope, '--g-measure-ui')
  if (!(measureUiPx > 0))
    measureUiPx = toPx(cs.getPropertyValue('--g-measure-ui'), rootFontPx) || 35 * 8

  return {
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
  }
}

// ---------------------------------------------------------------------------
// Internal: field kind + relationship detection
// ---------------------------------------------------------------------------

function detectFieldKind(el: HTMLElement): FieldKind {
  const cls = el.classList
  if (cls.contains('g-shell')) return 'shell'
  if (cls.contains('g-sub')) return 'subgrid'
  if (cls.contains('g-align-independent')) return 'independent'
  // g-view-* check
  for (const c of [...cls]) {
    if (/^g-view-\d+$/.test(c)) return 'view'
  }
  if (cls.contains('g') || cls.contains('g-fit') || cls.contains('g-fill')) return 'raw'
  return 'raw'
}

function detectViewCols(el: HTMLElement): number | undefined {
  for (const c of [...el.classList]) {
    const m = c.match(/^g-view-(\d+)$/)
    if (m) return parseInt(m[1])
  }
  return undefined
}

function detectRelationship(kind: FieldKind): AlignmentTruth {
  if (kind === 'subgrid') return 'exact'
  if (kind === 'view') return 'approximate'
  if (kind === 'independent') return 'independent'
  return 'exact'
}

// ---------------------------------------------------------------------------
// Internal: warning generation
// ---------------------------------------------------------------------------

function buildWarnings(
  kind: FieldKind,
  relationship: AlignmentTruth,
  geometry: FieldGeometry,
  inputs: ResolvedInputs,
  outerInlinePx: number,
): DebugWarning[] {
  const warnings: DebugWarning[] = []

  if (geometry.unit <= 0) {
    warnings.push({
      code: 'NEGATIVE_CONTENT_INLINE',
      message: `Content inline size is zero or negative at ${outerInlinePx}px viewport. The grid cannot render columns.`,
    })
  }

  if (inputs.minAutoTrackPx > 0 && geometry.unit > 0 && geometry.unit < inputs.minAutoTrackPx) {
    warnings.push({
      code: 'TRACK_BELOW_MIN',
      message: `Column unit (${geometry.unit.toFixed(1)}px) is below the declared minimum track size (${inputs.minAutoTrackPx}px).`,
    })
  }

  if (relationship === 'approximate') {
    warnings.push({
      code: 'VIEW_IS_APPROXIMATE',
      message: `g-view-* reinterprets the current content width. This is not exact parent-track inheritance. Use g-sub for exact inheritance or g-align-independent for explicit independence.`,
    })
  }

  if (kind === 'shell' && inputs.framePx === 0) {
    warnings.push({
      code: 'SHELL_FRAME_NOT_COLUMNS',
      message: `Shell frame is 0px. The outer shell areas are frame zones, not content columns. Use g for equal columns edge-to-edge.`,
    })
  }

  if (inputs.gutterPx <= 0) {
    warnings.push({
      code: 'MISSING_DERIVED_VAR',
      message: `Gutter resolved to 0px. Check that --g-gutter is set on this scope.`,
    })
  }

  return warnings
}

// ---------------------------------------------------------------------------
// Public API: buildSnapshot
// ---------------------------------------------------------------------------

let _snapshotCounter = 0

/**
 * Build a GridDebugSnapshot for a live DOM element.
 *
 * Reads CSS vars → resolves to numeric inputs → calls core.ts formulas.
 * Returns null if the element produces degenerate geometry at current size.
 */
export function buildSnapshot(element: HTMLElement): GridDebugSnapshot | null {
  const rect = element.getBoundingClientRect()
  const outerInlinePx = rect.width

  if (outerInlinePx <= 0) return null

  const inputs = resolveInputs(element)
  const kind = detectFieldKind(element)
  const relationship = detectRelationship(kind)
  const viewCols = detectViewCols(element)

  const strideInput: StrideContractInput = {
    cols: inputs.cols,
    gutter: inputs.gutterPx,
    frame: inputs.framePx,
    maxWidth: inputs.maxInlinePx,
    minAutoTrack: inputs.minAutoTrackPx,
    typeBase: inputs.typeBasePx,
    baseline: inputs.baselinePx,
    leadingSteps: inputs.leadingSteps,
    scaleRatio: inputs.scaleRatio,
    measureBody: inputs.measureBodyPx,
    measureTight: inputs.measureTightPx,
    measureUi: inputs.measureUiPx,
  }

  let geometry: FieldGeometry
  if (kind === 'shell') {
    geometry = computeShellField(outerInlinePx, strideInput)
  } else {
    geometry = computeRawField(outerInlinePx, strideInput)
  }

  const typeMetrics = computeTypeMetrics(strideInput)

  const contentInlinePx = geometry.contentEnd - geometry.contentStart

  const warnings = buildWarnings(kind, relationship, geometry, inputs, outerInlinePx)

  const id = element.getAttribute('data-g-snapshot-id') ?? `g-snap-${++_snapshotCounter}`
  if (!element.getAttribute('data-g-snapshot-id')) {
    element.setAttribute('data-g-snapshot-id', id)
  }

  return {
    id,
    element,

    field: {
      kind,
      relationship,
      cols: inputs.cols,
      ...(viewCols !== undefined ? { viewCols } : {}),
    },

    rect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      dpr: typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1,
    },

    authored: {
      cols: inputs.cols,
      gutterPx: inputs.gutterPx,
      framePx: inputs.framePx,
      maxInlinePx: inputs.maxInlinePx,
      minAutoTrackPx: inputs.minAutoTrackPx,
      baselinePx: inputs.baselinePx,
      typeBasePx: inputs.typeBasePx,
      leadingSteps: inputs.leadingSteps,
      scaleRatio: inputs.scaleRatio,
      measureBodyPx: inputs.measureBodyPx,
      measureTightPx: inputs.measureTightPx,
      measureUiPx: inputs.measureUiPx,
    },

    derived: {
      contentInlinePx,
      gapTotalPx: geometry.gapTotal,
      colUnitRawPx: geometry.unit,
      colUnitRoundedPx: Math.round(geometry.unit),
      strideRawPx: geometry.stride,
      rhythmPx: typeMetrics.rhythm,
      proseLineHeight: typeMetrics.proseLineHeight,
    },

    boundaries: {
      fullStartPx: geometry.fullStart,
      contentStartPx: geometry.contentStart,
      contentEndPx: geometry.contentEnd,
      fullEndPx: geometry.fullEnd,
    },

    lines: {
      lineStartPx: geometry.linePositions,
      gutterCenterPx: geometry.gutterCenters,
    },

    warnings,
  }
}

/**
 * Find all Gerstner scope elements in the document and build snapshots for each.
 */
export function buildAllSnapshots(): GridDebugSnapshot[] {
  const selector = '.g-shell, .g, .g-fit, .g-fill, .g-sub, [class*="g-view-"], .g-align-independent'
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
  const snapshots: GridDebugSnapshot[] = []
  for (const el of elements) {
    const snap = buildSnapshot(el)
    if (snap) snapshots.push(snap)
  }
  return snapshots
}

/**
 * Return valid gutter anchor indices for the given col count.
 * Convenience re-export of core rule: valid gutters are 1..cols-1.
 */
export function validDebugGutterAnchors(cols: number): number[] {
  return validGutterAnchors(cols)
}
