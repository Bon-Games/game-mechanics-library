"use strict";

const el = id => document.getElementById(id);
const esc = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clean = v => String(v || "").trim();
const key = v => clean(v).normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase();
const list = v => Array.isArray(v) ? v.map(clean).filter(Boolean) : clean(v).split(",").map(clean).filter(Boolean);
const unique = xs => [...new Set(xs)];
const allowedUrl = v => /^https?:\/\/[^\s]+$/i.test(clean(v)) ? clean(v) : "";
const slug = v => clean(v).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mechanic";
const today = () => new Date().toISOString().slice(0, 10);
const timestamp = () => new Date().toISOString();
const SOURCE_ID = "curated-starter";
const STORAGE = "bongames-mechanics-library-v1";
const statusText = { unreviewed: "Unreviewed", reviewing: "Reviewing", researched: "Researched" };
const state = { records: [], sources: [], categories: [], selected: "", limit: 60, editing: null };

function seedRecords(text) {
  const out = [];
  for (const row of text.trim().split(/\r?\n/)) {
    const parts = row.split("|");
    if (parts.length !== 3) continue;
    for (const name of parts[2].split(",").map(clean).filter(Boolean)) {
      out.push({ id: "gm-" + slug(name), name, category: parts[0], subcategory: parts[1], description: "", tags: [], aliases: [], examples: [], type: "unknown", status: "unreviewed", notes: "", favorite: false,
        sources: [{ source_id: SOURCE_ID, url: "", accessed_at: "2026-11-07", modified: false }], research_log: [] });
    }
  }
  return out;
}

function normalSource(ref) {
  if (!ref) return null;
  if (typeof ref === "string") return { source_id: "", url: allowedUrl(ref), accessed_at: today(), modified: false };
  return { source_id: clean(ref.source_id || ref.id), title: clean(ref.title || ref.name), creator: clean(ref.creator), url: allowedUrl(ref.url || ref.source_url),
    license: clean(ref.license), accessed_at: clean(ref.accessed_at) || today(), modified: Boolean(ref.modified), notes: clean(ref.notes) };
}
function mergeRefs(a, b) {
  const out = [];
  const seen = new Set();
  for (const item of [...(a || []), ...(b || [])]) {
    const src = normalSource(item);
    if (!src || (!src.source_id && !src.url && !src.title)) continue;
    const identity = [src.source_id, src.url, src.title].map(key).join("|");
    if (!seen.has(identity)) { seen.add(identity); out.push(src); }
    else { const old = out.find(x => [x.source_id,x.url,x.title].map(key).join("|") === identity);
      if (old) { old.modified = old.modified || src.modified; old.notes = old.notes || src.notes; old.license = old.license || src.license; old.creator = old.creator || src.creator; } }
  }
  return out;
}
function normalizeRecord(obj) {
  if (!obj || !clean(obj.name)) return null;
  return { id: clean(obj.id) || ("gm-" + slug(obj.name) + "-" + Math.random().toString(36).slice(2, 6)), name: clean(obj.name),
    category: clean(obj.category) || "Uncategorized", subcategory: clean(obj.subcategory), description: clean(obj.description || obj.definition),
    tags: unique(list(obj.tags)), aliases: unique(list(obj.aliases)), examples: unique(list(obj.examples || obj.example_games)),
    type: clean(obj.type) || "unknown", status: clean(obj.status) || "unreviewed", notes: clean(obj.notes), favorite: Boolean(obj.favorite),
    sources: mergeRefs(obj.sources || obj.source_refs || [], []), research_log: Array.isArray(obj.research_log) ? obj.research_log : [] };
}
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify({ mechanics: state.records, sources: state.sources })); }
  catch (e) { toast("Browser storage is full or unavailable. Export your JSON to retain changes."); }
}
let toastTimer;
function toast(message) { const node = el("toast"); node.textContent = message; node.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove("show"), 4100); }

