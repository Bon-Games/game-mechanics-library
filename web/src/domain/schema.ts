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
export function youtubeVideoId(value: string): string | undefined {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(?:www|m)\./, "");
    const id = host === "youtu.be" ? url.pathname.slice(1) : host === "youtube.com" && url.pathname === "/watch" ? url.searchParams.get("v") : null;
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
  } catch { return undefined; }
}
const videoSchema = z.strictObject({
  title: text, creator: text,
  url: httpUrlSchema.refine((value) => youtubeVideoId(value) !== undefined, "Use a YouTube watch or youtu.be URL"),
});
// Local files only, so licence and availability stay under repository control.
const mediaPath = z.string().regex(/^media\/mechanics\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9._-]+\.(?:avif|gif|jpe?g|png|webp)$/, "Use media/mechanics/<id>/<file> with an image extension");
const imageSchema = z.strictObject({ src: mediaPath, alt: text, credit: text, license: text, sourceUrl: httpUrlSchema });
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
  videos: z.array(videoSchema).optional(),
  images: z.array(imageSchema).optional(),
  sources: z.array(citationSchema),
}).refine((value) => value.status === "draft" || value.sources.length > 0, "Published entries require a citation snapshot");

export type Mechanic = z.infer<typeof mechanicSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Taxonomy = z.infer<typeof taxonomySchema>;
export type Citation = z.infer<typeof citationSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Image = z.infer<typeof imageSchema>;
export type PreviewMedia = { kind: "video"; videoId: string; title: string } | { kind: "image"; src: string; alt: string } | { kind: "none" };
export type MechanicCard = Pick<Mechanic, "id" | "title" | "summary" | "categoryId" | "subcategoryId" | "maturity" | "language" | "tags" | "genres" | "aliases" | "examples"> & {
  categoryTitle: string; subcategoryTitle: string; sources: { sourceId: string }[]; media: PreviewMedia;
};

export const STARTER_SUMMARY = "Definition not yet researched. This entry is part of the curated starter index.";
export function hasOwnSummary(entry: Pick<Mechanic, "summary" | "maturity">): boolean {
  return entry.maturity === "reviewed" || entry.summary !== STARTER_SUMMARY;
}
