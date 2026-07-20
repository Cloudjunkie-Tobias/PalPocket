// One-command release for PalPocket.
//   node scripts/release.mjs                 → regenerate CHANGELOG, build, publish to GitHub Releases, set release notes
//   node scripts/release.mjs --changelog-only → just regenerate CHANGELOG.md from src/notes.js
//
// Single sources of truth: version = package.json; per-version notes = src/notes.js (window.PP_NOTES).
import { execSync } from "node:child_process";
import fs from "node:fs";

const changelogOnly = process.argv.includes("--changelog-only");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;
const { owner, repo } = pkg.build.publish;

// Load canonical notes from src/notes.js (it assigns window.PP_NOTES).
const w = {};
new Function("window", fs.readFileSync("src/notes.js", "utf8"))(w);
const NOTES = w.PP_NOTES || {};

// --- CHANGELOG.md (generated; do not hand-edit) ---
function generateChangelog() {
  let md = "# Changelog\n\n_Generated from `src/notes.js` by `npm run release`. Do not edit by hand._\n";
  for (const v of Object.keys(NOTES)) {
    md += `\n## v${v}\n\n` + NOTES[v].map((b) => `- ${b}`).join("\n") + "\n";
  }
  fs.writeFileSync("CHANGELOG.md", md);
  console.log(`✓ CHANGELOG.md regenerated (${Object.keys(NOTES).length} versions)`);
}
generateChangelog();
if (changelogOnly) process.exit(0);

if (!NOTES[version]) {
  console.error(`✗ No notes for v${version} in src/notes.js — add an entry before releasing.`);
  process.exit(1);
}

// --- locate gh ---
let GH = "gh";
try { execSync(`${GH} --version`, { stdio: "ignore" }); }
catch { GH = `"C:\\Program Files\\GitHub CLI\\gh.exe"`; }
const token = execSync(`${GH} auth token`, { encoding: "utf8" }).trim();
if (!token) { console.error("✗ Could not get a GitHub token from `gh auth token`. Run `gh auth login`."); process.exit(1); }

// --- build + publish ---
console.log(`▶ Building & publishing PalPocket v${version} to ${owner}/${repo} …`);
execSync("npx electron-builder --win --publish always", { stdio: "inherit", env: { ...process.env, GH_TOKEN: token } });

// --- set the GitHub release notes from the canonical source ---
const body =
  `Palworld companion overlay for Windows.\n\n` +
  `## Install\n` +
  `Download **PalPocket-Setup-${version}.exe** (under Assets) and run it — per-user, no admin. ` +
  `Prefer no install? Use **PalPocket-portable.exe**.\n\n` +
  `> Unsigned build → Windows SmartScreen warns on first run: **More info → Run anyway**.\n\n` +
  `## What's new in v${version}\n` +
  NOTES[version].map((b) => `- ${b}`).join("\n") + "\n\n" +
  `_Installed builds auto-update from here; portable users re-download._`;
fs.writeFileSync(".release-notes.tmp", body);
execSync(`${GH} release edit v${version} --repo ${owner}/${repo} --title "PalPocket v${version}" --notes-file .release-notes.tmp`, { stdio: "inherit" });
fs.unlinkSync(".release-notes.tmp");

console.log(`\n✓ Published v${version}. Next: commit (incl. CHANGELOG.md) & push, then update the vault.`);
