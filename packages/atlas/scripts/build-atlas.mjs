import { access, rm } from 'node:fs/promises'
import { dirname } from 'node:path'

import {
  CONTINENTS,
  ensureDir,
  FIELD_NAMES,
  fileUrl,
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
    throw new Error(`Missing source file: ${path}\nRun: pnpm --filter @d3-maps/atlas fetch`)
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
  const output = fileUrl(`data/tmp/countries-${scale}.geojson`).pathname

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

await rm(fileUrl('src/world').pathname, { recursive: true, force: true })
await rm(fileUrl('src/countries').pathname, { recursive: true, force: true })
await rm(fileUrl('src/continents').pathname, { recursive: true, force: true })
await rm(fileUrl('data/tmp').pathname, { recursive: true, force: true })
await ensureDir(fileUrl('data/tmp').pathname)

const countriesBySlug = new Map()

for (const scale of SCALES) {
  const shp = sourceShp(scale)
  await mustExist(shp)

  await exportTopology(
    shp,
    fileUrl(`src/world/countries/countries-${scale}.json`).pathname,
  )

  const metadataGeojsonPath = await exportGeojsonForMetadata(scale)
  const geojson = await readJson(metadataGeojsonPath)

  for (const feature of geojson.features) {
    const country = normalizeCountry(feature.properties)
    if (!country.slug || !country.adm0A3) continue

    const existing = countriesBySlug.get(country.slug) ?? country
    existing.scales = [...new Set([...(existing.scales ?? []), scale])]
    countriesBySlug.set(country.slug, existing)

    await exportTopology(
      shp,
      fileUrl(`src/countries/${country.slug}/${country.slug}-${scale}.json`).pathname,
      ['-filter', `ADM0_A3 == "${country.adm0A3}"`],
    )
  }

  for (const continent of CONTINENTS) {
    await exportTopology(
      shp,
      fileUrl(`src/continents/${continent.slug}/${continent.slug}-${scale}.json`).pathname,
      ['-filter', `CONTINENT == "${continent.name}"`],
    )
  }
}

const countries = [...countriesBySlug.values()]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((country) => ({
    ...country,
    defaultScale: '110m',
  }))

await writeJson(fileUrl('src/metadata/countries.json').pathname, countries)
await writeJson(
  fileUrl('src/metadata/continents.json').pathname,
  CONTINENTS.map((continent) => ({
    ...continent,
    exportName: pascalCase(continent.name),
    defaultScale: '110m',
    scales: SCALES,
  })),
)

await writeJson(fileUrl('src/metadata/sources.json').pathname, {
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
