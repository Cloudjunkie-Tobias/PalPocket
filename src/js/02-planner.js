"use strict";
// PalPocket — Planner, By Level, Ladders (worker-list views).
// Part of the app split from the former single src/app.js (load order set in index.html).
// ---- Planner ----
function renderSuitPicker() {
  const box = $("suit-picker");
  box.innerHTML = "";
  allSuits().forEach((t) => {
    const c = el("div", "chip" + (state.picked.has(t) ? " on" : ""), esc(t));
    c.onclick = () => {
      state.picked.has(t) ? state.picked.delete(t) : state.picked.add(t);
      renderSuitPicker();
      renderPlanner();
    };
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
  wanted.forEach((type) => {
    const cands = DATA.pals
      .filter((p) => available(p) && suitLevel(p, type) > 0)
      .sort((a, b) => suitLevel(b, type) - suitLevel(a, type) || (a.catchLevel || 0) - (b.catchLevel || 0));
    if (!cands.length) {
      chosen.push({ type, pal: null });
      return;
    }
    // prefer a pal not already used, else reuse (multi-suitability worker covers several)
    const fresh = cands.find((p) => !usedNames.has(p.name)) || cands[0];
    usedNames.add(fresh.name);
    chosen.push({ type, pal: fresh });
  });

  const distinct = [...usedNames];
  const over = distinct.length > state.slots;
  const summary = el(
    "div",
    "slot-summary" + (over ? " over" : ""),
    `Lineup uses <b>${distinct.length}</b> pal(s) for ${wanted.length} work type(s) — base holds <b>${state.slots}</b> slot(s).` +
      (over ? " Over capacity — drop a work type or use a second base." : "")
  );
  out.appendChild(summary);

  chosen.forEach(({ type, pal }) => {
    if (!pal) {
      out.appendChild(
        el(
          "div",
          "pal locked",
          `<div class="pal-top"><span class="pal-name">${esc(type)}</span><span class="pal-catch locked">none at lvl ${state.level}</span></div>`
        )
      );
      return;
    }
    out.appendChild(palCard(pal, type));
  });
}

function palCard(pal, highlightType) {
  const avail = available(pal);
  const card = el("div", "pal" + (avail ? "" : " locked"));
  const catchTxt = pal.catchLevel == null ? "starter" : avail ? `lvl ${pal.catchLevel} ✓` : `lvl ${pal.catchLevel}`;
  const catchCls = pal.catchLevel == null ? "avail" : avail ? "avail" : "locked";
  card.appendChild(
    el(
      "div",
      "pal-top",
      `<span class="pal-name">${esc(pal.name)}</span><span class="pal-catch ${catchCls}">${catchTxt}</span>`
    )
  );
  const nm = card.querySelector(".pal-name");
  if (nm) {
    nm.classList.add("clickable");
    nm.addEventListener("click", () => showPalDetail(pal.name));
  }
  const suits = el("div", "suits");
  pal.suitabilities
    .slice()
    .sort((a, b) => b.level - a.level)
    .forEach((s) => {
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
const TIER_LABEL = {
  starter: "Starter (lvl 1–5)",
  early: "Early (lvl 5–15)",
  mid: "Mid (lvl 15–35)",
  late: "Late (lvl 35–55)",
  endgame: "Endgame (lvl 55+)",
};
const TIER_ORDER = ["starter", "early", "mid", "late", "endgame"];

function renderByLevel() {
  const out = $("bylevel-out");
  out.innerHTML = "";
  const filter = state.bylevelFilter;
  const pals = DATA.pals
    .filter((p) => !filter || suitLevel(p, filter) > 0)
    .slice()
    .sort((a, b) => (a.catchLevel == null ? -1 : a.catchLevel) - (b.catchLevel == null ? -1 : b.catchLevel));

  let any = false;
  TIER_ORDER.forEach((tier) => {
    const group = pals.filter((p) => (p.tier || "early") === tier);
    if (!group.length) return;
    any = true;
    out.appendChild(el("div", "group-h", TIER_LABEL[tier] || tier));
    group.forEach((p) => out.appendChild(palCard(p, filter)));
  });
  if (!any) out.appendChild(el("div", "empty", "No pals match."));
}

function fillBylevelFilter() {
  const sel = $("bylevel-filter");
  allSuits().forEach((t) => {
    const o = el("option", null, esc(t));
    o.value = t;
    sel.appendChild(o);
  });
}

// ---- Ladders ----
function renderLadders() {
  const out = $("ladders-out");
  out.innerHTML = "";
  const ladders = DATA.suitabilityLadders || {};
  const keys = Object.keys(ladders);
  if (keys.length) {
    SUIT_ORDER.concat(keys.filter((k) => !SUIT_ORDER.includes(k))).forEach((type) => {
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
  allSuits().forEach((type) => {
    const picks = DATA.pals
      .filter((p) => suitLevel(p, type) > 0)
      .sort((a, b) => (a.catchLevel == null ? -1 : a.catchLevel) - (b.catchLevel == null ? -1 : b.catchLevel));
    const steps = [];
    let best = 0;
    picks.forEach((p) => {
      const wl = suitLevel(p, type);
      if (wl > best) {
        best = wl;
        steps.push({ name: p.name, wl, catch: p.catchLevel });
      }
    });
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
