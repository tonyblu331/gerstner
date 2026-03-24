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
    injectImports: asBooleanFlag(flags['inject-imports'], true),
    installDebug: asBooleanFlag(flags['install-debug'], false),
    generateReference: asBooleanFlag(flags['generate-reference'], false),
    writePresets: asBooleanFlag(flags['with-presets'], true),
    yes: Boolean(flags.yes)
  })

  console.log('\n[gerstner] init complete')
  console.log(`- app root: ${result.appRoot}`)
  console.log(`- css entry: ${result.cssEntry}`)
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

function asBooleanFlag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function printHelp() {
  console.log(`Gerstner CLI\n\nUsage:\n  gerstner init [options]\n\nOptions:\n  --css-entry <path>         CSS entry to inject into\n  --app-type <react|vanilla> Project flavor hint\n  --inject-imports           Inject CSS imports into the entry file\n  --no-inject-imports        Skip CSS injection\n  --install-debug            Generate debug bridge files\n  --generate-reference       Generate the dev-only reference page\n  --with-presets             Generate project preset helpers\n  --no-with-presets          Skip preset generation\n  --yes                      Accept sensible defaults\n  --help                     Show this help\n`)
}

main().catch((error) => {
  console.error('[gerstner] init failed')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
