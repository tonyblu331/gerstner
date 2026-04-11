/**
 * Emit Helpers CLI — Generates css/helpers.css from Stride manifest
 *
 * Usage: pnpm dlx tsx src/cli/lib/emit-helpers.ts > src/css/helpers.css
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StrideManifest } from '../../stride/serialize'
import { emitCssHelpers } from './generate-helpers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = path.resolve(__dirname, '../../stride/contract.manifest.json')

const manifest: StrideManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

console.log(emitCssHelpers(manifest))
