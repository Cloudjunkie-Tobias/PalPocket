// One-command release for PalPocket.
//   node scripts/release.mjs                 → regenerate CHANGELOG, build, publish to GitHub Releases, set release notes
//   node scripts/release.mjs --beta          → build+publish the separate "PalPocket Beta" app on the beta update channel
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

// --- version/flag guard (bidirectional) ---
// A -beta.N version and the --beta flag must always travel together. Getting this wrong is how a
// beta build reaches the stable channel (or a stable build lands on the beta channel).
if (betaApp && !isPrerelease) {
  console.error(`✗ --beta requires a pre-release version (with -beta.N); package.json has ${version}.`);
  process.exit(1);
}
if (isPrerelease && !betaApp && !changelogOnly) {
  console.error(
    `✗ ${version} is a pre-release — publish it with \`npm run release:beta\` (--beta), not \`npm run release\`.\n` +
      `  Running the stable release on a -beta version would ship a beta build on the stable channel.`
  );
  process.exit(1);
}

// --- data integrity gate ---
// The dataset IS the product. A broken breeding reference, a mistyped work type, or a misspelled
// pal name (→ dead paldb.cc map link) must never ship. Same check as `npm run validate`; errors abort.
if (!changelogOnly) {
  try {
    execSync("node scripts/validate.mjs", { stdio: "inherit" });
  } catch {
    console.error("✗ Data validation failed — aborting release. Fix src/data.js and re-run.");
    process.exit(1);
  }
}

// Load canonical notes from src/notes.js (it assigns window.PP_NOTES).
const w = {};
new Function("window", fs.readFileSync("src/notes.js", "utf8"))(w);
const NOTES = w.PP_NOTES || {};

// --- CHANGELOG.md (generated; do not hand-edit) ---
// The public changelog only lists STABLE versions — pre-release (-beta.N) keys are internal and
// must never leak into the committed CHANGELOG. On promotion the notes key drops its suffix and appears here.
function generateChangelog() {
  const versions = Object.keys(NOTES).filter((v) => !v.includes("-"));
  let md = "# Changelog\n\n_Generated from `src/notes.js` by `npm run release`. Do not edit by hand._\n";
  for (const v of versions) {
    md += `\n## v${v}\n\n` + NOTES[v].map((b) => `- ${b}`).join("\n") + "\n";
  }
  fs.writeFileSync("CHANGELOG.md", md);
  console.log(`✓ CHANGELOG.md regenerated (${versions.length} stable versions)`);
}
generateChangelog();
if (changelogOnly) process.exit(0);

if (!NOTES[version]) {
  console.error(`✗ No notes for v${version} in src/notes.js — add an entry before releasing.`);
  process.exit(1);
}

// --- locate gh + get a token (friendly errors instead of a raw throw when logged out) ---
let GH = "gh";
try {
  execSync(`${GH} --version`, { stdio: "ignore" });
} catch {
  GH = `"C:\\Program Files\\GitHub CLI\\gh.exe"`;
}
let token = "";
try {
  token = execSync(`${GH} auth token`, { encoding: "utf8" }).trim();
} catch {
  token = "";
}
if (!token) {
  console.error("✗ Could not get a GitHub token from `gh auth token`. Run `gh auth login` first.");
  process.exit(1);
}

// --- pre-flight safeguards ---
// Wrong-branch guard: beta releases come off `beta`, stable off `main`. Warn loudly rather than
// silently shipping from the wrong branch (a merge you forgot, a detached HEAD, etc.).
try {
  const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  const expected = betaApp ? "beta" : "main";
  if (branch !== expected) {
    console.warn(
      `⚠ On branch "${branch}" but a ${betaApp ? "beta" : "stable"} release usually ships from "${expected}". Double-check this is intentional.`
    );
  }
} catch {
  /* not a git checkout / git missing — skip */
}

