"use strict";

const DATA = window.PAL_DATA || { pals: [], baseCapacity: {}, suitabilityLadders: {} };
const hasOverlay = typeof window.overlay !== "undefined";

// Version is single-sourced from package.json (via app.getVersion()); resolved at init.
// Per-version notes live in src/notes.js (window.PP_NOTES). Never hardcode the version here.
let APP_VERSION = "";
function releaseNotes() { return window.PP_NOTES || {}; }
// Newest notes key by semver — never rely on object insertion order (integer-like
// keys would sort first and misreport the version in the browser/preview fallback).
function newestNotesVersion() {
  const parse = (v) => String(v).split(".").map(n => parseInt(n, 10) || 0);
  return Object.keys(releaseNotes()).sort((a, b) => {
    const pa = parse(a), pb = parse(b);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      if ((pb[i] || 0) !== (pa[i] || 0)) return (pb[i] || 0) - (pa[i] || 0);
    }
    return 0;
  })[0];
}
async function resolveVersion() {
  if (hasOverlay && window.overlay.getVersion) {
    try { APP_VERSION = await window.overlay.getVersion(); } catch (e) { /* fall through */ }
  }
  if (!APP_VERSION) APP_VERSION = newestNotesVersion() || "dev"; // preview/browser fallback = newest notes key
}
const WELCOME_NOTES = [
  "Plan base workers by level, mounts, breeding, passives & more",
  "Click any pal for full details · 🔍 search · 🗺️ spawn maps",
  "Run Palworld in Borderless; summon/hide the overlay with Ctrl+Alt+N",
];

// Canonical suitability order for display.
const SUIT_ORDER = ["Kindling", "Watering", "Planting", "Farming", "Electricity",
  "Handiwork", "Gathering", "Lumbering", "Mining", "Medicine", "Cooling", "Transport"];

const state = {
  level: 15,
  slots: DATA.baseCapacity && DATA.baseCapacity.defaultWorkersPerBase ? DATA.baseCapacity.defaultWorkersPerBase : 15,
  picked: new Set(),
  bylevelFilter: "",
  mountsFilter: "",
  mountsAvailOnly: false,
  baseType: "",
  baseSlots: {},
  breedA: "",
  breedB: "",
  passivesFilter: "",
  bossesFilter: "",
  bossesHideDone: false,
  bossDone: {},
};

// ---- persistence (per-base-type slot counts survive restarts) ----
const LS_KEY = "palpocket.baseSlots";
const DEFAULT_SLOTS = 15;
// A plain object literal — rejects arrays, numbers, null so strict-mode writes never throw.
function isPlainObject(o) { return o != null && typeof o === "object" && !Array.isArray(o); }
function loadBaseSlots() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY));
    const clean = {};
    if (isPlainObject(raw)) {
      for (const id of Object.keys(raw)) {
        const v = parseInt(raw[id], 10);
        if (Number.isFinite(v)) clean[id] = Math.max(1, Math.min(MAX_SLOTS, v)); // clamp stale values to the cap
      }
    }
    state.baseSlots = clean;
  } catch (e) { state.baseSlots = {}; }
}
function saveBaseSlots() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state.baseSlots)); } catch (e) {}
}
function slotsOf(id) { return state.baseSlots[id] || DEFAULT_SLOTS; }

// ---- persistence (boss checklist survives restarts) ----
const LS_BOSS = "palpocket.bossDone";
function loadBossDone() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_BOSS));
    state.bossDone = isPlainObject(raw) ? raw : {};
  } catch (e) { state.bossDone = {}; }
}
function saveBossDone() {
  try { localStorage.setItem(LS_BOSS, JSON.stringify(state.bossDone)); } catch (e) {}
}
// A base gains +1 worker slot per base level (2 slots @ Lv1 → 15 @ Lv14), so base level ≈ slots − 1.
// Leveling tops out at 15 slots; slots 16–50 come from raised World Settings, so cap the derived level there.
const LEVEL_SLOTS_CAP = 15;
function baseLevelFromSlots(slots) { return Math.max(1, Math.min(LEVEL_SLOTS_CAP, slots) - 1); }
const MAX_SLOTS = (DATA.baseCapacity && DATA.baseCapacity.maxWorkersPerBase) || 50;

// ---- helpers ----
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

function allSuits() {
  const s = new Set();
  DATA.pals.forEach(p => p.suitabilities.forEach(su => s.add(su.type)));
  return SUIT_ORDER.filter(x => s.has(x)).concat([...s].filter(x => !SUIT_ORDER.includes(x)));
}
function suitLevel(pal, type) {
  const m = pal.suitabilities.find(s => s.type === type);
  return m ? m.level : 0;
}
const LEVEL_CAP = 70;
function available(pal) {
  // At the level cap you can still obtain higher-level pals (catch above-level or breed them).
  return pal.catchLevel == null || pal.catchLevel <= state.level || state.level >= LEVEL_CAP;
}
function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

// ---- catch helpers (where to catch + recommended sphere + map link) ----
function palPageUrl(name) {
  return "https://paldb.cc/en/" + encodeURIComponent(String(name || "").trim().replace(/ /g, "_"));
}
function openMap(name) {
  const url = palPageUrl(name);
  if (hasOverlay && window.overlay.openExternal) window.overlay.openExternal(url);
  else window.open(url, "_blank", "noopener");
}
// Recommended Pal Sphere tier, scaled to the target's catch level (weaken HP + hit from behind still applies).
const SPHERE_TIERS = [
  { max: 5, name: "Pal Sphere" },
  { max: 15, name: "Mega Sphere" },
  { max: 25, name: "Giga Sphere" },
  { max: 35, name: "Hyper Sphere" },
  { max: 50, name: "Ultra Sphere" },
  { max: Infinity, name: "Legendary Sphere" },
];
function sphereFor(catchLevel) {
  const t = SPHERE_TIERS.find(x => catchLevel <= x.max);
  return t ? t.name : "Legendary Sphere";
}
// Find a breeding recipe for a pal (prefer a real two-different-parents combo).
function breedRecipeFor(name) {
  const b = DATA.breeding || {};
  const cur = (b.curated || []).filter(c => c.child === name);
  const pick = cur.find(c => c.parentA !== c.parentB) || cur[0];
  if (pick) return { a: pick.parentA, b: pick.parentB, self: pick.parentA === pick.parentB };
  const sp = (b.special || []).find(s => s.child === name);
  if (sp) return { a: sp.parentA, b: sp.parentB, self: false };
  return null;
}
// Show a breeding shortcut for pals that are hard to catch in the wild (high catch level / uncatchable).
const BREED_HINT_MIN = 40;
function addBreedLine(card, name, catchLevel) {
  if (catchLevel != null && catchLevel < BREED_HINT_MIN) return;
  const r = breedRecipeFor(name);
  if (!r) return;
  const txt = r.self ? `🥚 Breed: two ${esc(r.a)}` : `🥚 Breed: ${esc(r.a)} + ${esc(r.b)}`;
  card.appendChild(el("div", "pal-breed", txt + " <span class=\"breed-hint\">(easier than catching)</span>"));
}

