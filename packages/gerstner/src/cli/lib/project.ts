import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const CSS_CANDIDATES = [
  'apps/playground/src/index.css',
  'apps/web/src/index.css',
  'app/src/index.css',
  'src/index.css',
  'src/styles.css',
]

const JS_ENTRY_NAMES = [
  'main.tsx',
  'main.ts',
  'main.jsx',
  'main.js',
  'index.tsx',
  'index.ts',
  'index.jsx',
  'index.js',
]

export async function detectCssEntry(cwd: string): Promise<string | undefined> {
  for (const candidate of CSS_CANDIDATES) {
    if (await exists(path.join(cwd, candidate))) {
      return normalize(candidate)
    }
  }

  const matches = await walkForMatches(cwd, (entryPath) =>
    /(?:^|\/)src\/(?:index|styles)\.css$/u.test(normalize(entryPath)),
  )
  return matches[0]
}

export async function detectJsEntry(cwd: string, cssEntry: string): Promise<string | undefined> {
  const srcDir = path.join(cwd, path.dirname(cssEntry))

  for (const name of JS_ENTRY_NAMES) {
    const absolute = path.join(srcDir, name)
    if (await exists(absolute)) {
      return normalize(path.relative(cwd, absolute))
    }
  }

  const matches = await walkForMatches(cwd, (entryPath) =>
    /(?:^|\/)(?:main|index)\.[cm]?[jt]sx?$/u.test(normalize(entryPath)),
  )
  return matches[0]
}

export async function detectAppType(cwd: string): Promise<'react' | 'vanilla'> {
  try {
    const packageJson = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    return 'react' in deps || 'preact' in deps ? 'react' : 'vanilla'
  } catch {
    return 'vanilla'
  }
}

export async function detectTargetFromCssEntry(
  cwd: string,
  cssEntry: string,
): Promise<'css' | 'tw4'> {
  const absolute = path.join(cwd, cssEntry)
  try {
    const content = await readFile(absolute, 'utf8')
    if (
      /@import\s+["']tailwindcss["']/u.test(content) ||
      /@import\s+["']gerstner\/tw4["']/u.test(content)
    ) {
      return 'tw4'
    }
  } catch {
    // file doesn't exist yet — fall through
  }
  return 'css'
}

export function inferAppRoot(cssEntry: string): string {
  const normalized = normalize(cssEntry)
  const srcSegment = '/src/'
  const srcIndex = normalized.lastIndexOf(srcSegment)

  if (srcIndex !== -1) {
    return normalized.slice(0, srcIndex)
  }

  return normalize(path.posix.dirname(normalized))
}

async function walkForMatches(
  root: string,
  predicate: (entryPath: string) => boolean,
): Promise<string[]> {
  const results: string[] = []

  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true })

    for (const entry of entries) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === '.turbo'
      ) {
        continue
      }

      const absolute = path.join(current, entry.name)

      if (entry.isDirectory()) {
        await walk(absolute)
        continue
      }

      const relative = normalize(path.relative(root, absolute))
      if (predicate(relative)) {
        results.push(relative)
      }
    }
  }

  await walk(root)
  return results.sort()
}

async function exists(target: string): Promise<boolean> {
  try {
    await stat(target)
    return true
  } catch {
    return false
  }
}

function normalize(value: string): string {
  return value.replace(/\\/g, '/')
}
