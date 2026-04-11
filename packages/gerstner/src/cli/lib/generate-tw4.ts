/**
 * TW4 Helper Generator — Emits TW4 @utility helpers from Stride manifest
 *
 * Phase C expansion: TW4 helpers use @utility syntax instead of .class.
 * Phase D owns: rewriting tw4/theme.css and tw4/utilities.css inline recalcs.
 *
 * Generated artifact — do not edit by hand.
 *
 * SPDX-License-Identifier: MIT
 */

import type { StrideManifest, ManifestHelperRange } from '../../stride/serialize'

// ---------------------------------------------------------------------------
// Helper Range Emission (TW4 @utility syntax)
// ---------------------------------------------------------------------------

function emitTw4Range(range: ManifestHelperRange): string {
  const lines: string[] = []
  for (let n = range.min; n <= range.max; n++) {
    const className = `${range.prefix}${n}`
    const value = range.cssValueTemplate.replaceAll('{n}', String(n))
    lines.push(`@utility ${className} {\n  ${range.cssProperty}: ${value};\n}`)
  }
  return lines.join('\n\n')
}

// ---------------------------------------------------------------------------
// Named Boundary Helpers
// ---------------------------------------------------------------------------

function emitTw4BoundaryHelpers(): string {
  const boundaries = [
    { cls: 'g-content', prop: 'grid-column', value: 'content-start / content-end' },
    { cls: 'g-full', prop: 'grid-column', value: '1 / -1' },
    { cls: 'col-full', prop: 'grid-column', value: '1 / -1' },
    { cls: 'g-breakout-l', prop: 'grid-column', value: 'full-start / content-end' },
    { cls: 'g-breakout-r', prop: 'grid-column', value: 'content-start / full-end' },
  ]

  return boundaries.map((b) => `@utility ${b.cls} {\n  ${b.prop}: ${b.value};\n}`).join('\n\n')
}

// ---------------------------------------------------------------------------
// Named Line Helpers
// ---------------------------------------------------------------------------

function emitTw4NamedLineHelpers(): string {
  const lines: string[] = []

  const namedFrom = ['content-start', 'content-end', 'full-start', 'full-end']
  for (const name of namedFrom) {
    lines.push(`@utility col-from-${name} {\n  grid-column-start: ${name};\n}`)
  }

  const namedTo = ['content-start', 'content-end', 'full-start', 'full-end']
  for (const name of namedTo) {
    lines.push(`@utility col-to-${name} {\n  grid-column-end: ${name};\n}`)
  }

  return lines.join('\n\n')
}

// ---------------------------------------------------------------------------
// View Column Overrides
// ---------------------------------------------------------------------------

function emitTw4ViewHelpers(manifest: StrideManifest): string {
  return manifest.views
    .map(
      (v) =>
        `@utility g-view-${v.viewCols} {\n  --g-cols: ${v.viewCols};\n  --g-align-mode: approximate;\n}`,
    )
    .join('\n\n')
}

// ---------------------------------------------------------------------------
// Align Mode Override
// ---------------------------------------------------------------------------

function emitTw4AlignModeHelpers(): string {
  return '@utility g-align-independent {\n  --g-align-mode: independent;\n}'
}

// ---------------------------------------------------------------------------
// Density Helpers
// ---------------------------------------------------------------------------

function emitTw4DensityHelpers(): string {
  return [
    '@utility g-tight {\n  --g-density: var(--g-density-tight);\n}',
    '@utility g-standard {\n  --g-density: var(--g-density-standard);\n}',
    '@utility g-loose {\n  --g-density: var(--g-density-loose);\n}',
  ].join('\n\n')
}

// ---------------------------------------------------------------------------
// Text Wrap Helpers
// ---------------------------------------------------------------------------

function emitTw4WrapHelpers(): string {
  return [
    '@utility g-wrap-balance {\n  text-wrap: balance;\n}',
    '@utility g-wrap-pretty {\n  text-wrap: pretty;\n}',
    '@utility g-wrap-normal {\n  text-wrap: wrap;\n}',
    '@utility g-wrap-nowrap {\n  text-wrap: nowrap;\n}',
  ].join('\n\n')
}

// ---------------------------------------------------------------------------
// Full TW4 Helper Emission
// ---------------------------------------------------------------------------

export function emitTw4Helpers(manifest: StrideManifest): string {
  const sections: string[] = []

  const header = [
    '/**',
    ' * Gerstner TW4 Helpers — Generated from Stride manifest',
    ' *',
    ` * Generated at: ${manifest.generatedAt}`,
    ` * Contract cols: ${manifest.contract.cols}`,
    ' *',
    ' * GENERATED ARTIFACT — do not edit by hand. Regenerate via: pnpm emit:manifest && pnpm emit:tw4',
    ' */',
  ].join('\n')
  sections.push(header)

  // Column helpers from manifest ranges
  for (const range of manifest.helperRanges) {
    sections.push(emitTw4Range(range))
  }

  // Named boundary helpers
  sections.push(emitTw4BoundaryHelpers())

  // Named line helpers
  sections.push(emitTw4NamedLineHelpers())

  // View column overrides
  sections.push(emitTw4ViewHelpers(manifest))

  // Align mode override
  sections.push(emitTw4AlignModeHelpers())

  // Density helpers
  sections.push(emitTw4DensityHelpers())

  // Text wrap helpers
  sections.push(emitTw4WrapHelpers())

  return sections.join('\n\n')
}
