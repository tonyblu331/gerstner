export interface CLIOptions {
  verbose?: boolean
  config?: string
}

export class GerstnerCLI {
  private options: CLIOptions

  constructor(options: CLIOptions = {}) {
    this.options = options
  }

  run(command: string, ...args: string[]): void {
    if (this.options.verbose) {
      console.log(`Running command: ${command} with args: ${args.join(' ')}`)
    }

    switch (command) {
      case 'init':
        this.init(args)
        break
      case 'build':
        this.build(args)
        break
      case 'dev':
        this.dev(args)
        break
      default:
        console.error(`Unknown command: ${command}`)
        process.exit(1)
    }
  }

  private init(args: string[]): void {
    console.log('Initializing Gerstner project...')
    // TODO: Implement project initialization
  }

  private build(args: string[]): void {
    console.log('Building Gerstner project...')
    // TODO: Implement build process
  }

  private dev(args: string[]): void {
    console.log('Starting development server...')
    // TODO: Implement dev server
  }
}
