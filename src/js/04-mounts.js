"use strict";
// PalPocket — Mounts tab.
// Part of the app split from the former single src/app.js (load order set in index.html).
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

  wantCats.forEach((cat) => {
    let group = mounts.filter((m) => m.category === cat);
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

  const catchTxt = m.catchLevel == null ? "special" : avail ? `lvl ${m.catchLevel} ✓` : `lvl ${m.catchLevel}`;
  const catchCls = m.catchLevel == null ? "avail" : avail ? "avail" : "locked";
  card.appendChild(
    el(
      "div",
      "pal-top",
      `<span class="pal-name"><span class="rank">#${rank}</span> ${esc(m.name)}</span>` +
        `<span class="pal-catch ${catchCls}">${catchTxt}</span>`
    )
  );
  const mnm = card.querySelector(".pal-name");
  if (mnm) {
    mnm.classList.add("clickable");
    mnm.addEventListener("click", () => showPalDetail(m.name));
  }

  // speed bar (relative to fastest in this category)
  const spd = m.speed;
  const pct = spd && topSpeed ? Math.max(6, Math.round((spd / topSpeed) * 100)) : 0;
  const spdLabel = spd ? `${spd}` : "n/a";
  const bar = el("div", "spd-row");
  bar.innerHTML =
    `<div class="spd-track"><div class="spd-fill" style="width:${pct}%"></div></div>` +
    `<span class="spd-val">${spdLabel}</span>`;
  card.appendChild(bar);

  if (m.location) card.appendChild(el("div", "pal-loc", "📍 " + esc(m.location)));
  if (m.note || m.notes) card.appendChild(el("div", "pal-note", esc(m.note || m.notes)));
  addBreedLine(card, m.name, m.catchLevel);
  addCatchRow(card, m.name, m.catchLevel);
  return card;
}
