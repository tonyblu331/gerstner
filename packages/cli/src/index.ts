/**
 * Gerstner CLI Library
 */

export interface CLIOptions {
  verbose?: boolean
  config?: string
}

export class GerstnerCLI {
  private options: CLIOptions

  constructor(options: CLIOptions = {}) {
    this.options = options
  }

  async run(command: string, ...args: string[]): Promise<void> {
    if (this.options.verbose) {
      console.log(`Running command: ${command} with args:`, args)
    }
    
    // CLI logic here
    console.log(`Gerstner CLI: ${command}`)
  }
}

export default GerstnerCLI
