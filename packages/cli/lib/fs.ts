import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function readTextIfExists(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    if (isMissing(error)) {
      return null
    }
    throw error
  }
}

export async function writeIfChanged(filePath: string, content: string): Promise<'created' | 'updated' | 'unchanged'> {
  const existing = await readTextIfExists(filePath)

  if (existing === content) {
    return 'unchanged'
  }

  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf8')
  return existing === null ? 'created' : 'updated'
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ENOENT'
}
