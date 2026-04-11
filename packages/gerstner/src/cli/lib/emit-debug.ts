/**
 * Emit Debug Labels CLI — Generates debug/labels.json from Stride manifest
 *
 * Usage: pnpm dlx tsx src/cli/lib/emit-debug.ts > src/debug/labels.json
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StrideManifest } from '../../stride/serialize'
import { emitDebugLabelsJson } from './generate-debug'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = path.resolve(__dirname, '../../stride/contract.manifest.json')

const manifest: StrideManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

console.log(emitDebugLabelsJson(manifest))