const CATCH_TIP = "Weaken it to red HP and hit from behind for a big catch bonus. Catching 10 of the same species grants a lasting capture-power & XP bonus.";
let _nightSet = null;
function nightOnly(name) {
  if (!_nightSet) _nightSet = new Set((DATA.nightOnly) || []);
  return _nightSet.has(name);
}
// Append a "catch" action row (recommended sphere + night flag + Map button) to a card.
function addCatchRow(card, name, catchLevel) {
  const row = el("div", "catch-row");
  if (catchLevel != null) {
    const ball = el("span", "catch-ball", "🎯 " + esc(sphereFor(catchLevel)));
    ball.title = CATCH_TIP;
    row.appendChild(ball);
  }
  if (nightOnly(name)) {
    const n = el("span", "catch-night", "🌙 night");
    n.title = "Only spawns at night";
    row.appendChild(n);
  }
  const btn = el("button", "map-btn", "🗺️ Map");
  btn.title = "Open " + name + "'s spawn map on paldb.cc";
  btn.addEventListener("click", (e) => { e.stopPropagation(); openMap(name); });
  row.appendChild(btn);
  card.appendChild(row);
}

// ---- Planner ----
function renderSuitPicker() {
  const box = $("suit-picker");
  box.innerHTML = "";
  allSuits().forEach(t => {
    const c = el("div", "chip" + (state.picked.has(t) ? " on" : ""), esc(t));
    c.onclick = () => { state.picked.has(t) ? state.picked.delete(t) : state.picked.add(t); renderSuitPicker(); renderPlanner(); };
    box.appendChild(c);
  });
}

function renderPlanner() {
  const out = $("planner-out");
  out.innerHTML = "";
  const wanted = state.picked.size ? [...state.picked] : allSuits();

  // Best available pal per wanted suitability (highest work level, then lowest catch level).
  const chosen = [];
  const usedNames = new Set();
  wanted.forEach(type => {
    const cands = DATA.pals
      .filter(p => available(p) && suitLevel(p, type) > 0)
      .sort((a, b) => suitLevel(b, type) - suitLevel(a, type) || (a.catchLevel || 0) - (b.catchLevel || 0));
    if (!cands.length) { chosen.push({ type, pal: null }); return; }
    // prefer a pal not already used, else reuse (multi-suitability worker covers several)
    const fresh = cands.find(p => !usedNames.has(p.name)) || cands[0];
    usedNames.add(fresh.name);
    chosen.push({ type, pal: fresh });
  });

  const distinct = [...usedNames];
  const over = distinct.length > state.slots;
  const summary = el("div", "slot-summary" + (over ? " over" : ""),
    `Lineup uses <b>${distinct.length}</b> pal(s) for ${wanted.length} work type(s) — base holds <b>${state.slots}</b> slot(s).` +
    (over ? " Over capacity — drop a work type or use a second base." : ""));
  out.appendChild(summary);

  chosen.forEach(({ type, pal }) => {
    if (!pal) {
      out.appendChild(el("div", "pal locked", `<div class="pal-top"><span class="pal-name">${esc(type)}</span><span class="pal-catch locked">none at lvl ${state.level}</span></div>`));
      return;
    }
    out.appendChild(palCard(pal, type));
  });
}

function palCard(pal, highlightType) {
  const avail = available(pal);
  const card = el("div", "pal" + (avail ? "" : " locked"));
  const catchTxt = pal.catchLevel == null ? "starter" : (avail ? `lvl ${pal.catchLevel} ✓` : `lvl ${pal.catchLevel}`);
  const catchCls = pal.catchLevel == null ? "avail" : (avail ? "avail" : "locked");
  card.appendChild(el("div", "pal-top",
    `<span class="pal-name">${esc(pal.name)}</span><span class="pal-catch ${catchCls}">${catchTxt}</span>`));
  const nm = card.querySelector(".pal-name");
  if (nm) { nm.classList.add("clickable"); nm.addEventListener("click", () => showPalDetail(pal.name)); }
  const suits = el("div", "suits");
  pal.suitabilities.slice().sort((a, b) => b.level - a.level).forEach(s => {
    const match = highlightType && s.type === highlightType;
    suits.appendChild(el("span", "suit" + (match ? " match" : ""), `${esc(s.type)} <b>${s.level}</b>`));
  });
  card.appendChild(suits);
  if (pal.ranchDrop) card.appendChild(el("div", "pal-ranch", "🐄 Ranch: " + esc(pal.ranchDrop)));
  if (pal.location) card.appendChild(el("div", "pal-loc", "📍 " + esc(pal.location)));
  if (pal.condenseTarget) card.appendChild(el("div", "pal-cond", "⭐ " + esc(pal.condenseTarget)));
  if (pal.note || pal.notes) card.appendChild(el("div", "pal-note", esc(pal.note || pal.notes)));
  addBreedLine(card, pal.name, pal.catchLevel);
  addCatchRow(card, pal.name, pal.catchLevel);
  return card;
}

// ---- By Level ----
const TIER_LABEL = { starter: "Starter (lvl 1–5)", early: "Early (lvl 5–15)", mid: "Mid (lvl 15–35)", late: "Late (lvl 35–55)", endgame: "Endgame (lvl 55+)" };
const TIER_ORDER = ["starter", "early", "mid", "late", "endgame"];

function renderByLevel() {
  const out = $("bylevel-out");
  out.innerHTML = "";
  const filter = state.bylevelFilter;
  const pals = DATA.pals
    .filter(p => !filter || suitLevel(p, filter) > 0)
    .slice()
    .sort((a, b) => (a.catchLevel == null ? -1 : a.catchLevel) - (b.catchLevel == null ? -1 : b.catchLevel));

  let any = false;
  TIER_ORDER.forEach(tier => {
    const group = pals.filter(p => (p.tier || "early") === tier);
    if (!group.length) return;
    any = true;
    out.appendChild(el("div", "group-h", TIER_LABEL[tier] || tier));
    group.forEach(p => out.appendChild(palCard(p, filter)));
  });
  if (!any) out.appendChild(el("div", "empty", "No pals match."));
}

function fillBylevelFilter() {
  const sel = $("bylevel-filter");
  allSuits().forEach(t => { const o = el("option", null, esc(t)); o.value = t; sel.appendChild(o); });
}

// ---- Ladders ----
function renderLadders() {
  const out = $("ladders-out");
  out.innerHTML = "";
  const ladders = DATA.suitabilityLadders || {};
  const keys = Object.keys(ladders);
  if (keys.length) {
    SUIT_ORDER.concat(keys.filter(k => !SUIT_ORDER.includes(k))).forEach(type => {
      const steps = ladders[type];
      if (!steps || !steps.length) return;
      const w = el("div", "ladder");
      w.appendChild(el("div", "ladder-h", esc(type)));
      const row = el("div", "ladder-steps");
      steps.forEach((s, i) => {
        if (i) row.appendChild(el("span", "arrow", "→"));
        row.appendChild(el("span", "ladder-step", `${esc(s.name)} <span class="wl">wl${s.workLevel}</span>`));
      });
      w.appendChild(row);
      out.appendChild(w);
    });
    return;
  }
  // Fallback: derive ladders from pals (best work level milestones per suitability).
  allSuits().forEach(type => {
    const picks = DATA.pals.filter(p => suitLevel(p, type) > 0)
      .sort((a, b) => (a.catchLevel == null ? -1 : a.catchLevel) - (b.catchLevel == null ? -1 : b.catchLevel));
    const steps = [];
    let best = 0;
    picks.forEach(p => { const wl = suitLevel(p, type); if (wl > best) { best = wl; steps.push({ name: p.name, wl, catch: p.catchLevel }); } });
    if (!steps.length) return;
    const w = el("div", "ladder");
    w.appendChild(el("div", "ladder-h", esc(type)));
    const row = el("div", "ladder-steps");
    steps.forEach((s, i) => {
      if (i) row.appendChild(el("span", "arrow", "→"));
      row.appendChild(el("span", "ladder-step", `${esc(s.name)} <span class="wl">wl${s.wl}</span>`));
    });
    w.appendChild(row);
    out.appendChild(w);
  });
}

