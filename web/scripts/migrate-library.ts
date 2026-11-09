import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import type { Category, Mechanic, Source } from "../src/domain/schema";
import { validateLibrary } from "../src/domain/validate";

export const starterSummary = "Definition not yet researched. This entry is part of the curated starter index.";
export const starterBody = "Definition and gameplay examples are pending research. This entry preserves the original curated name and classification.";
export const asciiJson = (value: unknown, indent = 2) => JSON.stringify(value, null, indent).replace(/[\u007f-\uffff]/g, (char) => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
export const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
export const stableSlug = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const normalizedName = (value: string) => value.trim().normalize("NFKC").toLocaleLowerCase("en");

export function createMigration(seed: string, sourceJson: string) {
  const originalSources = JSON.parse(sourceJson).sources as Record<string, string>[];
  const sources: Source[] = originalSources.map(({ license_url, accessed_at, ...source }) => ({ ...source, licenseUrl: license_url!, accessedAt: accessed_at! }) as Source);
  const starter = sources.find((source) => source.id === "curated-starter");
  if (!starter) throw new Error("Missing curated-starter source");
  const { id: sourceId, title: _title, usage: _usage, ...snapshot } = starter;
  const categories: Category[] = [];
  const mechanics: Mechanic[] = [];
  const duplicates: { title: string; line: number; category: string; subcategory: string; retainedId: string }[] = [];
  const mapping: { title: string; id: string; category: string; categoryId: string; subcategory: string; subcategoryId: string }[] = [];
  const seen = new Map<string, string>();
  const identities = new Map<string, string>();
  const claim = (scope: string, label: string) => {
    const id = stableSlug(label);
    if (!id) throw new Error(scope + ": title cannot produce an ID: " + label);
    const key = scope + ":" + id;
    const previous = identities.get(key);
    if (previous && previous !== label) throw new Error("ID collision: " + previous + " and " + label + " -> " + id);
    identities.set(key, label);
    return id;
  };
  for (const [index, line] of seed.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    const parts = line.split("|");
    if (parts.length !== 3 || parts.some((part) => !part.trim())) throw new Error("Invalid legacy row " + (index + 1));
    const [categoryTitle, subcategoryTitle, names] = parts.map((part) => part.trim()) as [string, string, string];
    const categoryId = claim("category", categoryTitle);
    let category = categories.find((category) => category.id === categoryId);
    if (!category) { category = { id: categoryId, title: categoryTitle, subcategories: [] }; categories.push(category); }
    const subcategoryId = claim("subcategory", categoryId + " " + subcategoryTitle);
    if (!category.subcategories.some((subcategory) => subcategory.id === subcategoryId)) category.subcategories.push({ id: subcategoryId, title: subcategoryTitle });
    for (const title of names.split(",").map((title) => title.trim()).filter(Boolean)) {
      const key = normalizedName(title);
      const previous = seen.get(key);
      if (previous) { duplicates.push({ title, line: index + 1, category: categoryTitle, subcategory: subcategoryTitle, retainedId: previous }); continue; }
      const id = claim("mechanic", title);
      seen.set(key, id);
      mapping.push({ title, id, category: categoryTitle, categoryId, subcategory: subcategoryTitle, subcategoryId });
      mechanics.push({ id, title, summary: starterSummary, categoryId, subcategoryId, status: "published", maturity: "starter", language: "en", tags: [], genres: [], aliases: [], examples: [], relatedIds: [], sources: [{ sourceId, ...snapshot, modified: false, notes: "Migrated from the recorded starter compilation; no fresh licence verification is claimed." }] });
    }
  }
  validateLibrary(mechanics, categories, sources);
  const files = new Map<string, string>();
  for (const mechanic of mechanics) files.set("mechanics/" + mechanic.id + ".md", "---\n" + asciiJson(mechanic) + "\n---\n\n" + starterBody + "\n");
  for (const category of categories) files.set("categories/" + category.id + ".json", asciiJson(category) + "\n");
  for (const source of sources) files.set("sources/" + source.id + ".json", asciiJson(source) + "\n");
  files.set("taxonomy.json", asciiJson({ tags: [], genres: [] }) + "\n");
  return { files, mechanics, categories, sources, mapping, duplicates, collisions: [] };
}

function isOriginalScaffold(relative: string, raw: string, migration: ReturnType<typeof createMigration>, sourceJson: string): boolean {
  const id = relative.split("/").at(-1)!.replace(/\.(md|json)$/, "");
  if (relative.startsWith("mechanics/")) {
    const entry = migration.mechanics.find((entry) => entry.id === id);
    if (!entry) return false;
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match || match[2]!.trim() !== starterBody) return false;
    const category = migration.categories.find((category) => category.id === entry.categoryId)!;
    const expected = { id, title: entry.title, summary: starterSummary, category: entry.categoryId, subcategory: category.subcategories.find((subcategory) => subcategory.id === entry.subcategoryId)!.title, status: "published", maturity: "starter", tags: [], genres: [], aliases: [], examples: [], related: [], sources: [{ sourceId: "curated-starter" }] };
    return asciiJson(parse(match[1]!)) === asciiJson(expected);
  }
  if (relative.startsWith("sources/")) return asciiJson(JSON.parse(raw)) === asciiJson(JSON.parse(sourceJson).sources.find((source: { id: string }) => source.id === id));
  if (relative.startsWith("categories/")) {
    const category = migration.categories.find((category) => category.id === id);
    return !!category && asciiJson(JSON.parse(raw)) === asciiJson({ id, title: category.title, subcategories: category.subcategories.map(({ title }) => title).sort() });
  }
  return false;
}

