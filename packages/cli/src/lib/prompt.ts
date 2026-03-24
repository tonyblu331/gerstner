import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export async function prompt(question: string, fallback?: string): Promise<string> {
  const rl = createInterface({ input, output })
  const suffix = fallback ? ` (${fallback})` : ''
  const answer = await rl.question(`${question}${suffix}: `)
  rl.close()
  const trimmed = answer.trim()
  return trimmed.length > 0 ? trimmed : fallback ?? ''
}

export async function promptBoolean(question: string, fallback: boolean): Promise<boolean> {
  const answer = await prompt(question, fallback ? 'Y/n' : 'y/N')
  const normalized = answer.toLowerCase()

  if (normalized === 'y' || normalized === 'yes') {
    return true
  }

  if (normalized === 'n' || normalized === 'no') {
    return false
  }

  return fallback
}
