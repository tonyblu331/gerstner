/**
 * Emit Reference Metadata CLI — Generates reference-fixtures/metadata.json from Stride manifest
 *
 * Usage: pnpm dlx tsx src/cli/lib/emit-reference.ts > src/reference-fixtures/metadata.json
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StrideManifest } from '../../stride/serialize'
import { emitReferenceMetadataJson } from './generate-reference'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = path.resolve(__dirname, '../../stride/contract.manifest.json')

const manifest: StrideManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

console.log(emitReferenceMetadataJson(manifest))
