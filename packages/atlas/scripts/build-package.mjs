import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'

import { filePath } from './utils.mjs'

const srcDir = filePath('src')
const distDir = filePath('dist')

function toJs(source) {
  return source
    .replace(/^import type .*$/gm, '')
    .replace(/^export type .*$/gm, '')
    .replace(/ as unknown as Topology/g, '')
    .replace(/ as Topology/g, '')
    .replace(/ satisfies Topology/g, '')
}

function toDts(source) {
  const constMatch = source.match(/const ([\w$]+) = /)
  if (constMatch) {
    const [, name] = constMatch
    return `import type { Topology } from 'topojson-specification'\n\ndeclare const ${name}: Topology\n\nexport default ${name}\n`
  }

  const declarations = source
    .split('\n')
    .filter((line) => line.startsWith('export '))
    .join('\n')
    .concat('\n')

  return declarations
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(path)
      continue
    }

    yield path
  }
}

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}

for await (const sourcePath of walk(srcDir)) {
  const rel = relative(srcDir, sourcePath)
  const ext = extname(sourcePath)

  if (ext === '.json') {
    await mkdir(dirname(join(distDir, rel)), { recursive: true })
    await cp(sourcePath, join(distDir, rel))
    continue
  }

  if (ext !== '.ts') continue

  const source = await readFile(sourcePath, 'utf8')
  const outBase = join(distDir, rel.replace(/\.ts$/, ''))

  await write(`${outBase}.js`, toJs(source))
  await write(`${outBase}.d.ts`, toDts(source))
}
