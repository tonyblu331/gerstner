import { describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { runInit } from '../../packages/cli/src/commands/init'

describe('gerstner cli init', () => {
  it('writes contract files and injects imports idempotently', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-cli-'))

    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({ dependencies: { react: '^19.0.0' } }, null, 2))
    await writeFile(path.join(cwd, 'apps/playground/src/index.css'), '.app { display: block; }\n')
    await writeFile(path.join(cwd, 'apps/playground/src/main.ts'), "console.log('boot')\n")

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: true,
      injectImports: true,
      writePresets: true,
      yes: true
    })

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: true,
      injectImports: true,
      writePresets: true,
      yes: true
    })

    const cssEntry = await readFile(path.join(cwd, 'apps/playground/src/index.css'), 'utf8')
    const mainEntry = await readFile(path.join(cwd, 'apps/playground/src/main.ts'), 'utf8')
    const contract = await readFile(path.join(cwd, 'apps/playground/src/styles/gerstner.contract.css'), 'utf8')
    const reference = await readFile(path.join(cwd, 'apps/playground/dev/gerstner.reference.css'), 'utf8')

    expect(cssEntry.match(/@import "@gerstner\/core";/g)?.length).toBe(1)
    expect(cssEntry).toContain('@import "./styles/gerstner.contract.css";')
    expect(mainEntry.match(/gerstner\.debug\.js/g)?.length).toBe(1)
    expect(contract).toContain('--g-baseline: 0.25rem;')
    expect(reference).toContain('@import "../src/styles/gerstner.contract.css";')
  })
})
