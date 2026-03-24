import { describe, expect, it } from 'vitest'
import { runInit } from '../../packages/cli/src/commands/init'
import { makeFixtureCopy, readFixtureFile, writeFixtureFile } from './helpers/fixture'

describe('gerstner cli init fixtures', () => {
  it('detects a vanilla Vite app and keeps debug out when not requested', async () => {
    const cwd = await makeFixtureCopy('vanilla-vite')

    const result = await runInit({
      cwd,
      injectImports: true,
      writePresets: true,
      yes: true
    })

    const cssEntry = await readFixtureFile(cwd, 'src/index.css')

    expect(result.cssEntry).toBe('src/index.css')
    expect(result.appType).toBe('vanilla')
    expect(cssEntry).toContain('@import "@gerstner/core";')
    expect(cssEntry).toContain('@import "./styles/gerstner.contract.css";')
    expect(cssEntry).not.toContain('gerstner.debug.css')
    expect(result.notes.join(' ')).toContain('Debug generation was skipped')
  })

  it('injects imports below existing imports and preserves source body', async () => {
    const cwd = await makeFixtureCopy('react-vite')
    await writeFixtureFile(
      cwd,
      'apps/playground/src/index.css',
      '@import "./base.css";\n\n.app {\n  display: grid;\n}\n'
    )

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      injectImports: true,
      writePresets: false,
      yes: true
    })

    const cssEntry = await readFixtureFile(cwd, 'apps/playground/src/index.css')
    const lines = cssEntry.trim().split(/\r?\n/)

    expect(lines[0]).toBe('@import "./base.css";')
    expect(lines[1]).toBe('@import "@gerstner/core";')
    expect(lines[2]).toBe('@import "./styles/gerstner.contract.css";')
    expect(cssEntry).toContain('.app {')
  })

  it('writes the debug bridge and living reference when explicitly requested', async () => {
    const cwd = await makeFixtureCopy('vanilla-vite')

    await runInit({
      cwd,
      installDebug: true,
      generateReference: true,
      injectImports: true,
      yes: true
    })

    const mainEntry = await readFixtureFile(cwd, 'src/main.ts')
    const debugCss = await readFixtureFile(cwd, 'src/styles/gerstner.debug.css')
    const referenceHtml = await readFixtureFile(cwd, 'dev/gerstner.reference.html')

    expect(mainEntry).toContain("import './scripts/gerstner.debug.js'")
    expect(debugCss).toContain('@import "@gerstner/debug/debug.css";')
    expect(referenceHtml).toContain('<title>Gerstner reference</title>')
  })
})
