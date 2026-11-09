import type { Category, MechanicCard } from "./schema";

export type BrowseState = {
  category: string;
  subcategory: string;
  source: string;
  tag: string;
  query: string;
  sort: "name" | "category";
  view: "grid" | "list";
  page: number;
  lang: "en" | "vi";
};
export type BrowseCatalogue = { categories: Category[]; cards: MechanicCard[] };
export const initialState: BrowseState = {
  category: "", subcategory: "", source: "", tag: "", query: "", sort: "name", view: "grid", page: 1, lang: "en",
};
const validId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const englishOrder = new Intl.Collator("en", { sensitivity: "variant", numeric: false });
const labelKey = (value: string) => value.trim().normalize("NFKC").toLocaleLowerCase("en");

export function normalizeState(state: BrowseState, catalogue?: BrowseCatalogue): BrowseState {
  const next = { ...state };
  if (catalogue) {
    const category = catalogue.categories.find((entry) => [entry.id, entry.title].some((value) => labelKey(value) === labelKey(next.category)));
    next.category = category?.id || "";
    const candidates = catalogue.categories.flatMap((entry) => entry.subcategories.map((sub) => ({ ...sub, categoryId: entry.id })))
      .filter((sub) => (!next.category || sub.categoryId === next.category) && [sub.id, sub.title].some((value) => labelKey(value) === labelKey(next.subcategory)));
    next.subcategory = candidates.length === 1 ? candidates[0]!.id : "";
    if (!catalogue.cards.some((entry) => entry.sources.some((source) => source.sourceId === next.source))) next.source = "";
    if (!catalogue.cards.some((entry) => entry.tags.includes(next.tag))) next.tag = "";
  } else {
    for (const field of ["category", "subcategory", "source", "tag"] as const) if (!validId.test(next[field])) next[field] = "";
  }
  next.page = Number.isSafeInteger(next.page) && next.page > 0 ? next.page : 1;
  return next;
}

export function readState(search: string, catalogue?: BrowseCatalogue): BrowseState {
  const params = new URLSearchParams(search);
  const rawPage = params.get("page") || "1";
  return normalizeState({
    category: params.get("category") || "", subcategory: params.get("subcategory") || "",
    source: params.get("source") || "", tag: params.get("tag") || "", query: (params.get("q") || "").trim(),
    sort: params.get("sort") === "category" ? "category" : "name",
    view: params.get("view") === "list" ? "list" : "grid",
    lang: params.get("lang") === "vi" ? "vi" : "en",
    page: /^[1-9][0-9]*$/.test(rawPage) ? Number(rawPage) : 1,
  }, catalogue);
}

export function stateParams(state: BrowseState): string {
  const params = new URLSearchParams();
  const values = { category: state.category, subcategory: state.subcategory, source: state.source, tag: state.tag, q: state.query,
    sort: state.sort === "name" ? "" : state.sort, view: state.view === "grid" ? "" : state.view,
    lang: state.lang === "en" ? "" : state.lang, page: state.page > 1 ? String(state.page) : "" };
  for (const [key, value] of Object.entries(values)) if (value) params.set(key, value);
  return params.toString();
}

export function transitionState(state: BrowseState, patch: Partial<BrowseState>, catalogue?: BrowseCatalogue): BrowseState {
  const next = { ...state, ...patch };
  if (!Object.hasOwn(patch, "page") && Object.keys(patch).some((key) => key !== "lang")) next.page = 1;
  if (Object.hasOwn(patch, "category") && next.category && catalogue && !catalogue.categories.find((entry) => entry.id === next.category)?.subcategories.some((sub) => sub.id === next.subcategory)) next.subcategory = "";
  return normalizeState(next, catalogue);
}

export function rankCards(cards: MechanicCard[], sort: BrowseState["sort"]): MechanicCard[] {
  return [...cards].sort((a, b) => (sort === "category" ? englishOrder.compare(a.categoryTitle, b.categoryTitle) : 0) || englishOrder.compare(a.title, b.title) || englishOrder.compare(a.id, b.id));
}

export function filterCards(cards: MechanicCard[], state: BrowseState): MechanicCard[] {
  return rankCards(cards.filter((entry) =>
    (!state.category || entry.categoryId === state.category) &&
    (!state.subcategory || entry.subcategoryId === state.subcategory) &&
    (!state.source || entry.sources.some((source) => source.sourceId === state.source)) &&
    (!state.tag || entry.tags.includes(state.tag)),
  ), state.sort);
}

export function pageCount(count: number, size: number): number { return Math.max(1, Math.ceil(count / size)); }
export function clampPage(page: number, count: number, size: number): number { return Math.min(Math.max(1, page), pageCount(count, size)); }
export function resizedPage(page: number, oldSize: number, newSize: number): number { return Math.floor((page - 1) * oldSize / newSize) + 1; }
export function pageNumbers(page: number, pages: number): number[] {
  return [...new Set([1, page - 1, page, page + 1, pages])].filter((number) => number > 0 && number <= pages).sort((a, b) => a - b);
}