// ---- Base ----
function renderBase() {
  const out = $("base-out");
  out.innerHTML = "";
  const b = DATA.baseCapacity || {};
  const grid = el("div");
  const facts = [
    ["Worker slots per base", `<span class="big">${b.defaultWorkersPerBase ?? "?"}</span>${b.maxWorkersPerBase && b.maxWorkersPerBase !== b.defaultWorkersPerBase ? " (max " + b.maxWorkersPerBase + ")" : ""}`],
    ["Max bases", `<span class="big">${b.maxBases ?? "?"}</span>`],
    ["Raising capacity", esc(b.howToIncrease || "—")],
    ["Pal Condenser (stars)", esc(b.condenserNotes || "—")],
  ];
  facts.forEach(([k, v]) => {
    const f = el("div", "fact");
    f.appendChild(el("div", "k", k));
    f.appendChild(el("div", "v", v));
    grid.appendChild(f);
  });
  out.appendChild(grid);
}

// ---- Base Types (with per-type leveling) ----
// Best available pal per work at the player's current level (same logic as the Planner).
function pickBestForWorks(works) {
  const chosen = [];
  const used = new Set();
  works.forEach(type => {
    const cands = DATA.pals
      .filter(p => available(p) && suitLevel(p, type) > 0)
      .sort((a, b) => suitLevel(b, type) - suitLevel(a, type) || (a.catchLevel || 0) - (b.catchLevel || 0));
    if (!cands.length) { chosen.push({ type, pal: null }); return; }
    const fresh = cands.find(p => !used.has(p.name)) || cands[0];
    used.add(fresh.name);
    chosen.push({ type, pal: fresh });
  });
  return chosen;
}

function renderBaseTypePicker() {
  const box = $("btype-picker");
  if (!box) return;
  box.innerHTML = "";
  const types = DATA.baseTypes || [];
  if (!types.length) return;
  if (!state.baseType) state.baseType = types[0].id;
  types.forEach(t => {
    const c = el("div", "chip" + (state.baseType === t.id ? " on" : ""), `${esc(t.icon || "")} ${esc(t.name)}`);
    c.onclick = () => { state.baseType = t.id; renderBaseTypePicker(); renderBaseTypeDetail(); };
    box.appendChild(c);
  });
}

function renderBaseTypeDetail() {
  const out = $("btype-detail");
  if (!out) return;
  out.innerHTML = "";
  const types = DATA.baseTypes || [];
  if (!types.length) { out.appendChild(el("div", "empty", "No base-type data loaded yet.")); return; }
  const t = types.find(x => x.id === state.baseType) || types[0];

  if (t.goal) out.appendChild(el("div", "btype-goal", esc(t.goal)));

  // per-base-type slot control (rendered once; the body below re-renders on change)
  const ctrl = el("div", "btype-levelbar");
  ctrl.innerHTML = `<label>Worker slots<span class="sub">(pal beds)</span></label>`;
  const range = el("input"); range.type = "range"; range.min = "1"; range.max = String(MAX_SLOTS); range.value = slotsOf(t.id);
  const num = el("input", "btype-lvlnum"); num.type = "number"; num.min = "1"; num.max = String(MAX_SLOTS); num.value = slotsOf(t.id);
  const body = el("div", "btype-body");
  const apply = (v) => {
    v = Math.max(1, Math.min(MAX_SLOTS, parseInt(v, 10) || 1));
    state.baseSlots[t.id] = v; saveBaseSlots();
    range.value = v; num.value = v;
    renderBaseBody(body, t, v);
  };
  range.addEventListener("input", e => apply(e.target.value));
  num.addEventListener("change", e => apply(e.target.value));
  ctrl.appendChild(range); ctrl.appendChild(num);
  out.appendChild(ctrl);
  out.appendChild(body);
  renderBaseBody(body, t, slotsOf(t.id));
}

// Everything that depends on the slot count, re-rendered together.
function renderBaseBody(body, t, slots) {
  body.innerHTML = "";
  const baseLevel = baseLevelFromSlots(slots);
  renderRoadmap(body, t, baseLevel);

  // Best pals in slot for THIS base's jobs, gated by your character level (catch) — Planner-style.
  const works = t.works && t.works.length ? (t.works[0] === "*" ? allSuits() : t.works) : [];
  if (works.length) {
    body.appendChild(el("div", "group-h", "Best in slot"));
    const raised = slots > LEVEL_SLOTS_CAP ? ` <span class="slot-note">(${slots - LEVEL_SLOTS_CAP} above the level-${LEVEL_SLOTS_CAP} cap — raised via World Settings)</span>` : "";
    body.appendChild(el("div", "slot-summary",
      `<b>${slots}</b> worker slots (pal beds) ≈ base <b>Lv ${baseLevel}</b>${raised} · best pal per job you can catch at char level <b>${state.level}</b>:`));
    pickBestForWorks(works).forEach(({ type, pal }) => {
      if (!pal) {
        body.appendChild(el("div", "pal locked", `<div class="pal-top"><span class="pal-name">${esc(type)}</span><span class="pal-catch locked">none at lvl ${state.level}</span></div>`));
        return;
      }
      body.appendChild(palCard(pal, type));
    });
  }

  renderTechReadiness(body, t);

  // Curated roles & ranch specifics (context the auto-picker can't capture)
  if (t.pals && t.pals.length) {
    body.appendChild(el("div", "group-h", "Notable pals & roles"));
    t.pals.forEach(p => {
      const card = el("div", "pal");
      card.appendChild(el("div", "pal-top", `<span class="pal-name">${esc(p.name)}</span>`));
      if (p.why) card.appendChild(el("div", "pal-note", esc(p.why)));
      addCatchRow(card, p.name.split("/")[0].trim(), null);
      body.appendChild(card);
    });
  }
  // Ranch-by-drop overview (farming base only) — surfaces every ranch pal grouped by its product.
  if (t.id === "farming") renderRanchByDrop(body);

  // structures (may be plain strings, or {item,count,note} to show how many to build)
  if (t.structures && t.structures.length) {
    const hasCounts = t.structures.some(s => s && typeof s === "object");
    body.appendChild(el("div", "group-h", "Key structures" + (hasCounts ? " — how many to build" : "")));
    if (hasCounts) body.appendChild(el("div", "slot-summary", "Suggested counts for a maxed base:"));
    const ul = el("ul", "blist" + (hasCounts ? " struct-list" : ""));
    t.structures.forEach(s => {
      if (s && typeof s === "object") {
        const note = s.note ? ` <span class="struct-note">— ${esc(s.note)}</span>` : "";
        ul.appendChild(el("li", "struct-row",
          `<span class="struct-qty">${esc(s.count || "1")}×</span> <b>${esc(s.item)}</b>${note}`));
      } else {
        ul.appendChild(el("li", null, esc(s)));
      }
    });
    body.appendChild(ul);
  }
  // tips
  if (t.tips && t.tips.length) {
    body.appendChild(el("div", "group-h", "Tips"));
    const ul = el("ul", "blist tips");
    t.tips.forEach(s => ul.appendChild(el("li", null, esc(s))));
    body.appendChild(ul);
  }
}

