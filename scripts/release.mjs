// One-command release for PalPocket.
//   node scripts/release.mjs                 → regenerate CHANGELOG, build, publish to GitHub Releases, set release notes
//   node scripts/release.mjs --changelog-only → just regenerate CHANGELOG.md from src/notes.js
//
// Single sources of truth: version = package.json; per-version notes = src/notes.js (window.PP_NOTES).
import { execSync } from "node:child_process";
import fs from "node:fs";

const changelogOnly = process.argv.includes("--changelog-only");
const betaApp = process.argv.includes("--beta"); // build the separate "PalPocket Beta" app on the beta update channel
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;
const { owner, repo } = pkg.build.publish;
const isPrerelease = version.includes("-"); // e.g. 3.1.0-beta.1 → GitHub pre-release, not the "latest" pointer

if (betaApp && !isPrerelease) {
  console.error(`✗ --beta requires a pre-release version (with -beta.N); package.json has ${version}.`);
  process.exit(1);
}

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
const productName = betaApp ? "PalPocket Beta" : "PalPocket";
let buildFlag = "";
if (betaApp) {
  // A fully separate app: own appId + name (→ own Start-menu shortcut, install dir, and userData),
  // own artifact names, and its OWN update channel ("beta.yml") so it never sees stable's latest.yml.
  const cfg = JSON.parse(JSON.stringify(pkg.build));
  cfg.productName = "PalPocket Beta";
  cfg.appId = "com.tobias.palpocket.beta";
  cfg.extraMetadata = { ...(cfg.extraMetadata || {}), productName: "PalPocket Beta", name: "palpocket-beta" };
  cfg.publish = { ...cfg.publish, channel: "beta" };
  cfg.nsis = {
    ...cfg.nsis,
    artifactName: "PalPocket-Beta-Setup-${version}.exe",
    shortcutName: "PalPocket Beta",
    uninstallDisplayName: "PalPocket Beta ${version}",
  };
  cfg.portable = { ...cfg.portable, artifactName: "PalPocket-Beta-portable.exe" };
  fs.writeFileSync("electron-builder-beta.json", JSON.stringify(cfg, null, 2));
  buildFlag = " -c electron-builder-beta.json";
}
console.log(`▶ Building & publishing ${productName} v${version} to ${owner}/${repo} …`);
execSync(`npx electron-builder --win${buildFlag} --publish always`, { stdio: "inherit", env: { ...process.env, GH_TOKEN: token } });
if (betaApp) { try { fs.unlinkSync("electron-builder-beta.json"); } catch (e) {} }

// --- set the GitHub release notes from the canonical source ---
const betaBanner = isPrerelease
  ? `> 🧪 **Beta / pre-release.** This is the separate **PalPocket Beta** app — it installs alongside stable PalPocket ` +
    `(own shortcut & settings) and only ever receives pre-releases. Stable users are unaffected.\n\n`
  : "";
const updateLine = isPrerelease
  ? `_Clients with beta updates on will auto-update to newer betas; everyone else stays on stable._`
  : `_Installed builds auto-update from here; portable users re-download._`;
const setupName = betaApp ? `PalPocket-Beta-Setup-${version}.exe` : `PalPocket-Setup-${version}.exe`;
const portableName = betaApp ? "PalPocket-Beta-portable.exe" : "PalPocket-portable.exe";
const body =
  `Palworld companion overlay for Windows.\n\n` +
  betaBanner +
  `## Install\n` +
  `Download **${setupName}** (under Assets) and run it — per-user, no admin. ` +
  `Prefer no install? Use **${portableName}**.\n\n` +
  `> Unsigned build → Windows SmartScreen warns on first run: **More info → Run anyway**.\n\n` +
  `## What's new in v${version}\n` +
  NOTES[version].map((b) => `- ${b}`).join("\n") + "\n\n" +
  updateLine;
fs.writeFileSync(".release-notes.tmp", body);
// Pre-releases are flagged and kept OFF the "latest" pointer so stable friends never get pulled onto a beta.
const flags = isPrerelease ? "--prerelease --latest=false" : "--latest";
execSync(`${GH} release edit v${version} --repo ${owner}/${repo} ${flags} --title "${productName} v${version}" --notes-file .release-notes.tmp`, { stdio: "inherit" });
fs.unlinkSync(".release-notes.tmp");

console.log(`\n✓ Published v${version}${isPrerelease ? " (pre-release)" : ""}. Next: commit (incl. CHANGELOG.md) & push, then update the vault.`);
