import { z } from "zod";

export const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case ID");
const text = z.string().min(1).refine((value) => value === value.trim(), "Remove surrounding whitespace");
export const httpUrlSchema = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !url.username && !url.password && !/[\s\\]/.test(value);
  } catch { return false; }
}, "Use an absolute HTTP or HTTPS URL without credentials");
const licenseUrl = z.union([httpUrlSchema, z.literal("")]);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, "Use a real calendar date");
const ids = z.array(idSchema).refine((values) => new Set(values).size === values.length, "Remove duplicate IDs");

export const sourceSchema = z.strictObject({
  id: idSchema, title: text, url: httpUrlSchema, creator: text, license: text,
  licenseUrl, accessedAt: date,
  usage: z.enum(["starter_data", "reference_only", "imported_data"]),
  attribution: text,
});
export const citationSchema = z.strictObject({
  sourceId: idSchema, url: httpUrlSchema, creator: text, license: text, licenseUrl,
  accessedAt: date, attribution: text, modified: z.boolean(), notes: text.optional(),
});
const term = z.strictObject({ id: idSchema, title: text });
export const categorySchema = z.strictObject({
  id: idSchema, title: text, subcategories: z.array(term).min(1),
});
export const taxonomySchema = z.strictObject({ tags: z.array(term), genres: z.array(term) });
export const mechanicSchema = z.strictObject({
  id: idSchema, title: text, summary: text, categoryId: idSchema, subcategoryId: idSchema,
  status: z.enum(["draft", "published"]), maturity: z.enum(["starter", "reviewed"]),
  language: z.literal("en"), tags: ids, genres: ids,
  aliases: z.array(text), examples: z.array(text), relatedIds: ids,
  sources: z.array(citationSchema),
}).refine((value) => value.status === "draft" || value.sources.length > 0, "Published entries require a citation snapshot");

export type Mechanic = z.infer<typeof mechanicSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Taxonomy = z.infer<typeof taxonomySchema>;
export type Citation = z.infer<typeof citationSchema>;
export type MechanicCard = Pick<Mechanic, "id" | "title" | "summary" | "categoryId" | "subcategoryId" | "maturity" | "language" | "tags" | "genres" | "aliases" | "examples"> & {
  categoryTitle: string; subcategoryTitle: string; sources: { sourceId: string }[];
};
