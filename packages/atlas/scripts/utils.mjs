import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { execa } from 'execa'

export const ROOT = new URL('..', import.meta.url)
export const SCALES = ['110m', '50m', '10m']
export const DEFAULT_SCALE = SCALES[0]

export const TOPOLOGY_PROPERTY_MAP = {
  ADM0_A3: 'id',
  NAME: 'name',
  NAME_LONG: 'name_long',
}

export const TOPOLOGY_PROPERTY_MODE = {
  NORMALIZE: 'normalize',
  PRESERVE: 'preserve',
}

export const TOPOLOGY_FIELD_NAMES = [
  ...Object.keys(TOPOLOGY_PROPERTY_MAP),
  'CONTINENT',
]

export const METADATA_FIELD_NAMES = [
  'ADM0_A3',
  'ISO_A2',
  'ISO_A3',
  'NAME',
  'NAME_LONG',
  'CONTINENT',
  'REGION_UN',
  'SUBREGION',
  'POP_EST',
  'GDP_MD',
]

export const CONTINENTS = [
  { name: 'Africa', slug: 'africa' },
  { name: 'Antarctica', slug: 'antarctica' },
  { name: 'Asia', slug: 'asia' },
  { name: 'Europe', slug: 'europe' },
  { name: 'North America', slug: 'north-america' },
  { name: 'Oceania', slug: 'oceania' },
  { name: 'South America', slug: 'south-america' },
]

export const WORLD_LAYERS = [
  {
    id: 'countries',
    name: 'Countries',
    sourceLayer: 'admin_0_countries',
    theme: 'cultural',
    topologyFields: TOPOLOGY_FIELD_NAMES,
    propertyMode: TOPOLOGY_PROPERTY_MODE.NORMALIZE,
    propertyMap: TOPOLOGY_PROPERTY_MAP,
  },
  {
    id: 'land',
    name: 'Land',
    sourceLayer: 'land',
    theme: 'physical',
    topologyFields: [],
    propertyMode: TOPOLOGY_PROPERTY_MODE.PRESERVE,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    sourceLayer: 'ocean',
    theme: 'physical',
    topologyFields: [],
    propertyMode: TOPOLOGY_PROPERTY_MODE.PRESERVE,
  },
  {
    id: 'coastline',
    name: 'Coastline',
    sourceLayer: 'coastline',
    theme: 'physical',
    topologyFields: [],
    propertyMode: TOPOLOGY_PROPERTY_MODE.PRESERVE,
  },
  {
    id: 'lakes',
    name: 'Lakes',
    sourceLayer: 'lakes',
    theme: 'physical',
    topologyFields: [],
    propertyMode: TOPOLOGY_PROPERTY_MODE.PRESERVE,
  },
  {
    id: 'rivers',
    name: 'Rivers',
    sourceLayer: 'rivers_lake_centerlines',
    theme: 'physical',
    topologyFields: [],
    propertyMode: TOPOLOGY_PROPERTY_MODE.PRESERVE,
  },
]

export function fileUrl(path) {
  return new URL(path, ROOT)
}

export function filePath(path) {
  return fileURLToPath(fileUrl(path))
}

export async function ensureDir(path) {
  await mkdir(path, { recursive: true })
}

export async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function writeJson(path, value) {
  await ensureDir(dirname(path))
  await writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')
}

export async function writeText(path, value) {
  await ensureDir(dirname(path))
  await writeFile(path, value.endsWith('\n') ? value : `${value}\n`, 'utf8')
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

export async function* walkFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) {
      yield* walkFiles(path)
      continue
    }

    yield path
  }
}

export function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export function pascalCase(value) {
  return slugify(value)
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('')
}

export function exec(command, args, options = {}) {
  return execa(command, args, {
    stdio: 'inherit',
    ...options,
  })
}

export function mapshaper(args) {
  return exec(filePath('node_modules/.bin/mapshaper'), args)
}

export function sourceShp(scale) {
  return filePath(`data/raw/natural-earth-vector/${scale}_cultural/ne_${scale}_admin_0_countries.shp`)
}

export function sourceWorldLayerShp(scale, sourceLayer, theme = 'physical') {
  return filePath(`data/raw/natural-earth-vector/${scale}_${theme}/ne_${scale}_${sourceLayer}.shp`)
}
