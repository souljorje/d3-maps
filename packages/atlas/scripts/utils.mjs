import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { execa } from 'execa'

export const ROOT = new URL('..', import.meta.url)
export const SCALES = ['110m', '50m', '10m']

export const FIELD_NAMES = [
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

export function fileUrl(path) {
  return new URL(path, ROOT)
}

export async function ensureDir(path) {
  await mkdir(path, { recursive: true })
}

export async function writeJson(path, value) {
  await ensureDir(dirname(path))
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
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
  return exec('pnpm', ['exec', 'mapshaper', ...args])
}

export function sourceShp(scale) {
  return fileUrl(`data/raw/natural-earth-vector/${scale}_cultural/ne_${scale}_admin_0_countries.shp`).pathname
}