// Ranch products grouped by what they drop (surfaces ranch pals by product, not by Farming level).
function renderRanchByDrop(body) {
  const producers = (DATA.pals || []).filter(p => p.ranchDrop);
  if (!producers.length) return;
  const byDrop = {};
  producers.forEach(p => { (byDrop[p.ranchDrop] = byDrop[p.ranchDrop] || []).push(p); });
  body.appendChild(el("div", "group-h", "Ranch products — who makes what"));
  Object.keys(byDrop).sort((a, b) => a.localeCompare(b)).forEach(drop => {
    const row = el("div", "ranchdrop-row");
    row.appendChild(el("div", "ranchdrop-name", "🐄 " + esc(drop)));
    const chips = el("div", "ranchdrop-pals");
    byDrop[drop]
      .sort((a, b) => (a.catchLevel == null ? -1 : a.catchLevel) - (b.catchLevel == null ? -1 : b.catchLevel))
      .forEach(p => {
        const c = el("span", "ranchdrop-pal clickable",
          esc(p.name) + (p.catchLevel != null ? ` <span class="rd-lv">Lv${p.catchLevel}</span>` : ""));
        c.addEventListener("click", () => showPalDetail(p.name));
        chips.appendChild(c);
      });
    row.appendChild(chips);
    body.appendChild(row);
  });
}

// Which of this base's key structures the character can research at their current level.
function renderTechReadiness(body, t) {
  const needs = t.techNeeds || [];
  const tl = DATA.techLevels || {};
  if (!needs.length) return;
  const usable = needs.filter(n => tl[n] && state.level >= tl[n].lvl).length;
  body.appendChild(el("div", "group-h", "Tech readiness"));
  body.appendChild(el("div", "slot-summary",
    `At char level <b>${state.level}</b> you can research <b>${usable}/${needs.length}</b> of this base's key structures:`));
  const wrap = el("div", "tech-list");
  needs.slice().sort((a, b) => (tl[a] ? tl[a].lvl : 99) - (tl[b] ? tl[b].lvl : 99)).forEach(n => {
    const info = tl[n]; if (!info) return;
    const ok = state.level >= info.lvl;
    const row = el("div", "tech-row" + (ok ? " ok" : " locked"));
    const anc = info.ancient ? ` <span class="anc">Ancient</span>` : "";
    row.innerHTML = `<span class="tmark">${ok ? "✓" : "🔒"}</span>` +
      `<span class="tname">${esc(n)}</span><span class="tlvl">Lv ${info.lvl}${anc}</span>`;
    wrap.appendChild(row);
  });
  body.appendChild(wrap);
}

function renderRoadmap(container, t, lvl) {
  if (!t.roadmap || !t.roadmap.length) return;
  container.appendChild(el("div", "group-h", "Progression roadmap"));
  t.roadmap.forEach(step => {
    const done = step.level != null && lvl >= step.level;
    const isNext = step.level != null && !done && lvl < step.level;
    const row = el("div", "road-step" + (done ? " done" : "") + (isNext ? " next" : ""));
    const tag = step.level != null ? `Lv ${step.level}+` : (step.stage || "");
    row.innerHTML = `<span class="road-mark">${done ? "✓" : (isNext ? "→" : "•")}</span>` +
      `<span class="road-body"><b>${esc(step.stage || tag)}</b> ${esc(step.text || "")}</span>`;
    container.appendChild(row);
  });
}

// ---- Mounts ----
const MOUNT_CATS = ["Flying", "Ground", "Water"];
const MOUNT_CAT_LABEL = {
  Flying: "🪽 Flying — by ride sprint speed",
  Ground: "🏃 Ground — by ride sprint speed",
  Water: "🌊 Water — by swim dash speed",
};

function mountAvailable(m) {
  return m.catchLevel == null || m.catchLevel <= state.level || state.level >= LEVEL_CAP;
}

function renderMounts() {
  const out = $("mounts-out");
  out.innerHTML = "";
  const mounts = DATA.mounts || [];
  if (!mounts.length) {
    out.appendChild(el("div", "empty", "No mount data loaded."));
    return;
  }
  const wantCats = state.mountsFilter ? [state.mountsFilter] : MOUNT_CATS;
  let any = false;

  wantCats.forEach(cat => {
    let group = mounts.filter(m => m.category === cat);
    if (state.mountsAvailOnly) group = group.filter(mountAvailable);
    // fastest first; unknown speeds sink to the bottom
    group.sort((a, b) => (b.speed || -1) - (a.speed || -1));
    if (!group.length) return;
    any = true;

    out.appendChild(el("div", "group-h", MOUNT_CAT_LABEL[cat] || cat));
    const top = group[0].speed || 0;
    group.forEach((m, i) => out.appendChild(mountCard(m, i + 1, top)));
  });

  if (!any) out.appendChild(el("div", "empty", "No mounts match — try clearing filters or raising your level."));
}

function mountCard(m, rank, topSpeed) {
  const avail = mountAvailable(m);
  const card = el("div", "pal mount" + (avail ? "" : " locked"));

  const catchTxt = m.catchLevel == null ? "special" : (avail ? `lvl ${m.catchLevel} ✓` : `lvl ${m.catchLevel}`);
  const catchCls = m.catchLevel == null ? "avail" : (avail ? "avail" : "locked");
  card.appendChild(el("div", "pal-top",
    `<span class="pal-name"><span class="rank">#${rank}</span> ${esc(m.name)}</span>` +
    `<span class="pal-catch ${catchCls}">${catchTxt}</span>`));
  const mnm = card.querySelector(".pal-name");
  if (mnm) { mnm.classList.add("clickable"); mnm.addEventListener("click", () => showPalDetail(m.name)); }

  // speed bar (relative to fastest in this category)
  const spd = m.speed;
  const pct = spd && topSpeed ? Math.max(6, Math.round((spd / topSpeed) * 100)) : 0;
  const spdLabel = spd ? `${spd}` : "n/a";
  const bar = el("div", "spd-row");
  bar.innerHTML = `<div class="spd-track"><div class="spd-fill" style="width:${pct}%"></div></div>` +
    `<span class="spd-val">${spdLabel}</span>`;
  card.appendChild(bar);

  if (m.location) card.appendChild(el("div", "pal-loc", "📍 " + esc(m.location)));
  if (m.note || m.notes) card.appendChild(el("div", "pal-note", esc(m.note || m.notes)));
  addBreedLine(card, m.name, m.catchLevel);
  addCatchRow(card, m.name, m.catchLevel);
  return card;
}

// ---- Breeding ----
function breedRanks() { return (DATA.breeding && DATA.breeding.ranks) || {}; }
function breedSpecials() { return (DATA.breeding && DATA.breeding.special) || []; }
let _breedExcluded = null;
function breedExcluded() {
  if (!_breedExcluded) _breedExcluded = new Set((DATA.breeding && DATA.breeding.excluded) || []);
  return _breedExcluded;
}

function fillBreedSelects() {
  const ranks = breedRanks();
  const names = Object.keys(ranks).sort((a, b) => a.localeCompare(b));
  ["breed-a", "breed-b", "breed-target"].forEach(id => {
    const sel = $(id);
    if (!sel) return;
    const first = sel.querySelector("option");
    sel.innerHTML = "";
    sel.appendChild(first);
    names.forEach(n => { const o = el("option", null, esc(n)); o.value = n; sel.appendChild(o); });
  });
}

