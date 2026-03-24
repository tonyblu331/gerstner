#!/usr/bin/env node

import { GerstnerCLI } from './index.js'

const cli = new GerstnerCLI({
  verbose: process.argv.includes('--verbose')
})

const [,, command, ...args] = process.argv

if (!command) {
  console.log('Usage: gerstner <command> [options]')
  process.exit(1)
}

cli.run(command, ...args).catch(error => {
  console.error('CLI Error:', error)
  process.exit(1)
})
