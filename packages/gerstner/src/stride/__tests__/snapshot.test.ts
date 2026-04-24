/**
 * Stride Snapshot Tests
 *
 * Phase A exit gate: Vitest proves raw/shell/view/gutter snapshots.
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vite-plus/test'
import { buildSnapshot, validDebugGutterAnchors, type GridDebugSnapshot } from '../snapshot.js'

// ---------------------------------------------------------------------------
// DOM mock helpers
// ---------------------------------------------------------------------------

function makeMockElement(opts: {
  clientWidth?: number
  rectWidth?: number
  classes?: string[]
  styles?: Record<string, string>
  snapshotId?: string
}): HTMLElement {
  const { rectWidth = 1440, classes = [], styles = {}, snapshotId } = opts

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
  if (snapshotId) attrs['data-g-snapshot-id'] = snapshotId

  return {
    classList,
    getBoundingClientRect: () => ({ x: 0, y: 0, width: rectWidth, height: 800 }),
    getAttribute: (k: string) => attrs[k] ?? null,
    setAttribute: (k: string, v: string) => {
      attrs[k] = v
    },
    removeAttribute: vi.fn(),
    appendChild: vi.fn(() => ({ getBoundingClientRect: () => ({ height: 0 }) })),
    removeChild: vi.fn(),
    style: { cssText: '', height: '' },
  } as unknown as HTMLElement
}

const MOCK_ROOT = {
  fontSize: '16px',
}

function installGetComputedStyle(
  elementStyles: Record<string, string>,
  rootStyles: Record<string, string> = MOCK_ROOT,
) {
  ;(globalThis as Record<string, unknown>).getComputedStyle = (el: unknown) => {
    const isRoot = el === mockDocument.documentElement
    const map = isRoot ? rootStyles : elementStyles
    return {
      getPropertyValue: (prop: string) => map[prop] ?? '',
      fontSize: rootStyles['fontSize'] ?? '16px',
    }
  }
}

function removeGetComputedStyle() {
  delete (globalThis as Record<string, unknown>).getComputedStyle
}

const mockDocument = {
  documentElement: makeMockElement({ classes: [] }),
  createElement: (tag: string) => {
    const el: Record<string, unknown> = {
      tagName: tag.toUpperCase(),
      style: { cssText: '', height: '' },
      setAttribute: vi.fn(),
      getBoundingClientRect: () => ({ height: 0 }),
    }
    return el
  },
}

beforeEach(() => {
  globalThis.document = mockDocument as unknown as Document
  globalThis.window = { devicePixelRatio: 1 } as unknown as Window & typeof globalThis
})

afterEach(() => {
  removeGetComputedStyle()
})

// ---------------------------------------------------------------------------
// Golden fixture: shell-12
// ---------------------------------------------------------------------------

describe('shell-12 golden fixture', () => {
  it('produces correct contentStartPx and contentEndPx', () => {
    // outerInlinePx=1440, cols=12, gutter=24, frame=64, maxWidth=1280
    // contentInline = min(1280, 1440 - 64*2) = min(1280, 1312) = 1280
    // contentStart = 64, contentEnd = 64+1280 = 1344
    const el = makeMockElement({ classes: ['g-shell'], rectWidth: 1440 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '64px',
      '--g-max-width': '1280px',
      '--g-min': '256px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)
    expect(snap).not.toBeNull()
    expect(snap!.boundaries.contentStartPx).toBe(64)
    expect(snap!.boundaries.contentEndPx).toBe(1344)
    expect(snap!.boundaries.fullStartPx).toBe(0)
    expect(snap!.boundaries.fullEndPx).toBe(1440)
  })

  it('has correct relationship=exact for shell', () => {
    const el = makeMockElement({ classes: ['g-shell'], rectWidth: 1440 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '64px',
      '--g-max-width': '1280px',
      '--g-min': '256px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)
    expect(snap!.field.relationship).toBe('exact')
    expect(snap!.field.kind).toBe('shell')
    expect(snap!.field.cols).toBe(12)
  })

  it('has valid gutters [1..11] for 12-col grid', () => {
    const gutters = validDebugGutterAnchors(12)
    expect(gutters).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })

  it('produces correct colUnitRawPx and strideRawPx', () => {
    // contentInline=1280, gapTotal=24*11=264, unit=(1280-264)/12=84.666...
    // stride = 84.666 + 24 = 108.666
    const el = makeMockElement({ classes: ['g-shell'], rectWidth: 1440 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '64px',
      '--g-max-width': '1280px',
      '--g-min': '256px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.derived.colUnitRawPx).toBeCloseTo((1280 - 264) / 12, 3)
    expect(snap.derived.strideRawPx).toBeCloseTo((1280 - 264) / 12 + 24, 3)
    expect(snap.derived.gapTotalPx).toBe(264)
  })

  it('produces 12 lineStartPx and 11 gutterCenterPx', () => {
    const el = makeMockElement({ classes: ['g-shell'], rectWidth: 1440 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '64px',
      '--g-max-width': '1280px',
      '--g-min': '256px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.lines.lineStartPx).toHaveLength(12)
    expect(snap.lines.gutterCenterPx).toHaveLength(11)
    // First line starts at contentStart (64)
    expect(snap.lines.lineStartPx[0]).toBe(64)
  })
})

// ---------------------------------------------------------------------------
// Golden fixture: raw-12
// ---------------------------------------------------------------------------

describe('raw-12 golden fixture', () => {
  it('has fullStart=contentStart=0 and fullEnd=contentEnd=inlinePx', () => {
    const el = makeMockElement({ classes: ['g'], rectWidth: 1200 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '20px',
      '--g-frame': '0px',
      '--g-max-width': '2000px',
      '--g-min': '100px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.boundaries.fullStartPx).toBe(0)
    expect(snap.boundaries.contentStartPx).toBe(0)
    expect(snap.boundaries.contentEndPx).toBe(1200)
    expect(snap.boundaries.fullEndPx).toBe(1200)
    expect(snap.field.kind).toBe('raw')
    expect(snap.field.relationship).toBe('exact')
  })
})

// ---------------------------------------------------------------------------
// View field: approximate relationship
// ---------------------------------------------------------------------------

describe('g-view-* snapshot', () => {
  it('detects approximate relationship and correct viewCols', () => {
    const el = makeMockElement({ classes: ['g-view-4'], rectWidth: 600 })
    installGetComputedStyle({
      '--g-cols': '4',
      '--g-gutter': '16px',
      '--g-frame': '0px',
      '--g-max-width': '2000px',
      '--g-min': '100px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.field.relationship).toBe('approximate')
    expect(snap.field.kind).toBe('view')
    expect(snap.field.viewCols).toBe(4)
  })

  it('emits VIEW_IS_APPROXIMATE warning', () => {
    const el = makeMockElement({ classes: ['g-view-4'], rectWidth: 600 })
    installGetComputedStyle({
      '--g-cols': '4',
      '--g-gutter': '16px',
      '--g-frame': '0px',
      '--g-max-width': '2000px',
      '--g-min': '100px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    const codes = snap.warnings.map((w) => w.code)
    expect(codes).toContain('VIEW_IS_APPROXIMATE')
  })
})

// ---------------------------------------------------------------------------
// Subgrid: exact relationship
// ---------------------------------------------------------------------------

describe('g-sub snapshot', () => {
  it('detects exact relationship for g-sub', () => {
    const el = makeMockElement({ classes: ['g-sub'], rectWidth: 800 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '0px',
      '--g-max-width': '2000px',
      '--g-min': '100px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.field.relationship).toBe('exact')
    expect(snap.field.kind).toBe('subgrid')
  })
})

// ---------------------------------------------------------------------------
// Independent: explicit independence
// ---------------------------------------------------------------------------

describe('g-align-independent snapshot', () => {
  it('detects independent relationship', () => {
    const el = makeMockElement({ classes: ['g-align-independent'], rectWidth: 400 })
    installGetComputedStyle({
      '--g-cols': '6',
      '--g-gutter': '12px',
      '--g-frame': '0px',
      '--g-max-width': '2000px',
      '--g-min': '100px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.field.relationship).toBe('independent')
    expect(snap.field.kind).toBe('independent')
  })
})

// ---------------------------------------------------------------------------
// Warning: narrow viewport → NEGATIVE_CONTENT_INLINE
// ---------------------------------------------------------------------------

describe('warning: narrow viewport', () => {
  it('emits NEGATIVE_CONTENT_INLINE when content inline is zero/negative', () => {
    // outerInlinePx=10, frame=64 each side → contentInline = min(1280, 10-128) < 0
    const el = makeMockElement({ classes: ['g-shell'], rectWidth: 10 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '64px',
      '--g-max-width': '1280px',
      '--g-min': '256px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    const codes = snap.warnings.map((w) => w.code)
    expect(codes).toContain('NEGATIVE_CONTENT_INLINE')
  })
})

// ---------------------------------------------------------------------------
// Null for zero-width element
// ---------------------------------------------------------------------------

describe('returns null for zero-width element', () => {
  it('returns null when getBoundingClientRect width is 0', () => {
    const el = makeMockElement({ classes: ['g-shell'], rectWidth: 0 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '24px',
      '--g-frame': '64px',
      '--g-max-width': '1280px',
      '--g-min': '256px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    expect(buildSnapshot(el)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Type metrics
// ---------------------------------------------------------------------------

describe('type metrics in snapshot', () => {
  it('derives rhythmPx = baseline * leadingSteps', () => {
    // baseline=8px, leadingSteps=3 → rhythm=24
    const el = makeMockElement({ classes: ['g'], rectWidth: 1200 })
    installGetComputedStyle({
      '--g-cols': '12',
      '--g-gutter': '20px',
      '--g-frame': '0px',
      '--g-max-width': '2000px',
      '--g-min': '100px',
      '--g-type-base': '16px',
      '--g-baseline': '8px',
      '--g-leading-steps': '3',
      '--g-scale-ratio': '1.25',
      '--g-measure-body': '560px',
      '--g-measure-tight': '360px',
      '--g-measure-ui': '280px',
    })

    const snap = buildSnapshot(el)!
    expect(snap.derived.rhythmPx).toBe(24) // 8 * 3
    expect(snap.derived.proseLineHeight).toBeCloseTo(24 / 16, 3) // 1.5
  })
})

// ---------------------------------------------------------------------------
// Structural contracts
// ---------------------------------------------------------------------------

describe('snapshot.ts structural contracts', () => {
  it('does not use matchAll heuristic', async () => {
    const { readFileSync } = await import('node:fs')
    const { fileURLToPath } = await import('node:url')
    const path = await import('node:path')
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const src = readFileSync(path.resolve(__dirname, '../snapshot.ts'), 'utf8')
    expect(src).not.toContain('matchAll')
    expect(src).not.toContain('gridTemplateColumns')
  })

  it('calls computeRawField or computeShellField from core', async () => {
    const { readFileSync } = await import('node:fs')
    const { fileURLToPath } = await import('node:url')
    const path = await import('node:path')
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const src = readFileSync(path.resolve(__dirname, '../snapshot.ts'), 'utf8')
    expect(src).toContain('computeRawField')
    expect(src).toContain('computeShellField')
    expect(src).toContain('computeTypeMetrics')
  })

  it('exports GridDebugSnapshot, AlignmentTruth, FieldKind, DebugWarning types', async () => {
    const { readFileSync } = await import('node:fs')
    const { fileURLToPath } = await import('node:url')
    const path = await import('node:path')
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const src = readFileSync(path.resolve(__dirname, '../snapshot.ts'), 'utf8')
    expect(src).toContain('export type AlignmentTruth')
    expect(src).toContain('export type FieldKind')
    expect(src).toContain('export interface GridDebugSnapshot')
    expect(src).toContain('export interface DebugWarning')
    expect(src).toContain('export function buildSnapshot')
    expect(src).toContain('export function buildAllSnapshots')
  })
})
