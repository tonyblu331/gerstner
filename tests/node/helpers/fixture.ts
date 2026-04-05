import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

export async function makeFixtureCopy(name: string): Promise<string> {
  const source = path.resolve(import.meta.dirname, '../../fixtures', name)
  const destination = await mkdtemp(path.join(os.tmpdir(), `gerstner-${name}-`))
  await cp(source, destination, { recursive: true })
  return destination
}

export async function readFixtureFile(cwd: string, relativePath: string): Promise<string> {
  return readFile(path.join(cwd, relativePath), 'utf8')
}

export async function writeFixtureFile(
  cwd: string,
  relativePath: string,
  content: string,
): Promise<void> {
  await writeFile(path.join(cwd, relativePath), content, 'utf8')
}
