"use strict";
// PalPocket — Entry point: init() wiring + DOMContentLoaded.
// Part of the app split from the former single src/app.js (load order set in index.html).
function init() {
  if (DATA._seed) $("seed-flag").classList.remove("hidden");
  else $("seed-flag").classList.add("hidden");

  $("level").addEventListener("input", (e) => setLevel(e.target.value));
  $("level-num").addEventListener("change", (e) => setLevel(e.target.value));
  $("slots").value = state.slots;
  $("slots").addEventListener("change", (e) => {
    const v = Math.max(1, Math.min(MAX_SLOTS, parseInt(e.target.value, 10) || 1)); // clamp to the base cap
    state.slots = v;
    $("slots").value = v;
    renderPlanner();
  });

  // Tab bar: click to switch, plus ARIA tab keyboard nav (←/→/Home/End) with roving focus.
  const tabEls = [...document.querySelectorAll(".tab")];
  tabEls.forEach((t) => {
    t.addEventListener("click", () => switchTab(t.dataset.tab));
    t.tabIndex = t.classList.contains("active") ? 0 : -1;
  });
  const tablist = document.querySelector(".tabs");
  if (tablist) {
    tablist.addEventListener("keydown", (e) => {
      const keys = { ArrowLeft: -1, ArrowRight: 1, Home: "first", End: "last" };
      if (!(e.key in keys)) return;
      const visible = tabEls.filter((t) => !t.classList.contains("hidden"));
      const cur = visible.indexOf(document.activeElement);
      let next;
      if (keys[e.key] === "first") next = 0;
      else if (keys[e.key] === "last") next = visible.length - 1;
      else next = (Math.max(0, cur) + keys[e.key] + visible.length) % visible.length;
      const target = visible[next];
      if (target) {
        e.preventDefault();
        switchTab(target.dataset.tab);
        target.focus();
      }
    });
  }
  // Wire each panel to its tab for screen readers.
  document.querySelectorAll(".tabpanel").forEach((p) => {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("tabindex", "0");
    const name = p.id.replace(/^tab-/, "");
    const btn = document.querySelector(`.tab[data-tab="${name}"]`);
    if (btn) {
      if (!btn.id) btn.id = "tabbtn-" + name;
      p.setAttribute("aria-labelledby", btn.id);
    }
  });
  $("bylevel-filter").addEventListener("change", (e) => {
    state.bylevelFilter = e.target.value;
    renderByLevel();
  });
  $("mounts-filter").addEventListener("change", (e) => {
    state.mountsFilter = e.target.value;
    renderMounts();
  });
  $("mounts-avail").addEventListener("change", (e) => {
    state.mountsAvailOnly = e.target.checked;
    renderMounts();
  });
  $("breed-a").addEventListener("change", (e) => {
    state.breedA = e.target.value;
    renderBreedResult();
  });
  $("breed-b").addEventListener("change", (e) => {
    state.breedB = e.target.value;
    renderBreedResult();
  });
  $("breed-target").addEventListener("change", (e) => renderBreedPath(e.target.value));
  $("passives-filter").addEventListener("change", (e) => {
    state.passivesFilter = e.target.value;
    renderPassives();
  });
  $("bosses-filter").addEventListener("change", (e) => {
    state.bossesFilter = e.target.value;
    renderBosses();
  });
  $("bosses-hidedone").addEventListener("change", (e) => {
    state.bossesHideDone = e.target.checked;
    renderBosses();
  });
  $("search").addEventListener("input", (e) => runSearch(e.target.value));
  $("search").addEventListener("blur", () =>
    setTimeout(() => {
      const b = $("search-results");
      if (b) b.classList.add("hidden");
    }, 150)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (settingsOpen()) {
      closeSettings();
      return;
    }
    // If the open modal is the What's New popup, persist the dismissal so it doesn't reappear next launch.
    const m = $("pal-modal");
    if (m && m.dataset.whatsnew === "1") dismissWhatsNew(m);
    else closePalModal();
    const b = $("search-results");
    if (b) b.classList.add("hidden");
  });

  // Settings panel (⚙️ title-bar button)
  const setBtn = $("settings-btn");
  if (setBtn) setBtn.addEventListener("click", openSettings);
  const setClose = $("settings-close");
  if (setClose) setClose.addEventListener("click", closeSettings);
  const setModal = $("settings-modal");
  if (setModal)
    setModal.addEventListener("click", (e) => {
      if (e.target === setModal) closeSettings();
    });
  const openExt = (url) => {
    if (hasOverlay && window.overlay.openExternal) window.overlay.openExternal(url);
    else window.open(url, "_blank", "noopener");
  };
  const getBeta = $("get-beta");
  if (getBeta)
    getBeta.addEventListener("click", () => openExt("https://github.com/Cloudjunkie-Tobias/PalPocket/releases"));
  const feedback = $("feedback-btn");
  if (feedback)
    feedback.addEventListener("click", () =>
      openExt("https://github.com/Cloudjunkie-Tobias/PalPocket/issues/new/choose")
    );
  const fullCl = $("full-changelog");
  if (fullCl)
    fullCl.addEventListener("click", () =>
      openExt("https://github.com/Cloudjunkie-Tobias/PalPocket/blob/main/CHANGELOG.md")
    );
  // Hotkey rebinding
  document
    .querySelectorAll(".hotkey-cap")
    .forEach((b) => b.addEventListener("click", () => startHotkeyCapture(b.dataset.action)));
  document
    .querySelectorAll(".hotkey-reset")
    .forEach((b) => b.addEventListener("click", () => saveHotkey(b.dataset.action, HK_DEFAULTS[b.dataset.action])));
  renderHotkeyButtons(); // defaults; overwritten by getUiState below when running as the overlay
  loadHiddenTabs();

  startClock();
  const wn = $("whatsnew");
  if (wn) wn.addEventListener("click", () => showWhatsNew("manual"));
  loadBaseSlots();
  loadBossDone();
  renderSuitPicker();
  fillBylevelFilter();
  fillBreedSelects();
  setLevel(state.level);
  applyTabVisibility(); // after initial setup, so a hidden active tab can safely switch

  // Overlay window controls (no-op when opened in a plain browser).
  if (hasOverlay) {
    $("opacity").addEventListener("input", (e) => window.overlay.setOpacity(e.target.value / 100));
    let ct = false;
    // Reflect click-through state everywhere: the button, and a whole-overlay cue (border + hint
    // pill) so it's obvious the app is passing clicks through — not frozen. In click-through mode
    // the pill can't be clicked (that's the point); Ctrl+Alt+C is the way back.
    const reflectClickThrough = (v) => {
      ct = v;
      const btn = $("click-through");
      btn.classList.toggle("active", v);
      btn.setAttribute("aria-pressed", v ? "true" : "false");
      document.body.classList.toggle("ct-active", v);
    };
    $("click-through").addEventListener("click", () => {
      reflectClickThrough(!ct);
      window.overlay.setClickThrough(ct);
    });
    let pinned = true;
    $("pin").addEventListener("click", () => {
      pinned = !pinned;
      window.overlay.togglePin(pinned);
      $("pin").classList.toggle("active", pinned);
    });
    $("min").addEventListener("click", () => window.overlay.minimize());
    $("close").addEventListener("click", () => window.overlay.close());
    window.overlay.onClickThroughChanged((v) => reflectClickThrough(v));
    if (window.overlay.onUpdateReady) {
      window.overlay.onUpdateReady((version) => {
        if ($("update-pill")) return;
        const pill = el("button", "update-pill", "⬆ v" + esc(version));
        pill.id = "update-pill";
        pill.title =
          "Update v" + version + " downloaded — click to restart and install (or it installs when you close the app)";
        pill.addEventListener("click", () => window.overlay.installUpdate());
        const bar = document.querySelector("#titlebar .tb-drag");
        if (bar) bar.appendChild(pill);
      });
    }
    if (window.overlay.getStartup) {
      window.overlay.getStartup().then((v) => {
        $("startup").checked = !!v;
      });
      $("startup").addEventListener("change", (e) => window.overlay.setStartup(e.target.checked));
    }
    // A global hotkey failed to register — almost always because PalPocket + PalPocket Beta
    // are running at once and both claim Ctrl+Alt+N/C. Warn instead of failing silently.
    if (window.overlay.onHotkeysUnavailable) {
      window.overlay.onHotkeysUnavailable((info) => {
        const dead = [];
        if (info && info.show === false) dead.push("Ctrl+Alt+N (show/hide)");
        if (info && info.clickThrough === false) dead.push("Ctrl+Alt+C (click-through)");
        if (!dead.length) return;
        showHotkeyWarning(
          "Hotkey unavailable: " +
            dead.join(" and ") +
            ". Another app (likely PalPocket Beta) already holds it — close that copy to free it."
        );
      });
    }
    // Restore saved UI prefs so the controls match the window we just reopened.
    if (window.overlay.getUiState) {
      window.overlay.getUiState().then((s) => {
        if (!s) return;
        if ($("opacity")) $("opacity").value = Math.round((s.opacity || 1) * 100);
        pinned = s.pinned !== false;
        $("pin").classList.toggle("active", pinned);
        ct = !!s.clickThrough;
        $("click-through").classList.toggle("active", ct);
        if (s.hotkeys) {
          hkCurrent = { ...HK_DEFAULTS, ...s.hotkeys };
          renderHotkeyButtons();
        }
        if (s.betaBuild && $("beta-flag")) $("beta-flag").classList.remove("hidden");
        // Beta section in Settings: the dedicated Beta app shows a "you're on beta" note;
        // the normal app shows a link to install the separate Beta app.
        if (s.betaBuild) {
          const c = $("beta-current");
          if (c) c.classList.remove("hidden");
        } else {
          const g = $("beta-get");
          if (g) g.classList.remove("hidden");
        }
      });
    }
  } else {
    $("close").addEventListener("click", () => window.close());
  }

  resolveVersion().then(() => {
    const verEl = $("ver");
    if (verEl) verEl.textContent = "v" + APP_VERSION;
    maybeShowWhatsNew();
  });
}

document.addEventListener("DOMContentLoaded", init);
