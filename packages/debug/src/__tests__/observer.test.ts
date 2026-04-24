/**
 * Debug Observer Tests
 *
 * Phase C exit gate: observer sources all geometry from snapshot, no layout formulas.
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
const srcRoot = path.resolve(__dirname, '../')

function readSrcFile(relativePath: string): string {
  return readFileSync(path.join(srcRoot, relativePath), 'utf8')
}

// ---------------------------------------------------------------------------
// DOM mock helpers — no jsdom needed
// ---------------------------------------------------------------------------

function makeMockElement(props: {
  clientWidth?: number
  rectWidth?: number
  classes?: string[]
  styles?: Record<string, string>
}): HTMLElement {
  const { rectWidth = 1440, classes = [] } = props

  const classList = {
    _list: new Set(classes),
    contains(c: string) {
      return this._list.has(c)
    },
    [Symbol.iterator]() {
      return this._list[Symbol.iterator]()
    },
  }

  const attrs: Record<string, string> = {}

  return {
    classList,
    clientWidth: rectWidth,
    getBoundingClientRect: () => ({ x: 0, y: 0, width: rectWidth, height: 800 }),
    getAttribute: (k: string) => attrs[k] ?? null,
    setAttribute: (k: string, v: string) => {
      attrs[k] = v
    },
    removeAttribute: vi.fn(),
    closest: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    appendChild: vi.fn(() => ({ getBoundingClientRect: () => ({ height: 0 }) })),
    removeChild: vi.fn(),
    style: {
      _props: {} as Record<string, string>,
      setProperty(k: string, v: string) {
        ;(this._props as Record<string, string>)[k] = v
      },
      getPropertyValue(k: string) {
        return (this._props as Record<string, string>)[k] ?? ''
      },
      cssText: '',
    },
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
      position: 'relative',
    } as unknown as CSSStyleDeclaration
  }
}

function removeGetComputedStyle() {
  delete (globalThis as Record<string, unknown>).getComputedStyle
}

const mockDocument = {
  documentElement: makeMockElement({ rectWidth: 1440 }),
  body: makeMockElement({ rectWidth: 1440 }),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(() => []),
  createElement: vi.fn(() => ({
    setAttribute: vi.fn(),
    getBoundingClientRect: () => ({ height: 0 }),
    style: { cssText: '', height: '' },
    className: '',
    appendChild: vi.fn(),
  })),
}

beforeEach(() => {
  globalThis.document = mockDocument as unknown as Document
  globalThis.window = { devicePixelRatio: 1 } as unknown as Window & typeof globalThis
})

afterEach(() => {
  removeGetComputedStyle()
})

// ---------------------------------------------------------------------------
// readMetrics — delegates to buildSnapshot, correct values
// ---------------------------------------------------------------------------

describe('readMetrics — delegates to buildSnapshot', () => {
  it('computes colPx, gutterPx, stridePx via snapshot for 12-col shell layout', async () => {
    // 1440px viewport, 80px frame, 24px gutter, 12 cols, maxWidth=1440
    // contentInline = min(1440, 1440-160) = 1280
    // colUnitRaw = (1280 - 24*11) / 12 = 84.666...
    const scope = makeMockElement({ classes: ['g-shell'], rectWidth: 1440 })
    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
        '--g-min': '256px',
        '--g-type-base': '16px',
        '--g-scale-ratio': '1.25',
        '--g-measure-body': '560px',
        '--g-measure-tight': '360px',
        '--g-measure-ui': '280px',
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
    expect(m!.frameOffsetPx).toBe(80)
  })

  it('returns null when element has no width', async () => {
    const scope = makeMockElement({ classes: ['g-shell'], rectWidth: 0 })
    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
        '--g-min': '256px',
        '--g-type-base': '16px',
        '--g-scale-ratio': '1.25',
        '--g-measure-body': '560px',
        '--g-measure-tight': '360px',
        '--g-measure-ui': '280px',
      },
      { fontSize: '16px' },
    )

    const { readMetrics } = await import('../observer.js')
    expect(readMetrics(scope)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// syncDebugMetrics — publishes correct CSS custom properties
// ---------------------------------------------------------------------------

describe('syncDebugMetrics — publishes px values to debug root', () => {
  it('sets all required debug custom properties on the root element', async () => {
    const debugRoot = makeMockElement({ rectWidth: 0 })
    const scope = makeMockElement({ classes: ['g-shell'], rectWidth: 1440 })

    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
        '--g-min': '256px',
        '--g-type-base': '16px',
        '--g-scale-ratio': '1.25',
        '--g-measure-body': '560px',
        '--g-measure-tight': '360px',
        '--g-measure-ui': '280px',
      },
      { fontSize: '16px' },
    )

    const { syncDebugMetrics } = await import('../observer.js')
    syncDebugMetrics(debugRoot, scope)

    const style = (debugRoot.style as unknown as { _props: Record<string, string> })._props
    const bodyStyle = (document.body.style as unknown as { _props: Record<string, string> })._props
    expect(style['--g-debug-col-px']).toMatch(/px$/)
    expect(style['--g-debug-gutter-px']).toBe('24px')
    expect(style['--g-debug-stride-px']).toMatch(/px$/)
    expect(style['--g-debug-frame-px']).toBe('80px')
    expect(style['--g-cols']).toBe('12')
    expect(bodyStyle['--g-debug-baseline-px']).toBe('8px')
    expect(bodyStyle['--g-debug-rhythm-px']).toBe('24px')
  })

  it('still publishes baseline/rhythm px when grid is degenerate (zero-width element)', async () => {
    const debugRoot = makeMockElement({ rectWidth: 0 })
    const scope = makeMockElement({ classes: ['g-shell'], rectWidth: 0 })

    installGetComputedStyle(
      {
        '--g-cols': '12',
        '--g-gutter': '24px',
        '--g-baseline': '8px',
        '--g-leading-steps': '3',
        '--g-frame': '80px',
        '--g-max-width': '1440px',
        '--g-min': '256px',
        '--g-type-base': '16px',
        '--g-scale-ratio': '1.25',
        '--g-measure-body': '560px',
        '--g-measure-tight': '360px',
        '--g-measure-ui': '280px',
      },
      { fontSize: '16px' },
    )

    const { syncDebugMetrics } = await import('../observer.js')
    syncDebugMetrics(debugRoot, scope)

    const style = (debugRoot.style as unknown as { _props: Record<string, string> })._props
    const bodyStyle = (document.body.style as unknown as { _props: Record<string, string> })._props
    expect(bodyStyle['--g-debug-baseline-px']).toMatch(/px$/)
    expect(bodyStyle['--g-debug-rhythm-px']).toMatch(/px$/)
    expect(style['--g-debug-col-px']).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Structural contracts — observer.ts
// ---------------------------------------------------------------------------

describe('debug/observer.ts — structural contracts', () => {
  const observer = readSrcFile('observer.ts')

  it('does not use gridTemplateColumns heuristic', () => {
    expect(observer).not.toContain('gridTemplateColumns')
  })

  it('does not use matchAll heuristic', () => {
    expect(observer).not.toContain('matchAll')
  })

  it('does not contain layout formula: colUnitRaw = (contentInline - gapTotal) / cols', () => {
    expect(observer).not.toContain('colUnitRaw =')
    expect(observer).not.toContain('contentInline - gapTotal')
  })

  it('does not contain drift detection', () => {
    expect(observer).not.toContain('detectDrift')
    expect(observer).not.toContain('applyDriftDetection')
    expect(observer).not.toContain('DriftReport')
  })

  it('imports buildSnapshot from stride/snapshot', () => {
    expect(observer).toContain("from 'gerstner/stride/snapshot'")
    expect(observer).toContain('buildSnapshot')
  })

  it('exports required public API', () => {
    expect(observer).toContain('export function readMetrics')
    expect(observer).toContain('export function readScopes')
    expect(observer).toContain('export function syncDebugMetrics')
    expect(observer).toContain('export function syncShellOverlays')
    expect(observer).toContain('export { buildAllSnapshots }')
  })

  it('exports ObserverMetrics interface with framePx and frameOffsetPx', () => {
    expect(observer).toContain('framePx')
    expect(observer).toContain('frameOffsetPx')
  })
})

describe('debug/debug.css — structural contracts', () => {
  const css = readSrcFile('debug.css')

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
  const index = readSrcFile('index.tsx')

  it('imports from observer.js', () => {
    expect(index).toContain("from './observer.js'")
  })

  it('does not use layout heuristics', () => {
    expect(index).not.toContain('gridTemplateColumns')
    expect(index).not.toContain('matchAll')
  })

  it('calls syncDebugMetrics', () => {
    expect(index).toContain('syncDebugMetrics(')
  })

  it('does not call applyDriftDetection (removed in Phase C)', () => {
    expect(index).not.toContain('applyDriftDetection()')
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
  const labels = JSON.parse(readSrcFile('labels.json'))

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
