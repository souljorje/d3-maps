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

const files = []
for await (const file of walkFiles(filePath('src'))) files.push(file)
const topologyFiles = files.filter((file) => file.endsWith('.json') && !file.includes('/metadata/'))

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

for (const scale of SCALES) {
  assert(
    await pathExists(filePath(`src/world/countries/countries-${scale}.json`)),
    `Missing world topology for ${scale}`,
  )
}

for (const country of countries) {
  assert(country.scales.length > 0, `missing scales for ${country.slug}`)

  for (const scale of country.scales) {
    assert(
      await pathExists(filePath(`src/countries/${country.slug}/${country.slug}-${scale}.json`)),
      `Missing country topology: ${country.slug}-${scale}`,
    )
  }
}

for (const continent of continents) {
  for (const scale of continent.scales) {
    assert(
      await pathExists(filePath(`src/continents/${continent.slug}/${continent.slug}-${scale}.json`)),
      `Missing continent topology: ${continent.slug}-${scale}`,
    )
  }
}

console.log(`Validated ${topologyFiles.length} TopoJSON files, ${countries.length} countries, and ${continents.length} continents.`)
