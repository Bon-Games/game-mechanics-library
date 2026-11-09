import { youtubeVideoId, type Category, type Mechanic, type MechanicCard, type PreviewMedia } from "./schema";

/** First video wins, then first image. */
export function previewMedia(entry: Pick<Mechanic, "videos" | "images">): PreviewMedia {
  const video = entry.videos?.[0];
  const videoId = video && youtubeVideoId(video.url);
  if (video && videoId) return { kind: "video", videoId, title: video.title };
  const image = entry.images?.[0];
  return image ? { kind: "image", src: image.src, alt: image.alt } : { kind: "none" };
}

export function createCards(mechanics: Mechanic[], categories: Category[]): MechanicCard[] {
  return mechanics.filter((entry) => entry.status === "published").map((entry) => {
    const category = categories.find((category) => category.id === entry.categoryId)!;
    return {
      id: entry.id, title: entry.title, summary: entry.summary, categoryId: entry.categoryId,
      subcategoryId: entry.subcategoryId, categoryTitle: category.title,
      subcategoryTitle: category.subcategories.find((subcategory) => subcategory.id === entry.subcategoryId)!.title,
      maturity: entry.maturity, language: entry.language, tags: entry.tags, genres: entry.genres,
      aliases: entry.aliases, examples: entry.examples,
      sources: entry.sources.map(({ sourceId }) => ({ sourceId })), media: previewMedia(entry),
    };
  });
}
