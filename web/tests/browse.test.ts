import { strict as assert } from "node:assert";
import { test } from "node:test";
import { clampPage, filterCards, initialState, pageNumbers, rankCards, readState, resizedPage, stateParams, transitionState } from "../src/domain/browse";
import { withBase } from "../src/domain/urls";
import type { Category, MechanicCard } from "../src/domain/schema";

const categories: Category[] = [
  { id: "movement", title: "Movement & Traversal", subcategories: [{ id: "jumping", title: "Jumping & Aerial" }] },
  { id: "combat", title: "Combat", subcategories: [{ id: "attacks", title: "Attacks" }] },
];
const card: MechanicCard = {
  id: "double-jump", title: "Double Jump", summary: "Jump again while airborne.",
  categoryId: "movement", categoryTitle: "Movement & Traversal", subcategoryId: "jumping", subcategoryTitle: "Jumping & Aerial",
  maturity: "reviewed", language: "en", tags: ["air"], genres: ["platformer"], aliases: ["Air Jump"], examples: ["Example Game"],
  sources: [{ sourceId: "curated-starter" }],
};
const catalogue = { categories, cards: [card] };

test("shared URLs restore every supported dimension", () => {
  const state = { ...initialState, category: "movement", subcategory: "jumping", query: "air jump", tag: "air",
    source: "curated-starter", page: 3, lang: "vi" as const, sort: "category" as const, view: "list" as const };
  assert.deepEqual(readState("?" + stateParams(state), catalogue), state);
});

test("exact legacy labels normalize through category-owned ID mappings", () => {
  const state = readState("?category=Movement+%26+Traversal&subcategory=Jumping+%26+Aerial", catalogue);
  assert.equal(state.category, "movement");
  assert.equal(state.subcategory, "jumping");
  assert.match(stateParams(state), /category=movement&subcategory=jumping/);
});

test("invalid IDs, unknown values, incompatible taxonomy and malformed pages recover safely", () => {
  for (const page of ["-1", "NaN", "1.5", "Infinity", "9007199254740992", "2abc", "1e2", "01", "0", ""]) {
    assert.equal(readState("?page=" + page).page, 1);
  }
  const state = readState("?category=combat&subcategory=jumping&source=reference-only&tag=unknown&view=unknown&lang=unknown", catalogue);
  assert.deepEqual(state, { ...initialState, category: "combat" });
  assert.equal(readState("?category=../../etc").category, "");
  assert.equal(readState("?category=made-up", catalogue).category, "");
});

test("all populated filter dimensions match the same record with AND semantics", () => {
  const other = { ...card, id: "sword", title: "Sword", categoryId: "combat", categoryTitle: "Combat", subcategoryId: "attacks", tags: ["air"], sources: [{ sourceId: "other" }] };
  const records = [card, other];
  const state = { ...initialState, category: "movement", subcategory: "jumping", source: "curated-starter", tag: "air" };
  assert.deepEqual(filterCards(records, state).map((entry) => entry.id), ["double-jump"]);
  assert.equal(filterCards(records, { ...state, source: "other" }).length, 0);
  assert.equal(filterCards(records, { ...state, tag: "ground" }).length, 0);
});

test("metadata browsing never pretends to implement full-text search", () => {
  assert.equal(filterCards([card], { ...initialState, query: "body-only-term" }).length, 1);
});

test("English sorting has deterministic title and immutable ID tie breakers", () => {
  const records = [
    { ...card, id: "z", title: "Same", categoryTitle: "Alpha" },
    { ...card, id: "a", title: "Same", categoryTitle: "Alpha" },
    { ...card, id: "b", title: "Before", categoryTitle: "Zebra" },
  ];
  assert.deepEqual(rankCards(records, "name").map((entry) => entry.id), ["b", "a", "z"]);
  assert.deepEqual(rankCards(records, "category").map((entry) => entry.id), ["a", "z", "b"]);
  assert.equal(records[0]!.id, "z");
});

test("language preserves page; view/query/sort/filter changes reset it", () => {
  const state = { ...initialState, page: 5, category: "movement", subcategory: "jumping" };
  assert.equal(transitionState(state, { lang: "vi" }, catalogue).page, 5);
  for (const patch of [{ view: "list" as const }, { query: "jump" }, { sort: "category" as const }, { tag: "air" }]) {
    assert.equal(transitionState(state, patch, catalogue).page, 1);
  }
  assert.equal(transitionState(state, { category: "combat" }, catalogue).subcategory, "");
  assert.equal(transitionState(state, { category: "movement" }, catalogue).subcategory, "jumping");
  assert.equal(transitionState(state, { category: "" }, catalogue).subcategory, "jumping");
  assert.equal(transitionState(state, { page: 2 }, catalogue).page, 2);
});

test("clear filters, clear search, and reset preserve their independent dimensions", () => {
  const state = { ...initialState, category: "movement", subcategory: "jumping", source: "curated-starter", tag: "air", query: "jump", sort: "category" as const, view: "list" as const, lang: "vi" as const, page: 3 };
  const cleared = transitionState(state, { category: "", subcategory: "", source: "", tag: "" }, catalogue);
  assert.deepEqual(cleared, { ...state, category: "", subcategory: "", source: "", tag: "", page: 1 });
  assert.deepEqual(transitionState(state, { query: "" }, catalogue), { ...state, query: "", page: 1 });
  assert.deepEqual(transitionState(state, { ...initialState, view: state.view, lang: state.lang }, catalogue), { ...initialState, view: "list", lang: "vi" });
});

test("resize includes the former first item and clamps only against known results", () => {
  assert.equal(resizedPage(3, 24, 12), 5);
  assert.equal(resizedPage(4, 12, 24), 2);
  assert.equal(clampPage(99, 763, 12), 64);
  assert.equal(clampPage(99, 763, 24), 32);
  assert.equal(clampPage(99, 0, 24), 1);
  assert.deepEqual(pageNumbers(4, 10), [1, 3, 4, 5, 10]);
});

test("routes and search bundles respect root and project-subpath hosting", () => {
  assert.equal(withBase("/"), "/");
  assert.equal(withBase("/library/"), "/library/");
  assert.equal(withBase("/library/", "mechanics/double-jump"), "/library/mechanics/double-jump/");
  assert.equal(withBase("/library", "pagefind/pagefind.js"), "/library/pagefind/pagefind.js");
});
