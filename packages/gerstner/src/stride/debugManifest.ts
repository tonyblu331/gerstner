/**
 * Stride Debug Manifest — Read-Only Metadata for Debug Visualizer
 *
 * Generates read-only metadata that debug visualizer consumes.
 * Debug never computes truth - it only reads what Stride exposes.
 *
 * SPDX-License-Identifier: MIT
 */

import type { StrideContractInput, FieldGeometry } from './core.js'

// ---------------------------------------------------------------------------
// Debug Metadata Types
// ---------------------------------------------------------------------------

export interface DebugFieldMetadata {
  /** Field kind classification */
  kind: 'raw' | 'shell' | 'subgrid' | 'view' | 'independent'

  /** Relationship truth to parent */
  relationship: 'exact' | 'approximate' | 'independent'

  /** Number of columns in this field */
  cols: number

  /** View column count for g-view-* fields */
  viewCols?: number

  /** CSS class that generated this metadata */
  cssClass: string
}

export interface DebugGeometryMetadata {
  /** Raw geometry values (unrounded) */
  raw: {
    gapTotalPx: number
    unitRawPx: number
    strideRawPx: number
  }

  /** Boundary positions in pixels */
  boundaries: {
    fullStartPx: number
    contentStartPx: number
    contentEndPx: number
    fullEndPx: number
  }

  /** Line positions for column starts */
  lineStartPx: number[]

  /** Gutter center positions */
  gutterCenterPx: number[]
}

