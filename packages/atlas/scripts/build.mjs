import { cp, rm } from 'node:fs/promises'
import { dirname } from 'node:path'

import { createAtlasPackageFiles, loadAtlasMetadata } from './api-plan.mjs'
import {
  ensureDir,
  filePath,
  pathExists,
  walkFiles,
  writeText,
} from './utils.mjs'

const srcDir = filePath('src')
const distDir = filePath('dist')
const srcTypesPath = filePath('src/types.ts')

async function cleanBuildOutput() {
  await rm(distDir, { force: true, recursive: true })
}

async function mustExist(path) {
  if (await pathExists(path)) return
  throw new Error(`Missing generated data: ${path}\nRun: pnpm --filter @d3-maps/atlas generate`)
}

async function copyGeneratedJson() {
  const copyTasks = []

  for await (const sourcePath of walkFiles(srcDir)) {
    if (!sourcePath.endsWith('.json')) continue
    if (sourcePath === filePath('src/sources.json')) continue

    const relativePath = sourcePath.slice(srcDir.length + 1)
    const targetPath = `${distDir}/${relativePath}`
    copyTasks.push((async () => {
      await ensureDir(dirname(targetPath))
      await cp(sourcePath, targetPath)
    })())
  }

  await Promise.all(copyTasks)
}

async function buildApiFiles() {
  const metadata = await loadAtlasMetadata()
  const files = createAtlasPackageFiles(distDir, metadata)
  await Promise.all(files.map((file) => writeText(file.path, file.content)))
}

async function buildTypesModule() {
  await Promise.all([
    writeText(`${distDir}/types.js`, 'export {}'),
    cp(srcTypesPath, `${distDir}/types.d.ts`),
  ])
}

async function build() {
  await cleanBuildOutput()

  await Promise.all([
    mustExist(filePath('src/metadata/countries.json')),
    mustExist(filePath('src/metadata/continents.json')),
    mustExist(srcTypesPath),
  ])

  await Promise.all([
    copyGeneratedJson(),
    buildApiFiles(),
    buildTypesModule(),
  ])
}

await build()
