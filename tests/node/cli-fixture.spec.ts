import { describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { runInit } from '../../packages/cli/commands/init'

describe('gerstner cli fixture tests', () => {
  it('generates contract files with exact content', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-fixture-'))

    // Setup basic project structure
    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({
      name: 'test-project',
      dependencies: { tailwindcss: '^4.0.0' }
    }, null, 2))
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

    // Read generated files
    const contract = await readFile(path.join(cwd, 'apps/playground/src/styles/gerstner.contract.css'), 'utf8')
    const presets = await readFile(path.join(cwd, 'apps/playground/src/styles/gerstner.project-presets.css'), 'utf8')
    const debug = await readFile(path.join(cwd, 'apps/playground/src/styles/gerstner.debug.css'), 'utf8')
    const debugJs = await readFile(path.join(cwd, 'apps/playground/src/scripts/gerstner.debug.js'), 'utf8')
    const reference = await readFile(path.join(cwd, 'apps/playground/dev/gerstner.reference.html'), 'utf8')

    // Snapshot tests for exact content matching
    expect(contract).toMatchInlineSnapshot(`
      ":root {
        --g-cols: 12;
        --g-gap: clamp(0.875rem, 2.2vw, 1.5rem);
        --g-frame: clamp(1rem, 5dvw, 5rem);
        --g-max-width: 90rem;
        --g-min: 16rem;
        --g-type-base: 1rem;
        --g-baseline: 0.25rem;
        --g-leading-steps: 3;
        --g-scale-ratio: 1.25;
        --g-measure: 70ch;
      }"
    `)

    expect(presets).toMatchInlineSnapshot(`
      ":root {
        --g-project-accent: #3b82f6;
        --g-project-neutral: #6b7280;
        --g-project-success: #10b981;
        --g-project-warning: #f59e0b;
        --g-project-error: #ef4444;
      }"
    `)

    expect(debug).toContain('@import "@gerstner/debug/debug.css";')
    expect(debugJs).toContain('initGerstnerDebug({')
    expect(reference).toContain('<!DOCTYPE html>')
    expect(reference).toContain('@import "../src/styles/gerstner.contract.css";')
  })

  it('injects imports correctly into existing files', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-fixture-'))

    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({
      name: 'test-project',
      dependencies: { tailwindcss: '^4.0.0' }
    }, null, 2))
    
    const originalCss = '@import "tailwindcss";\n.app { display: block; }\n'
    const originalJs = "console.log('boot')\n"
    
    await writeFile(path.join(cwd, 'apps/playground/src/index.css'), originalCss)
    await writeFile(path.join(cwd, 'apps/playground/src/main.ts'), originalJs)

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: false,
      injectImports: true,
      writePresets: false,
      yes: true
    })

    const updatedCss = await readFile(path.join(cwd, 'apps/playground/src/index.css'), 'utf8')
    const updatedJs = await readFile(path.join(cwd, 'apps/playground/src/main.ts'), 'utf8')

    expect(updatedCss).toContain('@import "tailwindcss";')
    expect(updatedCss).toContain('@import "gerstner";')
    expect(updatedCss).toContain('@import "./styles/gerstner.contract.css";')
    expect(updatedJs).toContain('import "./scripts/gerstner.debug.js"')
  })

  it('handles idempotent runs without duplication', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-fixture-'))

    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({
      name: 'test-project',
      dependencies: { tailwindcss: '^4.0.0' }
    }, null, 2))
    await writeFile(path.join(cwd, 'apps/playground/src/index.css'), '.app { display: block; }\n')
    await writeFile(path.join(cwd, 'apps/playground/src/main.ts'), "console.log('boot')\n")

    // Run init twice
    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: false,
      injectImports: true,
      writePresets: true,
      yes: true
    })

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: false,
      injectImports: true,
      writePresets: true,
      yes: true
    })

    const css = await readFile(path.join(cwd, 'apps/playground/src/index.css'), 'utf8')
    const js = await readFile(path.join(cwd, 'apps/playground/src/main.ts'), 'utf8')

    // Should not have duplicate imports
    expect(css.match(/@import "gerstner";/g)?.length).toBe(1)
    expect(css.match(/@import "\.\/styles\/gerstner\.contract\.css";/g)?.length).toBe(1)
    expect(js.match(/import "\.\/scripts\/gerstner\.debug\.js"/g)?.length).toBe(1)
  })
})
