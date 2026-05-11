import { access, readdir, rename, rm } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

import {
  CONTINENTS,
  DEFAULT_SCALE,
  ensureDir,
  FIELD_NAMES,
  filePath,
  mapshaper,
  pascalCase,
  readJson,
  SCALES,
  slugify,
  sourceShp,
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
  }
}

async function exportTopology(input, output, extraArgs = []) {
  await ensureDir(dirname(output))

  await mapshaper([
    input,
    ...extraArgs,
    '-clean',
    '-filter-fields',
    FIELD_NAMES.join(','),
    '-rename-layers',
    'features',
    '-o',
    'format=topojson',
    'quantization=1e5',
    'bbox',
    output,
  ])
}

async function exportGeojsonForMetadata(scale) {
  const input = sourceShp(scale)
  const output = filePath(`data/tmp/countries-${scale}.geojson`)

  await ensureDir(dirname(output))
  await mapshaper([
    input,
    '-filter-fields',
    FIELD_NAMES.join(','),
    '-o',
    'format=geojson',
    output,
  ])

  return output
}

async function exportSplitTopologies(input, splitField, outputDir) {
  await ensureDir(outputDir)
  await mapshaper([
    input,
    '-clean',
    '-filter-fields',
    FIELD_NAMES.join(','),
    '-split',
    splitField,
    'apart',
    '-o',
    'format=topojson',
    'quantization=1e5',
    'bbox',
    'singles',
    `${outputDir}/`,
  ])
}

async function moveSplitFiles(sourceDir, targetRoot, slugBySourceName, scale) {
  const sourceNames = []

  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue

    const sourceName = basename(entry.name, '.json')
    const slug = slugBySourceName.get(sourceName)
    if (!slug) continue

    const targetDir = join(targetRoot, slug)
    await ensureDir(targetDir)
    await rename(
      join(sourceDir, entry.name),
      join(targetDir, `${slug}-${scale}.json`),
    )
    sourceNames.push(sourceName)
  }

  await rm(sourceDir, { recursive: true, force: true })
  return sourceNames
}

async function createCountryMetadata() {
  const metadataGeojsonPath = await exportGeojsonForMetadata(DEFAULT_SCALE)
  const geojson = await readJson(metadataGeojsonPath)
  const countriesByCode = new Map()

  for (const feature of geojson.features) {
    const country = normalizeCountry(feature.properties)
    if (!country.slug || !country.adm0A3) continue

    countriesByCode.set(country.adm0A3, {
      ...country,
      scales: [],
    })
  }

  return countriesByCode
}

await ensureDir(filePath('data/tmp'))

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

  await exportTopology(
    shp,
    filePath(`src/world/countries/countries-${scale}.json`),
  )

  const countrySplitDir = filePath(`data/tmp/countries-${scale}`)
  await exportSplitTopologies(shp, 'ADM0_A3', countrySplitDir)
  const presentCountryCodes = await moveSplitFiles(
    countrySplitDir,
    filePath('src/countries'),
    countrySlugByCode,
    scale,
  )

  for (const adm0A3 of presentCountryCodes) {
    const country = countriesByCode.get(adm0A3)
    if (country) country.scales.push(scale)
  }

  const continentSplitDir = filePath(`data/tmp/continents-${scale}`)
  await exportSplitTopologies(shp, 'CONTINENT', continentSplitDir)
  await moveSplitFiles(
    continentSplitDir,
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

await writeJson(filePath('src/metadata/sources.json'), {
  naturalEarth: {
    name: 'Natural Earth Vector',
    url: 'https://github.com/nvkelso/natural-earth-vector',
    license: 'public domain',
    scales: SCALES,
    theme: 'cultural',
    sourceLayer: 'admin_0_countries',
    fields: FIELD_NAMES,
  },
})
