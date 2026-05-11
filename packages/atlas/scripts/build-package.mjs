import { cp } from 'node:fs/promises'
import { dirname } from 'node:path'

import {
  DEFAULT_SCALE,
  SCALES,
  ensureDir,
  filePath,
  pathExists,
  readJson,
  walkFiles,
  WORLD_LAYERS,
  writeText,
} from './utils.mjs'

const srcDir = filePath('src')
const distDir = filePath('dist')

async function mustExist(path) {
  if (await pathExists(path)) return
  throw new Error(`Missing generated data: ${path}\nRun: pnpm --filter @d3-maps/atlas generate`)
}

function wrapperJs(jsonFile) {
  return [
    `import data from './${jsonFile}' with { type: 'json' }`,
    '',
    'export default data',
  ].join('\n')
}

function scaleDts(sharedPath, exportName, defaultScale = DEFAULT_SCALE) {
  return [
    `export { default } from '${sharedPath}'`,
    '',
    ...SCALES.map((scale) => `export { default as ${exportName}${scale} } from '${sharedPath}'`),
  ].join('\n')
}

function scaleExports(baseName, exportName, defaultScale = DEFAULT_SCALE) {
  return [
    `export { default } from './${baseName}-${defaultScale}.js'`,
    '',
    ...SCALES.map((scale) => `export { default as ${exportName}${scale} } from './${baseName}-${scale}.js'`),
  ].join('\n')
}

async function copyGeneratedJson() {
  for await (const sourcePath of walkFiles(srcDir)) {
    if (!sourcePath.endsWith('.json')) continue
    if (sourcePath === filePath('src/sources.json')) continue

    const relativePath = sourcePath.slice(srcDir.length + 1)
    const targetPath = `${distDir}/${relativePath}`
    await ensureDir(dirname(targetPath))
    await cp(sourcePath, targetPath)
  }
}

async function writeWrapperPair(basePath, jsonFile) {
  await writeText(`${basePath}.js`, wrapperJs(jsonFile))
}

async function writeBarrelPair(basePath, lines) {
  const content = Array.isArray(lines) ? lines.join('\n') : lines
  await writeText(`${basePath}.js`, content)
  await writeText(`${basePath}.d.ts`, content)
}

async function buildWorldLayer(layer) {
  const dir = `${distDir}/world/${layer.id}`
  const sharedLeafPath = '../../_topology.js'

  for (const scale of SCALES) {
    await writeWrapperPair(
      `${dir}/${layer.id}-${scale}`,
      `${layer.id}-${scale}.json`,
    )
  }

  await writeText(
    `${dir}/index.js`,
    scaleExports(layer.id, layer.name),
  )
  await writeText(
    `${dir}/index.d.ts`,
    scaleDts(sharedLeafPath, layer.name),
  )
}

async function buildEntityModules(rootDir, metadataPath) {
  const entities = await readJson(metadataPath)
  const sharedLeafPath = '../../_topology.js'

  for (const entity of entities) {
    const { defaultScale, exportName, scales, slug } = entity
    const dir = `${rootDir}/${slug}`

    for (const scale of scales) {
      await writeWrapperPair(
        `${dir}/${slug}-${scale}`,
        `${slug}-${scale}.json`,
      )
    }

    await writeText(
      `${dir}/index.js`,
      scaleExports(slug, exportName, defaultScale),
    )
    await writeText(
      `${dir}/index.d.ts`,
      scaleDts(sharedLeafPath, exportName, defaultScale),
    )
  }

  return entities
}

async function buildCountriesBarrel(countries) {
  const lines = countries.map((country) => (
    `export { default as ${country.exportName} } from './countries/${country.slug}/index.js'`
  ))

  await writeBarrelPair(`${distDir}/countries`, lines)
}

async function buildRootBarrel(continents) {
  const worldLines = WORLD_LAYERS.flatMap((layer) => [
    `export { default as ${layer.name} } from './world/${layer.id}/index.js'`,
    `export { ${layer.name}10m, ${layer.name}50m, ${layer.name}110m } from './world/${layer.id}/index.js'`,
  ])
  const jsLines = [
    ...worldLines,
    '',
    ...continents.map((continent) => `export { default as ${continent.exportName} } from './continents/${continent.slug}/index.js'`),
  ]
  const dtsLines = [
    ...jsLines,
    '',
    "export type { Topology } from './types.js'",
  ]

  await writeText(`${distDir}/index.js`, jsLines.join('\n'))
  await writeText(`${distDir}/index.d.ts`, dtsLines.join('\n'))
}

async function buildTypesModule() {
  await writeText(`${distDir}/types.js`, 'export {}')
  await writeText(
    `${distDir}/types.d.ts`,
    "export type { Topology } from 'topojson-specification'",
  )
}

async function buildSharedTopologyModule() {
  await writeText(`${distDir}/_topology.js`, 'export {}')
  await writeText(
    `${distDir}/_topology.d.ts`,
    [
      "import type { Topology } from 'topojson-specification'",
      '',
      'declare const topology: Topology',
      '',
      'export default topology',
    ].join('\n'),
  )
}

await mustExist(filePath('src/metadata/countries.json'))
await mustExist(filePath('src/metadata/continents.json'))

await copyGeneratedJson()
await buildSharedTopologyModule()
for (const layer of WORLD_LAYERS) await buildWorldLayer(layer)
const countries = await buildEntityModules(
  `${distDir}/countries`,
  filePath('src/metadata/countries.json'),
)
const continents = await buildEntityModules(
  `${distDir}/continents`,
  filePath('src/metadata/continents.json'),
)
await buildCountriesBarrel(countries)
await buildRootBarrel(continents)
await buildTypesModule()
