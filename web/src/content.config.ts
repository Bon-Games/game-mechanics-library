import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { categorySchema, mechanicSchema, sourceSchema } from "./domain/schema";

export const collections = {
  mechanics: defineCollection({
    loader: glob({ base: "./src/content/mechanics", pattern: "**/*.{md,mdx}" }),
    schema: mechanicSchema,
  }),
  categories: defineCollection({
    loader: glob({ base: "./src/content/categories", pattern: "*.json" }),
    schema: categorySchema,
  }),
  sources: defineCollection({
    loader: glob({ base: "./src/content/sources", pattern: "*.json" }),
    schema: sourceSchema,
  }),
};
