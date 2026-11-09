import { readFileSync, readdirSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { parse } from "yaml";
import { categorySchema, mechanicSchema, sourceSchema, taxonomySchema } from "../domain/schema";
import { validateDocument, validateLibrary } from "../domain/validate";

// Astro relocates import.meta.url while bundling; app commands run from web/.
export const contentRoot = resolve("src/content");

export function parseDocument(raw: string, filename: string) {
  const match = raw.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(filename + ": expected YAML frontmatter");
  let data;
  try { data = mechanicSchema.parse(parse(match[1]!)); }
  catch (error) { throw new Error(filename + ": " + (error as Error).message); }
  if (basename(filename, extname(filename)) !== data.id) throw new Error(filename + ": filename must match stable ID " + data.id);
  validateDocument(data, match[2]!, filename);
  return { data, body: match[2]!, filename };
}

export function readContent(root = contentRoot) {
  const files = (directory: string, extension: RegExp) => readdirSync(join(root, directory)).filter((name) => !name.startsWith(".")).map((name) => {
    if (!extension.test(name)) throw new Error(join(directory, name) + ": unsupported content file");
    return join(root, directory, name);
  });
  const documents = files("mechanics", /\.mdx?$/).map((filename) => parseDocument(readFileSync(filename, "utf8"), filename));
  const readRegistry = <T>(directory: string, schema: { parse: (value: unknown) => T }) => files(directory, /\.json$/).map((filename) => {
    try {
      const data = schema.parse(JSON.parse(readFileSync(filename, "utf8").replace(/^\uFEFF/, "")));
      if (basename(filename, ".json") !== (data as { id: string }).id) throw new Error("filename must match stable ID");
      return data;
    } catch (error) { throw new Error(filename + ": " + (error as Error).message); }
  });
  const mechanics = documents.map(({ data }) => data);
  const categories = readRegistry("categories", categorySchema);
  const sources = readRegistry("sources", sourceSchema);
  const taxonomy = taxonomySchema.parse(JSON.parse(readFileSync(join(root, "taxonomy.json"), "utf8")));
  validateLibrary(mechanics, categories, sources, taxonomy);
  return { documents, mechanics, categories, sources, taxonomy };
}
