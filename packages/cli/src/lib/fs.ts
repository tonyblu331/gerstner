import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function ensureDir(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true })
}

export async function readTextIfExists(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return null
  }
}

export async function writeIfChanged(filePath: string, content: string): Promise<'created' | 'updated' | 'unchanged'> {
  const current = await readTextIfExists(filePath)

  if (current === content) {
    return 'unchanged'
  }

  await ensureDir(filePath)
  await writeFile(filePath, content, 'utf8')
  return current === null ? 'created' : 'updated'
}
