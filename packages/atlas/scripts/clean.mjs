import { rm } from 'node:fs/promises'
import process from 'node:process'

import { fileUrl } from './utils.mjs'

const targetGroups = {
  build: ['dist'],
  generate: [
    'data/generated',
    'data/tmp',
    'src/world',
    'src/countries',
    'src/continents',
    'src/metadata',
    'src/metadata/countries.json',
    'src/metadata/continents.json',
    'src/metadata/sources.json',
  ],
}

const groupNames = process.argv.slice(2)
const groups = groupNames.length > 0 ? groupNames : ['build']
const targets = new Set(groups.flatMap((group) => targetGroups[group] ?? []))

for (const target of targets) {
  await rm(fileUrl(target), { force: true, recursive: true })
}
