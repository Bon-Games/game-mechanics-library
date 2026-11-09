import { strict as assert } from "node:assert";
import { test } from "node:test";
import { initialState } from "../src/domain/browse";
import { resolvePage, searchOptions } from "../src/lib/search";

test("Pagefind receives combined filters and the documented deterministic rank", () => {
  assert.deepEqual(searchOptions({ ...initialState, category: "movement", subcategory: "jumping", source: "curated-starter", tag: "air", sort: "category", lang: "vi" }), {
    filters: { category: "movement", subcategory: "jumping", source: "curated-starter", tag: "air" }, sort: { category_rank: "asc" },
  });
  assert.deepEqual(searchOptions(initialState), { filters: {}, sort: { name_rank: "asc" } });
});

test("result details resolve only for the visible page", async () => {
  const calls: number[] = [];
  const results = Array.from({ length: 763 }, (_, index) => ({ id: "opaque-" + index, data: async () => {
    calls.push(index);
    return { url: "/mechanics/item-" + index + "/", meta: { mechanic_id: "item-" + index } };
  } }));
  const ids = await resolvePage(results, 24, 12);
  assert.deepEqual(calls, Array.from({ length: 12 }, (_, index) => index + 24));
  assert.deepEqual(ids, calls.map((index) => "item-" + index));
});

test("an incompatible index fails explicitly instead of fabricating metadata results", async () => {
  await assert.rejects(resolvePage([{ id: "opaque", data: async () => ({ url: "/unknown/", meta: {} }) }], 0, 24), /mechanic ID/);
});
