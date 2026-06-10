import {
  DEFAULT_SCALE,
  filePath,
  readJson,
  SCALES,
  WORLD_LAYERS,
  writeText,
} from './utils.mjs'

function specifier(extlessPath, extension) {
  return `${extlessPath}.${extension}`
}

function localSpecifier(importPath, extension, importKind = 'local') {
  return importKind === 'local'
    ? specifier(importPath, extension)
    : importPath
}

function renderTypeDefaultDeclaration(importPath, typeName) {
  return [
    `import type { ${typeName} } from '${importPath}'`,
    '',
    `declare const topology: ${typeName}`,
    '',
    'export default topology',
  ].join('\n')
}

function renderJsonDefaultExport(jsonFile) {
  return [
    `import data from './${jsonFile}' with { type: 'json' }`,
    '',
    'export default data',
  ].join('\n')
}

function renderBarrel(lines, extension, typeLines = []) {
  return [
    ...lines.map((line) => line.replaceAll('{ext}', extension)),
    ...(typeLines.length > 0 ? ['', ...typeLines.map((line) => line.replaceAll('{ext}', extension))] : []),
  ].join('\n')
}

function createEntityScaleDescriptors({ rootDir, group, slug, scales, typeName }) {
  const dir = `${rootDir}/${group}/${slug}`
  return scales.map((scale) => (
    createTypedJsonWrapperDescriptor(
      `${dir}/${slug}-${scale}`,
      `${slug}-${scale}.json`,
      '../../types',
      typeName,
    )
  ))
}

function createEntityBarrelDescriptor({ rootDir, group, slug, defaultScale, scales, exportName }) {
  return createBarrelDescriptor(
    `${rootDir}/${group}/${slug}/index`,
    [
      `export { default } from './${slug}-${defaultScale}.{ext}'`,
      ...scales.map((scale) => `export { default as ${exportName}${scale} } from './${slug}-${scale}.{ext}'`),
    ],
  )
}

function createTopologyRefDescriptor(basePath, importPath, typeName, importKind = 'local') {
  return {
    basePath,
    renderSource() {
      return renderTypeDefaultDeclaration(localSpecifier(importPath, 'ts', importKind), typeName)
    },
    renderJs() {
      return 'export {}'
    },
    renderDts() {
      return renderTypeDefaultDeclaration(localSpecifier(importPath, 'js', importKind), typeName)
    },
  }
}

function createTypedJsonWrapperDescriptor(basePath, jsonFile, typeImportPath, typeName) {
  return {
    basePath,
    renderSource() {
      return [
        `import type { ${typeName} } from '${specifier(typeImportPath, 'ts')}'`,
        `import data from './${jsonFile}' with { type: 'json' }`,
        '',
        `export default data as unknown as ${typeName}`,
      ].join('\n')
    },
    renderJs() {
      return renderJsonDefaultExport(jsonFile)
    },
    renderDts() {
      return renderTypeDefaultDeclaration(specifier(typeImportPath, 'js'), typeName)
    },
  }
}

function createMetadataDescriptor(basePath, jsonFile, typeName, importPath) {
  return {
    basePath,
    renderSource() {
      return [
        `import type { ${typeName} } from '${specifier(importPath, 'ts')}'`,
        `import data from './${jsonFile}' with { type: 'json' }`,
        '',
        `export default data as ${typeName}[]`,
      ].join('\n')
    },
    renderJs() {
      return renderJsonDefaultExport(jsonFile)
    },
    renderDts() {
      return [
        `import type { ${typeName} } from '${specifier(importPath, 'js')}'`,
        '',
        `declare const data: ${typeName}[]`,
        '',
        'export default data',
      ].join('\n')
    },
  }
}

function createBarrelDescriptor(basePath, exportLines, typeExportLines = []) {
  return {
    basePath,
    renderSource() {
      return renderBarrel(exportLines, 'ts', typeExportLines)
    },
    renderJs() {
      return renderBarrel(exportLines, 'js')
    },
    renderDts() {
      return renderBarrel(exportLines, 'js', typeExportLines)
    },
  }
}

