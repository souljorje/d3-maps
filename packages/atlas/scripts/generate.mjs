import { access, mkdtemp, readdir, rename, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'

import {
  CONTINENTS,
  DEFAULT_SCALE,
  ensureDir,
  filePath,
  mapshaper,
  METADATA_FIELD_NAMES,
  pascalCase,
  readJson,
  SCALES,
  slugify,
  sourceShp,
  sourceWorldLayerShp,
  TOPOLOGY_FIELD_NAMES,
  TOPOLOGY_PROPERTY_MAP,
  TOPOLOGY_PROPERTY_MODE,
  WORLD_LAYERS,
  writeJson,
} from './utils.mjs'
import { writeAtlasSourceFiles } from './api-plan.mjs'

const CLEAN_PATHS = [
  'data/generated',
  'data/tmp',
  'src/world',
  'src/countries',
  'src/continents',
  'src/metadata',
  'src/index.ts',
  'src/_topology.ts',
  'src/_country-topology.ts',
  'src/sources.json',
]

async function mustExist(path) {
  try {
    await access(path)
  } catch {
    throw new Error(`Missing source file: ${path}\nRun: pnpm --filter @d3-maps/atlas run sync-data`)
  }
}

async function cleanGeneratedOutputs() {
  await Promise.all(
    CLEAN_PATHS.map((path) => rm(filePath(path), { force: true, recursive: true })),
  )
}

function fieldValue(properties, key) {
  const value = properties[key]
  if (value == null || value === '-99') return undefined
  return value
}

function getCountryName(properties) {
  return fieldValue(properties, 'NAME_LONG') ?? fieldValue(properties, 'NAME') ?? fieldValue(properties, 'ADM0_A3')
}

function normalizeCountry(properties) {
  const name = getCountryName(properties)
  const slug = slugify(name)
  return {
    slug,
    exportName: pascalCase(name),
    name,
    adm0A3: fieldValue(properties, 'ADM0_A3'),
    isoA2: fieldValue(properties, 'ISO_A2'),
    isoA3: fieldValue(properties, 'ISO_A3'),
    continent: fieldValue(properties, 'CONTINENT'),
    region: fieldValue(properties, 'REGION_UN'),
    subregion: fieldValue(properties, 'SUBREGION'),
    popEst: fieldValue(properties, 'POP_EST'),
    gdpMd: fieldValue(properties, 'GDP_MD'),
  }
}

async function exportGeojsonForMetadata(scale) {
  const input = sourceShp(scale)
  const output = join(tempRoot, `countries-${scale}.geojson`)

  await ensureDir(dirname(output))
  await mapshaper([
    input,
    '-filter-fields',
    METADATA_FIELD_NAMES.join(','),
    '-o',
    'format=geojson',
    output,
  ])

  return output
}

async function exportScaleTopologies(scale) {
  const worldOutputs = WORLD_LAYERS.map((layer) => ({
    ...layer,
    input: sourceWorldLayerShp(scale, layer.sourceLayer, layer.theme),
    output: filePath(`src/world/${layer.id}/${layer.id}-${scale}.json`),
  }))
  const countryOutputDir = join(tempRoot, `countries-${scale}`)
  const continentOutputDir = join(tempRoot, `continents-${scale}`)

  for (const { output } of worldOutputs) await ensureDir(dirname(output))
  await ensureDir(countryOutputDir)
  await ensureDir(continentOutputDir)

  const countriesLayer = worldOutputs.find((layer) => layer.id === 'countries')
  await mapshaper([
    countriesLayer.input,
    '-clean',
    '-filter-fields',
    countriesLayer.topologyFields.join(','),
    '-rename-layers',
    'features',
    '-o',
    'format=topojson',
    'quantization=1e5',
    'bbox',
    countriesLayer.output,
    '-split',
    'ADM0_A3',
    'apart',
    '+',
    '-o',
    'format=topojson',
    'quantization=1e5',
    'bbox',
    'singles',
    `${countryOutputDir}/`,
    '-target',
    'features',
    '-split',
    'CONTINENT',
    'apart',
    '+',
    '-o',
    'format=topojson',
    'quantization=1e5',
    'bbox',
    'singles',
    `${continentOutputDir}/`,
  ])

  for (const layer of worldOutputs) {
    if (layer.id === 'countries') continue

    await mapshaper([
      layer.input,
      '-clean',
      '-rename-layers',
      'features',
      '-o',
      'format=topojson',
      'quantization=1e5',
      'bbox',
      layer.output,
    ])
  }

  return {
    continentOutputDir,
    countryOutputDir,
    worldOutputs,
  }
}

function transformGeometryProperties(geometry, layer) {
  if (layer.propertyMode === TOPOLOGY_PROPERTY_MODE.NORMALIZE && geometry.properties) {
    geometry.properties = Object.fromEntries(
      Object.entries(layer.propertyMap)
        .map(([sourceKey, targetKey]) => [targetKey, geometry.properties[sourceKey]])
        .filter(([, value]) => value != null),
    )
  }

  if (Array.isArray(geometry.geometries)) {
    for (const child of geometry.geometries) transformGeometryProperties(child, layer)
  }
}

async function transformTopologyProperties(path, layer) {
  const topology = await readJson(path)

  for (const object of Object.values(topology.objects ?? {})) {
    transformGeometryProperties(object, layer)
  }

  await writeJson(path, topology)
}

async function moveSplitFiles(sourceDir, targetRoot, slugBySourceName, scale, layer) {
  const sourceNames = []

  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue

    const sourceName = basename(entry.name, '.json')
    if (sourceName === 'features') continue

    const slug = slugBySourceName.get(sourceName)
    if (!slug) continue

    const targetDir = join(targetRoot, slug)
    await ensureDir(targetDir)
    await rename(
      join(sourceDir, entry.name),
      join(targetDir, `${slug}-${scale}.json`),
    )
    await transformTopologyProperties(join(targetDir, `${slug}-${scale}.json`), layer)
    sourceNames.push(sourceName)
  }

  await rm(sourceDir, { recursive: true, force: true })
  return sourceNames
}

