/**
 * Emit TW4 Helpers CLI — Generates tw4/helpers.css from Stride manifest
 *
 * Usage: pnpm dlx tsx src/cli/lib/emit-tw4.ts > src/tw4/helpers.css
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StrideManifest } from '../../stride/serialize'
import { emitTw4Helpers } from './generate-tw4'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = path.resolve(__dirname, '../../stride/contract.manifest.json')

const manifest: StrideManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

console.log(emitTw4Helpers(manifest))