export function runMigration(root: string, fixtures: string, adoptScaffold = false) {
  const seedBytes = readFileSync(join(fixtures, "mechanics.txt"));
  const sourceBytes = readFileSync(join(fixtures, "sources.json"));
  if (hash(seedBytes) !== "9c5b5d51839144ba300cd8063c9e12d373210f27210794e6178a749636a4138f" || hash(sourceBytes) !== "07add6296f00e9752cc247b2edbeb91b7244ce5f31a47d068ebaae9d3768f488") throw new Error("Frozen legacy fixtures changed; migration refused");
  const migration = createMigration(seedBytes.toString("utf8"), sourceBytes.toString("utf8"));
  const manifestPath = join(fixtures, "migration-map.json");
  if (adoptScaffold && existsSync(manifestPath)) throw new Error("Scaffold adoption is permitted only before the migration map exists");
  for (const directory of ["mechanics", "categories", "sources"]) {
    if (!existsSync(join(root, directory))) continue;
    for (const name of readdirSync(join(root, directory))) {
      if (name.startsWith(".")) continue;
      if (!migration.files.has(directory + "/" + name)) throw new Error("Unexpected canonical file; migration refused: " + directory + "/" + name);
    }
  }
  for (const [relative, expected] of migration.files) {
    const path = join(root, relative);
    if (!existsSync(path)) continue;
    const actual = readFileSync(path, "utf8");
    if (actual !== expected && !(adoptScaffold && isOriginalScaffold(relative, actual, migration, sourceBytes.toString("utf8")))) throw new Error("Edited canonical file; migration refused: " + relative);
  }
  const manifest = asciiJson({ version: 1, mechanicsSha256: hash(seedBytes), sourcesSha256: hash(sourceBytes), mapping: migration.mapping, duplicates: migration.duplicates, collisions: migration.collisions, files: Object.fromEntries([...migration.files].map(([path, contents]) => [path, hash(contents)])) }) + "\n";
  if (existsSync(manifestPath) && readFileSync(manifestPath, "utf8") !== manifest) throw new Error("Stable identity map changed; migration refused");
  for (const [relative, contents] of migration.files) {
    const path = join(root, relative);
    mkdirSync(dirname(path), { recursive: true });
    if (!existsSync(path) || readFileSync(path, "utf8") !== contents) writeFileSync(path, contents, "utf8");
  }
  if (!existsSync(manifestPath)) writeFileSync(manifestPath, manifest, "utf8");
  return migration;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const migration = runMigration(fileURLToPath(new URL("../src/content/", import.meta.url)), fileURLToPath(new URL("../tests/fixtures/legacy/", import.meta.url)), process.argv.includes("--adopt-scaffold"));
  console.log("[OK] Migration verified: " + migration.mechanics.length + " mechanics, " + migration.categories.length + " categories, " + migration.sources.length + " sources; " + migration.duplicates.length + " duplicate names, no ID collisions.");
}
