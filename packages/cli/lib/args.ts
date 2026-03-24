export interface ParsedArgs {
  command?: string
  flags: Record<string, string | boolean>
}

export function parseArgs(argv: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {}
  let command: string | undefined

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (!command && !token.startsWith('-')) {
      command = token
      continue
    }

    if (!token.startsWith('--')) {
      continue
    }

    if (token.startsWith('--no-')) {
      flags[token.slice(5)] = false
      continue
    }

    const eqIndex = token.indexOf('=')
    if (eqIndex !== -1) {
      flags[token.slice(2, eqIndex)] = token.slice(eqIndex + 1)
      continue
    }

    const next = argv[index + 1]
    if (next && !next.startsWith('-')) {
      flags[token.slice(2)] = next
      index += 1
      continue
    }

    flags[token.slice(2)] = true
  }

  return { command, flags }
}
