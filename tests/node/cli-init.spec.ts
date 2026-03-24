import { describe, expect, it } from 'vitest'
import { runInit } from '../../packages/cli/src/commands/init'
import { makeFixtureCopy, readFixtureFile } from './helpers/fixture'

describe('gerstner cli init', () => {
  it('writes contract files and injects imports idempotently', async () => {
    const cwd = await makeFixtureCopy('react-vite')

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

    const cssEntry = await readFixtureFile(cwd, 'apps/playground/src/index.css')
    const mainEntry = await readFixtureFile(cwd, 'apps/playground/src/main.ts')
    const contract = await readFixtureFile(cwd, 'apps/playground/src/styles/gerstner.contract.css')
    const reference = await readFixtureFile(cwd, 'apps/playground/dev/gerstner.reference.css')

    expect(cssEntry.match(/@import "@gerstner\/core";/g)?.length).toBe(1)
    expect(cssEntry).toContain('@import "./styles/gerstner.contract.css";')
    expect(mainEntry.match(/gerstner\.debug\.js/g)?.length).toBe(1)
    expect(contract).toContain('--g-baseline: 0.25rem;')
    expect(reference).toContain('@import "../src/styles/gerstner.contract.css";')
  })
})
