import path from 'node:path'
import { prompt, promptBoolean } from '../lib/prompt'
import { detectAppType, detectCssEntry, detectJsEntry, inferAppRoot } from '../lib/project'
import { readTextIfExists, writeIfChanged } from '../lib/fs'
import { renderContractCss } from '../templates/contract'
import { renderPresetCss } from '../templates/presets'
import { renderDebugCss, renderDebugScript } from '../templates/debug'
import { renderReferenceCss, renderReferenceHtml, renderReferenceJs } from '../templates/reference'

export interface InitOptions {
  cwd: string
  cssEntry?: string
  appType?: 'react' | 'vanilla'
  injectImports?: boolean
  installDebug?: boolean
  generateReference?: boolean
  writePresets?: boolean
  yes?: boolean
}

export interface InitResult {
  appRoot: string
  cssEntry: string
  appType: 'react' | 'vanilla'
  written: {
    styles: string[]
    scripts: string[]
    dev: string[]
  }
  notes: string[]
}

export async function runInit(options: InitOptions): Promise<InitResult> {
  const cwd = options.cwd
  const cssEntry = await resolveCssEntry(options)
  const appType = options.appType ?? (await detectAppType(cwd))
  const appRoot = inferAppRoot(cssEntry)
  const jsEntry = await detectJsEntry(cwd, cssEntry)
  const stylesDir = normalizeAppPath(appRoot, 'src/styles')
  const scriptsDir = normalizeAppPath(appRoot, 'src/scripts')
  const devDir = normalizeAppPath(appRoot, 'dev')
  const notes: string[] = []

  const contractFile = normalizeAppPath(stylesDir, 'gerstner.contract.css')
  const presetsFile = normalizeAppPath(stylesDir, 'gerstner.project-presets.css')
  const debugCssFile = normalizeAppPath(stylesDir, 'gerstner.debug.css')
  const debugScriptFile = normalizeAppPath(scriptsDir, 'gerstner.debug.js')
  const referenceHtmlFile = normalizeAppPath(devDir, 'gerstner.reference.html')
  const referenceCssFile = normalizeAppPath(devDir, 'gerstner.reference.css')
  const referenceJsFile = normalizeAppPath(devDir, 'gerstner.reference.js')

  const written = {
    styles: [] as string[],
    scripts: [] as string[],
    dev: [] as string[]
  }

  await writeTracked(written.styles, path.join(cwd, contractFile), renderContractCss({
    baseline: '0.25rem',
    proseLeading: [1.5, 1.65, 1.8],
    scaleRatio: 1.2,
    measure: '72ch',
    frame: '1rem',
    cols: 12,
    gutter: '1rem',
    maxWidth: '72rem',
    minWidth: '20rem',
    lattice: 24,
    fitMin: '16rem',
    breakout: 'clamp(0rem, 4vw, 5rem)'
  }), contractFile)

  if (options.writePresets ?? true) {
    await writeTracked(written.styles, path.join(cwd, presetsFile), renderPresetCss(), presetsFile)
  }

  if (options.installDebug) {
    await writeTracked(written.styles, path.join(cwd, debugCssFile), renderDebugCss(), debugCssFile)
    await writeTracked(written.scripts, path.join(cwd, debugScriptFile), renderDebugScript(), debugScriptFile)
  }

  if (options.generateReference) {
    const contractFromDev = relativeImport(referenceCssFile, contractFile)
    const presetsFromDev = relativeImport(referenceCssFile, presetsFile)
    const debugCssFromDev = options.installDebug ? relativeImport(referenceCssFile, debugCssFile) : null
    const debugScriptFromDev = options.installDebug ? relativeImport(referenceJsFile, debugScriptFile) : null

    await writeTracked(written.dev, path.join(cwd, referenceHtmlFile), renderReferenceHtml({
      title: 'Gerstner reference',
      cssHref: './gerstner.reference.css',
      jsSrc: './gerstner.reference.js'
    }), referenceHtmlFile)

    await writeTracked(written.dev, path.join(cwd, referenceCssFile), renderReferenceCss({
      contractPath: contractFromDev,
      presetsPath: contractFromDev === presetsFromDev ? contractFromDev : presetsFromDev,
      debugPath: debugCssFromDev
    }), referenceCssFile)

    await writeTracked(written.dev, path.join(cwd, referenceJsFile), renderReferenceJs({
      debugScriptPath: debugScriptFromDev
    }), referenceJsFile)
  }

  if (options.injectImports ?? true) {
    const cssEntryPath = path.join(cwd, cssEntry)
    const cssEntryText = (await readTextIfExists(cssEntryPath)) ?? ''
    const cssImports = [
      '@import "@gerstner/core";',
      `@import "${relativeImport(cssEntry, contractFile)}";`
    ]

    if (options.writePresets ?? true) {
      cssImports.push(`@import "${relativeImport(cssEntry, presetsFile)}";`)
    }

    if (options.installDebug) {
      cssImports.push(`@import "${relativeImport(cssEntry, debugCssFile)}";`)
    }

    const nextCssEntry = ensureImports(cssEntryText, cssImports)
    await writeIfChanged(cssEntryPath, nextCssEntry)

    if (options.installDebug) {
      if (jsEntry) {
        const jsEntryPath = path.join(cwd, jsEntry)
        const jsEntryText = (await readTextIfExists(jsEntryPath)) ?? ''
        const debugImport = `import '${relativeImport(jsEntry, debugScriptFile)}'`
        await writeIfChanged(jsEntryPath, ensureImports(jsEntryText, [debugImport]))
      } else {
        notes.push('Debug files were generated, but no JS entry was detected for automatic bootstrap injection.')
      }
    }
  }

  if (!(options.installDebug ?? false)) {
    notes.push('Debug generation was skipped. Run init again with --install-debug when you want the observer layer.')
  }

  if (!(options.generateReference ?? false)) {
    notes.push('Reference page generation was skipped. Run init again with --generate-reference to scaffold the living proof page.')
  }

  if (appType === 'react') {
    notes.push('Plain HTML reference files were generated on purpose. React-specific dev UIs belong on top, not inside the contract layer.')
  }

  return {
    appRoot,
    cssEntry,
    appType,
    written,
    notes
  }
}

