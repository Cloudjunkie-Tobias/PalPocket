"use strict";
// PalPocket — Bases: general facts + per-type base planning/leveling.
// Part of the app split from the former single src/app.js (load order set in index.html).
// ---- Base ----
function renderBase() {
  const out = $("base-out");
  out.innerHTML = "";
  const b = DATA.baseCapacity || {};
  const grid = el("div");
  const facts = [
    [
      "Worker slots per base",
      `<span class="big">${b.defaultWorkersPerBase ?? "?"}</span>${b.maxWorkersPerBase && b.maxWorkersPerBase !== b.defaultWorkersPerBase ? " (max " + b.maxWorkersPerBase + ")" : ""}`,
    ],
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
  works.forEach((type) => {
    const cands = DATA.pals
      .filter((p) => available(p) && suitLevel(p, type) > 0)
      .sort((a, b) => suitLevel(b, type) - suitLevel(a, type) || (a.catchLevel || 0) - (b.catchLevel || 0));
    if (!cands.length) {
      chosen.push({ type, pal: null });
      return;
    }
    const fresh = cands.find((p) => !used.has(p.name)) || cands[0];
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
  types.forEach((t) => {
    const c = el("div", "chip" + (state.baseType === t.id ? " on" : ""), `${esc(t.icon || "")} ${esc(t.name)}`);
    c.onclick = () => {
      state.baseType = t.id;
      renderBaseTypePicker();
      renderBaseTypeDetail();
    };
    box.appendChild(c);
  });
}

function renderBaseTypeDetail() {
  const out = $("btype-detail");
  if (!out) return;
  out.innerHTML = "";
  const types = DATA.baseTypes || [];
  if (!types.length) {
    out.appendChild(el("div", "empty", "No base-type data loaded yet."));
    return;
  }
  const t = types.find((x) => x.id === state.baseType) || types[0];

  if (t.goal) out.appendChild(el("div", "btype-goal", esc(t.goal)));

  // per-base-type slot control (rendered once; the body below re-renders on change)
  const ctrl = el("div", "btype-levelbar");
  ctrl.innerHTML = `<label>Worker slots<span class="sub">(pal beds)</span></label>`;
  const range = el("input");
  range.type = "range";
  range.min = "1";
  range.max = String(MAX_SLOTS);
  range.value = slotsOf(t.id);
  const num = el("input", "btype-lvlnum");
  num.type = "number";
  num.min = "1";
  num.max = String(MAX_SLOTS);
  num.value = slotsOf(t.id);
  const body = el("div", "btype-body");
  const apply = (v) => {
    v = Math.max(1, Math.min(MAX_SLOTS, parseInt(v, 10) || 1));
    state.baseSlots[t.id] = v;
    saveBaseSlots();
    range.value = v;
    num.value = v;
    renderBaseBody(body, t, v);
  };
  range.addEventListener("input", (e) => apply(e.target.value));
  num.addEventListener("change", (e) => apply(e.target.value));
  ctrl.appendChild(range);
  ctrl.appendChild(num);
  out.appendChild(ctrl);
  out.appendChild(body);
  renderBaseBody(body, t, slotsOf(t.id));
  renderBuildSpots(out, t);
}

// "Where to build" (v4.1): real map spots that suit THIS base type, from DATA.baseLocations.
// Verified (game8) spots first, roomiest first; community-reported spots get a "verify in-game" flag.
function renderBuildSpots(container, t) {
  const spots = (DATA.baseLocations || []).filter((l) => (l.goodFor || []).includes(t.id));
  if (!spots.length) return;
  const spaceRank = (x) => (x === "large-flat" ? 0 : x === "medium" ? 1 : x === "tight" ? 2 : 9);
  spots.sort((a, b) => b.verified - a.verified || spaceRank(a.space) - spaceRank(b.space));

  const spaceLabel = { "large-flat": "🟩 large / flat", medium: "🟨 medium", tight: "🟥 tight" };
  const fold = el("details", "fold buildspots");
  fold.appendChild(el("summary", null, `📍 Where to build (${spots.length})`));
  const list = el("div", "spot-list");
  spots.forEach((s) => {
    const card = el("div", "spot" + (s.verified ? "" : " unverified"));
    const head = el("div", "spot-head");
    head.appendChild(el("span", "spot-name", esc(s.name)));
    head.appendChild(el("span", "spot-coords", "📌 " + esc(s.coords)));
    card.appendChild(head);
    const badges = el("div", "spot-badges");
    if (s.space) badges.appendChild(el("span", "spot-badge", spaceLabel[s.space] || esc(s.space)));
    if (s.level && s.level !== "?") badges.appendChild(el("span", "spot-badge", "⚔️ lvl " + esc(s.level)));
    if (s.water) badges.appendChild(el("span", "spot-badge", "💧 water"));
    (s.resources || []).forEach((r) => badges.appendChild(el("span", "spot-badge res", esc(r))));
    if (!s.verified) badges.appendChild(el("span", "spot-badge warn", "⚠️ verify in-game"));
    card.appendChild(badges);
    if (s.note) card.appendChild(el("div", "spot-note", esc(s.note)));
    list.appendChild(card);
  });
  fold.appendChild(list);
  container.appendChild(fold);
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
    const raised =
      slots > LEVEL_SLOTS_CAP
        ? ` <span class="slot-note">(${slots - LEVEL_SLOTS_CAP} above the level-${LEVEL_SLOTS_CAP} cap — raised via World Settings)</span>`
        : "";
    body.appendChild(
      el(
        "div",
        "slot-summary",
        `<b>${slots}</b> worker slots (pal beds) ≈ base <b>Lv ${baseLevel}</b>${raised} · best pal per job you can catch at char level <b>${state.level}</b>:`
      )
    );
    pickBestForWorks(works).forEach(({ type, pal }) => {
      if (!pal) {
        body.appendChild(
          el(
            "div",
            "pal locked",
            `<div class="pal-top"><span class="pal-name">${esc(type)}</span><span class="pal-catch locked">none at lvl ${state.level}</span></div>`
          )
        );
        return;
      }
      body.appendChild(palCard(pal, type));
    });
  }

  renderTechReadiness(body, t);

  // Curated roles & ranch specifics (context the auto-picker can't capture)
  if (t.pals && t.pals.length) {
    body.appendChild(el("div", "group-h", "Notable pals & roles"));
    t.pals.forEach((p) => {
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
    const hasCounts = t.structures.some((s) => s && typeof s === "object");
    body.appendChild(el("div", "group-h", "Key structures" + (hasCounts ? " — how many to build" : "")));
    if (hasCounts) body.appendChild(el("div", "slot-summary", "Suggested counts for a maxed base:"));
    const ul = el("ul", "blist" + (hasCounts ? " struct-list" : ""));
    t.structures.forEach((s) => {
      if (s && typeof s === "object") {
        const note = s.note ? ` <span class="struct-note">— ${esc(s.note)}</span>` : "";
        ul.appendChild(
          el("li", "struct-row", `<span class="struct-qty">${esc(s.count || "1")}×</span> <b>${esc(s.item)}</b>${note}`)
        );
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
    t.tips.forEach((s) => ul.appendChild(el("li", null, esc(s))));
    body.appendChild(ul);
  }
}

// Ranch products grouped by what they drop (surfaces ranch pals by product, not by Farming level).
function renderRanchByDrop(body) {
  const producers = (DATA.pals || []).filter((p) => p.ranchDrop);
  if (!producers.length) return;
  const byDrop = {};
  producers.forEach((p) => {
    (byDrop[p.ranchDrop] = byDrop[p.ranchDrop] || []).push(p);
  });
  body.appendChild(el("div", "group-h", "Ranch products — who makes what"));
  Object.keys(byDrop)
    .sort((a, b) => a.localeCompare(b))
    .forEach((drop) => {
      const row = el("div", "ranchdrop-row");
      row.appendChild(el("div", "ranchdrop-name", "🐄 " + esc(drop)));
      const chips = el("div", "ranchdrop-pals");
      byDrop[drop]
        .sort((a, b) => (a.catchLevel == null ? -1 : a.catchLevel) - (b.catchLevel == null ? -1 : b.catchLevel))
        .forEach((p) => {
          const c = el(
            "span",
            "ranchdrop-pal clickable",
            esc(p.name) + (p.catchLevel != null ? ` <span class="rd-lv">Lv${p.catchLevel}</span>` : "")
          );
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
  const usable = needs.filter((n) => tl[n] && state.level >= tl[n].lvl).length;
  body.appendChild(el("div", "group-h", "Tech readiness"));
  body.appendChild(
    el(
      "div",
      "slot-summary",
      `At char level <b>${state.level}</b> you can research <b>${usable}/${needs.length}</b> of this base's key structures:`
    )
  );
  const wrap = el("div", "tech-list");
  needs
    .slice()
    .sort((a, b) => (tl[a] ? tl[a].lvl : 99) - (tl[b] ? tl[b].lvl : 99))
    .forEach((n) => {
      const info = tl[n];
      if (!info) return;
      const ok = state.level >= info.lvl;
      const row = el("div", "tech-row" + (ok ? " ok" : " locked"));
      const anc = info.ancient ? ` <span class="anc">Ancient</span>` : "";
      row.innerHTML =
        `<span class="tmark">${ok ? "✓" : "🔒"}</span>` +
        `<span class="tname">${esc(n)}</span><span class="tlvl">Lv ${info.lvl}${anc}</span>`;
      wrap.appendChild(row);
    });
  body.appendChild(wrap);
}

function renderRoadmap(container, t, lvl) {
  if (!t.roadmap || !t.roadmap.length) return;
  container.appendChild(el("div", "group-h", "Progression roadmap"));
  t.roadmap.forEach((step) => {
    const done = step.level != null && lvl >= step.level;
    const isNext = step.level != null && !done && lvl < step.level;
    const row = el("div", "road-step" + (done ? " done" : "") + (isNext ? " next" : ""));
    const tag = step.level != null ? `Lv ${step.level}+` : step.stage || "";
    row.innerHTML =
      `<span class="road-mark">${done ? "✓" : isNext ? "→" : "•"}</span>` +
      `<span class="road-body"><b>${esc(step.stage || tag)}</b> ${esc(step.text || "")}</span>`;
    container.appendChild(row);
  });
}
