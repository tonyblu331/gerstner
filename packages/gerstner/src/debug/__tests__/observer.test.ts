/**
 * Debug Observer Tests
 *
 * Phase E exit gate: "Debug tests pass"
 * Real unit tests — mocks DOM APIs in Node, exercises actual logic.
 * No source-grep false positives.
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vite-plus/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcRoot = path.resolve(__dirname, '../../')

function readSrcFile(relativePath: string): string {
  return readFileSync(path.join(srcRoot, relativePath), 'utf8')
}

// ---------------------------------------------------------------------------
// DOM mock helpers — no jsdom needed
// ---------------------------------------------------------------------------

function makeMockElement(props: {
  clientWidth: number
  styles: Record<string, string>
}): HTMLElement {
  return {
    clientWidth: props.clientWidth,
    style: {
      _props: {} as Record<string, string>,
      setProperty(k: string, v: string) {
        ;(this._props as Record<string, string>)[k] = v
      },
      getPropertyValue(k: string) {
        return (this._props as Record<string, string>)[k] ?? ''
      },
    },
    getAttribute: vi.fn(),
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    closest: vi.fn(),
    querySelectorAll: vi.fn(() => []),
  } as unknown as HTMLElement
}

function installGetComputedStyle(
  elementStyles: Record<string, string>,
  rootStyles: Record<string, string> = {},
) {
  ;(globalThis as Record<string, unknown>).getComputedStyle = (el: unknown) => {
    const isRoot = (el as HTMLElement) === mockDocument.documentElement
    const styles = isRoot ? rootStyles : elementStyles
    return {
      getPropertyValue: (prop: string) => styles[prop] ?? '',
      fontSize: rootStyles['fontSize'] ?? '16px',
    } as unknown as CSSStyleDeclaration
  }
}

function removeGetComputedStyle() {
  delete (globalThis as Record<string, unknown>).getComputedStyle
}

const mockDocument = {
  documentElement: makeMockElement({ clientWidth: 1440, styles: {} }),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(() => []),
}

// ---------------------------------------------------------------------------
// readMetrics — actual math verification
// ---------------------------------------------------------------------------

describe('readMetrics — computes correct pixel values', () => {
  beforeEach(() => {
    globalThis.document = mockDocument as unknown as Document
  })

  afterEach(() => {
    removeGetComputedStyle()
  })

  it('computes colPx, gutterPx, stridePx correctly for 12-col layout', async () => {
    // 1440px viewport, 80px frame each side, 24px gutter, 12 cols
    // contentInline = min(1440, 1440 - 80*2) = 1280
    // gapTotal = 24 * 11 = 264
    // colUnitRaw = (1280 - 264) / 12 = 84.666...
    // stridePx = 84.666 + 24 = 108.666
    const scope = makeMockElement({ clientWidth: 1440, styles: {} })
    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
      },
      { fontSize: '16px' },
    )

    const { readMetrics } = await import('../observer.js')
    const m = readMetrics(scope)

    expect(m).not.toBeNull()
    expect(m!.cols).toBe(12)
    expect(m!.gutterPx).toBe(24)
    expect(m!.framePx).toBe(80)
    expect(m!.colPx).toBeCloseTo((1280 - 264) / 12, 3)
    expect(m!.stridePx).toBeCloseTo((1280 - 264) / 12 + 24, 3)
    // frameOffsetPx = (cqiPx - contentInline) / 2 = (1440 - 1280) / 2 = 80
    expect(m!.frameOffsetPx).toBe(80)
  })

  it('converts rem values using actual root font-size, not hardcoded 16', async () => {
    // root font-size = 20px, 1rem gutter = 20px, 5rem frame = 100px
    // contentInline = min(90*20, 1440 - 100*2) = min(1800, 1240) = 1240
    // gapTotal = 20 * 11 = 220
    // colUnitRaw = (1240 - 220) / 12 = 85
    const scope = makeMockElement({ clientWidth: 1440, styles: {} })
    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '1rem',
        '--g-baseline': '0.5rem',
        '--g-leading-steps': '3',
        '--g-frame': '5rem',
        '--g-max-width': '90rem',
      },
      { fontSize: '20px' },
    )

    const { readMetrics } = await import('../observer.js')
    const m = readMetrics(scope)

    expect(m).not.toBeNull()
    expect(m!.gutterPx).toBe(20) // 1rem * 20px
    expect(m!.framePx).toBe(100) // 5rem * 20px
    expect(m!.baselinePx).toBe(10) // 0.5rem * 20px
    expect(m!.rhythmPx).toBe(30) // 10 * 3
    expect(m!.colPx).toBeCloseTo((1240 - 220) / 12, 3)
    // frameOffsetPx = (1440 - 1240) / 2 = 100
    expect(m!.frameOffsetPx).toBe(100)
  })

  it('returns null when colPx is zero or negative', async () => {
    // Pathological: viewport too small for content
    const scope = makeMockElement({ clientWidth: 10, styles: {} })
    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
      },
      { fontSize: '16px' },
    )

    const { readMetrics } = await import('../observer.js')
    expect(readMetrics(scope)).toBeNull()
  })

  it('respects max-width clamp — does not exceed it', async () => {
    // viewport 2000px wide, max-width 1440px, frame 80px each side
    // contentInline = min(1440, 2000 - 160) = 1440
    const scope = makeMockElement({ clientWidth: 2000, styles: {} })
    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
      },
      { fontSize: '16px' },
    )

    const { readMetrics } = await import('../observer.js')
    const m = readMetrics(scope)
    expect(m).not.toBeNull()
    // contentInline capped at 1440, not 2000-160=1840
    expect(m!.colPx).toBeCloseTo((1440 - 24 * 11) / 12, 3)
    // frameOffsetPx = (2000 - 1440) / 2 = 280 — NOT 80 (framePx)
    expect(m!.frameOffsetPx).toBe(280)
  })
})

// ---------------------------------------------------------------------------
// syncDebugMetrics — publishes correct CSS custom properties
// ---------------------------------------------------------------------------

describe('syncDebugMetrics — publishes px values to debug root', () => {
  afterEach(() => removeGetComputedStyle())

  it('sets all required debug custom properties on the root element', async () => {
    const debugRoot = makeMockElement({ clientWidth: 0, styles: {} })
    const scope = makeMockElement({ clientWidth: 1440, styles: {} })
    globalThis.document = mockDocument as unknown as Document

    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
      },
      { fontSize: '16px' },
    )

    const { syncDebugMetrics } = await import('../observer.js')
    syncDebugMetrics(debugRoot, scope)

    const style = (debugRoot.style as unknown as { _props: Record<string, string> })._props
    expect(style['--g-debug-col-px']).toMatch(/px$/)
    expect(style['--g-debug-gutter-px']).toBe('24px')
    expect(style['--g-debug-stride-px']).toMatch(/px$/)
    expect(style['--g-debug-frame-px']).toBe('80px')
    expect(style['--g-cols']).toBe('12')
    expect(style['--g-debug-baseline-px']).toBe('8px')
    expect(style['--g-debug-rhythm-px']).toBe('24px')
  })

  it('still publishes baseline/rhythm px when readMetrics is null (invalid grid)', async () => {
    const debugRoot = makeMockElement({ clientWidth: 0, styles: {} })
    const scope = makeMockElement({ clientWidth: 10, styles: {} })
    globalThis.document = mockDocument as unknown as Document

    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
      },
      { fontSize: '16px' },
    )

    const { syncDebugMetrics } = await import('../observer.js')
    syncDebugMetrics(debugRoot, scope)

    const style = (debugRoot.style as unknown as { _props: Record<string, string> })._props
    expect(style['--g-debug-baseline-px']).toBe('8px')
    expect(style['--g-debug-rhythm-px']).toBe('24px')
    expect(style['--g-debug-col-px']).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Structural contracts — these ARE valid as grep tests (shape, not logic)
// ---------------------------------------------------------------------------

describe('debug/observer.ts — structural contracts', () => {
  const observer = readSrcFile('debug/observer.ts')

  it('does not use gridTemplateColumns heuristic', () => {
    expect(observer).not.toContain('gridTemplateColumns')
  })

  it('does not use matchAll heuristic', () => {
    expect(observer).not.toContain('matchAll')
  })

  it('does not hardcode REM_PX = 16', () => {
    expect(observer).not.toContain('REM_PX')
    expect(observer).not.toContain('= 16 //')
  })

  it('reads root font-size at runtime', () => {
    // Must call getComputedStyle on documentElement to get real font-size — never hardcode 16
    expect(observer).toContain('document.documentElement')
    expect(observer).toContain('.fontSize')
  })

  it('exports required public API', () => {
    expect(observer).toContain('export function readMetrics')
    expect(observer).toContain('export function detectDrift')
    expect(observer).toContain('export function applyDriftDetection')
    expect(observer).toContain('export function syncDebugMetrics')
  })

  it('exports ObserverMetrics interface with framePx and frameOffsetPx', () => {
    expect(observer).toContain('framePx')
    expect(observer).toContain('frameOffsetPx')
  })
})

describe('debug/debug.css — structural contracts', () => {
  const css = readSrcFile('debug/debug.css')

  it('column overlay uses absolute positioning to avoid layout shift', () => {
    expect(css).toContain('position: absolute')
    expect(css).toContain('inset: 0')
    expect(css).toContain('pointer-events: none')
  })

  it('uses px metrics from observer for baseline/rhythm overlays', () => {
    expect(css).toContain('var(--g-debug-baseline-px)')
    expect(css).toContain('var(--g-debug-rhythm-px)')
  })

  it('defines column tint variable', () => {
    expect(css).toContain('--g-debug-col-tint')
  })

  it('hides version/presets UI from the panel toolbar', () => {
    expect(css).toContain('.dialkit-preset-manager')
    expect(css).toContain('.dialkit-toolbar-add')
  })
})

describe('debug/index.tsx — structural contracts', () => {
  const index = readSrcFile('debug/index.tsx')

  it('imports from observer.js', () => {
    expect(index).toContain("from './observer.js'")
  })

  it('does not use layout heuristics', () => {
    expect(index).not.toContain('gridTemplateColumns')
    expect(index).not.toContain('matchAll')
  })

  it('calls syncDebugMetrics and applyDriftDetection', () => {
    expect(index).toContain('syncDebugMetrics(')
    expect(index).toContain('applyDriftDetection()')
  })

  it('exports --g-measure-body/tight/ui (not singular --g-measure)', () => {
    expect(index).not.toMatch(/--g-measure:\s/)
    expect(index).toContain('--g-measure-body')
    expect(index).toContain('--g-measure-tight')
    expect(index).toContain('--g-measure-ui')
  })
})

// ---------------------------------------------------------------------------
// debug/labels.json — shape validation
// ---------------------------------------------------------------------------

describe('debug/labels.json — shape', () => {
  const labels = JSON.parse(readSrcFile('debug/labels.json'))

  it('has 12 columns with index, name, lineName', () => {
    expect(Array.isArray(labels.columns)).toBe(true)
    expect(labels.columns.length).toBe(12)
    for (const col of labels.columns) {
      expect(col).toHaveProperty('index')
      expect(col).toHaveProperty('name')
      expect(col).toHaveProperty('lineName')
    }
  })

  it('has 11 gutters', () => {
    expect(Array.isArray(labels.gutters)).toBe(true)
    expect(labels.gutters.length).toBe(11)
  })

  it('has boundaries, views, scales', () => {
    expect(labels).toHaveProperty('boundaries')
    expect(labels).toHaveProperty('views')
    expect(labels).toHaveProperty('scales')
  })
})

// ---------------------------------------------------------------------------
// CLI templates — structural contracts
// ---------------------------------------------------------------------------

describe('cli/templates/contract.ts — structural contracts', () => {
  const template = readSrcFile('cli/templates/contract.ts')

  it('does not contain deprecated --g-measure (singular)', () => {
    expect(template).not.toMatch(/--g-measure:\s/)
  })

  it('contains --g-measure-body/tight/ui', () => {
    expect(template).toContain('--g-measure-body')
    expect(template).toContain('--g-measure-tight')
    expect(template).toContain('--g-measure-ui')
  })
})

describe('cli/templates/debug.ts — structural contracts', () => {
  const template = readSrcFile('cli/templates/debug.ts')

  it('uses layers config, not legacy overlay/badge/ruler', () => {
    expect(template).toContain('layers:')
    expect(template).not.toContain('overlay:')
    expect(template).not.toContain('badge:')
    expect(template).not.toContain('ruler:')
  })
})
