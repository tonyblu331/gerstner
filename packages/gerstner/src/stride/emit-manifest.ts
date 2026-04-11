/**
 * Stride Manifest Emitter — CLI utility to emit contract.manifest.json
 *
 * Usage: npx tsx src/stride/emit-manifest.ts > src/stride/contract.manifest.json
 *
 * SPDX-License-Identifier: MIT
 */

import { serializeManifest } from './serialize'

const DEFAULT_CONTRACT = {
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

console.log(serializeManifest(DEFAULT_CONTRACT))
