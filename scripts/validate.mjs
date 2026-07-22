#!/usr/bin/env node
// Data integrity checker for src/data.js — run before every release (`npm run validate`).
//
// This is the closest thing PalPocket has to a test suite: it guards the recurring
// class of bug (wrong breeding refs, mistyped pal names → dead paldb.cc map links,
// bad suitability types → silently-broken planner) that has shipped before.
//
// It checks STRUCTURE and REFERENTIAL INTEGRITY, not game-facts. It cannot know that a
// recipe is factually wrong — but it will catch a recipe pointing at a pal that doesn't
// exist, a mistyped work type, an out-of-range suitability, or a broken cross-reference.
//
// Exit code: 0 = clean (warnings allowed), 1 = errors found (or any warning with --strict).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");

// Palworld's complete, fixed sets — a value outside these is a typo, not new content.
const WORK_TYPES = new Set([
  "Kindling",
  "Watering",
  "Planting",
  "Gathering",
  "Handiwork",
  "Lumbering",
  "Mining",
  "Medicine",
  "Cooling",
  "Transport",
  "Farming",
  "Electricity",
]);
const MOUNT_CATEGORIES = new Set(["Ground", "Flying", "Water"]);
const MAX_SUITABILITY = 8; // 1.0 / Feybreak scale

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const isPosNum = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;
const isNonEmptyStr = (s) => typeof s === "string" && s.trim().length > 0;
// Skip referential checks on descriptive multi-pal cells like "Lyleen / Petallia" or "A + B".
const isCompound = (s) => /[/+&]|(\bor\b)/i.test(String(s));

// ---- load src/data.js the same way the app does (it assigns window.PAL_DATA = {...}) ----
// Uses the repo's own load convention (cf. release.mjs loading notes.js) — no eval.
function loadData() {
  const src = readFileSync(join(ROOT, "src", "data.js"), "utf8");
  const w = {};
  new Function("window", src)(w);
  if (!w.PAL_DATA || typeof w.PAL_DATA !== "object") {
    throw new Error("data.js did not assign window.PAL_DATA to an object");
  }
  return w.PAL_DATA;
}

let DATA;
try {
  DATA = loadData();
} catch (e) {
  console.error(`\n✗ Could not load src/data.js: ${e.message}\n`);
  process.exit(1);
}

const b = DATA.breeding || {};
// Canonical name universe: worker pals ∪ the full breeding rank table (~298 names).
// A single (non-compound) pal name referenced anywhere should resolve to this set;
// if it doesn't, it's almost certainly a typo (→ a dead paldb.cc map link).
const KNOWN = new Set([...(DATA.pals || []).map((p) => p && p.name).filter(Boolean), ...Object.keys(b.ranks || {})]);
const checkName = (where, name) => {
  if (!isNonEmptyStr(name)) return err(where, "empty/invalid pal name");
  if (!isCompound(name) && !KNOWN.has(name)) {
    warn(where, `unknown pal name "${name}" (typo? → dead map link)`);
  }
};

// ---- pals ----
if (!Array.isArray(DATA.pals) || DATA.pals.length === 0) {
  err("pals", "missing or empty");
} else {
  const seen = new Set();
  for (const p of DATA.pals) {
    const id = p && p.name ? p.name : "<unnamed>";
    const w = `pals["${id}"]`;
    if (!isNonEmptyStr(p.name)) err(w, "missing/empty name");
    else if (seen.has(p.name)) err(w, "duplicate pal name");
    else seen.add(p.name);

    if (!isPosNum(p.catchLevel)) err(w, `catchLevel must be a positive number (got ${JSON.stringify(p.catchLevel)})`);

    if (!Array.isArray(p.suitabilities) || p.suitabilities.length === 0) {
      err(w, "no suitabilities");
    } else {
      for (const s of p.suitabilities) {
        if (!s || !WORK_TYPES.has(s.type)) err(w, `invalid suitability type ${JSON.stringify(s && s.type)}`);
        if (!Number.isInteger(s && s.level) || s.level < 1 || s.level > MAX_SUITABILITY) {
          err(
            w,
            `suitability ${s && s.type} level out of range 1..${MAX_SUITABILITY} (got ${JSON.stringify(s && s.level)})`
          );
        }
      }
    }
    // A worker pal that's absent from the breeding table is suspicious (all 70 currently resolve).
    if (isNonEmptyStr(p.name) && !KNOWN.has(p.name))
      warn(w, "worker pal not present in breeding.ranks (typo or missing rank?)");
    if ("ranchDrop" in p && !isNonEmptyStr(p.ranchDrop)) err(w, "ranchDrop present but empty");
  }
}