export interface DebugWarningMetadata {
  code: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface DebugScopeMetadata {
  /** Unique identifier for this scope */
  id: string

  /** Field classification */
  field: DebugFieldMetadata

  /** Computed geometry */
  geometry: DebugGeometryMetadata

  /** Authored contract values */
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

  /** Derived computed values */
  derived: {
    contentInlinePx: number
    colUnitRawPx: number
    strideRawPx: number
    rhythmPx: number
    proseLineHeight: number
  }

  /** Warnings for this scope */
  warnings: DebugWarningMetadata[]

  /** DOM element reference */
  element?: Element
}

// ---------------------------------------------------------------------------
// CSS Metadata Generation
// ---------------------------------------------------------------------------

/**
 * Generate CSS custom properties for debug metadata.
 * These are read-only variables that expose field information.
 */
export function generateDebugCSS(metadata: DebugFieldMetadata): string {
  return `
/* Debug metadata for ${metadata.cssClass} */
.${metadata.cssClass} {
  --g-debug-field: ${metadata.kind};
  --g-debug-relationship: ${metadata.relationship};
  --g-debug-cols: ${metadata.cols};
  ${metadata.viewCols ? `--g-debug-view-cols: ${metadata.viewCols};` : ''}
}
`.trim()
}

/**
 * Generate CSS for all standard debug metadata classes.
 */
export function generateStandardDebugCSS(): string {
  const fieldTypes = [
    { cssClass: 'g', kind: 'raw' as const, relationship: 'exact' as const },
    { cssClass: 'g-shell', kind: 'shell' as const, relationship: 'exact' as const },
    { cssClass: 'g-sub', kind: 'subgrid' as const, relationship: 'exact' as const },
    {
      cssClass: 'g-view-2',
      kind: 'view' as const,
      relationship: 'approximate' as const,
      viewCols: 2,
    },
    {
      cssClass: 'g-view-3',
      kind: 'view' as const,
      relationship: 'approximate' as const,
      viewCols: 3,
    },
    {
      cssClass: 'g-view-4',
      kind: 'view' as const,
      relationship: 'approximate' as const,
      viewCols: 4,
    },
    {
      cssClass: 'g-view-6',
      kind: 'view' as const,
      relationship: 'approximate' as const,
      viewCols: 6,
    },
    {
      cssClass: 'g-align-independent',
      kind: 'independent' as const,
      relationship: 'independent' as const,
    },
    { cssClass: 'g-fit', kind: 'raw' as const, relationship: 'exact' as const },
    { cssClass: 'g-fill', kind: 'raw' as const, relationship: 'exact' as const },
  ]

  return fieldTypes
    .map((field) =>
      generateDebugCSS({
        kind: field.kind,
        relationship: field.relationship,
        cols: field.viewCols || 12, // Default to 12 for non-view fields
        cssClass: field.cssClass,
        ...(field.viewCols && { viewCols: field.viewCols }),
      }),
    )
    .join('\n\n')
}

// ---------------------------------------------------------------------------
// Metadata Extraction from DOM
// ---------------------------------------------------------------------------

/**
 * Extract debug metadata from a DOM element.
 * Reads CSS custom properties and class attributes.
 */
export function extractMetadataFromElement(element: Element): DebugFieldMetadata | null {
  const cssClass = Array.from(element.classList).find((cls) => cls.startsWith('g-') || cls === 'g')

  if (!cssClass) return null

  // Determine field kind and relationship from CSS class
  let kind: DebugFieldMetadata['kind'] = 'raw'
  let relationship: DebugFieldMetadata['relationship'] = 'exact'
  let cols = 12
  let viewCols: number | undefined

  if (cssClass === 'g-shell') {
    kind = 'shell'
  } else if (cssClass === 'g-sub') {
    kind = 'subgrid'
  } else if (cssClass.startsWith('g-view-')) {
    kind = 'view'
    relationship = 'approximate'
    viewCols = parseInt(cssClass.replace('g-view-', ''))
    cols = viewCols
  } else if (cssClass === 'g-align-independent') {
    kind = 'independent'
    relationship = 'independent'
  } else if (cssClass === 'g-fit' || cssClass === 'g-fill') {
    kind = 'raw'
  }

  return {
    kind,
    relationship,
    cols,
    ...(viewCols && { viewCols }),
    cssClass,
  }
}

// ---------------------------------------------------------------------------
// Geometry Computation from Contract
// ---------------------------------------------------------------------------

/**
 * Compute debug geometry metadata from Stride contract and element bounds.
 */
export async function computeDebugGeometry(
  element: Element,
  contract: StrideContractInput,
  fieldMetadata: DebugFieldMetadata,
): Promise<DebugGeometryMetadata> {
  const rect = element.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  // Use actual rendered bounds instead of assuming size
  const outerInlinePx = rect.width * dpr

  let geometry: FieldGeometry

  if (fieldMetadata.kind === 'shell') {
    const { computeShellField } = await import('./core.js')
    geometry = computeShellField(outerInlinePx, contract)
  } else if (fieldMetadata.kind === 'view' && fieldMetadata.viewCols) {
    // View reinterpretation
    const { gutterPx } = contract
    const contentInlinePx = outerInlinePx

    const gapTotalPx = gutterPx * (fieldMetadata.viewCols - 1)
    const unitRawPx = Math.max(0, (contentInlinePx - gapTotalPx) / fieldMetadata.viewCols)
    const strideRawPx = unitRawPx + gutterPx

    geometry = {
      gapTotalPx,
      unitRawPx,
      strideRawPx,
      fullStartPx: 0,
      contentStartPx: 0,
      contentEndPx: contentInlinePx,
      fullEndPx: contentInlinePx,
      lineStartPx: Array.from({ length: fieldMetadata.viewCols }, (_, i) => i * strideRawPx),
      gutterCenterPx: Array.from(
        { length: fieldMetadata.viewCols - 1 },
        (_, i) => (i + 1) * unitRawPx + i * gutterPx + gutterPx / 2,
      ),
    }
  } else {
    // Raw field
    const { computeRawField } = await import('./core.js')
    geometry = computeRawField(outerInlinePx, contract)
  }

  return {
    raw: {
      gapTotalPx: geometry.gapTotalPx,
      unitRawPx: geometry.unitRawPx,
      strideRawPx: geometry.strideRawPx,
    },
    boundaries: {
      fullStartPx: geometry.fullStartPx,
      contentStartPx: geometry.contentStartPx,
      contentEndPx: geometry.contentEndPx,
      fullEndPx: geometry.fullEndPx,
    },
    lineStartPx: geometry.lineStartPx,
    gutterCenterPx: geometry.gutterCenterPx,
  }
}

// ---------------------------------------------------------------------------
// Warning Generation
// ---------------------------------------------------------------------------

/**
 * Generate debug warnings for a scope based on contract and geometry.
 */
export function generateDebugWarnings(
  contract: StrideContractInput,
  geometry: DebugGeometryMetadata,
  fieldMetadata: DebugFieldMetadata,
): DebugWarningMetadata[] {
  const warnings: DebugWarningMetadata[] = []

  // Track below minimum
  if (
    contract.minAutoTrackPx > 0 &&
    geometry.raw.unitRawPx > 0 &&
    geometry.raw.unitRawPx < contract.minAutoTrackPx
  ) {
    warnings.push({
      code: 'TRACK_BELOW_MIN',
      message: `Column unit (${geometry.raw.unitRawPx.toFixed(1)}px) is below the declared minimum track size (${contract.minAutoTrackPx}px).`,
      severity: 'warning',
    })
  }

  // Negative content inline
  if (geometry.boundaries.contentEndPx <= geometry.boundaries.contentStartPx) {
    warnings.push({
      code: 'NEGATIVE_CONTENT_INLINE',
      message: 'Content inline space is negative or zero - no room for columns.',
      severity: 'error',
    })
  }

  // View is approximate (always warn for view fields)
  if (fieldMetadata.kind === 'view') {
    warnings.push({
      code: 'VIEW_IS_APPROXIMATE',
      message: `g-view-${fieldMetadata.viewCols} reinterprets the current content width as ${fieldMetadata.viewCols} columns. This is not exact parent-track inheritance.`,
      severity: 'info',
    })
  }

  // Non-divisor view check
  if (fieldMetadata.kind === 'view' && fieldMetadata.viewCols) {
    if (contract.cols % fieldMetadata.viewCols !== 0) {
      warnings.push({
        code: 'NON_DIVISOR_VIEW',
        message: `View columns (${fieldMetadata.viewCols}) do not evenly divide base columns (${contract.cols}).`,
        severity: 'warning',
      })
    }
  }

  return warnings
}

// ---------------------------------------------------------------------------
// Complete Scope Metadata
// ---------------------------------------------------------------------------

/**
 * Build complete debug metadata for a scope.
 * This is the primary function the debug visualizer calls.
 */
export async function buildDebugScopeMetadata(
  element: Element,
  contract: StrideContractInput,
): Promise<DebugScopeMetadata | null> {
  const fieldMetadata = extractMetadataFromElement(element)
  if (!fieldMetadata) return null

  const { computeTypeMetrics } = await import('./core.js')
  const typeMetrics = computeTypeMetrics(contract)

  const geometry = await computeDebugGeometry(element, contract, fieldMetadata)
  const warnings = generateDebugWarnings(contract, geometry, fieldMetadata)

  // Compute derived values
  const contentInlinePx = geometry.boundaries.contentEndPx - geometry.boundaries.contentStartPx

  const derived = {
    contentInlinePx,
    colUnitRawPx: geometry.raw.unitRawPx,
    strideRawPx: geometry.raw.strideRawPx,
    rhythmPx: typeMetrics.rhythm,
    proseLineHeight: typeMetrics.proseLineHeight,
  }

  return {
    id: `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    field: fieldMetadata,
    geometry,
    authored: {
      cols: contract.cols,
      gutterPx: contract.gutterPx,
      framePx: contract.framePx,
      maxInlinePx: contract.maxInlinePx,
      minAutoTrackPx: contract.minAutoTrackPx,

      baselinePx: contract.baselinePx,
      typeBasePx: contract.typeBasePx,
      leadingSteps: contract.leadingSteps,
      scaleRatio: contract.scaleRatio,

      measureBodyPx: contract.measureBodyPx,
      measureTightPx: contract.measureTightPx,
      measureUiPx: contract.measureUiPx,
    },
    derived,
    warnings,
    element,
  }
}
