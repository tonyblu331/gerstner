import { describe, expect, it } from 'vite-plus/test'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { runInit } from '../../packages/gerstner/src/cli/commands/init'

describe('gerstner cli fixture tests', () => {
  it('generates contract files with exact content', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-fixture-'))

    // Setup basic project structure
    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify(
        {
          name: 'test-project',
          dependencies: { tailwindcss: '^4.0.0' },
        },
        null,
        2,
      ),
    )
    await writeFile(path.join(cwd, 'apps/playground/src/index.css'), '.app { display: block; }\n')
    await writeFile(path.join(cwd, 'apps/playground/src/main.ts'), "console.log('boot')\n")

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: true,
      injectImports: true,
      yes: true,
    })

    // Read generated files
    const contract = await readFile(
      path.join(cwd, 'apps/playground/src/styles/gerstner.contract.css'),
      'utf8',
    )
    const debug = await readFile(
      path.join(cwd, 'apps/playground/src/styles/gerstner.debug.css'),
      'utf8',
    )
    const debugJs = await readFile(
      path.join(cwd, 'apps/playground/src/scripts/gerstner.debug.js'),
      'utf8',
    )
    const reference = await readFile(
      path.join(cwd, 'apps/playground/dev/gerstner.reference.html'),
      'utf8',
    )

    // Content matching
    expect(contract).toContain('Gerstner project contract')
    expect(contract).toContain('--g-cols: 12;')
    expect(contract).toContain('--g-gutter: clamp(0.875rem, 2.2vw, 1.5rem);')
    expect(contract).toContain('--g-baseline: 0.5rem;')
    expect(contract).toContain('--g-measure-body: 70ch;')

    expect(debug).toContain('@import "@gerstner/debug/debug.css";')
    expect(debugJs).toContain('initGerstnerDebug({')
    expect(reference).toMatch(/<!doctype html>/i)
  })

  it('injects imports correctly into existing files', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-fixture-'))

    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify(
        {
          name: 'test-project',
          dependencies: { tailwindcss: '^4.0.0' },
        },
        null,
        2,
      ),
    )

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
      yes: true,
    })

    const updatedCss = await readFile(path.join(cwd, 'apps/playground/src/index.css'), 'utf8')
    const updatedJs = await readFile(path.join(cwd, 'apps/playground/src/main.ts'), 'utf8')

    expect(updatedCss).toContain('@import "tailwindcss";')
    expect(updatedCss).toContain('@import "gerstner/tw4";')
    expect(updatedCss).toContain('@import "./styles/gerstner.contract.css";')
    expect(updatedJs).toContain("import './scripts/gerstner.debug.js'")
  })

  it('handles idempotent runs without duplication', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'gerstner-fixture-'))

    await mkdir(path.join(cwd, 'apps/playground/src'), { recursive: true })
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify(
        {
          name: 'test-project',
          dependencies: { tailwindcss: '^4.0.0' },
        },
        null,
        2,
      ),
    )
    await writeFile(
      path.join(cwd, 'apps/playground/src/index.css'),
      '@import "tailwindcss";\n.app { display: block; }\n',
    )
    await writeFile(path.join(cwd, 'apps/playground/src/main.ts'), "console.log('boot')\n")

    // Run init twice
    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: false,
      injectImports: true,
      yes: true,
    })

    await runInit({
      cwd,
      cssEntry: 'apps/playground/src/index.css',
      installDebug: true,
      generateReference: false,
      injectImports: true,
      yes: true,
    })

    const css = await readFile(path.join(cwd, 'apps/playground/src/index.css'), 'utf8')
    const js = await readFile(path.join(cwd, 'apps/playground/src/main.ts'), 'utf8')

    // Should not have duplicate imports
    expect(css.split('@import "gerstner/tw4";').length - 1).toBe(1)
    expect(css.split('@import "./styles/gerstner.contract.css";').length - 1).toBe(1)
    expect(js.split("import './scripts/gerstner.debug.js'").length - 1).toBe(1)
  })
})
