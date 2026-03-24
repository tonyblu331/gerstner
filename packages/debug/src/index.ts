/**
 * Gerstner Debug Library
 */

export function debug(message: string, ...args: any[]): void {
  console.log(`[DEBUG] ${message}`, ...args)
}

export function createDebugLogger(namespace: string) {
  return (message: string, ...args: any[]): void => {
    console.log(`[DEBUG:${namespace}] ${message}`, ...args)
  }
}

export default {
  debug,
  createDebugLogger
}
