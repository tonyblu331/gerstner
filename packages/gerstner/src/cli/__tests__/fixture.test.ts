/**
 * CLI Fixture Tests — Validates emitted artifacts match generator output
 *
 * These tests verify that the files on disk (emitted via pnpm emit:*)
 * match what the generators would produce from the current manifest.
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vite-plus/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StrideContractInput } from '../../stride/core'
import { emitManifest } from '../../stride/serialize'
import { emitDebugLabelsJson } from '../lib/generate-debug'
import { emitReferenceMetadataJson } from '../lib/generate-reference'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcRoot = path.resolve(__dirname, '../../')

const DEFAULT_CONTRACT: StrideContractInput = {
  cols: 12,
  gutter: 24,
  frame: 80,
  maxWidth: 1440,
  minAutoTrack: 256,
  typeBase: 16,
  baseline: 8,
  leadingSteps: 3,
  scaleRatio: 1.25,
  measureBody: 70,
  measureTight: 45,
  measureUi: 35,
}

const manifest = emitManifest(DEFAULT_CONTRACT)

function readSrcFile(relativePath: string): string {
  return readFileSync(path.join(srcRoot, relativePath), 'utf8')
}

// ---------------------------------------------------------------------------
// Manifest Fixture
// ---------------------------------------------------------------------------

describe('contract.manifest.json fixture', () => {
  it('matches emitManifest output for default contract (ignoring generatedAt)', () => {
    const onDisk = JSON.parse(readSrcFile('stride/contract.manifest.json'))
    const fromGenerator = JSON.parse(JSON.stringify(manifest, null, 2))
    // Timestamps differ between emission runs — compare everything else
    const { generatedAt: _diskTs, ...diskData } = onDisk
    const { generatedAt: _genTs, ...genData } = fromGenerator
    expect(diskData).toEqual(genData)
  })
})

// ---------------------------------------------------------------------------
// CSS Helpers Fixture
// ---------------------------------------------------------------------------

describe('css/helpers.css fixture', () => {
  it('contains all expected helper classes', () => {
    const onDisk = readSrcFile('css/helpers.css')
    // Verify key structural elements rather than byte-for-byte match
    // (Windows redirect can mangle UTF-8 em-dashes)
    expect(onDisk).toContain('@layer gerstner.helpers')
    expect(onDisk).toContain('.col-1 {')
    expect(onDisk).toContain('.col-12 {')
    expect(onDisk).toContain('.col-start-1 {')
    expect(onDisk).toContain('.col-end-13 {')
    expect(onDisk).toContain('grid-column-start: col 1')
    expect(onDisk).toContain('grid-column-end: col 13')
    expect(onDisk).toContain('.col-from-gutter-1 {')
    expect(onDisk).toContain('grid-column-start: col 2')
    expect(onDisk).toContain('.col-to-gutter-11 {')
    expect(onDisk).toContain('grid-column-end: col 12')
    expect(onDisk).toContain('.g-content {')
    expect(onDisk).toContain('.g-view-2 {')
    expect(onDisk).toContain('.g-align-independent {')
    expect(onDisk).toContain('.g-tight {')
    expect(onDisk).toContain('.g-wrap-balance {')
    expect(onDisk).toContain('.g-stack-1 {')
  })
})

// ---------------------------------------------------------------------------
// TW4 Helpers Fixture
// ---------------------------------------------------------------------------

describe('tw4/helpers.css fixture', () => {
  it('contains all expected @utility helpers', () => {
    const onDisk = readSrcFile('tw4/helpers.css')
    expect(onDisk).toContain('@utility col-1 {')
    expect(onDisk).toContain('@utility col-12 {')
    expect(onDisk).toContain('@utility col-start-1 {')
    expect(onDisk).toContain('@utility col-end-13 {')
    expect(onDisk).toContain('grid-column-start: col 1')
    expect(onDisk).toContain('grid-column-end: col 13')
    expect(onDisk).toContain('@utility col-from-gutter-1 {')
    expect(onDisk).toContain('@utility col-to-gutter-11 {')
    expect(onDisk).toContain('@utility g-content {')
    expect(onDisk).toContain('@utility g-view-2 {')
    expect(onDisk).toContain('@utility g-align-independent {')
    expect(onDisk).toContain('@utility g-tight {')
    expect(onDisk).toContain('@utility g-wrap-balance {')
  })
})

// ---------------------------------------------------------------------------
// Debug Labels Fixture
// ---------------------------------------------------------------------------

describe('debug/labels.json fixture', () => {
  it('matches emitDebugLabelsJson output', () => {
    const onDisk = readSrcFile('debug/labels.json')
    const fromGenerator = emitDebugLabelsJson(manifest)
    expect(JSON.parse(onDisk)).toEqual(JSON.parse(fromGenerator))
  })
})

// ---------------------------------------------------------------------------
// Reference Metadata Fixture
// ---------------------------------------------------------------------------

describe('reference-fixtures/metadata.json fixture', () => {
  it('matches emitReferenceMetadataJson output', () => {
    const onDisk = readSrcFile('reference-fixtures/metadata.json')
    const fromGenerator = emitReferenceMetadataJson(manifest)
    expect(JSON.parse(onDisk)).toEqual(JSON.parse(fromGenerator))
  })
})