// Existing-release guard: electron-builder would try to reuse/clobber a release with this tag.
// If v${version} already exists, the version wasn't bumped (or a prior run half-completed).
try {
  execSync(`${GH} release view v${version} --repo ${owner}/${repo}`, { stdio: "ignore" });
  console.error(
    `✗ A GitHub release for v${version} already exists. Bump the version in package.json, ` +
      `or delete that release if you're re-running a failed publish.`
  );
  process.exit(1);
} catch {
  /* release does not exist → good, proceed */
}

// --- build + publish ---
const productName = betaApp ? "PalPocket Beta" : "PalPocket";
let buildFlag = "";
const BETA_CFG = "electron-builder-beta.json";
if (betaApp) {
  // A fully separate app: own appId + name (→ own Start-menu shortcut, install dir, and userData),
  // own artifact names, and its OWN update channel ("beta.yml") so it never sees stable's latest.yml.
  const cfg = JSON.parse(JSON.stringify(pkg.build));
  cfg.productName = "PalPocket Beta";
  cfg.appId = "com.tobias.palpocket.beta";
  cfg.extraMetadata = { ...(cfg.extraMetadata || {}), productName: "PalPocket Beta", name: "palpocket-beta" };
  // channel:beta keeps it on beta.yml; releaseType:prerelease makes GitHub flag it as a pre-release
  // FROM CREATION, so it's never briefly the "latest" release that a stable updater could grab.
  cfg.publish = { ...cfg.publish, channel: "beta", releaseType: "prerelease" };
  cfg.nsis = {
    ...cfg.nsis,
    artifactName: "PalPocket-Beta-Setup-${version}.exe",
    shortcutName: "PalPocket Beta",
    uninstallDisplayName: "PalPocket Beta ${version}",
  };
  cfg.portable = { ...cfg.portable, artifactName: "PalPocket-Beta-portable.exe" };
  fs.writeFileSync(BETA_CFG, JSON.stringify(cfg, null, 2));
  buildFlag = ` -c ${BETA_CFG}`;
}
console.log(`▶ Building & publishing ${productName} v${version} to ${owner}/${repo} …`);
try {
  execSync(`npx electron-builder --win${buildFlag} --publish always`, {
    stdio: "inherit",
    env: { ...process.env, GH_TOKEN: token },
  });
} finally {
  // Always remove the temp config, even if the build throws — otherwise it's left in the working tree.
  if (betaApp) {
    try {
      fs.unlinkSync(BETA_CFG);
    } catch (e) {}
  }
}

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
  NOTES[version].map((b) => `- ${b}`).join("\n") +
  "\n\n" +
  updateLine;
fs.writeFileSync(".release-notes.tmp", body);
// Pre-releases are flagged and kept OFF the "latest" pointer so stable friends never get pulled onto a beta.
const flags = isPrerelease ? "--prerelease --latest=false" : "--latest";
const editCmd = `${GH} release edit v${version} --repo ${owner}/${repo} ${flags} --title "${productName} v${version}" --notes-file .release-notes.tmp`;
// Retry once — a flaky network here would otherwise leave the release published with the wrong
// flags and no notes (electron-builder already created it during the build step above).
let edited = false;
for (let attempt = 1; attempt <= 2 && !edited; attempt++) {
  try {
    execSync(editCmd, { stdio: "inherit" });
    edited = true;
  } catch (e) {
    if (attempt === 1) console.warn("⚠ `gh release edit` failed — retrying once…");
  }
}
try {
  fs.unlinkSync(".release-notes.tmp");
} catch (e) {}
if (!edited) {
  console.error(
    `\n✗ The build published v${version}, but setting its flags/notes failed.\n` +
      `  The release may be live with default flags${isPrerelease ? " (NOT marked pre-release — stable users could see it!)" : ""}.\n` +
      `  Fix it manually:\n    ${editCmd.replace("--notes-file .release-notes.tmp", `--notes "See src/notes.js for v${version}"`)}`
  );
  process.exit(1);
}

console.log(
  `\n✓ Published v${version}${isPrerelease ? " (pre-release)" : ""}. Next: commit (incl. CHANGELOG.md) & push, then update the vault.`
);