function computeChild(a, b) {
  const ranks = breedRanks();
  if (!a || !b) return null;
  if (a === b) return { child: a, kind: "same" };
  // unique/special combo overrides the formula (order-independent)
  const sp = breedSpecials().find(s =>
    (s.parentA === a && s.parentB === b) || (s.parentA === b && s.parentB === a));
  if (sp) return { child: sp.child, kind: "special" };
  const ra = ranks[a], rb = ranks[b];
  if (ra == null || rb == null) return { child: null, kind: "unknown" };
  // Normal averaging: child = candidate whose breed-power is closest to the target.
  // Candidate pool excludes "special-only" pals; on an exact tie the HIGHER power wins.
  const target = Math.floor((ra + rb + 1) / 2);
  const excluded = breedExcluded();
  let best = null, bestDiff = Infinity, bestRank = -Infinity;
  Object.keys(ranks).forEach(n => {
    if (excluded.has(n)) return;
    const r = ranks[n];
    const d = Math.abs(r - target);
    if (d < bestDiff || (d === bestDiff && r > bestRank)) { best = n; bestDiff = d; bestRank = r; }
  });
  return { child: best, kind: "formula" };
}

function renderBreedResult() {
  const box = $("breed-result");
  if (!box) return;
  box.innerHTML = "";
  const r = computeChild(state.breedA, state.breedB);
  if (!r) { box.appendChild(el("div", "muted-line", "Choose two parents to see the offspring.")); return; }
  if (r.kind === "unknown") { box.appendChild(el("div", "muted-line", "No breed-rank data for one of these pals.")); return; }
  const tag = r.kind === "special" ? '<span class="pill special">unique combo</span>'
    : r.kind === "same" ? '<span class="pill">same species</span>' : "";
  box.innerHTML = `<div class="breed-eq"><span>${esc(state.breedA)}</span> + <span>${esc(state.breedB)}</span> →</div>` +
    `<div class="breed-child">${esc(r.child || "?")} ${tag}</div>`;
  if (r.child) {
    const child = el("div", "breed-child-row");
    addCatchRow(child, r.child, null);
    box.appendChild(child);
  }
}

function renderBreeding() {
  const out = $("breeding-out");
  if (!out) return;
  out.innerHTML = "";
  const b = DATA.breeding || {};
  renderBreedResult();

  if (b.formula) {
    const f = el("div", "breed-formula");
    f.innerHTML = `<b>How it works:</b> ${esc(b.formula)}`;
    out.appendChild(f);
  }
  if (b.curated && b.curated.length) {
    out.appendChild(el("div", "group-h", "Key combos worth breeding"));
    b.curated.forEach(c => {
      const card = el("div", "pal");
      card.appendChild(el("div", "pal-top", `<span class="pal-name">${esc(c.child)}</span>`));
      card.appendChild(el("div", "combo-parents", `${esc(c.parentA)} <span class="plus">+</span> ${esc(c.parentB)}`));
      if (c.why) card.appendChild(el("div", "pal-note", esc(c.why)));
      addCatchRow(card, c.child, null);
      out.appendChild(card);
    });
  }
  if (b.special && b.special.length) {
    out.appendChild(el("div", "group-h", `Unique combos (${b.special.length})`));
    const wrap = el("div", "special-list");
    b.special.forEach(s => {
      wrap.appendChild(el("div", "special-row",
        `${esc(s.parentA)} <span class="plus">+</span> ${esc(s.parentB)} <span class="arrow">→</span> <b>${esc(s.child)}</b>`));
    });
    out.appendChild(wrap);
  }
  if (!b.formula && !(b.curated || []).length && !(b.special || []).length) {
    out.appendChild(el("div", "empty", "No breeding data loaded yet."));
  }
}

// ---- Breeding path finder (target → best parent pairs) ----
let _breedRev = null;
function buildBreedReverse() {
  if (_breedRev) return _breedRev;
  _breedRev = {};
  const ranks = breedRanks();
  const excl = breedExcluded();
  const names = Object.keys(ranks);
  // sorted non-excluded candidate pool for fast nearest-power lookup
  const cands = names.filter(n => !excl.has(n)).map(n => [n, ranks[n]]).sort((a, b) => a[1] - b[1]);
  const powers = cands.map(c => c[1]);
  function nearest(target) {
    let lo = 0, hi = powers.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (powers[mid] < target) lo = mid + 1; else hi = mid; }
    let best = null, bd = Infinity, bp = -Infinity;
    for (let k = lo - 1; k <= lo + 1; k++) {
      if (k < 0 || k >= cands.length) continue;
      const c = cands[k], d = Math.abs(c[1] - target);
      if (d < bd || (d === bd && c[1] > bp)) { best = c[0]; bd = d; bp = c[1]; }
    }
    return best;
  }
  const spMap = {};
  breedSpecials().forEach(s => { spMap[s.parentA + "|" + s.parentB] = s.child; spMap[s.parentB + "|" + s.parentA] = s.child; });
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i], b = names[j];
      const child = spMap[a + "|" + b] || nearest(Math.floor((ranks[a] + ranks[b] + 1) / 2));
      if (child) (_breedRev[child] = _breedRev[child] || []).push([a, b]);
    }
  }
  return _breedRev;
}
let _catchMap = null;
function catchMap() {
  if (_catchMap) return _catchMap;
  _catchMap = {};
  (DATA.pals || []).forEach(p => { _catchMap[p.name] = p.catchLevel; });
  (DATA.mounts || []).forEach(mn => { if (!(mn.name in _catchMap)) _catchMap[mn.name] = mn.catchLevel; });
  return _catchMap;
}
// Obtainability proxy: known catch level, else derived from breed power (common pals = high power = low level).
function obtainScore(name) {
  const cm = catchMap();
  if (name in cm) { const c = cm[name]; return c == null ? 1 : c; }
  const p = breedRanks()[name];
  if (p == null) return 60;
  return Math.max(1, Math.min(80, Math.round((3100 - p) / 42)));
}
function parentTag(name) {
  const cm = catchMap();
  if (name in cm) return cm[name] == null ? "easy catch" : "catch Lv " + cm[name];
  return "~Lv " + obtainScore(name);
}
function bestPairsFor(target, limit) {
  const pairs = (buildBreedReverse()[target] || []).slice();
  pairs.sort((x, y) =>
    Math.max(obtainScore(x[0]), obtainScore(x[1])) - Math.max(obtainScore(y[0]), obtainScore(y[1])));
  return pairs.slice(0, limit || 5);
}
function renderBreedPath(target) {
  const out = $("breed-path");
  if (!out) return;
  out.innerHTML = "";
  if (!target) return;
  out.appendChild(el("div", "group-h", "Ways to breed " + esc(target)));
  const pairs = bestPairsFor(target, 6);
  if (!pairs.length) {
    const msg = breedRanks()[target] != null
      ? `No two-parent recipe — breed two ${esc(target)}, or catch it.`
      : "No breeding recipe found.";
    out.appendChild(el("div", "muted-line", msg));
    return;
  }
  out.appendChild(el("div", "muted-line", "Easiest parent pairs first:"));
  pairs.forEach(([a, b]) => {
    const card = el("div", "path-row");
    card.innerHTML = `<div class="path-main"><b>${esc(a)}</b> <span class="ptag">${esc(parentTag(a))}</span>` +
      ` <span class="plus">+</span> <b>${esc(b)}</b> <span class="ptag">${esc(parentTag(b))}</span></div>`;
    [a, b].forEach(par => {
      if (obtainScore(par) >= 45) {
        const sub = bestPairsFor(par, 1)[0];
        if (sub) card.appendChild(el("div", "path-sub", `↳ ${esc(par)} from ${esc(sub[0])} + ${esc(sub[1])}`));
      }
    });
    out.appendChild(card);
  });
}

