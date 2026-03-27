import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const IGNORE_FILE = join(ROOT, '.netlifyignore')

function changedFiles(base, head) {
  return execFileSync(
    'git',
    ['diff', '--name-only', '--no-renames', base, head],
    { cwd: ROOT, encoding: 'utf8' },
  )
    .split(/\r?\n/)
    .filter(Boolean)
}

function isIgnored(file) {
  try {
    execFileSync(
      'git',
      [
        '-c',
        `core.excludesFile=${IGNORE_FILE}`,
        'check-ignore',
        '--quiet',
        '--no-index',
        file,
      ],
      { cwd: ROOT, stdio: 'ignore' },
    )
    return true
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 1) {
      return false
    }
    throw error
  }
}

function shouldBuild() {
  const base = process.env.CACHED_COMMIT_REF
  const head = process.env.COMMIT_REF

  if (!base || !head || base === head || !existsSync(IGNORE_FILE)) return true

  const files = changedFiles(base, head)
  if (files.length === 0) return false

  return !files.every(isIgnored)
}

try {
  process.exit(shouldBuild() ? 1 : 0)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
