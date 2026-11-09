import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, MechanicCard as Card, Source } from "../domain/schema";
import { clampPage, filterCards, initialState, pageCount, pageNumbers, readState, resizedPage, stateParams, transitionState, type BrowseState } from "../domain/browse";
import translations from "../domain/translations.json";
import { withBase } from "../domain/urls";
import { loadPagefind, resolvePage, searchOptions, type Pagefind } from "../lib/search";
import MechanicCard from "./MechanicCard";
import MechanicPreview from "./MechanicPreview";

type Props = { cards: Card[]; categories: Category[]; sources: Source[]; base: string };
type CompletedSearch = { cards: Card[]; count: number; page: number; size: number; key: string };

export default function LibraryBrowser({ cards, categories, sources, base }: Props) {
  const catalogue = useMemo(() => ({ cards, categories }), [cards, categories]);
  const [state, setState] = useState<BrowseState>(initialState);
  const stateRef = useRef(state);
  const [draft, setDraft] = useState("");
  const draftRef = useRef("");
  const composing = useRef(false);
  const [isComposing, setIsComposing] = useState(false);
  const [size, setSize] = useState(24);
  const sizeRef = useRef(24);
  const [hydrated, setHydrated] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchStatus, setSearchStatus] = useState<"ready" | "loading" | "error">("ready");
  const [completed, setCompleted] = useState<CompletedSearch | null>(null);
  const [retry, setRetry] = useState(0);
  const [preview, setPreview] = useState<Card | null>(null);
  const previewTrigger = useRef<HTMLButtonElement | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const focusPagination = useRef(false);
  const request = useRef(0);
  const pagefind = useRef<Promise<Pagefind> | null>(null);
  const loadAttempt = useRef(0);
  const labels = translations[state.lang];
  const categoriesHref = withBase(base, "categories") + (state.lang === "vi" ? "?lang=vi" : "");

  function writeState(next: BrowseState, replace = false) {
    stateRef.current = next;
    setState(next);
    const params = stateParams(next);
    const target = window.location.pathname + (params ? "?" + params : "") + window.location.hash;
    if (target !== window.location.pathname + window.location.search + window.location.hash) {
      window.history[replace ? "replaceState" : "pushState"]({}, "", target);
    }
  }

  function update(patch: Partial<BrowseState>, replace = false) {
    const next = transitionState(stateRef.current, patch, catalogue);
    if (stateParams(next) !== stateParams(stateRef.current)) request.current++;
    writeState(next, replace);
  }

  function settleQuery(value = draftRef.current) {
    const query = value.trim();
    draftRef.current = value;
    if (query !== stateRef.current.query) update({ query });
  }

  function changeFilter(patch: Partial<BrowseState>) {
    update({ ...patch, query: draftRef.current.trim() });
  }

  function clearSearch() {
    setDraft("");
    draftRef.current = "";
    update({ query: "" });
    searchInput.current?.focus();
  }

  useEffect(() => {
    const restore = () => {
      focusPagination.current = false;
      const restored = readState(window.location.search, catalogue);
      const fields = ["query", "category", "subcategory", "source", "tag", "sort", "view", "page"] as const;
      if (fields.some((field) => restored[field] !== stateRef.current[field]) || draftRef.current.trim() !== restored.query || composing.current) request.current++;
      composing.current = false;
      setIsComposing(false);
      setDraft(restored.query);
      draftRef.current = restored.query;
      writeState(restored, true);
      if (restored.subcategory || restored.source || restored.tag) setFiltersOpen(true);
    };
    sizeRef.current = window.matchMedia("(min-width:900px)").matches ? 24 : 12;
    setSize(sizeRef.current);
    setFiltersOpen(window.matchMedia("(min-width:1024px)").matches);
    restore();
    setHydrated(true);
    window.addEventListener("popstate", restore);
    const media = window.matchMedia("(min-width:900px)");
    const resize = () => {
      request.current++;
      const nextSize = media.matches ? 24 : 12;
      const nextPage = resizedPage(stateRef.current.page, sizeRef.current, nextSize);
      sizeRef.current = nextSize;
      setSize(nextSize);
      writeState({ ...stateRef.current, page: nextPage }, true);
    };
    media.addEventListener("change", resize);
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !target?.closest("input, select, textarea, [contenteditable]:not([contenteditable='false'])") && !document.querySelector("dialog[open], [aria-modal='true']")) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    const language = (event: Event) => {
      const lang = (event as CustomEvent<{ lang: string }>).detail?.lang;
      if (lang === "en" || lang === "vi") {
        const next: BrowseState = { ...stateRef.current, lang };
        writeState(next);
      }
    };
    window.addEventListener("library-language-request", language);
    document.addEventListener("keydown", shortcut);
    return () => {
      request.current++;
      window.removeEventListener("popstate", restore);
      window.removeEventListener("library-language-request", language);
      media.removeEventListener("change", resize);
      document.removeEventListener("keydown", shortcut);
    };
  }, [catalogue]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = state.lang;
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n as keyof typeof labels;
      if (labels[key]) element.textContent = labels[key];
    });
    window.dispatchEvent(new CustomEvent("library-language", { detail: { lang: state.lang } }));
  }, [state.lang, hydrated, labels]);

  useEffect(() => {
    if (!hydrated || isComposing || draft.trim() === state.query) return;
    const timer = window.setTimeout(() => settleQuery(draft), 300);
    return () => window.clearTimeout(timer);
  }, [draft, state.query, hydrated, isComposing]);

  const filtered = useMemo(() => filterCards(cards, state), [cards, state.category, state.subcategory, state.source, state.tag, state.sort]);
  const browsePage = clampPage(state.page, filtered.length, size);
  const searchKey = JSON.stringify([state.query, state.category, state.subcategory, state.source, state.tag, state.sort, state.view, state.page, size, retry, draft.trim(), isComposing]);

  useEffect(() => {
    if (!hydrated) return;
    const token = ++request.current;
    if (draft.trim() !== state.query || isComposing) {
      setSearchStatus("loading");
      return;
    }
    if (!state.query) {
      setSearchStatus("ready");
      if (state.page !== browsePage) writeState({ ...stateRef.current, page: browsePage }, true);
      return;
    }
    setSearchStatus("loading");
    const requested = { ...state };
    let active = true;
    void (async () => {
      try {
        pagefind.current ??= loadPagefind(base, loadAttempt.current++);
        const api = await pagefind.current;
        const response = await api.search(requested.query, searchOptions(requested));
        if (!active || token !== request.current) return;
        const page = clampPage(requested.page, response.results.length, size);
        const ids = await resolvePage(response.results, (page - 1) * size, size);
        if (!active || token !== request.current) return;
        const byId = new Map(cards.map((card) => [card.id, card]));
        const visible = ids.map((id) => {
          const entry = byId.get(id);
          if (!entry) throw new Error("Search index and catalogue do not match");
          return entry;
        });
        setCompleted({ cards: visible, count: response.results.length, page, size, key: searchKey });
        setSearchStatus("ready");
        if (requested.page !== page) writeState({ ...stateRef.current, page }, true);
      } catch {
        if (!active || token !== request.current) return;
        pagefind.current = null;
        setSearchStatus("error");
      }
    })();
    return () => { active = false; };
  }, [searchKey, hydrated, base, cards, browsePage]);

  const pendingDraft = draft.trim() !== state.query || isComposing;
  const pending = pendingDraft || (!!state.query && (searchStatus === "loading" || (searchStatus !== "error" && completed?.key !== searchKey)));
  const failed = !!state.query && searchStatus === "error" && !pendingDraft;
  const snapshot = state.query ? completed : null;
  const visible = snapshot?.cards || (!state.query ? filtered.slice((browsePage - 1) * size, browsePage * size) : []);
  const count = state.query ? snapshot?.count ?? 0 : filtered.length;
  const page = state.query ? snapshot?.page ?? 1 : browsePage;
  const shownSize = snapshot?.size || size;
  const pages = pageCount(count, shownSize);
  const ready = !pending && !failed;

  useEffect(() => {
    if (ready && focusPagination.current) {
      focusPagination.current = false;
      resultsHeading.current?.focus();
      resultsHeading.current?.scrollIntoView({ block: "start" });
    }
  }, [ready, page]);

  const subcategories = categories.filter((category) => !state.category || category.id === state.category)
    .flatMap((category) => category.subcategories.map((sub) => ({ ...sub, categoryTitle: category.title })));
  const usedSources = sources.filter((source) => cards.some((entry) => entry.sources.some((ref) => ref.sourceId === source.id)));
  const tags = [...new Set(cards.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b, "en"));
  const activeFilters = [
    { key: "category" as const, value: state.category, title: categories.find((entry) => entry.id === state.category)?.title },
    { key: "subcategory" as const, value: state.subcategory, title: categories.flatMap((entry) => entry.subcategories).find((entry) => entry.id === state.subcategory)?.title },
    { key: "source" as const, value: state.source, title: sources.find((entry) => entry.id === state.source)?.title },
    { key: "tag" as const, value: state.tag, title: state.tag },
  ].filter((filter) => filter.value);
  const clearFilters = () => changeFilter({ category: "", subcategory: "", source: "", tag: "" });
  const reset = () => {
    setDraft("");
    draftRef.current = "";
    update({ ...initialState, view: state.view, lang: state.lang });
  };
  const openPreview = (entry: Card, trigger: HTMLButtonElement) => {
    previewTrigger.current = trigger;
    setPreview(entry);
  };
  const closePreview = () => {
    setPreview(null);
    previewTrigger.current?.focus();
  };
  const goPage = (number: number) => {
    focusPagination.current = true;
    update({ page: clampPage(number, count, size) });
  };

  return (
    <section data-library-browser data-hydrated={hydrated ? "true" : "false"} className="directory-section" id="library" aria-labelledby="library-title">
      <div className="directory-heading"><h2 id="library-title">{labels.entriesTitle}</h2><a className="text-link" href={categoriesHref}>{labels.seeCategories}</a></div>
      <form className="library-search" role="search" onSubmit={(event) => { event.preventDefault(); if (!composing.current) settleQuery(); }}>
        <label htmlFor="search">{labels.searchLabel}</label>
        <div className="search-box">
          <input ref={searchInput} id="search" type="search" placeholder={labels.searchPlaceholder} aria-describedby="search-hint" value={draft}
            onChange={(event) => { if (event.target.value.trim() !== draftRef.current.trim()) request.current++; draftRef.current = event.target.value; setDraft(event.target.value); }}
            onCompositionStart={() => { composing.current = true; setIsComposing(true); request.current++; }}
            onCompositionEnd={(event) => { composing.current = false; setIsComposing(false); draftRef.current = event.currentTarget.value; setDraft(event.currentTarget.value); }} />
          <kbd className="search-hotkey" aria-hidden="true">/</kbd>
          {draft && <button type="button" className="clear-search" onClick={clearSearch}>{labels.clearSearch}</button>}
        </div>
        <p className="search-hint" id="search-hint">{labels.searchHint}</p>
      </form>
      <div className="library-toolbar">
        <label className="category-filter">{labels.category}<select id="category-filter" value={state.category} onChange={(event) => changeFilter({ category: event.target.value })}>
          <option value="">{labels.allCategories}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
        </select></label>
        <button className="toolbar-button" type="button" aria-controls="filter-panel" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}>{labels.filters} ({activeFilters.length})</button>
        <div className="view-switch" role="group" aria-label={labels.displayStyle}>
          <button type="button" aria-pressed={state.view === "grid"} onClick={() => changeFilter({ view: "grid" })}>{labels.grid}</button>
          <button type="button" aria-pressed={state.view === "list"} onClick={() => changeFilter({ view: "list" })}>{labels.list}</button>
        </div>
      </div>
      <div id="filter-panel" className="filter-panel" hidden={!filtersOpen}>
        <label>{labels.subcategory}<select id="subcategory-filter" value={state.subcategory} onChange={(event) => changeFilter({ subcategory: event.target.value })}>
          <option value="">{labels.allSubs}</option>{subcategories.map((sub) => <option key={sub.id} value={sub.id}>{state.category ? sub.title : sub.categoryTitle + " / " + sub.title}</option>)}
        </select></label>
        <label>{labels.source}<select id="source-filter" value={state.source} onChange={(event) => changeFilter({ source: event.target.value })}>
          <option value="">{labels.allSources}</option>{usedSources.map((source) => <option key={source.id} value={source.id}>{source.title}</option>)}
        </select></label>
        {!!tags.length && <label>{labels.tag}<select id="tag-filter" value={state.tag} onChange={(event) => changeFilter({ tag: event.target.value })}>
          <option value="">{labels.allTags}</option>{tags.map((tag) => <option key={tag}>{tag}</option>)}
        </select></label>}
      </div>
      {!!activeFilters.length && <div className="active-filters" aria-label={labels.activeFilters}>
        {activeFilters.map((filter) => <button key={filter.key} type="button" onClick={() => changeFilter({ [filter.key]: "" })} aria-label={labels.removeFilter + ": " + filter.title}>{filter.title}<span aria-hidden="true"> x</span></button>)}
        <button type="button" className="text-button" onClick={clearFilters}>{labels.clearFilters}</button>
      </div>}
      <div className="result-heading">
        <h3 id="results-heading" ref={resultsHeading} tabIndex={-1}>{categories.find((category) => category.id === state.category)?.title || labels.all}</h3>
        <label>{labels.sort}<select id="sort-filter" value={state.sort} onChange={(event) => changeFilter({ sort: event.target.value === "category" ? "category" : "name" })}>
          <option value="name">{labels.sortName}</option><option value="category">{labels.sortCategory}</option>
        </select></label>
      </div>
      <p className="search-status" role="status" aria-live="polite" aria-atomic="true">
        {pending ? labels.updating : failed ? labels.searchError : count + " " + labels.results}
        {(pending || failed) && visible.length > 0 && " " + labels.retainedResults}
      </p>
      {failed && <div className="search-recovery"><button type="button" className="toolbar-button" onClick={() => { pagefind.current = null; setSearchStatus("loading"); setRetry((value) => value + 1); }}>{labels.retry}</button><a href={categoriesHref}>{labels.seeCategories}</a></div>}
      <div id="cards" className={"mechanics-grid" + (state.view === "list" ? " list-view" : "")} aria-busy={pending} aria-describedby="search-result-context" lang="en">
        {visible.map((entry) => <MechanicCard key={entry.id} entry={entry} base={base} missing={labels.missing} reviewed={labels.reviewed} interfaceLang={state.lang} previewLabel={labels.preview} onPreview={hydrated ? openPreview : undefined} />)}
      </div>
      <p id="search-result-context" className="sr-only">{(pending || failed) && visible.length ? labels.retainedResults : labels.currentResults}</p>
      {ready && !visible.length && <div className="empty-state"><p>{labels.noResults}</p><div className="empty-actions">
        {!!activeFilters.length && <button type="button" onClick={clearFilters}>{labels.clearFilters}</button>}
        {!!state.query && <button type="button" onClick={clearSearch}>{labels.clearSearch}</button>}
        <a href={categoriesHref}>{labels.seeCategories}</a>
      </div></div>}
      {ready && <p className="page-summary">{labels.showing} {count ? (page - 1) * shownSize + 1 : 0}-{Math.min(page * shownSize, count)} {labels.of} {count}</p>}
      {ready && pages > 1 && <nav className="pagination" aria-label={labels.resultsPages}>
        <button type="button" disabled={page === 1} onClick={() => goPage(page - 1)}>{labels.prev}</button>
        {pageNumbers(page, pages).map((number, index, numbers) => <span key={number}>
          {index > 0 && number - numbers[index - 1]! > 1 && <span className="dots" aria-hidden="true">...</span>}
          <button type="button" aria-label={labels.page + " " + number} aria-current={page === number ? "page" : undefined} onClick={() => goPage(number)}>{number}</button>
        </span>)}
        <button type="button" disabled={page === pages} onClick={() => goPage(page + 1)}>{labels.next}</button>
      </nav>}
      <MechanicPreview entry={preview} base={base} interfaceLang={state.lang} labels={labels} onClose={closePreview} />
      <div className="library-reset"><button type="button" className="text-button" onClick={reset}>{labels.resetLibrary}</button></div>
    </section>
  );
}