// ---- Pal detail popover ----
function closePalModal() { const ex = $("pal-modal"); if (ex) ex.remove(); }
function showPalDetail(name) {
  closePalModal();
  const pal = (DATA.pals || []).find(p => p.name === name);
  const mount = (DATA.mounts || []).find(p => p.name === name);
  const inRanks = breedRanks()[name] != null;
  if (!pal && !mount && !inRanks) return;

  const overlay = el("div"); overlay.id = "pal-modal"; overlay.className = "modal";
  overlay.addEventListener("click", e => { if (e.target === overlay) closePalModal(); });
  const card = el("div", "modal-card");
  card.appendChild(el("div", "modal-title", esc(name)));

  const suits = pal ? pal.suitabilities : null;
  if (suits && suits.length) {
    const sb = el("div", "suits");
    suits.slice().sort((a, b) => b.level - a.level).forEach(s => sb.appendChild(el("span", "suit", `${esc(s.type)} <b>${s.level}</b>`)));
    card.appendChild(sb);
  }
  if (mount) card.appendChild(el("div", "pal-note", `🏇 ${esc(mount.category)} mount · speed ${mount.speed || "?"}${mount.speedKind === "swim" ? " (swim)" : ""}`));

  const catchLevel = pal ? pal.catchLevel : (mount ? mount.catchLevel : undefined);
  if (catchLevel !== undefined) {
    const parts = [catchLevel == null ? "starter / easy catch" : "catch Lv " + catchLevel];
    if (catchLevel != null) parts.push("🎯 " + sphereFor(catchLevel));
    if (nightOnly(name)) parts.push("🌙 night only");
    card.appendChild(el("div", "modal-meta", esc(parts.join("  ·  "))));
  }
  if (pal && pal.ranchDrop) card.appendChild(el("div", "pal-ranch", "🐄 Ranch: " + esc(pal.ranchDrop)));
  if (pal && pal.location) card.appendChild(el("div", "pal-loc", "📍 " + esc(pal.location)));
  const note = (pal && (pal.note || pal.notes)) || (mount && (mount.note || mount.notes));
  if (note) card.appendChild(el("div", "pal-note", esc(note)));

  const pairs = bestPairsFor(name, 3);
  if (pairs.length) {
    card.appendChild(el("div", "group-h", "Breed from"));
    pairs.forEach(pr => card.appendChild(el("div", "path-row", `<div class="path-main"><b>${esc(pr[0])}</b> <span class="plus">+</span> <b>${esc(pr[1])}</b></div>`)));
  } else if (inRanks) {
    card.appendChild(el("div", "muted-line", `Self-only — breed two ${esc(name)}, or catch it.`));
  }

  card.appendChild(el("div", "catch-tip", "💡 " + CATCH_TIP));
  const actions = el("div", "modal-actions");
  const mapBtn = el("button", "map-btn", "🗺️ Map"); mapBtn.addEventListener("click", () => openMap(name));
  const closeBtn = el("button", "map-btn", "Close"); closeBtn.addEventListener("click", closePalModal);
  actions.appendChild(mapBtn); actions.appendChild(closeBtn);
  card.appendChild(actions);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ---- Non-blocking warning toast (inline-styled so it never depends on styles.css) ----
function showHotkeyWarning(msg) {
  let host = $("pp-toast");
  if (!host) {
    host = el("div"); host.id = "pp-toast";
    host.style.cssText = "position:fixed;left:50%;bottom:14px;transform:translateX(-50%);" +
      "max-width:88%;z-index:9999;background:#3a2a12;color:#ffd9a0;border:1px solid #7a5a1e;" +
      "border-radius:8px;padding:8px 12px;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.4);" +
      "display:flex;gap:10px;align-items:center;";
    document.body.appendChild(host);
  }
  host.innerHTML = "";
  host.appendChild(el("span", null, "⚠️ " + esc(msg)));
  const x = el("button", null, "Dismiss");
  x.style.cssText = "background:transparent;color:#ffd9a0;border:1px solid #7a5a1e;border-radius:5px;" +
    "padding:2px 8px;cursor:pointer;font-size:11px;white-space:nowrap;";
  x.addEventListener("click", () => host.remove());
  host.appendChild(x);
}

// ---- What's New / Welcome popup ----
function dismissWhatsNew(overlay) {
  try { localStorage.setItem("palpocket.lastSeenVersion", APP_VERSION); } catch (e) {}
  if (overlay) overlay.remove();
}
function showWhatsNew(mode) {
  closePalModal();
  const overlay = el("div"); overlay.id = "pal-modal"; overlay.className = "modal";
  overlay.dataset.whatsnew = "1"; // lets the global Escape handler persist the dismissal
  overlay.addEventListener("click", e => { if (e.target === overlay) dismissWhatsNew(overlay); });
  const card = el("div", "modal-card");
  const welcome = mode === "welcome";
  card.appendChild(el("div", "modal-title", welcome ? "Welcome to PalPocket 🎒" : "What's New — v" + APP_VERSION));
  if (!welcome) card.appendChild(el("div", "modal-meta", "Version " + APP_VERSION));
  const bullets = welcome ? WELCOME_NOTES : (releaseNotes()[APP_VERSION] || []);
  const ul = el("ul", "blist tips"); bullets.forEach(b => ul.appendChild(el("li", null, esc(b)))); card.appendChild(ul);
  const actions = el("div", "modal-actions");
  const ok = el("button", "map-btn", mode === "manual" ? "Close" : "Got it");
  ok.addEventListener("click", () => dismissWhatsNew(overlay));
  actions.appendChild(ok); card.appendChild(actions);
  overlay.appendChild(card); document.body.appendChild(overlay);
}
function maybeShowWhatsNew() {
  let last = null;
  try { last = localStorage.getItem("palpocket.lastSeenVersion"); } catch (e) {}
  if (!last) showWhatsNew("welcome");
  else if (last !== APP_VERSION && (releaseNotes()[APP_VERSION] || []).length) showWhatsNew("update");
}

// ---- Quick search ----
let _searchIndex = null;
function searchIndex() {
  if (_searchIndex) return _searchIndex;
  const set = new Set();
  (DATA.pals || []).forEach(p => set.add(p.name));
  (DATA.mounts || []).forEach(p => set.add(p.name));
  Object.keys(breedRanks()).forEach(n => set.add(n));
  _searchIndex = [...set].sort((a, b) => a.localeCompare(b));
  return _searchIndex;
}
function runSearch(q) {
  const box = $("search-results");
  if (!box) return;
  q = (q || "").trim().toLowerCase();
  if (!q) { box.classList.add("hidden"); box.innerHTML = ""; return; }
  const hits = searchIndex().filter(n => n.toLowerCase().includes(q)).slice(0, 12);
  box.innerHTML = "";
  if (!hits.length) { box.appendChild(el("div", "search-empty", "No pal found.")); box.classList.remove("hidden"); return; }
  hits.forEach(n => {
    const row = el("div", "search-item", esc(n));
    row.addEventListener("click", () => {
      $("search").value = ""; box.classList.add("hidden"); box.innerHTML = "";
      showPalDetail(n);
    });
    box.appendChild(row);
  });
  box.classList.remove("hidden");
}

// ---- wiring ----
function switchTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".tabpanel").forEach(p => p.classList.toggle("active", p.id === "tab-" + name));
  if (name === "planner") renderPlanner();
  if (name === "bylevel") renderByLevel();
  if (name === "ladders") renderLadders();
  if (name === "mounts") renderMounts();
  if (name === "bosses") renderBosses();
  if (name === "base") { renderBaseTypePicker(); renderBaseTypeDetail(); renderBase(); }
  if (name === "breeding") renderBreeding();
  if (name === "guide") renderGuide();
  if (name === "passives") renderPassives();
}

