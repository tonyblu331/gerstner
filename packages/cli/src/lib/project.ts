import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CSS_ENTRY_CANDIDATES = [
  'apps/playground/src/index.css',
  'src/index.css',
  'src/styles/index.css',
  'app/globals.css'
]

const JS_ENTRY_CANDIDATES = [
  'apps/playground/src/main.ts',
  'apps/playground/src/main.tsx',
  'src/main.ts',
  'src/main.tsx',
  'src/main.js',
  'src/main.jsx'
]

export async function detectCssEntry(cwd: string): Promise<string | null> {
  for (const candidate of CSS_ENTRY_CANDIDATES) {
    try {
      await readFile(path.join(cwd, candidate), 'utf8')
      return candidate
    } catch {
      continue
    }
  }

  return null
}

export async function detectJsEntry(cwd: string, cssEntry: string): Promise<string | null> {
  const siblingCandidates = [
    cssEntry.replace(/index\.css$/, 'main.ts'),
    cssEntry.replace(/index\.css$/, 'main.tsx'),
    cssEntry.replace(/index\.css$/, 'main.js'),
    cssEntry.replace(/index\.css$/, 'main.jsx')
  ]

  for (const candidate of [...new Set([...siblingCandidates, ...JS_ENTRY_CANDIDATES])]) {
    try {
      await readFile(path.join(cwd, candidate), 'utf8')
      return candidate
    } catch {
      continue
    }
  }

  return null
}

export function inferAppRoot(cssEntry: string): string {
  const normalized = cssEntry.replace(/\\/g, '/')
  const marker = '/src/'
  const index = normalized.indexOf(marker)
  return index === -1 ? '.' : normalized.slice(0, index)
}

export async function detectAppType(cwd: string): Promise<'react' | 'vanilla'> {
  try {
    const packageJson = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const all = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    return 'react' in all ? 'react' : 'vanilla'
  } catch {
    return 'vanilla'
  }
}
