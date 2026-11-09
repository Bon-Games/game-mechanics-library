import { getCollection } from "astro:content";
import { createCards } from "../domain/library";
import { readContent } from "./read-content";

export async function loadLibrary() {
  const validated = readContent();
  const allMechanics = await getCollection("mechanics");
  const mechanics = allMechanics.filter((entry) => entry.data.status === "published")
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "en") || a.data.id.localeCompare(b.data.id, "en"));
  const categories = validated.categories.sort((a, b) => a.title.localeCompare(b.title, "en"));
  const sources = validated.sources;
  const cards = createCards(mechanics.map(({ data }) => data), categories);
  return { mechanics, categories, sources, cards, taxonomy: validated.taxonomy };
}
