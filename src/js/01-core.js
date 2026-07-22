"use strict";
// PalPocket — Shared state, constants, persistence & helpers. MUST load first.
// Part of the app split from the former single src/app.js (load order set in index.html).

const DATA = window.PAL_DATA || { pals: [], baseCapacity: {}, suitabilityLadders: {} };
const hasOverlay = typeof window.overlay !== "undefined";

// Version is single-sourced from package.json (via app.getVersion()); resolved at init.
// Per-version notes live in src/notes.js (window.PP_NOTES). Never hardcode the version here.
let APP_VERSION = "";
function releaseNotes() {
  return window.PP_NOTES || {};
}
// Newest notes key by semver — never rely on object insertion order (integer-like
// keys would sort first and misreport the version in the browser/preview fallback).
function newestNotesVersion() {
  const parse = (v) =>
    String(v)
      .split(".")
      .map((n) => parseInt(n, 10) || 0);
  return Object.keys(releaseNotes()).sort((a, b) => {
    const pa = parse(a),
      pb = parse(b);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      if ((pb[i] || 0) !== (pa[i] || 0)) return (pb[i] || 0) - (pa[i] || 0);
    }
    return 0;
  })[0];
}
async function resolveVersion() {
  if (hasOverlay && window.overlay.getVersion) {
    try {
      APP_VERSION = await window.overlay.getVersion();
    } catch (e) {
      /* fall through */
    }
  }
  if (!APP_VERSION) APP_VERSION = newestNotesVersion() || "dev"; // preview/browser fallback = newest notes key
}
const WELCOME_NOTES = [
  "🎮 Run Palworld in Borderless Windowed (Settings → Screen Mode) so the overlay can draw on top.",
  "⌨️ Ctrl+Alt+N shows/hides the overlay · Ctrl+Alt+C toggles click-through (so clicks pass to the game). Both are rebindable in ⚙️ Settings.",
  "🖱️ Drag it by the title bar; use the opacity slider and 📌 pin to place it how you like.",
  "🔍 Plan base workers, mounts, breeding & passives — search any pal, click for details, 🗺️ open spawn maps.",
];

// Canonical suitability order for display.
const SUIT_ORDER = [
  "Kindling",
  "Watering",
  "Planting",
  "Farming",
  "Electricity",
  "Handiwork",
  "Gathering",
  "Lumbering",
  "Mining",
  "Medicine",
  "Cooling",
  "Transport",
];

const state = {
  level: 15,
  slots: DATA.baseCapacity && DATA.baseCapacity.defaultWorkersPerBase ? DATA.baseCapacity.defaultWorkersPerBase : 15,
  picked: new Set(),
  bylevelFilter: "",
  mountsFilter: "",
  mountsAvailOnly: false,
  baseType: "",
  baseSlots: {},
  baseFood: {},
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
function isPlainObject(o) {
  return o != null && typeof o === "object" && !Array.isArray(o);
}
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
  } catch (e) {
    state.baseSlots = {};
  }
}
function saveBaseSlots() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state.baseSlots));
  } catch (e) {}
}
function slotsOf(id) {
  return state.baseSlots[id] || DEFAULT_SLOTS;
}

// ---- persistence (per-base "produce own food" toggle — v4.2) ----
const LS_FOOD = "palpocket.baseFood";
// The food-production loop: seed a Berry/Wheat Plantation, water it, harvest into the Feed Box.
const FOOD_WORKS = ["Planting", "Watering", "Gathering"];
function loadBaseFood() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_FOOD));
    const clean = {};
    if (isPlainObject(raw)) for (const id of Object.keys(raw)) clean[id] = !!raw[id];
    state.baseFood = clean;
  } catch (e) {
    state.baseFood = {};
  }
}
function saveBaseFood() {
  try {
    localStorage.setItem(LS_FOOD, JSON.stringify(state.baseFood));
  } catch (e) {}
}
function foodOf(id) {
  return !!state.baseFood[id];
}

// ---- persistence (boss checklist survives restarts) ----
const LS_BOSS = "palpocket.bossDone";
function loadBossDone() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_BOSS));
    state.bossDone = isPlainObject(raw) ? raw : {};
  } catch (e) {
    state.bossDone = {};
  }
}
function saveBossDone() {
  try {
    localStorage.setItem(LS_BOSS, JSON.stringify(state.bossDone));
  } catch (e) {}
}
// A base gains +1 worker slot per base level (2 slots @ Lv1 → 15 @ Lv14), so base level ≈ slots − 1.
// Leveling tops out at 15 slots; slots 16–50 come from raised World Settings, so cap the derived level there.
const LEVEL_SLOTS_CAP = 15;
function baseLevelFromSlots(slots) {
  return Math.max(1, Math.min(LEVEL_SLOTS_CAP, slots) - 1);
}
const MAX_SLOTS = (DATA.baseCapacity && DATA.baseCapacity.maxWorkersPerBase) || 50;

// ---- helpers ----
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

function allSuits() {
  const s = new Set();
  DATA.pals.forEach((p) => p.suitabilities.forEach((su) => s.add(su.type)));
  return SUIT_ORDER.filter((x) => s.has(x)).concat([...s].filter((x) => !SUIT_ORDER.includes(x)));
}
function suitLevel(pal, type) {
  const m = pal.suitabilities.find((s) => s.type === type);
  return m ? m.level : 0;
}
const LEVEL_CAP = 70;
function available(pal) {
  // At the level cap you can still obtain higher-level pals (catch above-level or breed them).
  return pal.catchLevel == null || pal.catchLevel <= state.level || state.level >= LEVEL_CAP;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
}

// ---- catch helpers (where to catch + recommended sphere + map link) ----
function palPageUrl(name) {
  return (
    "https://paldb.cc/en/" +
    encodeURIComponent(
      String(name || "")
        .trim()
        .replace(/ /g, "_")
    )
  );
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
  const t = SPHERE_TIERS.find((x) => catchLevel <= x.max);
  return t ? t.name : "Legendary Sphere";
}
// Find a breeding recipe for a pal (prefer a real two-different-parents combo).
function breedRecipeFor(name) {
  const b = DATA.breeding || {};
  const cur = (b.curated || []).filter((c) => c.child === name);
  const pick = cur.find((c) => c.parentA !== c.parentB) || cur[0];
  if (pick) return { a: pick.parentA, b: pick.parentB, self: pick.parentA === pick.parentB };
  const sp = (b.special || []).find((s) => s.child === name);
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
  card.appendChild(el("div", "pal-breed", txt + ' <span class="breed-hint">(easier than catching)</span>'));
}

const CATCH_TIP =
  "Weaken it to red HP and hit from behind for a big catch bonus. Catching 10 of the same species grants a lasting capture-power & XP bonus.";
let _nightSet = null;
function nightOnly(name) {
  if (!_nightSet) _nightSet = new Set(DATA.nightOnly || []);
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
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openMap(name);
  });
  row.appendChild(btn);
  card.appendChild(row);
}
