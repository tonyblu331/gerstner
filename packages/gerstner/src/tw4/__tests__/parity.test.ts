/**
 * TW4 Parity Tests — Validates CSS and TW4 surfaces are semantically equivalent
 *
 * Phase D exit gate: "CSS and TW4 semantics match"
 * "No parallel engine remains"
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vite-plus/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcRoot = path.resolve(__dirname, '../../')

function readSrcFile(relativePath: string): string {
  return readFileSync(path.join(srcRoot, relativePath), 'utf8')
}

// ---------------------------------------------------------------------------
// Theme parity — no inline derived recalcs
// ---------------------------------------------------------------------------

describe('tw4/theme.css parity', () => {
  const theme = readSrcFile('tw4/theme.css')

  it('does not recompute --g-rhythm', () => {
    expect(theme).not.toMatch(/--g-rhythm:\s*calc\(/)
  })

  it('does not recompute --g-prose', () => {
    expect(theme).not.toMatch(/--g-prose:\s*calc\(/)
  })

  it('does not recompute --g-density-*', () => {
    expect(theme).not.toMatch(/--g-density-tight:\s*calc\(/)
    expect(theme).not.toMatch(/--g-density-standard:\s*calc\(/)
    expect(theme).not.toMatch(/--g-density-loose:\s*calc\(/)
  })

  it('does not recompute --font-size-g-* inline', () => {
    // font-size tokens must reference stride scale, not recompute
    expect(theme).not.toMatch(/--font-size-g--2:\s*calc\(/)
    expect(theme).not.toMatch(/--font-size-g-5:\s*calc\(/)
  })

  it('does not recompute --spacing-g-stride inline', () => {
    expect(theme).not.toMatch(/--spacing-g-stride:\s*calc\(/)
  })

  it('references stride scale tokens via var()', () => {
    expect(theme).toContain('var(--g-scale--2)')
    expect(theme).toContain('var(--g-scale-5)')
  })

  it('references stride spacing tokens via var()', () => {
    expect(theme).toContain('var(--g-rhythm)')
    expect(theme).toContain('var(--g-stride)')
  })

  it('does not contain --g-measure (singular, demoted)', () => {
    // --g-measure (singular) was demoted; --g-measure-body/tight/ui are authored
    expect(theme).not.toMatch(/--g-measure:\s/)
  })

  it('contains authored --g-measure-body/tight/ui', () => {
    expect(theme).toContain('--g-measure-body:')
    expect(theme).toContain('--g-measure-tight:')
    expect(theme).toContain('--g-measure-ui:')
  })
})

// ---------------------------------------------------------------------------
// Utilities parity — no parallel engine
// ---------------------------------------------------------------------------

describe('tw4/utilities.css parity', () => {
  const utilities = readSrcFile('tw4/utilities.css')

  it('does not contain col-offset-* (deleted)', () => {
    expect(utilities).not.toContain('col-offset')
  })

  it('does not contain g-view-* (moved to helpers)', () => {
    expect(utilities).not.toContain('@utility g-view-')
  })

  it('does not contain density helpers (moved to helpers)', () => {
    expect(utilities).not.toContain('@utility g-tight')
    expect(utilities).not.toContain('@utility g-loose')
  })

  it('does not contain wrap helpers (moved to helpers)', () => {
    expect(utilities).not.toContain('@utility g-wrap-')
  })

  it('does not contain col-* helpers (moved to helpers)', () => {
    expect(utilities).not.toContain('@utility col-1')
    expect(utilities).not.toContain('@utility col-start-')
    expect(utilities).not.toContain('@utility col-end-')
    expect(utilities).not.toContain('@utility col-from-')
    expect(utilities).not.toContain('@utility col-to-')
  })

  it('contains grid container definitions', () => {
    expect(utilities).toContain('@utility g-shell')
    expect(utilities).toContain('@utility g {')
    expect(utilities).toContain('@utility g-sub')
    expect(utilities).toContain('@utility g-fit')
    expect(utilities).toContain('@utility g-fill')
  })

  it('contains type utilities', () => {
    expect(utilities).toContain('@utility g-prose')
    expect(utilities).toContain('@utility g-display')
    expect(utilities).toContain('@utility g-heading')
    expect(utilities).toContain('@utility g-ui')
  })
})

// ---------------------------------------------------------------------------
// Index parity — correct import order
// ---------------------------------------------------------------------------

describe('tw4/index.css parity', () => {
  const index = readSrcFile('tw4/index.css')

  it('imports stride before theme', () => {
    const stridePos = index.indexOf("stride/index.css")
    const themePos = index.indexOf("theme.css")
    expect(stridePos).toBeGreaterThan(-1)
    expect(themePos).toBeGreaterThan(-1)
    expect(stridePos).toBeLessThan(themePos)
  })

  it('imports theme before utilities', () => {
    const themePos = index.indexOf("theme.css")
    const utilPos = index.indexOf("utilities.css")
    expect(themePos).toBeLessThan(utilPos)
  })

  it('imports utilities before helpers', () => {
    const utilPos = index.indexOf("utilities.css")
    const helpersPos = index.indexOf("helpers.css")
    expect(utilPos).toBeLessThan(helpersPos)
  })

  it('imports helpers before aliases', () => {
    const helpersPos = index.indexOf("helpers.css")
    const aliasesPos = index.indexOf("aliases.css")
    expect(helpersPos).toBeLessThan(aliasesPos)
  })
})

// ---------------------------------------------------------------------------
// Cross-surface: CSS helpers match TW4 helpers
// ---------------------------------------------------------------------------

describe('CSS ↔ TW4 helper parity', () => {
  const cssHelpers = readSrcFile('css/helpers.css')
  const tw4Helpers = readSrcFile('tw4/helpers.css')

  it('both contain col-1 through col-12', () => {
    for (let n = 1; n <= 12; n++) {
      expect(cssHelpers).toContain(`.col-${n} {`)
      expect(tw4Helpers).toContain(`@utility col-${n} {`)
    }
  })

  it('both contain col-start-1 through col-start-12', () => {
    for (let n = 1; n <= 12; n++) {
      expect(cssHelpers).toContain(`.col-start-${n} {`)
      expect(tw4Helpers).toContain(`@utility col-start-${n} {`)
    }
  })

  it('both contain col-end-1 through col-end-13', () => {
    for (let n = 1; n <= 13; n++) {
      expect(cssHelpers).toContain(`.col-end-${n} {`)
      expect(tw4Helpers).toContain(`@utility col-end-${n} {`)
    }
  })

  it('both contain gutter anchors', () => {
    expect(cssHelpers).toContain('.col-from-gutter-1 {')
    expect(tw4Helpers).toContain('@utility col-from-gutter-1 {')
    expect(cssHelpers).toContain('.col-to-gutter-11 {')
    expect(tw4Helpers).toContain('@utility col-to-gutter-11 {')
  })

  it('both contain boundary helpers', () => {
    expect(cssHelpers).toContain('.g-content {')
    expect(tw4Helpers).toContain('@utility g-content {')
  })

  it('both contain density helpers', () => {
    expect(cssHelpers).toContain('.g-tight {')
    expect(tw4Helpers).toContain('@utility g-tight {')
  })

  it('both contain wrap helpers', () => {
    expect(cssHelpers).toContain('.g-wrap-balance {')
    expect(tw4Helpers).toContain('@utility g-wrap-balance {')
  })

  it('neither contains col-offset-*', () => {
    expect(cssHelpers).not.toContain('col-offset')
    expect(tw4Helpers).not.toContain('col-offset')
  })
})
