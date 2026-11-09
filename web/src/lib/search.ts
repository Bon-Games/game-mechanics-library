import type { BrowseState } from "../domain/browse";
import { withBase } from "../domain/urls";

export type SearchResult = { id: string; data: () => Promise<{ meta: { mechanic_id?: string }; url: string }> };
export type SearchResponse = { results: SearchResult[] };
export type Pagefind = {
  options: (options: { baseUrl: string; language: string }) => Promise<void>;
  search: (query: string, options: { filters: Record<string, string>; sort: Record<string, "asc"> }) => Promise<SearchResponse>;
};

export function searchOptions(state: BrowseState) {
  const filters: Record<string, string> = {};
  for (const field of ["category", "subcategory", "source", "tag"] as const) if (state[field]) filters[field] = state[field];
  return { filters, sort: { [state.sort === "category" ? "category_rank" : "name_rank"]: "asc" as const } };
}

export async function loadPagefind(base: string, attempt = 0): Promise<Pagefind> {
  const bundle = withBase(base, "pagefind/pagefind.js") + (attempt ? "?retry=" + attempt : "");
  const api = await import(/* @vite-ignore */ bundle) as Pagefind;
  await api.options({ baseUrl: withBase(base), language: "en" });
  return api;
}

export async function resolvePage(results: SearchResult[], start: number, size: number): Promise<string[]> {
  const records = await Promise.all(results.slice(start, start + size).map((result) => result.data()));
  return records.map((record) => {
    if (!record.meta.mechanic_id) throw new Error("Search result is missing its mechanic ID");
    return record.meta.mechanic_id;
  });
}
