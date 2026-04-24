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
  gutterPx: 24,
  framePx: 80,
  maxInlinePx: 1440,
  minAutoTrackPx: 256,
  typeBasePx: 16,
  baselinePx: 8,
  leadingSteps: 3,
  scaleRatio: 1.25,
  measureBodyPx: 70,
  measureTightPx: 45,
  measureUiPx: 35,
}

console.log(serializeManifest(DEFAULT_CONTRACT))
