import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileUrl, readJson } from "./utils.mjs";

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(path, files);
      continue;
    }

    files.push(path);
  }

  return files;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const srcDir = fileUrl("src").pathname;
const files = await walk(srcDir);
const topologyFiles = files.filter((file) => file.endsWith(".json") && !file.includes("/metadata/"));

for (const file of topologyFiles) {
  const value = JSON.parse(await readFile(file, "utf8"));

  assert(value.type === "Topology", `${file}: expected type=Topology`);
  assert(value.objects && typeof value.objects === "object", `${file}: missing objects`);
  assert(value.objects.features, `${file}: missing objects.features`);
  assert(Array.isArray(value.arcs), `${file}: missing arcs`);
  assert(Array.isArray(value.bbox), `${file}: missing bbox`);
}

const countries = await readJson(fileUrl("src/metadata/countries.json").pathname);
const countryExports = await readFile(fileUrl("src/countries.ts").pathname, "utf8");

for (const country of countries) {
  assert(countryExports.includes(`as ${country.exportName}`), `missing country export: ${country.exportName}`);
}

console.log(`Validated ${topologyFiles.length} TopoJSON files and ${countries.length} country exports.`);