// ---- mounts ----
if (!Array.isArray(DATA.mounts)) err("mounts", "missing or not an array");
else {
  for (const m of DATA.mounts) {
    const w = `mounts["${m && m.name ? m.name : "<unnamed>"}"]`;
    checkName(w, m.name);
    if (!MOUNT_CATEGORIES.has(m.category)) err(w, `invalid category ${JSON.stringify(m.category)}`);
    if (!isPosNum(m.speed)) err(w, `speed must be a positive number (got ${JSON.stringify(m.speed)})`);
  }
}

// ---- baseTypes ----
if (!Array.isArray(DATA.baseTypes)) err("baseTypes", "missing or not an array");
else {
  const ids = new Set();
  for (const t of DATA.baseTypes) {
    const w = `baseTypes["${t && t.id ? t.id : (t && t.name) || "<unnamed>"}"]`;
    if (!isNonEmptyStr(t.id)) err(w, "missing id");
    else if (ids.has(t.id)) err(w, "duplicate base id");
    else ids.add(t.id);
    if (!isNonEmptyStr(t.name)) err(w, "missing name");
    // "*" is a legal wildcard on a base's works (means "all suitabilities", see app.js renderBaseBody).
    for (const work of t.works || []) {
      if (work !== "*" && !WORK_TYPES.has(work)) err(w, `invalid work type ${JSON.stringify(work)}`);
    }
    for (const p of t.pals || []) {
      if (!p || !isNonEmptyStr(p.name)) err(w, "notable pal with empty name");
      else checkName(`${w}.pals`, p.name);
    }
    for (const s of t.structures || []) {
      const okString = isNonEmptyStr(s);
      const okObject = s && typeof s === "object" && isNonEmptyStr(s.item);
      if (!okString && !okObject) err(w, `malformed structure entry ${JSON.stringify(s)}`);
    }
  }
}

// ---- breeding ----
if (!b || typeof b !== "object") err("breeding", "missing");
else {
  for (const [name, power] of Object.entries(b.ranks || {})) {
    if (!isPosNum(power))
      err(`breeding.ranks["${name}"]`, `breed power must be a positive number (got ${JSON.stringify(power)})`);
  }
  const checkCombo = (arr, label) => {
    (arr || []).forEach((c, i) => {
      const w = `breeding.${label}[${i}]`;
      if (!c || typeof c !== "object") return err(w, "not an object");
      checkName(`${w}.parentA`, c.parentA);
      checkName(`${w}.parentB`, c.parentB);
      checkName(`${w}.child`, c.child);
    });
  };
  checkCombo(b.special, "special");
  checkCombo(b.curated, "curated");
  (b.excluded || []).forEach((n) => checkName("breeding.excluded", n));
}

// ---- techLevels ----
if (DATA.techLevels && typeof DATA.techLevels === "object") {
  for (const [k, v] of Object.entries(DATA.techLevels)) {
    if (!v || !isPosNum(v.lvl))
      err(`techLevels["${k}"]`, `lvl must be a positive number (got ${JSON.stringify(v && v.lvl)})`);
  }
}

// ---- passives ----
if (DATA.passives && DATA.passives.categories) {
  for (const [cat, list] of Object.entries(DATA.passives.categories)) {
    (list || []).forEach((pv, i) => {
      const w = `passives.${cat}[${i}]`;
      if (!isNonEmptyStr(pv && pv.name)) err(w, "missing passive name");
      if (!isNonEmptyStr(pv && pv.effect)) err(w, "missing passive effect");
    });
  }
}

// ---- nightOnly ----
(DATA.nightOnly || []).forEach((n) => checkName("nightOnly", n));

// ---- report ----
const pad = (n) => String(n).padStart(3, " ");
console.log(
  `\nPalPocket data validation — ${DATA.pals ? DATA.pals.length : 0} pals, ${Object.keys(b.ranks || {}).length} breeding ranks\n`
);
if (warnings.length) {
  console.log(`⚠  ${warnings.length} warning(s):`);
  warnings.forEach((m, i) => console.log(`   ${pad(i + 1)}. ${m}`));
  console.log("");
}
if (errors.length) {
  console.log(`✗  ${errors.length} error(s):`);
  errors.forEach((m, i) => console.log(`   ${pad(i + 1)}. ${m}`));
  console.log("");
}

if (errors.length || (STRICT && warnings.length)) {
  console.error(
    `✗ Data validation FAILED — ${errors.length} error(s)${STRICT ? `, ${warnings.length} warning(s) (--strict)` : ""}.\n`
  );
  process.exit(1);
}
console.log(
  `✓ Data validation passed${warnings.length ? ` (${warnings.length} warning(s) — review, not blocking)` : ""}.\n`
);
