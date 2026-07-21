// Canonical per-version release notes. Single source of truth — consumed by:
//   • the in-app "What's New" popup (src/app.js)
//   • CHANGELOG.md and the GitHub release body (scripts/release.mjs)
// Newest version FIRST. Add a new key here each release (the version number
// itself comes from package.json — don't duplicate it).
window.PP_NOTES = {
  "3.4.0-beta.1": [
    "🏗️ 'How many to build' structure counts now cover every base type (Mining, Breeding, All-in-one — not just Farming)",
    "🐄 New Ranch-by-drop view on the Farming base: see every ranch product and which pals make it, at a glance",
  ],
  "3.3.0": [
    "⚡ You can ranch Electric Organs! Sparkit produces them via its Partner Skill — added to the Farming base's notable pals (and corrected the earlier tip).",
  ],
  "3.2.0": [
    "🌾 Farming/Ranch base: added the Venom Gland producer (Depresso) to notable pals",
    "🏗️ Key structures now show suggested build counts (how many of each to build for a maxed base) — starting with the Farming base",
    "⚡ Clarified that Electric Organ can't be ranched — noted where to actually get it",
  ],
  "3.1.0": [
    "🏭 Base worker slots now go up to 50 (was 15) — supports servers running the raised vanilla worker cap via World Settings",
    "ℹ️ Slots above 15 are flagged as raised-via-World-Settings; base level still tops out where in-game leveling does",
    "🧪 There's now a separate 'PalPocket Beta' app you can install alongside this one to try pre-release builds early",
  ],
  "3.0.0": [
    "💀 New Bosses tab — a tickable checklist of every Tower boss + notable Alpha/field bosses, with level, location, element & what they're weak to",
    "🎯 Progress bar tracks how many bosses you've beaten; tap a name to open its map",
    "💾 The overlay now remembers where you left it — window position, size, opacity & pin all persist between launches",
    "🔮 Title-bar logo now matches the Pal Sphere app icon",
    "🧪 Opt-in 'beta updates' setting (Bases tab) for trying early builds",
  ],
  "2.0.0": [
    "🎉 Milestone release — now published on GitHub with automatic updates",
    "Under the hood: one-command releases + single-source versioning for smoother, more reliable updates",
  ],
  "1.4.0": [
    "⬆ Auto-update: the installed app now updates itself from GitHub",
    "A green update pill appears in the title bar when a new version is ready",
  ],
  "1.3.0": [
    "✨ 'What's New' popup — see updates right after installing",
    "ℹ️ Version + What's-New link on the Bases tab",
  ],
  "1.2.0": ["🕒 Live local-time clock in the title bar"],
  "1.1.0": ["Refreshed every pal's notes & locations to current 1.0/Feybreak data"],
  "1.0.0": [
    "Mounts, Bases, Breeding (calculator + path finder), Guide & Passives tabs",
    "Pal search, click-any-pal detail popovers, spawn-map links",
    "Recommended spheres, night flags, ranch drops & breed hints",
  ],
};
