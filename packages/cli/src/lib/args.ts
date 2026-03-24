export interface ParsedArgs {
  command: string | null
  flags: Record<string, string | boolean>
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv
  const flags: Record<string, string | boolean> = {}

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index]

    if (!token.startsWith('--')) {
      continue
    }

    if (token.startsWith('--no-')) {
      flags[token.slice(5)] = false
      continue
    }

    const name = token.slice(2)
    const next = rest[index + 1]

    if (!next || next.startsWith('--')) {
      flags[name] = true
      continue
    }

    flags[name] = next
    index += 1
  }

  return {
    command: command ?? null,
    flags
  }
}
