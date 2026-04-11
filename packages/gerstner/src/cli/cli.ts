#!/usr/bin/env node
import { parseArgs } from './lib/args'
import { runInit } from './commands/init'

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2))

  if (!command || command === 'help' || flags.help) {
    printHelp()
    return
  }

  if (command !== 'init') {
    console.error(`[gerstner] Unknown command: ${command}`)
    printHelp()
    process.exitCode = 1
    return
  }

  const result = await runInit({
    cwd: process.cwd(),
    cssEntry: asString(flags['css-entry']),
    appType: asAppType(flags['app-type']),
    target: asTarget(flags['target']),
    injectImports: asBooleanFlag(flags['inject-imports'], true),
    installDebug: asBooleanFlag(flags['install-debug'], false),
    generateReference: asBooleanFlag(flags['generate-reference'], false),
    yes: Boolean(flags.yes),
  })

  console.log('\n[gerstner] init complete')
  console.log(`- app root: ${result.appRoot}`)
  console.log(`- css entry: ${result.cssEntry}`)
  console.log(`- target: ${result.target}`)
  console.log(`- styles written: ${result.written.styles.join(', ')}`)

  if (result.written.scripts.length > 0) {
    console.log(`- scripts written: ${result.written.scripts.join(', ')}`)
  }

  if (result.written.dev.length > 0) {
    console.log(`- dev files written: ${result.written.dev.join(', ')}`)
  }

  if (result.notes.length > 0) {
    console.log('- notes:')
    for (const note of result.notes) {
      console.log(`  • ${note}`)
    }
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function asAppType(value: unknown): 'react' | 'vanilla' | undefined {
  return value === 'react' || value === 'vanilla' ? value : undefined
}

function asTarget(value: unknown): 'css' | 'tw4' | undefined {
  return value === 'css' || value === 'tw4' ? value : undefined
}

function asBooleanFlag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function printHelp() {
  console.log(`Gerstner CLI

Usage:
  gerstner init [options]

Options:
  --css-entry <path>         CSS entry to inject into
  --app-type <react|vanilla> Project flavor hint
  --target <css|tw4>         Target surface (css or tw4)
  --inject-imports           Inject CSS imports into the entry file
  --no-inject-imports        Skip CSS injection
  --install-debug            Generate debug bridge files
  --generate-reference       Generate the dev-only reference page
  --yes                      Accept sensible defaults
  --help                     Show this help
`)
}

main().catch((error) => {
  console.error('[gerstner] init failed')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
