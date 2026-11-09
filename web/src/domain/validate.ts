import { categorySchema, mechanicSchema, sourceSchema, taxonomySchema, type Category, type Mechanic, type Source, type Taxonomy } from "./schema";

export function validateLibrary(mechanics: Mechanic[], categories: Category[], sources: Source[], taxonomy: Taxonomy = { tags: [], genres: [] }): void {
  const errors: string[] = [];
  const check = (label: string, values: unknown[], schema: { safeParse: (value: unknown) => any }) => {
    for (const [index, value] of values.entries()) {
      const result = schema.safeParse(value);
      if (!result.success) errors.push(label + " " + ((value as { id?: string })?.id ?? index) + ": " + result.error.message);
    }
  };
  check("mechanic", mechanics, mechanicSchema);
  check("category", categories, categorySchema);
  check("source", sources, sourceSchema);
  check("taxonomy", [taxonomy], taxonomySchema);
  if (errors.length) throw new Error("Content validation failed:\n" + errors.join("\n"));
  const unique = (label: string, values: { id: string }[]) => {
    const seen = new Set<string>();
    for (const value of values) {
      if (seen.has(value.id)) errors.push("Duplicate " + label + " ID: " + value.id);
      seen.add(value.id);
    }
  };
  unique("mechanic", mechanics);
  unique("category", categories);
  unique("source", sources);
  unique("subcategory", categories.flatMap((category) => category.subcategories));
  unique("tag", taxonomy.tags);
  unique("genre", taxonomy.genres);
  const mechanicById = new Map(mechanics.map((entry) => [entry.id, entry]));
  const categoryById = new Map(categories.map((entry) => [entry.id, entry]));
  const sourceById = new Map(sources.map((entry) => [entry.id, entry]));
  for (const entry of mechanics) {
    const category = categoryById.get(entry.categoryId);
    if (!category) errors.push(entry.id + ": unknown category " + entry.categoryId);
    else if (!category.subcategories.some((subcategory) => subcategory.id === entry.subcategoryId)) errors.push(entry.id + ": unknown or mismatched subcategory " + entry.subcategoryId);
    for (const field of ["tags", "genres"] as const) {
      for (const value of entry[field]) {
        if (!taxonomy[field].some((term) => term.id === value)) errors.push(entry.id + ": unknown " + field + " ID " + value);
      }
    }
    for (const relatedId of entry.relatedIds) {
      const related = mechanicById.get(relatedId);
      if (relatedId === entry.id) errors.push(entry.id + ": self relationship");
      else if (!related) errors.push(entry.id + ": unknown relationship " + relatedId);
      else if (entry.status === "published" && related.status === "draft") errors.push(entry.id + ": published entry links to draft " + relatedId);
    }
    for (const image of entry.images ?? []) {
      if (!image.src.startsWith("media/mechanics/" + entry.id + "/")) errors.push(entry.id + ": image must live under media/mechanics/" + entry.id + "/");
    }
    for (const reference of entry.sources) {
      const source = sourceById.get(reference.sourceId);
      if (!source) errors.push(entry.id + ": unknown source " + reference.sourceId);
      else if (source.usage === "reference_only") errors.push(entry.id + ": reference-only source cannot establish provenance: " + source.id);
    }
  }
  if (errors.length) throw new Error("Content validation failed:\n" + errors.join("\n"));
}

export function publishedMechanics(mechanics: Mechanic[]): Mechanic[] {
  return mechanics.filter((entry) => entry.status === "published");
}

export function validateDocument(entry: Mechanic, body: string, filename: string): void {
  const fail = (reason: string): never => { throw new Error(filename + ": " + reason); };
  if (filename.endsWith(".mdx")) fail("MDX is disabled until a reviewed component allowlist is introduced");
  if (/<\/?[A-Za-z!][^>]*>/.test(body)) fail("Raw HTML is forbidden; use portable Markdown");
  if (entry.status === "draft" && /!\[/.test(body)) fail("Draft-only assets are forbidden in copied public content");
  const decoded = body.replace(/&#(x[\da-f]+|\d+);?/gi, (_, value: string) => String.fromCodePoint(Number.parseInt(value.replace(/^x/i, ""), /^x/i.test(value) ? 16 : 10)))
    .replace(/&colon;/gi, ":").replace(/&tab;|&newline;/gi, "");
  if (/(?:javascript|vbscript|data|file)\s*:/i.test(decoded)) fail("Unsafe URL protocol");
  for (const match of decoded.matchAll(/!?\[[^\]]*\]\(\s*<?([^\s)>]+)|^\s*\[[^\]]+\]:\s*<?([^\s>]+)/gm)) {
    const url = (match[1] ?? match[2]!).replace(/\\/g, "");
    if (/^https?:\/\//i.test(url)) {
      try {
        const parsed = new URL(url);
        if (parsed.username || parsed.password) fail("URL credentials are forbidden");
      } catch { fail("Invalid external URL"); }
    } else if (!url.startsWith("#") && (!url.startsWith("/") || url.startsWith("//") || url.includes(".."))) fail("Use HTTP/HTTPS, a fragment, or a site-root path for links");
    if (entry.status === "draft" && url.startsWith("/assets/")) fail("Draft-only assets are forbidden in copied public content");
  }
  if (entry.maturity === "reviewed" && (body.trim().length < 100 || /pending research|not yet researched/i.test(body))) fail("Reviewed entries require a substantive authored definition and editorial evidence");
  if (entry.maturity === "reviewed" && !entry.sources.some((source) => source.notes && !/no fresh licence verification|pending research/i.test(source.notes))) fail("Reviewed entries require citation notes recording editorial evidence");
}
