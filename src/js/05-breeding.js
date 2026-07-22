"use strict";
// PalPocket — Breeding calculator + path finder.
// Part of the app split from the former single src/app.js (load order set in index.html).
// ---- Breeding ----
function breedRanks() {
  return (DATA.breeding && DATA.breeding.ranks) || {};
}
function breedSpecials() {
  return (DATA.breeding && DATA.breeding.special) || [];
}
let _breedExcluded = null;
function breedExcluded() {
  if (!_breedExcluded) _breedExcluded = new Set((DATA.breeding && DATA.breeding.excluded) || []);
  return _breedExcluded;
}

function fillBreedSelects() {
  const ranks = breedRanks();
  const names = Object.keys(ranks).sort((a, b) => a.localeCompare(b));
  ["breed-a", "breed-b", "breed-target"].forEach((id) => {
    const sel = $(id);
    if (!sel) return;
    const first = sel.querySelector("option");
    sel.innerHTML = "";
    sel.appendChild(first);
    names.forEach((n) => {
      const o = el("option", null, esc(n));
      o.value = n;
      sel.appendChild(o);
    });
  });
}

function computeChild(a, b) {
  const ranks = breedRanks();
  if (!a || !b) return null;
  if (a === b) return { child: a, kind: "same" };
  // unique/special combo overrides the formula (order-independent)
  const sp = breedSpecials().find((s) => (s.parentA === a && s.parentB === b) || (s.parentA === b && s.parentB === a));
  if (sp) return { child: sp.child, kind: "special" };
  const ra = ranks[a],
    rb = ranks[b];
  if (ra == null || rb == null) return { child: null, kind: "unknown" };
  // Normal averaging: child = candidate whose breed-power is closest to the target.
  // Candidate pool excludes "special-only" pals; on an exact tie the HIGHER power wins.
  const target = Math.floor((ra + rb + 1) / 2);
  const excluded = breedExcluded();
  let best = null,
    bestDiff = Infinity,
    bestRank = -Infinity;
  Object.keys(ranks).forEach((n) => {
    if (excluded.has(n)) return;
    const r = ranks[n];
    const d = Math.abs(r - target);
    if (d < bestDiff || (d === bestDiff && r > bestRank)) {
      best = n;
      bestDiff = d;
      bestRank = r;
    }
  });
  return { child: best, kind: "formula" };
}

function renderBreedResult() {
  const box = $("breed-result");
  if (!box) return;
  box.innerHTML = "";
  const r = computeChild(state.breedA, state.breedB);
  if (!r) {
    box.appendChild(el("div", "muted-line", "Choose two parents to see the offspring."));
    return;
  }
  if (r.kind === "unknown") {
    box.appendChild(el("div", "muted-line", "No breed-rank data for one of these pals."));
    return;
  }
  const tag =
    r.kind === "special"
      ? '<span class="pill special">unique combo</span>'
      : r.kind === "same"
        ? '<span class="pill">same species</span>'
        : "";
  box.innerHTML =
    `<div class="breed-eq"><span>${esc(state.breedA)}</span> + <span>${esc(state.breedB)}</span> →</div>` +
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
    b.curated.forEach((c) => {
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
    b.special.forEach((s) => {
      wrap.appendChild(
        el(
          "div",
          "special-row",
          `${esc(s.parentA)} <span class="plus">+</span> ${esc(s.parentB)} <span class="arrow">→</span> <b>${esc(s.child)}</b>`
        )
      );
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
  const cands = names
    .filter((n) => !excl.has(n))
    .map((n) => [n, ranks[n]])
    .sort((a, b) => a[1] - b[1]);
  const powers = cands.map((c) => c[1]);
  function nearest(target) {
    let lo = 0,
      hi = powers.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (powers[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    let best = null,
      bd = Infinity,
      bp = -Infinity;
    for (let k = lo - 1; k <= lo + 1; k++) {
      if (k < 0 || k >= cands.length) continue;
      const c = cands[k],
        d = Math.abs(c[1] - target);
      if (d < bd || (d === bd && c[1] > bp)) {
        best = c[0];
        bd = d;
        bp = c[1];
      }
    }
    return best;
  }
  const spMap = {};
  breedSpecials().forEach((s) => {
    spMap[s.parentA + "|" + s.parentB] = s.child;
    spMap[s.parentB + "|" + s.parentA] = s.child;
  });
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i],
        b = names[j];
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
  (DATA.pals || []).forEach((p) => {
    _catchMap[p.name] = p.catchLevel;
  });
  (DATA.mounts || []).forEach((mn) => {
    if (!(mn.name in _catchMap)) _catchMap[mn.name] = mn.catchLevel;
  });
  return _catchMap;
}
// Obtainability proxy: known catch level, else derived from breed power (common pals = high power = low level).
function obtainScore(name) {
  const cm = catchMap();
  if (name in cm) {
    const c = cm[name];
    return c == null ? 1 : c;
  }
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
  pairs.sort((x, y) => Math.max(obtainScore(x[0]), obtainScore(x[1])) - Math.max(obtainScore(y[0]), obtainScore(y[1])));
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
    const msg =
      breedRanks()[target] != null
        ? `No two-parent recipe — breed two ${esc(target)}, or catch it.`
        : "No breeding recipe found.";
    out.appendChild(el("div", "muted-line", msg));
    return;
  }
  out.appendChild(el("div", "muted-line", "Easiest parent pairs first:"));
  pairs.forEach(([a, b]) => {
    const card = el("div", "path-row");
    card.innerHTML =
      `<div class="path-main"><b>${esc(a)}</b> <span class="ptag">${esc(parentTag(a))}</span>` +
      ` <span class="plus">+</span> <b>${esc(b)}</b> <span class="ptag">${esc(parentTag(b))}</span></div>`;
    [a, b].forEach((par) => {
      if (obtainScore(par) >= 45) {
        const sub = bestPairsFor(par, 1)[0];
        if (sub) card.appendChild(el("div", "path-sub", `↳ ${esc(par)} from ${esc(sub[0])} + ${esc(sub[1])}`));
      }
    });
    out.appendChild(card);
  });
}
