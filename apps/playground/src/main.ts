import { debug, createDebugLogger } from '@gerstner/debug'
import { GerstnerCLI } from '@gerstner/cli'

// Test debug library
debug('Playground app started')
const logger = createDebugLogger('playground')
logger('Testing debug functionality')

// Test CLI library
const cli = new GerstnerCLI({ verbose: true })
cli.run('test', 'arg1', 'arg2')

console.log('Gerstner Playground is running!')