// ---- Passives / traits guide ----
const PASSIVE_CATS = ["Combat", "Movement", "Work", "Defense", "Negative"];
const PASSIVE_CAT_LABEL = {
  Combat: "⚔️ Combat", Movement: "🏃 Movement / mount", Work: "🔨 Work / base",
  Defense: "🛡️ Defense", Negative: "⚠️ Negative — breed these out",
};
function renderPassives() {
  const out = $("passives-out");
  if (!out) return;
  out.innerHTML = "";
  const P = DATA.passives;
  if (!P || !P.categories) { out.appendChild(el("div", "empty", "No passive data loaded yet.")); return; }

  // Best 4-passive builds
  if (P.bestBuilds && !state.passivesFilter) {
    out.appendChild(el("div", "group-h", "Best 4-passive builds"));
    const BUILD_LABEL = { battle: "⚔️ Battle", mount: "🏇 Mount", worker: "🔨 Worker" };
    Object.keys(P.bestBuilds).forEach(k => {
      const row = el("div", "build-row");
      row.innerHTML = `<span class="build-k">${esc(BUILD_LABEL[k] || k)}</span>` +
        P.bestBuilds[k].map(p => `<span class="build-p">${esc(p)}</span>`).join("");
      out.appendChild(row);
    });
    if (P.breedingMechanics) {
      const note = el("div", "breed-formula");
      note.innerHTML = `<b>Stacking passives:</b> ${esc(P.breedingMechanics)}`;
      out.appendChild(note);
    }
  }

  const cats = state.passivesFilter ? [state.passivesFilter] : PASSIVE_CATS;
  cats.forEach(cat => {
    const list = P.categories[cat];
    if (!list || !list.length) return;
    out.appendChild(el("div", "group-h", PASSIVE_CAT_LABEL[cat] || cat));
    list.forEach(p => {
      const row = el("div", "passive-row" + (p.good === false ? " bad" : " good"));
      row.innerHTML = `<span class="passive-name">${esc(p.name)}</span><span class="passive-eff">${esc(p.effect)}</span>`;
      out.appendChild(row);
    });
  });
}

// ---- Guide: which base to build, and when ----
function renderGuide() {
  const out = $("guide-out");
  if (!out) return;
  out.innerHTML = "";
  const plan = DATA.basePlan || [];
  if (!plan.length) { out.appendChild(el("div", "empty", "No base plan loaded.")); return; }
  plan.forEach(step => {
    const card = el("div", "guide-step");
    const head = el("div", "guide-head",
      `<span class="guide-n">${esc(step.icon || step.n)}</span>` +
      `<span class="guide-title">${esc(step.n)}. ${esc(step.base)}</span>`);
    card.appendChild(head);
    const meta = el("div", "guide-meta");
    meta.innerHTML = `<span class="guide-when">🕑 ${esc(step.when)}</span><span class="guide-unlock">🔓 ${esc(step.unlock)}</span>`;
    card.appendChild(meta);
    card.appendChild(el("div", "guide-focus", esc(step.focus)));
    if (step.baseType) {
      const btn = el("button", "guide-open", "Open this base →");
      btn.addEventListener("click", () => {
        state.baseType = step.baseType;
        switchTab("base");
        renderBaseTypePicker();
        renderBaseTypeDetail();
      });
      card.appendChild(btn);
    }
    out.appendChild(card);
  });
}

// ---- Bosses: Alpha & Tower checklist ----
const ELEM_ICON = {
  Neutral: "⭐", Fire: "🔥", Water: "💧", Grass: "🌿", Electric: "⚡",
  Ground: "⛰️", Ice: "❄️", Dark: "🌑", Dragon: "🐉",
};
function elemChip(label, elem, title) {
  // elem may be a compound like "Ice/Dragon"; pick the first for the icon.
  const first = String(elem || "").split("/")[0].trim();
  const icon = ELEM_ICON[first] || "";
  const c = el("span", "elem-chip elem-" + first.toLowerCase(), `${icon} ${label}: <b>${esc(elem)}</b>`);
  if (title) c.title = title;
  return c;
}
function bossKey(b) { return (b.kind || "") + ":" + b.name; }
function bossCard(b) {
  const done = !!state.bossDone[bossKey(b)];
  const card = el("div", "pal boss" + (b.kind === "tower" ? " tower" : "") + (done ? " done" : ""));

  const top = el("div", "pal-top");
  const left = el("label", "boss-check");
  const cb = el("input"); cb.type = "checkbox"; cb.checked = done;
  cb.addEventListener("change", () => {
    if (cb.checked) state.bossDone[bossKey(b)] = 1; else delete state.bossDone[bossKey(b)];
    saveBossDone(); renderBosses();
  });
  const nm = el("span", "pal-name clickable", (b.kind === "tower" ? "🗼 " : "💀 ") + esc(b.name));
  // Tower boss names are "Human & Pal"; open the pal's map (part after &).
  const mapName = b.kind === "tower" && b.name.includes("&") ? b.name.split("&").pop().trim() : b.name;
  nm.addEventListener("click", () => openMap(mapName));
  left.appendChild(cb); left.appendChild(nm);
  top.appendChild(left);
  top.appendChild(el("span", "pal-catch " + (state.level >= (b.level || 0) ? "avail" : "locked"), "Lv " + esc(b.level)));
  card.appendChild(top);

  if (b.faction) card.appendChild(el("div", "boss-faction", esc(b.faction)));

  const chips = el("div", "elem-row");
  if (b.element) chips.appendChild(elemChip("Type", b.element));
  if (b.weakness) chips.appendChild(elemChip("Weak to", b.weakness, "Bring " + b.weakness + "-type pals & attacks"));
  card.appendChild(chips);

  if (b.location) card.appendChild(el("div", "pal-loc", "📍 " + esc(b.location)));
  if (b.note) card.appendChild(el("div", "pal-note", esc(b.note)));
  return card;
}
function renderBossGroup(out, label, list) {
  if (!list.length) return;
  const shown = state.bossesHideDone ? list.filter(b => !state.bossDone[bossKey(b)]) : list;
  if (!shown.length) return;
  const doneN = list.filter(b => state.bossDone[bossKey(b)]).length;
  out.appendChild(el("div", "group-h", `${label} — ${doneN}/${list.length} beaten`));
  shown.slice().sort((a, b) => (a.level || 0) - (b.level || 0)).forEach(b => out.appendChild(bossCard(b)));
}
function renderBosses() {
  const out = $("bosses-out");
  if (!out) return;
  out.innerHTML = "";
  const B = DATA.bosses || {};
  const towers = (B.towers || []).map(b => ({ ...b, kind: "tower" }));
  const alphas = (B.alphas || []).map(b => ({ ...b, kind: "alpha" }));
  const all = towers.concat(alphas);

  const prog = $("bosses-progress");
  if (prog) {
    if (!all.length) { prog.innerHTML = ""; }
    else {
      const doneN = all.filter(b => state.bossDone[bossKey(b)]).length;
      const pct = Math.round((doneN / all.length) * 100);
      prog.innerHTML = `<div class="boss-prog-label"><b>${doneN}</b> / ${all.length} bosses beaten</div>` +
        `<div class="spd-track"><div class="spd-fill" style="width:${pct}%"></div></div>`;
    }
  }

  if (!all.length) { out.appendChild(el("div", "empty", "No boss data loaded yet.")); return; }
  const f = state.bossesFilter;
  if (f !== "alpha") renderBossGroup(out, "🗼 Tower bosses", towers);
  if (f !== "tower") renderBossGroup(out, "💀 Alpha & field bosses", alphas);
  if (!out.children.length) out.appendChild(el("div", "empty", "Nothing to show — all done or filtered out. 🎉"));
}

