"use strict";
// PalPocket — Pal detail popover, warning toast, What's New / Welcome.
// Part of the app split from the former single src/app.js (load order set in index.html).
// ---- Pal detail popover ----
function closePalModal() {
  const ex = $("pal-modal");
  if (ex) ex.remove();
}
function showPalDetail(name) {
  closePalModal();
  const pal = (DATA.pals || []).find((p) => p.name === name);
  const mount = (DATA.mounts || []).find((p) => p.name === name);
  const inRanks = breedRanks()[name] != null;
  if (!pal && !mount && !inRanks) return;

  const overlay = el("div");
  overlay.id = "pal-modal";
  overlay.className = "modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", name + " details");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePalModal();
  });
  const card = el("div", "modal-card");
  card.appendChild(el("div", "modal-title", esc(name)));

  const suits = pal ? pal.suitabilities : null;
  if (suits && suits.length) {
    const sb = el("div", "suits");
    suits
      .slice()
      .sort((a, b) => b.level - a.level)
      .forEach((s) => sb.appendChild(el("span", "suit", `${esc(s.type)} <b>${s.level}</b>`)));
    card.appendChild(sb);
  }
  if (mount)
    card.appendChild(
      el(
        "div",
        "pal-note",
        `🏇 ${esc(mount.category)} mount · speed ${mount.speed || "?"}${mount.speedKind === "swim" ? " (swim)" : ""}`
      )
    );

  const catchLevel = pal ? pal.catchLevel : mount ? mount.catchLevel : undefined;
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
    pairs.forEach((pr) =>
      card.appendChild(
        el(
          "div",
          "path-row",
          `<div class="path-main"><b>${esc(pr[0])}</b> <span class="plus">+</span> <b>${esc(pr[1])}</b></div>`
        )
      )
    );
  } else if (inRanks) {
    card.appendChild(el("div", "muted-line", `Self-only — breed two ${esc(name)}, or catch it.`));
  }

  card.appendChild(el("div", "catch-tip", "💡 " + CATCH_TIP));
  const actions = el("div", "modal-actions");
  const mapBtn = el("button", "map-btn", "🗺️ Map");
  mapBtn.addEventListener("click", () => openMap(name));
  const closeBtn = el("button", "map-btn", "Close");
  closeBtn.addEventListener("click", closePalModal);
  actions.appendChild(mapBtn);
  actions.appendChild(closeBtn);
  card.appendChild(actions);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ---- Non-blocking warning toast (inline-styled so it never depends on styles.css) ----
function showHotkeyWarning(msg) {
  let host = $("pp-toast");
  if (!host) {
    host = el("div");
    host.id = "pp-toast";
    host.style.cssText =
      "position:fixed;left:50%;bottom:14px;transform:translateX(-50%);" +
      "max-width:88%;z-index:9999;background:#3a2a12;color:#ffd9a0;border:1px solid #7a5a1e;" +
      "border-radius:8px;padding:8px 12px;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.4);" +
      "display:flex;gap:10px;align-items:center;";
    document.body.appendChild(host);
  }
  host.innerHTML = "";
  host.appendChild(el("span", null, "⚠️ " + esc(msg)));
  const x = el("button", null, "Dismiss");
  x.style.cssText =
    "background:transparent;color:#ffd9a0;border:1px solid #7a5a1e;border-radius:5px;" +
    "padding:2px 8px;cursor:pointer;font-size:11px;white-space:nowrap;";
  x.addEventListener("click", () => host.remove());
  host.appendChild(x);
}

// ---- What's New / Welcome popup ----
function dismissWhatsNew(overlay) {
  try {
    localStorage.setItem("palpocket.lastSeenVersion", APP_VERSION);
  } catch (e) {}
  if (overlay) overlay.remove();
}
function showWhatsNew(mode) {
  closePalModal();
  const overlay = el("div");
  overlay.id = "pal-modal";
  overlay.className = "modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", mode === "welcome" ? "Welcome to PalPocket" : "What's new");
  overlay.dataset.whatsnew = "1"; // lets the global Escape handler persist the dismissal
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) dismissWhatsNew(overlay);
  });
  const card = el("div", "modal-card");
  const welcome = mode === "welcome";
  card.appendChild(el("div", "modal-title", welcome ? "Welcome to PalPocket 🎒" : "What's New — v" + APP_VERSION));
  if (!welcome) card.appendChild(el("div", "modal-meta", "Version " + APP_VERSION));
  const bullets = welcome ? WELCOME_NOTES : releaseNotes()[APP_VERSION] || [];
  const ul = el("ul", "blist tips");
  bullets.forEach((b) => ul.appendChild(el("li", null, esc(b))));
  card.appendChild(ul);
  const actions = el("div", "modal-actions");
  const ok = el("button", "map-btn", mode === "manual" ? "Close" : "Got it");
  ok.addEventListener("click", () => dismissWhatsNew(overlay));
  actions.appendChild(ok);
  card.appendChild(actions);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}
function maybeShowWhatsNew() {
  let last = null;
  try {
    last = localStorage.getItem("palpocket.lastSeenVersion");
  } catch (e) {}
  if (!last) showWhatsNew("welcome");
  else if (last !== APP_VERSION && (releaseNotes()[APP_VERSION] || []).length) showWhatsNew("update");
}
