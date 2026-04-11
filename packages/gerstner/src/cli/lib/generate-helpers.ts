/**
 * CSS Helper Generator — Emits helpers.css from Stride manifest
 *
 * Phase B: CSS helper emission only.
 * Phase C owns: TW4 helpers, debug labels, reference metadata.
 *
 * Generated artifact — do not edit by hand.
 *
 * SPDX-License-Identifier: MIT
 */

import type { StrideManifest, ManifestHelperRange } from '../../stride/serialize'

// ---------------------------------------------------------------------------
// Helper Range Emission
// ---------------------------------------------------------------------------

function emitRange(range: ManifestHelperRange): string {
  const lines: string[] = []
  for (let n = range.min; n <= range.max; n++) {
    const className = `${range.prefix}${n}`
    const value = range.cssValueTemplate.replaceAll('{n}', String(n))
    lines.push(`.${className} {\n  ${range.cssProperty}: ${value};\n}`)
  }
  return lines.join('\n\n')
}

// ---------------------------------------------------------------------------
// Named Boundary Helpers
// ---------------------------------------------------------------------------

function emitBoundaryHelpers(): string {
  const boundaries = [
    { cls: 'g-content', prop: 'grid-column', value: 'content-start / content-end' },
    { cls: 'g-full', prop: 'grid-column', value: '1 / -1' },
    { cls: 'col-full', prop: 'grid-column', value: '1 / -1' },
    { cls: 'g-breakout-l', prop: 'grid-column', value: 'full-start / content-end' },
    { cls: 'g-breakout-r', prop: 'grid-column', value: 'content-start / full-end' },
  ]

  return boundaries.map((b) => `.${b.cls} {\n  ${b.prop}: ${b.value};\n}`).join('\n\n')
}

// ---------------------------------------------------------------------------
// Named Line Helpers (content-start, content-end, full-start, full-end)
// ---------------------------------------------------------------------------

function emitNamedLineHelpers(): string {
  const lines: string[] = []

  const namedFrom = ['content-start', 'content-end', 'full-start', 'full-end']
  for (const name of namedFrom) {
    const cls = `col-from-${name}`
    lines.push(`.${cls} {\n  grid-column-start: ${name};\n}`)
  }

  const namedTo = ['content-start', 'content-end', 'full-start', 'full-end']
  for (const name of namedTo) {
    const cls = `col-to-${name}`
    lines.push(`.${cls} {\n  grid-column-end: ${name};\n}`)
  }

  return lines.join('\n\n')
}

// ---------------------------------------------------------------------------
// Density Helpers
// ---------------------------------------------------------------------------

function emitDensityHelpers(): string {
  return [
    '.g-tight {\n  --g-density: var(--g-density-tight);\n}',
    '.g-standard {\n  --g-density: var(--g-density-standard);\n}',
    '.g-loose {\n  --g-density: var(--g-density-loose);\n}',
  ].join('\n\n')
}

// ---------------------------------------------------------------------------
// Text Wrap Helpers
// ---------------------------------------------------------------------------

function emitWrapHelpers(): string {
  return [
    '.g-wrap-balance {\n  text-wrap: balance;\n}',
    '.g-wrap-pretty {\n  text-wrap: pretty;\n}',
    '.g-wrap-normal {\n  text-wrap: wrap;\n}',
    '.g-wrap-nowrap {\n  text-wrap: nowrap;\n}',
  ].join('\n\n')
}

// ---------------------------------------------------------------------------
// View Column Overrides
// ---------------------------------------------------------------------------

function emitViewHelpers(manifest: StrideManifest): string {
  return manifest.views
    .map(
      (v) =>
        `.g-view-${v.viewCols} {\n  --g-cols: ${v.viewCols};\n  --g-align-mode: approximate;\n}`,
    )
    .join('\n\n')
}

// ---------------------------------------------------------------------------
// Align Mode Override
// ---------------------------------------------------------------------------

function emitAlignModeHelpers(): string {
  return '.g-align-independent {\n  --g-align-mode: independent;\n}'
}

// ---------------------------------------------------------------------------
// Full Emission
// ---------------------------------------------------------------------------

export function emitCssHelpers(manifest: StrideManifest): string {
  const sections: string[] = []

  // Header
  const header = [
    '/**',
    ' * Gerstner CSS Helpers — Generated from Stride manifest',
    ' *',
    ` * Generated at: ${manifest.generatedAt}`,
    ` * Contract cols: ${manifest.contract.cols}`,
    ' *',
    ' * GENERATED ARTIFACT — do not edit by hand. Regenerate via: pnpm emit:manifest && pnpm emit:helpers',
    ' */',
    '',
    '@layer gerstner.helpers {',
  ].join('\n')
  sections.push(header)

  // Column helpers from manifest ranges
  for (const range of manifest.helperRanges) {
    sections.push(emitRange(range))
  }

  // Named boundary helpers
  sections.push(emitBoundaryHelpers())

  // Named line helpers
  sections.push(emitNamedLineHelpers())

  // View column overrides
  sections.push(emitViewHelpers(manifest))

  // Align mode override
  sections.push(emitAlignModeHelpers())

  // Density helpers
  sections.push(emitDensityHelpers())

  // Text wrap helpers
  sections.push(emitWrapHelpers())

  // Close layer
  sections.push('}')

  return sections.join('\n\n')
}