async function boot() {
  try {
    const [seedResponse, sourceResponse] = await Promise.all([fetch("./data/mechanics.txt"), fetch("./data/sources.json")]);
    if (!seedResponse.ok || !sourceResponse.ok) throw new Error("Missing data files on GitHub Pages.");
    const initial = seedRecords(await seedResponse.text());
    const index = await sourceResponse.json();
    const cached = localStorage.getItem(STORAGE);
    const saved = cached ? JSON.parse(cached) : null;
    state.records = Array.isArray(saved && saved.mechanics) ? saved.mechanics.map(normalizeRecord).filter(Boolean) : initial;
    state.sources = Array.isArray(saved && saved.sources) ? saved.sources : index.sources;
    if (!state.records.length) state.records = initial;
    state.categories = unique(initial.map(x => x.category));
    setup();
    render();
  } catch (err) {
    el("summary").textContent = "Could not load the library: " + err.message;
    el("cards").innerHTML = '<div class="empty">Check that the repository contains data/mechanics.txt and data/sources.json, and open the page using GitHub Pages.</div>';
  }
}
function categoryNames() { return unique([...state.categories, ...state.records.map(x => x.category)]); }
function sourceById(id) { return state.sources.find(x => x.id === id); }
function creditedSource(ref) {
  const registered = sourceById(ref.source_id || "");
  return { title: clean(ref.title) || (registered && registered.title) || clean(ref.source_id) || "Unspecified source",
    creator: clean(ref.creator) || (registered && registered.creator) || "", license: clean(ref.license) || (registered && registered.license) || "Unverified",
    url: ref.url || (registered && registered.url) || "", accessed_at: ref.accessed_at || "", modified: Boolean(ref.modified) };
}
function setup() {
  el("search").addEventListener("input", () => { state.limit = 60; renderCards(); });
  for (const id of ["status-filter", "source-filter", "tag-filter", "favorite-only"]) el(id).addEventListener("change", () => { state.limit = 60; renderCards(); });
  el("reset-btn").addEventListener("click", () => { state.selected = ""; state.limit = 60; el("search").value = ""; el("status-filter").value = ""; el("source-filter").value = ""; el("tag-filter").value = ""; el("favorite-only").checked = false; render(); });
  el("more-btn").addEventListener("click", () => { state.limit += 60; renderCards(); });
  el("new-btn").addEventListener("click", () => openEditor(null));
  el("export-btn").addEventListener("click", exportData);
  el("import-btn").addEventListener("click", () => el("import-dialog").showModal());
  el("do-import").addEventListener("click", importData);
  document.querySelectorAll(".close-dialog").forEach(b => b.addEventListener("click", () => el("edit-dialog").close()));
  document.querySelectorAll(".close-import").forEach(b => b.addEventListener("click", () => el("import-dialog").close()));
  el("edit-form").addEventListener("submit", saveEditor);
  el("cards").addEventListener("click", event => {
    const star = event.target.closest("[data-favorite]");
    if (star) { const item = state.records.find(x => x.id === star.dataset.favorite); if (item) { item.favorite = !item.favorite; save(); renderCards(); renderStats(); } return; }
    const card = event.target.closest("[data-record]");
    if (card) openEditor(card.dataset.record);
  });
  el("cards").addEventListener("keydown", event => { if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-record]")) { event.preventDefault(); openEditor(event.target.dataset.record); } });
}
function render() { renderNav(); renderStats(); renderControls(); renderCards(); renderCredits(); }
function renderNav() {
  const categories = categoryNames();
  const make = (id,title,count) => '<button type="button" data-category="' + esc(id) + '" class="category-btn ' + (state.selected === id ? "active" : "") + '"><span>' + esc(title) + '</span><small>' + count + '</small></button>';
  el("category-nav").innerHTML = make("", "▦ All categories", state.records.length) + categories.map((c, i) => make(c, String(i+1).padStart(2, "0") + " · " + c, state.records.filter(r => r.category === c).length)).join("");
  el("category-nav").querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { state.selected = btn.dataset.category; state.limit = 60; renderNav(); renderCards(); }));
}
function renderStats() {
  el("total-stat").textContent = state.records.length.toLocaleString();
  el("category-stat").textContent = categoryNames().length;
  el("review-stat").textContent = state.records.filter(x => x.status === "researched").length;
  el("source-stat").textContent = state.sources.length;
}
function renderControls() {
  const ids = unique(state.records.flatMap(x => (x.sources || []).map(s => s.source_id)).filter(Boolean));
  const sel = el("source-filter"), prev = sel.value;
  sel.innerHTML = '<option value="">All sources</option>' + ids.map(id => '<option value="' + esc(id) + '">' + esc(sourceById(id)?.title || id) + "</option>").join("");
  if (ids.includes(prev)) sel.value = prev;
  const tags = unique(state.records.flatMap(x => x.tags || [])).sort();
  const tagSel = el("tag-filter"), oldTag = tagSel.value;
  tagSel.innerHTML = '<option value="">All tags</option>' + tags.map(t => '<option value="' + esc(t) + '">' + esc(t) + "</option>").join("");
  if (tags.includes(oldTag)) tagSel.value = oldTag;
}
function filterRecords() {
  const q = key(el("search").value), status = el("status-filter").value, source = el("source-filter").value, tag = el("tag-filter").value, favorites = el("favorite-only").checked;
  return state.records.filter(x => {
    if (state.selected && x.category !== state.selected) return false;
    if (status && x.status !== status) return false;
    if (source && !(x.sources || []).some(r => r.source_id === source)) return false;
    if (tag && !(x.tags || []).includes(tag)) return false;
    if (favorites && !x.favorite) return false;
    if (q && !key([x.name,x.description,x.category,x.subcategory,x.notes,...(x.tags||[]),...(x.aliases||[]),...(x.examples||[])].join(" ")).includes(q)) return false;
    return true;
  }).sort((a,b) => a.name.localeCompare(b.name));
}
function renderCards() {
  const results = filterRecords();
  el("active-category").textContent = state.selected || "All categories";
  el("summary").textContent = state.records.length + " indexed mechanics · source citations included";
  el("filtered-count").textContent = results.length + " results";
  el("cards").innerHTML = !results.length ? '<div class="empty">No mechanics match these filters.</div>' : results.slice(0, state.limit).map(item => {
    const count = (item.sources || []).length;
    return '<article class="card" tabindex="0" role="button" data-record="' + esc(item.id) + '" aria-label="Open ' + esc(item.name) + '">' +
      '<div class="card-top"><span class="badge">' + esc(item.subcategory || item.category) + '</span><button type="button" class="star ' + (item.favorite ? "active" : "") + '" data-favorite="' + esc(item.id) + '" aria-label="Favorite ' + esc(item.name) + '">' + (item.favorite ? "★" : "☆") + '</button></div>' +
      '<h3>' + esc(item.name) + '</h3><p class="' + (!item.description ? "placeholder" : "") + '">' + esc(item.description || "Research not started. Add definition and examples.") + '</p>' +
      '<div class="card-bottom"><span class="credit-count">↗ ' + count + ' source' + (count === 1 ? "" : "s") + '</span><span class="research-status ' + esc(item.status) + '">' + esc(statusText[item.status] || item.status) + '</span></div></article>';
  }).join("");
  const more = el("more-btn"); more.hidden = state.limit >= results.length;
}
function renderCredits() {
  el("credits-list").innerHTML = state.sources.map(source => '<div class="source-entry"><a href="' + esc(allowedUrl(source.url) || "#") + '" rel="noopener noreferrer" target="_blank">' + esc(source.title) + " ↗</a>" +
    '<small>' + esc(source.creator || "Source author unverified") + " · " + esc(source.license || "Licence unverified") + '</small><p>' +
    esc(source.usage === "starter_data" ? "Starter data (original curated compilation)" : "Research reference (not imported)") + '</p></div>').join("");
}
function refsHtml(sources) {
  if (!sources?.length) return '<p class="muted">No source attached yet.</p>';
  return sources.map(ref => {
    const s = creditedSource(ref), link = allowedUrl(s.url);
    return '<div class="reference">' + (link ? '<a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + " ↗</a>" : esc(s.title)) +
      '<small>Credit: ' + esc(s.creator || "Unspecified") + " · Licence: " + esc(s.license) + " · Accessed: " + esc(s.accessed_at || "Not recorded") +
      (s.modified ? " · Adapted / modified" : "") + "</small></div>";
  }).join("");
}
function openEditor(id) {
  const item = state.records.find(x => x.id === id) || null;
  state.editing = item;
  el("dialog-title").textContent = item ? item.name : "New mechanic";
  el("edit-id").value = item?.id || "";
  for (const field of ["name","subcategory","description","notes"]) el("edit-" + field).value = item?.[field] || "";
  for (const field of ["tags","aliases","examples"]) el("edit-" + field).value = (item?.[field] || []).join(", ");
  el("edit-category").innerHTML = categoryNames().map(c => '<option value="' + esc(c) + '">' + esc(c) + '</option>').join("");
  el("edit-category").value = item?.category || state.selected || categoryNames()[0] || "";
  el("edit-status").value = item?.status || "unreviewed";
  el("edit-type").value = item?.type || "unknown";
  el("edit-favorite").checked = Boolean(item?.favorite);
  el("edit-source-select").innerHTML = '<option value="">No new source</option>' + state.sources.map(s => '<option value="' + esc(s.id) + '">' + esc(s.title) + '</option>').join("");
  el("edit-source-select").value = "";
  el("edit-source-url").value = "";
  el("edit-sources-list").innerHTML = refsHtml(item?.sources || []);
  el("research-log").innerHTML = (item?.research_log || []).map(n => '<div class="reference"><small>' + esc(n.at || "") + '</small>' + esc(n.text || "") + '</div>').join("") || '<p class="muted">No research log yet.</p>';
  el("new-log").value = "";
  el("edit-dialog").showModal();
}
function saveEditor(event) {
  event.preventDefault();
  const name = clean(el("edit-name").value);
  if (!name) return;
  const current = state.editing;
  const existing = state.records.find(x => x !== current && key(x.name) === key(name));
  if (existing) { toast("This name already exists. Open and edit the existing mechanic."); return; }
  const item = current || normalizeRecord({name, category:el("edit-category").value});
  item.name = name;
  for (const field of ["category","subcategory","description","status","type","notes"]) item[field] = clean(el("edit-" + field).value);
  for (const field of ["tags","aliases","examples"]) item[field] = unique(list(el("edit-" + field).value));
  item.favorite = el("edit-favorite").checked;
  const sourceId = el("edit-source-select").value, url = allowedUrl(el("edit-source-url").value);
  if (sourceId || url) {
    const ref = {source_id:sourceId,url,accessed_at:today(),modified:false};
    item.sources = mergeRefs(item.sources, [ref]);
  }
  const note = clean(el("new-log").value);
  if (note) { item.research_log ||= []; item.research_log.push({at:timestamp(),text:note}); }
  if (!current) state.records.push(item);
  save(); render(); el("edit-dialog").close(); toast("Saved in this browser. Export JSON to keep a portable backup.");
}
function exportData() {
  const data = { schema_version:1, generated_at:timestamp(), repository:"https://github.com/Bon-Games/game-mechanics-library", mechanics:state.records, sources:state.sources };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "game-mechanics-library-" + today() + ".json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast("JSON export includes every mechanic, note and credit.");
}
function readCSV(text) {
  const rows = [], row = []; let cell = "", quoted = false;
  for (let i=0; i<text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i+1] === '"') { cell+='"'; i++; } else quoted = !quoted; }
    else if (c === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i+1] === "\n") i++;
      row.push(cell); if (row.some(x=>x.trim())) rows.push([...row]); row.length = 0; cell = "";
    } else cell += c;
  }
  row.push(cell); if (row.some(x=>x.trim())) rows.push(row);
  if (rows.length < 2) return [];
  const heads = rows.shift().map(x => x.trim().toLowerCase().replace(/\s+/g,"_"));
  return rows.map(cells => Object.fromEntries(heads.map((h,i) => [h,cells[i] || ""])));
}
function registerSource(raw) {
  if (!raw) return null;
  const url = allowedUrl(raw.url), existing = state.sources.find(s => url && s.url === url);
  if (existing) return existing.id;
  const id = clean(raw.id) || "import-" + slug(raw.title || raw.name || "unknown") + "-" + Date.now().toString(36);
  let finalId = id, seq = 2; while (state.sources.some(x=>x.id === finalId)) finalId = id + "-" + seq++;
  state.sources.push({id:finalId,title:clean(raw.title || raw.name) || "Imported source (unverified)",creator:clean(raw.creator),url,
    license:clean(raw.license) || "Unverified — review before publishing",license_url:allowedUrl(raw.license_url),accessed_at:today(),usage:"imported_data",
    attribution:clean(raw.attribution)}); return finalId;
}
async function importData() {
  const file = el("file-input").files[0];
  if (!file) { el("import-status").textContent = "Choose a CSV or JSON file."; return; }
  try {
    const raw = await file.text();
    const data = file.name.toLowerCase().endsWith(".csv") ? readCSV(raw) : JSON.parse(raw);
    const items = Array.isArray(data) ? data : data.mechanics;
    if (!Array.isArray(items)) throw new Error("Expected a JSON array or { mechanics: [...] }.");
    if (Array.isArray(data.sources)) for (const source of data.sources) { if (!state.sources.some(s=>s.id===source.id)) state.sources.push(source); }
    const title = clean(el("import-source-name").value) || "Imported dataset: " + file.name;
    const url = allowedUrl(el("import-source-url").value);
    const license = clean(el("import-source-license").value) || "Unverified — check before publishing";
    const importSourceId = registerSource({title,creator:title,url,license});
    let added=0, merged=0, skipped=0;
    for (const rawEntry of items) {
      const record = normalizeRecord(rawEntry);
      if (!record) { skipped++; continue; }
      const originURL = allowedUrl(rawEntry.source_url);
      record.sources = mergeRefs(record.sources,[{source_id:importSourceId,url:originURL||url,accessed_at:today(),modified:false,license}]);
      const old = state.records.find(x=>key(x.name)===key(record.name));
      if (old) {
        old.sources = mergeRefs(old.sources,record.sources);
        old.tags = unique([...(old.tags||[]),...record.tags]);
        old.aliases = unique([...(old.aliases||[]),...record.aliases]);
        old.examples = unique([...(old.examples||[]),...record.examples]);
        if (!old.description && record.description) old.description = record.description;
        if (!old.notes && record.notes) old.notes = record.notes;
        merged++;
      } else { if (state.records.some(x=>x.id===record.id)) record.id += "-" + Math.random().toString(36).slice(2,6);
        state.records.push(record); added++; }
    }
    save(); render(); el("import-status").textContent = "Imported: " + added + " new, " + merged + " exact-name merges, " + skipped + " skipped. Credits retained.";
    toast("Import complete. Export JSON for backup.");
  } catch (e) { el("import-status").textContent = "Import failed: " + e.message; }
}
boot();