function setLevel(v) {
  v = Math.max(1, Math.min(70, parseInt(v, 10) || 1));
  state.level = v;
  $("level").value = v;
  $("level-num").value = v;
  // Only re-render panels that are actually visible; the slider fires on every input event.
  if ($("tab-planner").classList.contains("active")) renderPlanner();
  if ($("tab-bylevel").classList.contains("active")) renderByLevel();
  if ($("tab-mounts").classList.contains("active")) renderMounts();
  if ($("tab-base").classList.contains("active")) renderBaseTypeDetail();
}

// Live clock — the Windows device's local time.
function startClock() {
  const elc = $("clock");
  if (!elc) return;
  const tick = () => { elc.textContent = "🕒 " + new Date().toLocaleTimeString(); };
  tick();
  setInterval(tick, 1000);
}

function init() {
  if (DATA._seed) $("seed-flag").classList.remove("hidden"); else $("seed-flag").classList.add("hidden");

  $("level").addEventListener("input", e => setLevel(e.target.value));
  $("level-num").addEventListener("change", e => setLevel(e.target.value));
  $("slots").value = state.slots;
  $("slots").addEventListener("change", e => {
    const v = Math.max(1, Math.min(MAX_SLOTS, parseInt(e.target.value, 10) || 1)); // clamp to the base cap
    state.slots = v; $("slots").value = v; renderPlanner();
  });

  document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
  $("bylevel-filter").addEventListener("change", e => { state.bylevelFilter = e.target.value; renderByLevel(); });
  $("mounts-filter").addEventListener("change", e => { state.mountsFilter = e.target.value; renderMounts(); });
  $("mounts-avail").addEventListener("change", e => { state.mountsAvailOnly = e.target.checked; renderMounts(); });
  $("breed-a").addEventListener("change", e => { state.breedA = e.target.value; renderBreedResult(); });
  $("breed-b").addEventListener("change", e => { state.breedB = e.target.value; renderBreedResult(); });
  $("breed-target").addEventListener("change", e => renderBreedPath(e.target.value));
  $("passives-filter").addEventListener("change", e => { state.passivesFilter = e.target.value; renderPassives(); });
  $("bosses-filter").addEventListener("change", e => { state.bossesFilter = e.target.value; renderBosses(); });
  $("bosses-hidedone").addEventListener("change", e => { state.bossesHideDone = e.target.checked; renderBosses(); });
  $("search").addEventListener("input", e => runSearch(e.target.value));
  $("search").addEventListener("blur", () => setTimeout(() => { const b = $("search-results"); if (b) b.classList.add("hidden"); }, 150));
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    // If the open modal is the What's New popup, persist the dismissal so it doesn't reappear next launch.
    const m = $("pal-modal");
    if (m && m.dataset.whatsnew === "1") dismissWhatsNew(m);
    else closePalModal();
    const b = $("search-results"); if (b) b.classList.add("hidden");
  });

  startClock();
  const wn = $("whatsnew"); if (wn) wn.addEventListener("click", () => showWhatsNew("manual"));
  loadBaseSlots();
  loadBossDone();
  renderSuitPicker();
  fillBylevelFilter();
  fillBreedSelects();
  setLevel(state.level);

  // Overlay window controls (no-op when opened in a plain browser).
  if (hasOverlay) {
    $("opacity").addEventListener("input", e => window.overlay.setOpacity(e.target.value / 100));
    let ct = false;
    $("click-through").addEventListener("click", () => { ct = !ct; window.overlay.setClickThrough(ct); $("click-through").classList.toggle("active", ct); });
    let pinned = true;
    $("pin").addEventListener("click", () => { pinned = !pinned; window.overlay.togglePin(pinned); $("pin").classList.toggle("active", pinned); });
    $("min").addEventListener("click", () => window.overlay.minimize());
    $("close").addEventListener("click", () => window.overlay.close());
    window.overlay.onClickThroughChanged(v => { ct = v; $("click-through").classList.toggle("active", v); });
    if (window.overlay.onUpdateReady) {
      window.overlay.onUpdateReady(version => {
        if ($("update-pill")) return;
        const pill = el("button", "update-pill", "⬆ v" + esc(version));
        pill.id = "update-pill";
        pill.title = "Update v" + version + " downloaded — click to restart and install (or it installs when you close the app)";
        pill.addEventListener("click", () => window.overlay.installUpdate());
        const bar = document.querySelector("#titlebar .tb-drag");
        if (bar) bar.appendChild(pill);
      });
    }
    if (window.overlay.getStartup) {
      window.overlay.getStartup().then(v => { $("startup").checked = !!v; });
      $("startup").addEventListener("change", e => window.overlay.setStartup(e.target.checked));
    }
    // A global hotkey failed to register — almost always because PalPocket + PalPocket Beta
    // are running at once and both claim Ctrl+Alt+N/C. Warn instead of failing silently.
    if (window.overlay.onHotkeysUnavailable) {
      window.overlay.onHotkeysUnavailable(info => {
        const dead = [];
        if (info && info.show === false) dead.push("Ctrl+Alt+N (show/hide)");
        if (info && info.clickThrough === false) dead.push("Ctrl+Alt+C (click-through)");
        if (!dead.length) return;
        showHotkeyWarning("Hotkey unavailable: " + dead.join(" and ") +
          ". Another app (likely PalPocket Beta) already holds it — close that copy to free it.");
      });
    }
    // Restore saved UI prefs so the controls match the window we just reopened.
    if (window.overlay.getUiState) {
      window.overlay.getUiState().then(s => {
        if (!s) return;
        if ($("opacity")) $("opacity").value = Math.round((s.opacity || 1) * 100);
        pinned = s.pinned !== false;
        $("pin").classList.toggle("active", pinned);
        ct = !!s.clickThrough;
        $("click-through").classList.toggle("active", ct);
        if (s.betaBuild && $("beta-flag")) $("beta-flag").classList.remove("hidden");
        if ($("beta-updates")) {
          if (s.betaBuild) {
            // This IS the dedicated Beta app — always on the pre-release stream; lock the control.
            $("beta-updates").checked = true;
            $("beta-updates").disabled = true;
            const lbl = $("beta-updates").parentElement;
            if (lbl) lbl.title = "This is the Beta app — it always receives pre-release builds";
          } else {
            $("beta-updates").checked = !!s.beta;
          }
        }
      });
    }
    if (window.overlay.setBeta && $("beta-updates")) {
      $("beta-updates").addEventListener("change", e => { if (!e.target.disabled) window.overlay.setBeta(e.target.checked); });
    }
  } else {
    $("close").addEventListener("click", () => window.close());
  }

  resolveVersion().then(() => {
    const verEl = $("ver"); if (verEl) verEl.textContent = "v" + APP_VERSION;
    maybeShowWhatsNew();
  });
}

document.addEventListener("DOMContentLoaded", init);
