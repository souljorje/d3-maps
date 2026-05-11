import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { SCALES, fileUrl, pascalCase, readJson, writeJson } from "./utils.mjs";
import { writeFile } from "node:fs/promises";

async function write(path, content) {
  await writeFile(path, `${content.trim()}\n`, "utf8");
}

function wrapperContent(jsonFile) {
  return `
import type { Topology } from "topojson-specification";
import data from "./${jsonFile}" with { type: "json" };

export default data as Topology;
`;
}

function indexContent(baseName, exportName) {
  const lines = [
    `export { default } from "./${baseName}-110m";`,
    "",
    `export { default as ${exportName}110m } from "./${baseName}-110m";`,
    `export { default as ${exportName}50m } from "./${baseName}-50m";`,
    `export { default as ${exportName}10m } from "./${baseName}-10m";`
  ];

  return lines.join("\n");
}

async function generateWorldCountries() {
  const dir = fileUrl("src/world/countries").pathname;

  for (const scale of SCALES) {
    await write(
      join(dir, `countries-${scale}.ts`),
      wrapperContent(`countries-${scale}.json`)
    );
  }

  await write(
    join(dir, "index.ts"),
    [
      'export { default } from "./countries-110m";',
      "",
      'export { default as Countries110m } from "./countries-110m";',
      'export { default as Countries50m } from "./countries-50m";',
      'export { default as Countries10m } from "./countries-10m";'
    ].join("\n")
  );
}

async function generateEntityWrappers(root, metadataPath, exportNameBySlug) {
  const entities = await readJson(metadataPath);

  for (const entity of entities) {
    const slug = entity.slug;
    const exportName = exportNameBySlug(entity);
    const dir = join(root, slug);

    for (const scale of SCALES) {
      await write(
        join(dir, `${slug}-${scale}.ts`),
        wrapperContent(`${slug}-${scale}.json`)
      );
    }

    await write(join(dir, "index.ts"), indexContent(slug, exportName));
  }
}

await generateWorldCountries();

await generateEntityWrappers(
  fileUrl("src/countries").pathname,
  fileUrl("src/metadata/countries.json").pathname,
  (country) => country.exportName
);

await generateEntityWrappers(
  fileUrl("src/continents").pathname,
  fileUrl("src/metadata/continents.json").pathname,
  (continent) => continent.exportName
);
