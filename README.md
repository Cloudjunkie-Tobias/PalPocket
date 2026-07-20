# PalPocket — Palworld companion overlay

A compact, always-on-top **Palworld companion** for Windows: worker planning, mounts, base building, a breeding calculator, and passive-skill guides — all in a small overlay you can summon mid-game. Fully offline; all game data is baked in.

![Electron](https://img.shields.io/badge/Electron-31-blue) ![Platform](https://img.shields.io/badge/platform-Windows%20x64-informational) ![License](https://img.shields.io/badge/license-MIT-green)

## ⬇️ Download / Install (players)

**→ [Get the latest release](https://github.com/Cloudjunkie-Tobias/PalPocket/releases/latest)** — under **Assets**, download **`PalPocket-Setup-<version>.exe`** and run it.

It's a normal setup wizard: per-user (no admin), creates Desktop/Start Menu shortcuts and an uninstaller. Prefer no install? Grab **`PalPocket-portable.exe`** instead. Once installed, the app **updates itself** automatically from future releases.

> ⚠️ The binaries are unsigned, so Windows SmartScreen will warn on first run. Click **More info → Run anyway**.

## Using it as an overlay

- Run **Palworld in Borderless Windowed** mode (Settings → Screen Mode). The overlay draws on top.
- **Hotkeys (work even while the game is focused):**
  - `Ctrl + Alt + N` — show / hide the overlay
  - `Ctrl + Alt + C` — toggle click-through (clicks pass to the game so it doesn't block you)
- Drag it by the title bar. Use the opacity slider, 📌 pin (always-on-top), and — button to tuck it away.
- **Bases tab → "Launch on Windows startup"** keeps it ready in the background; tap `Ctrl+Alt+N` to summon it.

## Tabs

- **Planner** — set your level + base slots, pick the work you need; get the best worker lineup that fits.
- **By Level** — every worker pal grouped by progression tier, filterable by suitability.
- **Ladders** — the ordered best picks to max each work type.
- **Mounts** — ride mounts ranked by speed across Flying / Ground / Water.
- **Bases** — Mining / Breeding / Farming / All-in-one base templates: worker-slot planning, a progression roadmap, tech readiness vs. your character level, and best-in-slot workers.
- **Breeding** — parent A + B → child calculator, curated & unique combos, and a path finder (pick a target → easiest parent pairs).
- **Guide** — which base to build, and when.
- **Passives** — the passive skills worth chasing + ideal 4-passive builds.

Everywhere: 🔍 global pal search, click any pal name for a detail popover, 🗺️ spawn-map links (paldb.cc), 🎯 recommended Pal Sphere per catch level, 🌙 night-only flags, 🐄 ranch drops, and 🥚 breed hints for hard-to-catch pals.

## Develop

```bash
npm install
npm start        # dev run
npm run dist     # build installer + portable into dist/
```

Requires Node.js 18+ on Windows. `npm run dist` produces `dist/PalPocket-Setup-<version>.exe` (NSIS installer) and `dist/PalPocket-portable.exe`.

## Data

All game data lives in [`src/data.js`](src/data.js) (`window.PAL_DATA`): pals, mounts, base types, breeding ranks/combos, tech levels, passives. Edit freely — `npm start` picks changes up immediately; re-run `npm run dist` to bake them into the executables.

Data conventions:
- **Snapshot** of Palworld **1.0 + Feybreak** (verified 2026-07-20), sourced from paldb.cc and cross-checked against palworld.wiki.gg / game8; breeding validated against extracted game data.
- **catchLevel** = lowest *wild free-roaming* spawn — dungeon/cave spawns and alpha/named bosses excluded; where no plain wild spawn exists, the open-world field-boss level is used.
- Work suitabilities use the 1.0/Feybreak scale (max 8).

## License

[MIT](LICENSE). Not affiliated with Pocketpair — Palworld and all pal names are property of Pocketpair, Inc. Data compiled from public community sources (paldb.cc, palworld.wiki.gg, game8).
