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
  TOPOLOGY_FIELD_NAMES,
  TOPOLOGY_PROPERTY_MAP,
  writeJson,
} from './utils.mjs'

async function mustExist(path) {
  try {
    await access(path)
  } catch {
    throw new Error(`Missing source file: ${path}\nRun: pnpm --filter @d3-maps/atlas run sync-data`)
  }
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
  const input = sourceShp(scale)
  const worldOutput = filePath(`src/world/countries/countries-${scale}.json`)
  const countryOutputDir = join(tempRoot, `countries-${scale}`)
  const continentOutputDir = join(tempRoot, `continents-${scale}`)

  await ensureDir(dirname(worldOutput))
  await ensureDir(countryOutputDir)
  await ensureDir(continentOutputDir)

  await mapshaper([
    input,
    '-clean',
    '-filter-fields',
    TOPOLOGY_FIELD_NAMES.join(','),
    '-rename-layers',
    'features',
    '-o',
    'format=topojson',
    'quantization=1e5',
    'bbox',
    worldOutput,
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

  return {
    continentOutputDir,
    countryOutputDir,
    worldOutput,
  }
}

function pruneGeometryProperties(geometry) {
  if (geometry.properties) {
    geometry.properties = Object.fromEntries(
      Object.entries(TOPOLOGY_PROPERTY_MAP)
        .map(([sourceKey, targetKey]) => [targetKey, geometry.properties[sourceKey]])
        .filter(([, value]) => value != null),
    )
  }

  if (Array.isArray(geometry.geometries)) {
    for (const child of geometry.geometries) pruneGeometryProperties(child)
  }
}

async function pruneTopologyProperties(path) {
  const topology = await readJson(path)

  for (const object of Object.values(topology.objects ?? {})) {
    pruneGeometryProperties(object)
  }

  await writeJson(path, topology)
}

async function moveSplitFiles(sourceDir, targetRoot, slugBySourceName, scale) {
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
    await pruneTopologyProperties(join(targetDir, `${slug}-${scale}.json`))
    sourceNames.push(sourceName)
  }

  await rm(sourceDir, { recursive: true, force: true })
  return sourceNames
}

async function createCountryMetadata() {
  const countriesByCode = new Map()

  for (const scale of SCALES) {
    const metadataGeojsonPath = await exportGeojsonForMetadata(scale)
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
  const countriesByCode = await createCountryMetadata()
  const countrySlugByCode = new Map(
    [...countriesByCode.values()].map((country) => [country.adm0A3, country.slug]),
  )
  const continentSlugByName = new Map(
    CONTINENTS.map((continent) => [continent.name, continent.slug]),
  )

  for (const scale of SCALES) {
    const shp = sourceShp(scale)
    await mustExist(shp)

    const { continentOutputDir, countryOutputDir, worldOutput } = await exportScaleTopologies(scale)
    await pruneTopologyProperties(worldOutput)
    const presentCountryCodes = await moveSplitFiles(
      countryOutputDir,
      filePath('src/countries'),
      countrySlugByCode,
      scale,
    )

    for (const adm0A3 of presentCountryCodes) {
      const country = countriesByCode.get(adm0A3)
      if (country) country.scales.push(scale)
    }

    await moveSplitFiles(
      continentOutputDir,
      filePath('src/continents'),
      continentSlugByName,
      scale,
    )
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
    naturalEarth: {
      name: 'Natural Earth Vector',
      url: 'https://github.com/nvkelso/natural-earth-vector',
      license: 'public domain',
      scales: SCALES,
      theme: 'cultural',
      sourceLayer: 'admin_0_countries',
      topologyFields: Object.values(TOPOLOGY_PROPERTY_MAP),
      topologySourceFields: TOPOLOGY_FIELD_NAMES,
      metadataFields: METADATA_FIELD_NAMES,
    },
  })
} finally {
  await rm(tempRoot, { force: true, recursive: true })
}
