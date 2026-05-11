import { readFile } from 'node:fs/promises'

import {
  CONTINENTS,
  SCALES,
  filePath,
  pathExists,
  readJson,
  walkFiles,
} from './utils.mjs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertString(value, label) {
  assert(typeof value === 'string' && value.length > 0, `${label}: expected non-empty string`)
}

function assertOptionalString(value, label) {
  assert(value == null || typeof value === 'string', `${label}: expected string or undefined`)
}

function assertOptionalNumber(value, label) {
  assert(value == null || typeof value === 'number', `${label}: expected number or undefined`)
}

const files = []
for await (const file of walkFiles(filePath('src'))) files.push(file)
const topologyFiles = files.filter((file) => (
  file.endsWith('.json')
  && (
    file.includes('/world/')
    || file.includes('/countries/')
    || file.includes('/continents/')
  )
))

assert(topologyFiles.length > 0, 'No topology files generated')

for (const file of topologyFiles) {
  const value = JSON.parse(await readFile(file, 'utf8'))

  assert(value.type === 'Topology', `${file}: expected type=Topology`)
  assert(value.objects && typeof value.objects === 'object', `${file}: missing objects`)
  assert(Object.keys(value.objects).length > 0, `${file}: missing topology objects`)
  assert(Array.isArray(value.arcs), `${file}: missing arcs`)
  assert(Array.isArray(value.bbox), `${file}: missing bbox`)
}

const countries = await readJson(filePath('src/metadata/countries.json'))
const continents = await readJson(filePath('src/metadata/continents.json'))

assert(countries.length > 0, 'No country metadata generated')
assert(continents.length === CONTINENTS.length, 'Continent metadata is incomplete')

const countrySlugs = new Set()
const countryCodes = new Set()

for (const scale of SCALES) {
  assert(
    await pathExists(filePath(`src/world/countries/countries-${scale}.json`)),
    `Missing world topology for ${scale}`,
  )
}

for (const country of countries) {
  assertString(country.slug, 'country.slug')
  assertString(country.exportName, `country.exportName:${country.slug}`)
  assertString(country.name, `country.name:${country.slug}`)
  assertString(country.adm0A3, `country.adm0A3:${country.slug}`)
  assertOptionalString(country.isoA2, `country.isoA2:${country.slug}`)
  assertOptionalString(country.isoA3, `country.isoA3:${country.slug}`)
  assertOptionalString(country.continent, `country.continent:${country.slug}`)
  assertOptionalString(country.region, `country.region:${country.slug}`)
  assertOptionalString(country.subregion, `country.subregion:${country.slug}`)
  assertOptionalNumber(country.popEst, `country.popEst:${country.slug}`)
  assertOptionalNumber(country.gdpMd, `country.gdpMd:${country.slug}`)
  assert(Array.isArray(country.scales), `country.scales:${country.slug}: expected array`)
  assert(country.scales.length > 0, `missing scales for ${country.slug}`)
  assert(country.scales.every((scale) => SCALES.includes(scale)), `invalid scales for ${country.slug}`)
  assert(country.defaultScale && country.scales.includes(country.defaultScale), `defaultScale not in scales for ${country.slug}`)
  assert(!countrySlugs.has(country.slug), `duplicate country slug: ${country.slug}`)
  assert(!countryCodes.has(country.adm0A3), `duplicate country adm0A3: ${country.adm0A3}`)
  countrySlugs.add(country.slug)
  countryCodes.add(country.adm0A3)

  for (const scale of country.scales) {
    assert(
      await pathExists(filePath(`src/countries/${country.slug}/${country.slug}-${scale}.json`)),
      `Missing country topology: ${country.slug}-${scale}`,
    )
  }
}

for (const continent of continents) {
  assertString(continent.slug, 'continent.slug')
  assertString(continent.name, `continent.name:${continent.slug}`)
  assertString(continent.exportName, `continent.exportName:${continent.slug}`)
  assert(Array.isArray(continent.scales), `continent.scales:${continent.slug}: expected array`)
  assert(continent.scales.length > 0, `missing scales for continent ${continent.slug}`)
  assert(continent.scales.every((scale) => SCALES.includes(scale)), `invalid scales for continent ${continent.slug}`)
  assert(continent.defaultScale && continent.scales.includes(continent.defaultScale), `defaultScale not in scales for continent ${continent.slug}`)

  for (const scale of continent.scales) {
    assert(
      await pathExists(filePath(`src/continents/${continent.slug}/${continent.slug}-${scale}.json`)),
      `Missing continent topology: ${continent.slug}-${scale}`,
    )
  }
}

console.log(`Validated ${topologyFiles.length} TopoJSON files, ${countries.length} countries, and ${continents.length} continents.`)