async function resolveCssEntry(options: InitOptions): Promise<string> {
  if (options.cssEntry) {
    return normalize(options.cssEntry)
  }

  const detected = await detectCssEntry(options.cwd)

  if (detected && options.yes) {
    return detected
  }

  if (detected && !options.yes) {
    const keepDetected = await promptBoolean('Use detected CSS entry', true)
    if (keepDetected) {
      return detected
    }
  }

  if (!options.yes) {
    const answer = await prompt('CSS entry path', detected ?? 'src/index.css')
    return normalize(answer)
  }

  if (detected) {
    return detected
  }

  throw new Error('No CSS entry could be detected. Pass --css-entry explicitly.')
}

async function writeTracked(bucket: string[], absolutePath: string, content: string, displayPath: string) {
  const status = await writeIfChanged(absolutePath, content)
  bucket.push(`${displayPath} (${status})`)
}

function relativeImport(fromFile: string, toFile: string): string {
  const fromDir = path.posix.dirname(normalize(fromFile))
  const relative = path.posix.relative(fromDir, normalize(toFile))
  return relative.startsWith('.') ? relative : `./${relative}`
}

function ensureImports(source: string, imports: string[]): string {
  const lines = source.split(/\r?\n/)
  const missing = imports.filter((entry) => !source.includes(entry))

  if (missing.length === 0) {
    return source
  }

  const insertionPoint = lines.findIndex((line) => !line.trim().startsWith('@import') && line.trim().length > 0)

  if (insertionPoint === -1) {
    return `${missing.join('\n')}\n${source}`.trimEnd() + '\n'
  }

  lines.splice(insertionPoint, 0, ...missing)
  return `${lines.join('\n').trimEnd()}\n`
}

function normalize(value: string): string {
  return value.replace(/\\/g, '/')
}

function normalizeAppPath(...parts: string[]): string {
  return normalize(path.posix.join(...parts.filter(Boolean)))
}
