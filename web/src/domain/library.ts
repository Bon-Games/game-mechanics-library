import type { Category, Mechanic, MechanicCard } from "./schema";

export function createCards(mechanics: Mechanic[], categories: Category[]): MechanicCard[] {
  return mechanics.filter((entry) => entry.status === "published").map((entry) => {
    const category = categories.find((category) => category.id === entry.categoryId)!;
    return {
      id: entry.id, title: entry.title, summary: entry.summary, categoryId: entry.categoryId,
      subcategoryId: entry.subcategoryId, categoryTitle: category.title,
      subcategoryTitle: category.subcategories.find((subcategory) => subcategory.id === entry.subcategoryId)!.title,
      maturity: entry.maturity, language: entry.language, tags: entry.tags, genres: entry.genres,
      aliases: entry.aliases, examples: entry.examples,
      sources: entry.sources.map(({ sourceId }) => ({ sourceId })),
    };
  });
}