export async function loadAtlasMetadata() {
  const [countries, continents] = await Promise.all([
    readJson(filePath('src/metadata/countries.json')),
    readJson(filePath('src/metadata/continents.json')),
  ])

  return { countries, continents }
}

function createAtlasSharedDescriptors(rootDir, { countries, continents }) {
  const descriptors = [
    createMetadataDescriptor(`${rootDir}/metadata/countries`, 'countries.json', 'CountryMetadata', '../types'),
    createMetadataDescriptor(`${rootDir}/metadata/continents`, 'continents.json', 'ContinentMetadata', '../types'),
  ]

  for (const layer of WORLD_LAYERS) {
    descriptors.push(
      ...createEntityScaleDescriptors({
        rootDir,
        group: 'world',
        slug: layer.id,
        scales: SCALES,
        typeName: layer.typeName,
      }),
      createEntityBarrelDescriptor({
        rootDir,
        group: 'world',
        slug: layer.id,
        defaultScale: DEFAULT_SCALE,
        scales: SCALES,
        exportName: layer.name,
      }),
    )
  }

  for (const continent of continents) {
    descriptors.push(
      ...createEntityScaleDescriptors({
        rootDir,
        group: 'continents',
        slug: continent.slug,
        scales: continent.scales,
        typeName: 'AtlasCountryTopology',
      }),
      createEntityBarrelDescriptor({
        rootDir,
        group: 'continents',
        slug: continent.slug,
        defaultScale: continent.defaultScale,
        scales: continent.scales,
        exportName: continent.exportName,
      }),
    )
  }

  for (const country of countries) {
    descriptors.push(
      ...createEntityScaleDescriptors({
        rootDir,
        group: 'countries',
        slug: country.slug,
        scales: country.scales,
        typeName: 'AtlasCountryTopology',
      }),
      createEntityBarrelDescriptor({
        rootDir,
        group: 'countries',
        slug: country.slug,
        defaultScale: country.defaultScale,
        scales: country.scales,
        exportName: country.exportName,
      }),
    )
  }

  descriptors.push(
    createBarrelDescriptor(
      `${rootDir}/countries/index`,
      countries.map((country) => `export { default as ${country.exportName} } from './${country.slug}/index.{ext}'`),
    ),
  )

  const worldLines = WORLD_LAYERS.flatMap((layer) => [
    `export { default as ${layer.name} } from './world/${layer.id}/index.{ext}'`,
    `export { ${layer.name}10m, ${layer.name}50m, ${layer.name}110m } from './world/${layer.id}/index.{ext}'`,
  ])
  descriptors.push(
    createBarrelDescriptor(
      `${rootDir}/index`,
      [
        ...worldLines,
        ...continents.map((continent) => `export { default as ${continent.exportName} } from './continents/${continent.slug}/index.{ext}'`),
      ],
      [
        "export type { AtlasCountryTopology, AtlasFeatureProperties, AtlasScale, ContinentMetadata, CountryMetadata, Topology } from './types.{ext}'",
      ],
    ),
  )

  return descriptors
}

export function createAtlasSourceFiles(rootDir, metadata) {
  return createAtlasSharedDescriptors(rootDir, metadata).map((descriptor) => ({
    path: `${descriptor.basePath}.ts`,
    content: descriptor.renderSource(),
  }))
}

export function createAtlasPackageFiles(rootDir, metadata) {
  return [
    createTopologyRefDescriptor(`${rootDir}/_topology`, 'topojson-specification', 'Topology', 'external'),
    createTopologyRefDescriptor(`${rootDir}/_country-topology`, './types', 'AtlasCountryTopology'),
    ...createAtlasSharedDescriptors(rootDir, metadata),
  ].flatMap((descriptor) => ([
    {
      path: `${descriptor.basePath}.js`,
      content: descriptor.renderJs(),
    },
    {
      path: `${descriptor.basePath}.d.ts`,
      content: descriptor.renderDts(),
    },
  ]))
}

export async function writeAtlasSourceFiles(rootDir) {
  const metadata = await loadAtlasMetadata()
  const files = createAtlasSourceFiles(rootDir, metadata)
  await Promise.all(files.map((file) => writeText(file.path, file.content)))
  return files
}
