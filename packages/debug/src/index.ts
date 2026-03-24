export interface DebugOptions {
  prefix?: string
  enabled?: boolean
}

export function debug(message: string, options: DebugOptions = {}): void {
  if (options.enabled !== false) {
    const prefix = options.prefix ? `[${options.prefix}]` : '[debug]'
    console.log(`${prefix} ${message}`)
  }
}

export function createDebugLogger(prefix: string): (message: string) => void {
  return (message: string) => {
    debug(message, { prefix })
  }
}

export class DebugLogger {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  log(message: string): void {
    debug(message, { prefix: this.prefix })
  }

  error(message: string): void {
    console.error(`[${this.prefix}] ERROR: ${message}`)
  }

  warn(message: string): void {
    console.warn(`[${this.prefix}] WARN: ${message}`)
  }
}
