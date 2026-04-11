/**
 * Debug Observer Tests
 *
 * Phase E exit gate: "Debug tests pass"
 * Validates observer.ts reads stride tokens correctly.
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
// observer.ts — no layout math
// ---------------------------------------------------------------------------

describe('debug/observer.ts parity', () => {
  const observer = readSrcFile('debug/observer.ts')

  it('does not parse gridTemplateColumns', () => {
    expect(observer).not.toContain('gridTemplateColumns')
  })

  it('does not use matchAll heuristic', () => {
    expect(observer).not.toContain('matchAll')
  })

  it('reads stride tokens via getComputedStyle', () => {
    expect(observer).toContain('getComputedStyle')
    expect(observer).toContain('--g-stride')
    expect(observer).toContain('--g-gutter')
    expect(observer).toContain('--g-baseline')
    expect(observer).toContain('--g-rhythm')
  })

  it('exports readMetrics, detectDrift, applyDriftDetection, syncDebugMetrics', () => {
    expect(observer).toContain('export function readMetrics')
    expect(observer).toContain('export function detectDrift')
    expect(observer).toContain('export function applyDriftDetection')
    expect(observer).toContain('export function syncDebugMetrics')
  })
})

// ---------------------------------------------------------------------------
// debug/index.tsx — uses observer, no heuristic
// ---------------------------------------------------------------------------

describe('debug/index.tsx parity', () => {
  const index = readSrcFile('debug/index.tsx')

  it('imports from observer.ts', () => {
    expect(index).toContain("from './observer.js'")
  })

  it('does not parse gridTemplateColumns', () => {
    expect(index).not.toContain('gridTemplateColumns')
  })

  it('does not use matchAll heuristic', () => {
    expect(index).not.toContain('matchAll')
  })

  it('does not export --g-measure in contract export', () => {
    expect(index).not.toContain('--g-measure')
  })

  it('calls applyDriftDetection on resize', () => {
    expect(index).toContain('applyDriftDetection()')
  })

  it('calls syncDebugMetrics instead of heuristic', () => {
    expect(index).toContain('syncDebugMetrics(')
  })
})

// ---------------------------------------------------------------------------
// debug/debug.css — consumes stride tokens
// ---------------------------------------------------------------------------

describe('debug/debug.css parity', () => {
  const css = readSrcFile('debug/debug.css')

  it('uses --g-baseline from stride', () => {
    expect(css).toContain('var(--g-baseline)')
  })

  it('uses --g-rhythm from stride', () => {
    expect(css).toContain('var(--g-rhythm)')
  })

  it('uses observer metrics for column overlay', () => {
    expect(css).toContain('var(--g-debug-col-px)')
    expect(css).toContain('var(--g-debug-stride-px)')
  })

  it('does not contain --g-measure', () => {
    expect(css).not.toContain('--g-measure')
  })
})

// ---------------------------------------------------------------------------
// debug/labels.json — generated artifact
// ---------------------------------------------------------------------------

describe('debug/labels.json parity', () => {
  const labels = JSON.parse(readSrcFile('debug/labels.json'))

  it('has columns array', () => {
    expect(Array.isArray(labels.columns)).toBe(true)
    expect(labels.columns.length).toBe(12)
  })

  it('each column has index, name, lineName', () => {
    for (const col of labels.columns) {
      expect(col).toHaveProperty('index')
      expect(col).toHaveProperty('name')
      expect(col).toHaveProperty('lineName')
    }
  })

  it('has gutters array', () => {
    expect(Array.isArray(labels.gutters)).toBe(true)
    expect(labels.gutters.length).toBe(11)
  })

  it('has boundaries', () => {
    expect(labels).toHaveProperty('boundaries')
  })

  it('has views', () => {
    expect(labels).toHaveProperty('views')
  })

  it('has scales', () => {
    expect(labels).toHaveProperty('scales')
  })
})

// ---------------------------------------------------------------------------
// CLI contract template — no --g-measure
// ---------------------------------------------------------------------------

describe('cli/templates/contract.ts parity', () => {
  const template = readSrcFile('cli/templates/contract.ts')

  it('does not contain --g-measure', () => {
    expect(template).not.toContain('--g-measure')
    expect(template).not.toContain('measure')
  })
})

// ---------------------------------------------------------------------------
// CLI debug template — uses observer layers
// ---------------------------------------------------------------------------

describe('cli/templates/debug.ts parity', () => {
  const template = readSrcFile('cli/templates/debug.ts')

  it('uses layers config not overlay/badge/ruler', () => {
    expect(template).toContain('layers:')
    expect(template).not.toContain('overlay:')
    expect(template).not.toContain('badge:')
    expect(template).not.toContain('ruler:')
  })
})
