import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export async function prompt(label: string, fallback?: string): Promise<string> {
  const rl = createInterface({ input, output })
  try {
    const suffix = fallback ? ` (${fallback})` : ''
    const answer = (await rl.question(`${label}${suffix}: `)).trim()
    return answer.length > 0 ? answer : (fallback ?? '')
  } finally {
    rl.close()
  }
}

export async function promptBoolean(label: string, fallback = true): Promise<boolean> {
  const rl = createInterface({ input, output })
  try {
    const hint = fallback ? 'Y/n' : 'y/N'
    const answer = (await rl.question(`${label} [${hint}]: `)).trim().toLowerCase()

    if (answer.length === 0) {
      return fallback
    }

    return answer === 'y' || answer === 'yes'
  } finally {
    rl.close()
  }
}

export async function promptChoice<T extends string>(
  label: string,
  choices: readonly T[],
  fallback: T,
): Promise<T> {
  const rl = createInterface({ input, output })
  try {
    const options = choices.join('/')
    const answer = (await rl.question(`${label} [${options}] (${fallback}): `)).trim() as T

    if (answer.length === 0) {
      return fallback
    }

    return choices.includes(answer) ? answer : fallback
  } finally {
    rl.close()
  }
}
