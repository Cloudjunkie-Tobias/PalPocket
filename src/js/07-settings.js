"use strict";
// PalPocket — Settings panel, tab show/hide, custom hotkeys, quick search.
// Part of the app split from the former single src/app.js (load order set in index.html).
// ---- Settings panel + tab show/hide ----
const LS_TABS = "palpocket.hiddenTabs";
let hiddenTabs = new Set();
function loadHiddenTabs() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_TABS));
    hiddenTabs = new Set(Array.isArray(raw) ? raw : []);
  } catch (e) {
    hiddenTabs = new Set();
  }
}
function saveHiddenTabs() {
  try {
    localStorage.setItem(LS_TABS, JSON.stringify([...hiddenTabs]));
  } catch (e) {}
}
function allTabButtons() {
  return [...document.querySelectorAll(".tabs .tab")].map((b) => ({
    id: b.dataset.tab,
    label: b.textContent.trim(),
    btn: b,
  }));
}
function applyTabVisibility() {
  const tabs = allTabButtons();
  tabs.forEach((t) => t.btn.classList.toggle("hidden", hiddenTabs.has(t.id)));
  // If the active tab just got hidden, jump to the first visible one.
  const active = document.querySelector(".tabs .tab.active");
  if (active && hiddenTabs.has(active.dataset.tab)) {
    const firstVisible = tabs.find((t) => !hiddenTabs.has(t.id));
    if (firstVisible) switchTab(firstVisible.id);
  }
}
function buildTabVisibility() {
  const host = $("tab-visibility");
  if (!host) return;
  host.innerHTML = "";
  allTabButtons().forEach((t) => {
    const row = el("label", "tabvis-row");
    const cb = el("input");
    cb.type = "checkbox";
    cb.checked = !hiddenTabs.has(t.id);
    cb.addEventListener("change", () => {
      if (!cb.checked) {
        // Guardrail: never hide the last remaining visible tab.
        const visibleCount = allTabButtons().filter((x) => !hiddenTabs.has(x.id)).length;
        if (visibleCount <= 1) {
          cb.checked = true;
          return;
        }
        hiddenTabs.add(t.id);
      } else {
        hiddenTabs.delete(t.id);
      }
      saveHiddenTabs();
      applyTabVisibility();
    });
    row.appendChild(cb);
    row.appendChild(el("span", null, esc(t.label)));
    host.appendChild(row);
  });
}
function openSettings() {
  buildTabVisibility();
  const m = $("settings-modal");
  if (m) m.classList.remove("hidden");
}
function closeSettings() {
  const m = $("settings-modal");
  if (m) m.classList.add("hidden");
}
function settingsOpen() {
  const m = $("settings-modal");
  return m && !m.classList.contains("hidden");
}

// ---- Custom hotkeys ----
const HK_DEFAULTS = { show: "Control+Alt+N", clickThrough: "Control+Alt+C" };
let hkCurrent = { ...HK_DEFAULTS };
let hkCapturing = null; // action being captured, or null
function fmtAccel(a) {
  return String(a || "")
    .replace(/CommandOrControl|Control/g, "Ctrl")
    .replace(/Super|Meta/g, "Win")
    .split("+")
    .join(" + ");
}
function renderHotkeyButtons() {
  ["show", "clickThrough"].forEach((a) => {
    const btn = $("hk-" + a);
    if (btn && hkCapturing !== a) btn.textContent = fmtAccel(hkCurrent[a]);
  });
}
function hotkeyMsg(text, ok) {
  const m = $("hotkey-msg");
  if (!m) return;
  if (!text) {
    m.classList.add("hidden");
    m.textContent = "";
    return;
  }
  m.textContent = text;
  m.classList.toggle("bad", !ok);
  m.classList.remove("hidden");
}
// Build an Electron accelerator from a keydown event; null if it isn't a usable combo.
function accelFromEvent(e) {
  const mods = [];
  if (e.ctrlKey) mods.push("Control");
  if (e.altKey) mods.push("Alt");
  if (e.shiftKey) mods.push("Shift");
  if (e.metaKey) mods.push("Super");
  if (!mods.length) return null; // a global shortcut must have a modifier
  const c = e.code || "";
  let key = null,
    m;
  if ((m = c.match(/^Key([A-Z])$/))) key = m[1];
  else if ((m = c.match(/^Digit(\d)$/))) key = m[1];
  else if ((m = c.match(/^Numpad(\d)$/))) key = m[1];
  else if ((m = c.match(/^F(\d{1,2})$/))) key = "F" + m[1];
  else if (c === "ArrowUp") key = "Up";
  else if (c === "ArrowDown") key = "Down";
  else if (c === "ArrowLeft") key = "Left";
  else if (c === "ArrowRight") key = "Right";
  else if (c === "Space") key = "Space";
  else return null;
  return mods.join("+") + "+" + key;
}
async function saveHotkey(action, accel) {
  if (!(hasOverlay && window.overlay.setHotkey)) {
    hkCurrent[action] = accel;
    renderHotkeyButtons();
    return;
  }
  const res = await window.overlay.setHotkey(action, accel);
  if (res && res.ok) {
    hkCurrent[action] = res.accelerator;
    hotkeyMsg("Saved ✓", true);
  } else {
    hotkeyMsg((res && res.error) || "Couldn't set that combo.", false);
  }
  renderHotkeyButtons();
}
function startHotkeyCapture(action) {
  if (hkCapturing) return;
  const btn = $("hk-" + action);
  if (!btn) return;
  hkCapturing = action;
  btn.classList.add("capturing");
  btn.textContent = "Press keys…";
  hotkeyMsg("");
  const onKey = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === "Escape") {
      endHotkeyCapture(onKey);
      renderHotkeyButtons();
      return;
    }
    if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) return; // wait for the real key
    const accel = accelFromEvent(e);
    if (!accel) {
      hotkeyMsg("Use Ctrl / Alt / Shift + a letter, number, F-key or arrow.", false);
      return;
    }
    endHotkeyCapture(onKey);
    saveHotkey(action, accel);
  };
  btn._hk = onKey;
  document.addEventListener("keydown", onKey, true); // capture phase, so Esc doesn't close Settings
}
function endHotkeyCapture(onKey) {
  if (onKey) document.removeEventListener("keydown", onKey, true);
  if (hkCapturing) {
    const b = $("hk-" + hkCapturing);
    if (b) b.classList.remove("capturing");
  }
  hkCapturing = null;
}

// ---- Quick search ----
let _searchIndex = null;
function searchIndex() {
  if (_searchIndex) return _searchIndex;
  const set = new Set();
  (DATA.pals || []).forEach((p) => set.add(p.name));
  (DATA.mounts || []).forEach((p) => set.add(p.name));
  Object.keys(breedRanks()).forEach((n) => set.add(n));
  _searchIndex = [...set].sort((a, b) => a.localeCompare(b));
  return _searchIndex;
}
function runSearch(q) {
  const box = $("search-results");
  if (!box) return;
  q = (q || "").trim().toLowerCase();
  if (!q) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }
  const hits = searchIndex()
    .filter((n) => n.toLowerCase().includes(q))
    .slice(0, 12);
  box.innerHTML = "";
  if (!hits.length) {
    box.appendChild(el("div", "search-empty", "No pal found."));
    box.classList.remove("hidden");
    return;
  }
  hits.forEach((n) => {
    const row = el("div", "search-item", esc(n));
    row.addEventListener("click", () => {
      $("search").value = "";
      box.classList.add("hidden");
      box.innerHTML = "";
      showPalDetail(n);
    });
    box.appendChild(row);
  });
  box.classList.remove("hidden");
}
