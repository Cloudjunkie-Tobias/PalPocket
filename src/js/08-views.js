"use strict";
// PalPocket — Tab switching (switchTab) + Passives, Guide, Bosses views.
// Part of the app split from the former single src/app.js (load order set in index.html).
// ---- wiring ----
function switchTab(name) {
  document.querySelectorAll(".tab").forEach((t) => {
    const on = t.dataset.tab === name;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on ? "true" : "false");
    t.tabIndex = on ? 0 : -1; // roving tabindex: only the active tab is in the tab order
  });
  document.querySelectorAll(".tabpanel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + name));
  if (name === "planner") renderPlanner();
  if (name === "bylevel") renderByLevel();
  if (name === "ladders") renderLadders();
  if (name === "mounts") renderMounts();
  if (name === "bosses") renderBosses();
  if (name === "base") {
    renderBaseTypePicker();
    renderBaseTypeDetail();
    renderBase();
  }
  if (name === "breeding") renderBreeding();
  if (name === "guide") renderGuide();
  if (name === "passives") renderPassives();
}

// ---- Passives / traits guide ----
const PASSIVE_CATS = ["Combat", "Movement", "Work", "Defense", "Negative"];
const PASSIVE_CAT_LABEL = {
  Combat: "⚔️ Combat",
  Movement: "🏃 Movement / mount",
  Work: "🔨 Work / base",
  Defense: "🛡️ Defense",
  Negative: "⚠️ Negative — breed these out",
};
function renderPassives() {
  const out = $("passives-out");
  if (!out) return;
  out.innerHTML = "";
  const P = DATA.passives;
  if (!P || !P.categories) {
    out.appendChild(el("div", "empty", "No passive data loaded yet."));
    return;
  }

  // Best 4-passive builds
  if (P.bestBuilds && !state.passivesFilter) {
    out.appendChild(el("div", "group-h", "Best 4-passive builds"));
    const BUILD_LABEL = { battle: "⚔️ Battle", mount: "🏇 Mount", worker: "🔨 Worker" };
    Object.keys(P.bestBuilds).forEach((k) => {
      const row = el("div", "build-row");
      row.innerHTML =
        `<span class="build-k">${esc(BUILD_LABEL[k] || k)}</span>` +
        P.bestBuilds[k].map((p) => `<span class="build-p">${esc(p)}</span>`).join("");
      out.appendChild(row);
    });
    if (P.breedingMechanics) {
      const note = el("div", "breed-formula");
      note.innerHTML = `<b>Stacking passives:</b> ${esc(P.breedingMechanics)}`;
      out.appendChild(note);
    }
  }

  const cats = state.passivesFilter ? [state.passivesFilter] : PASSIVE_CATS;
  cats.forEach((cat) => {
    const list = P.categories[cat];
    if (!list || !list.length) return;
    out.appendChild(el("div", "group-h", PASSIVE_CAT_LABEL[cat] || cat));
    list.forEach((p) => {
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
  if (!plan.length) {
    out.appendChild(el("div", "empty", "No base plan loaded."));
    return;
  }
  plan.forEach((step) => {
    const card = el("div", "guide-step");
    const head = el(
      "div",
      "guide-head",
      `<span class="guide-n">${esc(step.icon || step.n)}</span>` +
        `<span class="guide-title">${esc(step.n)}. ${esc(step.base)}</span>`
    );
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
  Neutral: "⭐",
  Fire: "🔥",
  Water: "💧",
  Grass: "🌿",
  Electric: "⚡",
  Ground: "⛰️",
  Ice: "❄️",
  Dark: "🌑",
  Dragon: "🐉",
};
function elemChip(label, elem, title) {
  // elem may be a compound like "Ice/Dragon"; pick the first for the icon.
  const first = String(elem || "")
    .split("/")[0]
    .trim();
  const icon = ELEM_ICON[first] || "";
  const c = el("span", "elem-chip elem-" + first.toLowerCase(), `${icon} ${label}: <b>${esc(elem)}</b>`);
  if (title) c.title = title;
  return c;
}
function bossKey(b) {
  return (b.kind || "") + ":" + b.name;
}
function bossCard(b) {
  const done = !!state.bossDone[bossKey(b)];
  const card = el("div", "pal boss" + (b.kind === "tower" ? " tower" : "") + (done ? " done" : ""));

  const top = el("div", "pal-top");
  const left = el("label", "boss-check");
  const cb = el("input");
  cb.type = "checkbox";
  cb.checked = done;
  cb.addEventListener("change", () => {
    if (cb.checked) state.bossDone[bossKey(b)] = 1;
    else delete state.bossDone[bossKey(b)];
    saveBossDone();
    renderBosses();
  });
  const nm = el("span", "pal-name clickable", (b.kind === "tower" ? "🗼 " : "💀 ") + esc(b.name));
  // Tower boss names are "Human & Pal"; open the pal's map (part after &).
  const mapName = b.kind === "tower" && b.name.includes("&") ? b.name.split("&").pop().trim() : b.name;
  nm.addEventListener("click", () => openMap(mapName));
  left.appendChild(cb);
  left.appendChild(nm);
  top.appendChild(left);
  top.appendChild(
    el("span", "pal-catch " + (state.level >= (b.level || 0) ? "avail" : "locked"), "Lv " + esc(b.level))
  );
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
  const shown = state.bossesHideDone ? list.filter((b) => !state.bossDone[bossKey(b)]) : list;
  if (!shown.length) return;
  const doneN = list.filter((b) => state.bossDone[bossKey(b)]).length;
  out.appendChild(el("div", "group-h", `${label} — ${doneN}/${list.length} beaten`));
  shown
    .slice()
    .sort((a, b) => (a.level || 0) - (b.level || 0))
    .forEach((b) => out.appendChild(bossCard(b)));
}
function renderBosses() {
  const out = $("bosses-out");
  if (!out) return;
  out.innerHTML = "";
  const B = DATA.bosses || {};
  const towers = (B.towers || []).map((b) => ({ ...b, kind: "tower" }));
  const alphas = (B.alphas || []).map((b) => ({ ...b, kind: "alpha" }));
  const all = towers.concat(alphas);

  const prog = $("bosses-progress");
  if (prog) {
    if (!all.length) {
      prog.innerHTML = "";
    } else {
      const doneN = all.filter((b) => state.bossDone[bossKey(b)]).length;
      const pct = Math.round((doneN / all.length) * 100);
      prog.innerHTML =
        `<div class="boss-prog-label"><b>${doneN}</b> / ${all.length} bosses beaten</div>` +
        `<div class="spd-track"><div class="spd-fill" style="width:${pct}%"></div></div>`;
    }
  }

  if (!all.length) {
    out.appendChild(el("div", "empty", "No boss data loaded yet."));
    return;
  }
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
  const tick = () => {
    elc.textContent = "🕒 " + new Date().toLocaleTimeString();
  };
  tick();
  setInterval(tick, 1000);
}