async function createCountryMetadata() {
  const countriesByCode = new Map()

  const metadataGeojsonPaths = await Promise.all(
    SCALES.map((scale) => exportGeojsonForMetadata(scale)),
  )

  for (const metadataGeojsonPath of metadataGeojsonPaths) {
    const geojson = await readJson(metadataGeojsonPath)

    for (const feature of geojson.features) {
      const country = normalizeCountry(feature.properties)
      if (!country.slug || !country.adm0A3) continue

      const existing = countriesByCode.get(country.adm0A3)
      if (existing) continue

      countriesByCode.set(country.adm0A3, {
        ...country,
        scales: [],
      })
    }
  }

  return countriesByCode
}

const tempRoot = await mkdtemp(join(tmpdir(), 'd3-maps-atlas-'))

try {
  await cleanGeneratedOutputs()

  const countriesByCode = await createCountryMetadata()
  const countrySlugByCode = new Map(
    [...countriesByCode.values()].map((country) => [country.adm0A3, country.slug]),
  )
  const continentSlugByName = new Map(
    CONTINENTS.map((continent) => [continent.name, continent.slug]),
  )
  const normalizedLayer = {
    propertyMode: TOPOLOGY_PROPERTY_MODE.NORMALIZE,
    propertyMap: TOPOLOGY_PROPERTY_MAP,
  }

  for (const scale of SCALES) {
    await Promise.all([
      mustExist(sourceShp(scale)),
      ...WORLD_LAYERS.map((layer) => mustExist(sourceWorldLayerShp(scale, layer.sourceLayer, layer.theme))),
    ])

    const { continentOutputDir, countryOutputDir, worldOutputs } = await exportScaleTopologies(scale)
    await Promise.all(worldOutputs.map((layer) => transformTopologyProperties(layer.output, layer)))
    const [presentCountryCodes] = await Promise.all([
      moveSplitFiles(
        countryOutputDir,
        filePath('src/countries'),
        countrySlugByCode,
        scale,
        normalizedLayer,
      ),
      moveSplitFiles(
        continentOutputDir,
        filePath('src/continents'),
        continentSlugByName,
        scale,
        normalizedLayer,
      ),
    ])

    for (const adm0A3 of presentCountryCodes) {
      const country = countriesByCode.get(adm0A3)
      if (country) country.scales.push(scale)
    }
  }

  const countries = [...countriesByCode.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((country) => ({
      ...country,
      defaultScale: country.scales[0] ?? DEFAULT_SCALE,
    }))

  await writeJson(filePath('src/metadata/countries.json'), countries)
  await writeJson(
    filePath('src/metadata/continents.json'),
    CONTINENTS.map((continent) => ({
      ...continent,
      exportName: pascalCase(continent.name),
      defaultScale: DEFAULT_SCALE,
      scales: SCALES,
    })),
  )

  await writeJson(filePath('src/sources.json'), {
    naturalEarth: WORLD_LAYERS.map((layer) => ({
      name: 'Natural Earth Vector',
      url: 'https://github.com/nvkelso/natural-earth-vector',
      license: 'public domain',
      scales: SCALES,
      theme: layer.theme,
      sourceLayer: layer.sourceLayer,
      outputLayer: layer.id,
      topologyFields: layer.id === 'countries' ? Object.values(TOPOLOGY_PROPERTY_MAP) : [],
      topologySourceFields: layer.topologyFields,
      metadataFields: layer.id === 'countries' ? METADATA_FIELD_NAMES : [],
    })),
  })

  await writeAtlasSourceFiles(filePath('src'))
} finally {
  await rm(tempRoot, { force: true, recursive: true })
}
