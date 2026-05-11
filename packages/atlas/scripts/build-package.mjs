import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { fileUrl } from './utils.mjs'

const srcDir = fileURLToPath(fileUrl('src'))
const distDir = fileURLToPath(fileUrl('dist'))

function toJs(source) {
  return source
    .replace(/^import type \{ Topology \} from 'topojson-specification'\n\n/m, '')
    .replace(/^export type .*$/gm, '')
    .replace(/ satisfies Topology/g, '')
    .replace(/(from '\.\/(?:countries|continents)\/[^']+)\.js'/g, '$1/index.js\'')
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

  return declarations.replace(/(from '\.\/(?:countries|continents)\/[^']+)\.js'/g, '$1/index.js\'')
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
