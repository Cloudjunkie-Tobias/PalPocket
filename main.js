const { app, BrowserWindow, globalShortcut, ipcMain, screen, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Auto-update via GitHub Releases (installed builds only; the portable exe can't self-update).
let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { /* dev without dep */ }

let win = null;
let clickThrough = false;

// The "PalPocket Beta" build is a separate app (own appId/name/userData) that always tracks pre-releases.
// Its update channel ("beta") comes from the packaged app-update.yml; we just force prereleases on.
const IS_BETA_BUILD = app.getName().toLowerCase().includes('beta');

// ---- persisted overlay/user state (survives restarts) ----
// One small JSON file in userData holds window bounds + opacity + pin + click-through + the beta-updates flag.
const STATE_FILE = path.join(app.getPath('userData'), 'overlay-state.json');
const DEFAULT_STATE = { bounds: null, opacity: 1, pinned: true, clickThrough: false, beta: false };
let uiState = { ...DEFAULT_STATE };

function loadState() {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    uiState = { ...DEFAULT_STATE, ...raw };
  } catch (e) { uiState = { ...DEFAULT_STATE }; }
}
let _saveTimer = null;
function writeStateNow() {
  // Atomic write: temp file + rename, so a crash mid-write can't leave torn JSON.
  try {
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(uiState));
    fs.renameSync(tmp, STATE_FILE);
  } catch (e) { /* ignore */ }
}
function saveState() {
  // debounce — move/resize fire rapidly
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => { _saveTimer = null; writeStateNow(); }, 400);
}
function flushState() {
  // Synchronous flush for quit paths, so the last <400ms of changes aren't lost.
  if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
  writeStateNow();
}

// Is the OTHER PalPocket app (stable ↔ Beta) currently running? Used to decide whether a
// failed hotkey registration is worth warning about (a sibling holding it is expected/harmless).
// Matches by the packaged exe names; our own dev process ("electron.exe") never matches, and
// unrelated Electron apps (VS Code, etc.) are ignored because they aren't PalPocket*.exe.
function detectSiblingPalPocket(cb) {
  if (process.platform !== 'win32') return cb(false);
  let done = false;
  const finish = (v) => { if (!done) { done = true; cb(v); } };
  try {
    const { execFile } = require('child_process');
    const myExe = path.basename(process.execPath).toLowerCase();
    const family = ['palpocket.exe', 'palpocket beta.exe'];
    execFile('tasklist', ['/FO', 'CSV', '/NH'], { windowsHide: true }, (err, stdout) => {
      if (err || !stdout) return finish(false);
      const sibling = stdout.split(/\r?\n/).some((line) => {
        const m = line.match(/^"([^"]+)"/);
        if (!m) return false;
        const img = m[1].toLowerCase();
        return family.includes(img) && img !== myExe;
      });
      finish(sibling);
    });
    // Never let a slow/hung tasklist stall the hint — assume no sibling after 1.5s.
    setTimeout(() => finish(false), 1500);
  } catch (e) { finish(false); }
}

// Only reuse saved bounds if they still land on a currently-connected display (monitor unplugged / resolution change).
function boundsVisible(b) {
  if (!b || typeof b.x !== 'number') return false;
  return screen.getAllDisplays().some(d => {
    const wa = d.workArea;
    return b.x < wa.x + wa.width && b.x + Math.min(b.width, 200) > wa.x &&
           b.y < wa.y + wa.height && b.y + 40 > wa.y;
  });
}

function createWindow() {
  const { width: sw } = screen.getPrimaryDisplay().workAreaSize;
  const saved = boundsVisible(uiState.bounds) ? uiState.bounds : null;
  win = new BrowserWindow({
    width: saved ? saved.width : 380,
    height: saved ? saved.height : 640,
    x: saved ? saved.x : sw - 400,
    y: saved ? saved.y : 40,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    minWidth: 300,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Restore opacity + pin from saved state.
  // Always start INTERACTIVE: restoring click-through on launch can lock the user out of
  // the UI (e.g. an unclickable What's New popup). It's a per-session toggle (Ctrl+Alt+C).
  clickThrough = false;
  uiState.clickThrough = false;
  win.setOpacity(Math.max(0.15, Math.min(1, uiState.opacity || 1)));

  // Keep above fullscreen-borderless games.
  win.setAlwaysOnTop(!!uiState.pinned, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Persist window geometry as the user moves/resizes it.
  // Skip while minimized or maximized so we store the real "normal" geometry, not a maximized rect.
  const rememberBounds = () => {
    if (win && !win.isMinimized() && !win.isMaximized()) { uiState.bounds = win.getBounds(); saveState(); }
  };
  win.on('move', rememberBounds);
  win.on('resize', rememberBounds);
  win.on('closed', () => { win = null; });

  // Lock the window to the local UI — no navigating to remote URLs, no popups.
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) e.preventDefault();
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

function toggleShow() {
  if (!win) return;
  if (win.isVisible()) win.hide();
  else win.show();
}

function toggleClickThrough() {
  if (!win) return;
  clickThrough = !clickThrough;
  win.setIgnoreMouseEvents(clickThrough, { forward: true });
  uiState.clickThrough = clickThrough; saveState();
  win.webContents.send('click-through-changed', clickThrough);
}

// Apply the beta-updates preference to the updater (prereleases only surface on the alpha client).
function applyUpdaterChannel() {
  if (!autoUpdater) return;
  // The dedicated Beta app always tracks pre-releases. In the stable app it's opt-in via the settings toggle:
  // with allowPrerelease on, the GitHub provider picks the newest release INCLUDING prereleases.
  autoUpdater.allowPrerelease = IS_BETA_BUILD || !!uiState.beta;
}

// Only one copy of THIS app (stable and "PalPocket Beta" have different appIds, so they still coexist).
// Prevents two instances fighting over overlay-state.json, the updater, and the hotkeys.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) { if (!win.isVisible()) win.show(); win.focus(); }
  });
  main();
}

function main() {
app.whenReady().then(() => {
  loadState();
  createWindow();

  // globalShortcut.register returns false if another app already holds the accelerator.
  const okShow = globalShortcut.register('Control+Alt+N', toggleShow);
  const okClick = globalShortcut.register('Control+Alt+C', toggleClickThrough);
  if (!okShow || !okClick) {
    // The common cause is our OWN sibling (PalPocket ↔ PalPocket Beta) running at the same
    // time — that's expected and harmless, so stay quiet. Only warn when something ELSE grabbed
    // the hotkeys, which the user can't infer without a hint.
    detectSiblingPalPocket((siblingRunning) => {
      if (siblingRunning) return;
      const notify = () => { if (win) win.webContents.send('hotkeys-unavailable', { show: okShow, clickThrough: okClick }); };
      if (win && win.webContents.isLoading()) win.webContents.once('did-finish-load', notify);
      else notify();
    });
  }

  ipcMain.on('set-opacity', (_e, value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return; // ignore NaN/garbage so we never persist a null opacity
    const v = Math.max(0.15, Math.min(1, n));
    if (win) win.setOpacity(v);
    uiState.opacity = v; saveState();
  });
  ipcMain.on('set-click-through', (_e, value) => {
    if (!win) return;
    clickThrough = !!value;
    win.setIgnoreMouseEvents(clickThrough, { forward: true });
    uiState.clickThrough = clickThrough; saveState();
  });
  ipcMain.handle('get-version', () => app.getVersion());
  ipcMain.handle('get-startup', () => app.getLoginItemSettings().openAtLogin);
  ipcMain.on('set-startup', (_e, value) => {
    app.setLoginItemSettings({ openAtLogin: !!value });
  });
  // Renderer asks for saved UI prefs on load so its controls match the restored window.
  ipcMain.handle('get-ui-state', () => ({
    opacity: uiState.opacity, pinned: uiState.pinned,
    clickThrough: uiState.clickThrough, beta: uiState.beta,
    betaBuild: IS_BETA_BUILD,
  }));
  ipcMain.on('set-beta', (_e, value) => {
    const on = !!value;
    uiState.beta = on; saveState();
    applyUpdaterChannel();
    if (autoUpdater && app.isPackaged && !process.env.PORTABLE_EXECUTABLE_DIR) {
      if (on) {
        // Re-check right away so enabling the channel picks up a waiting prerelease.
        autoUpdater.autoInstallOnAppQuit = true;
        autoUpdater.checkForUpdates().catch(() => {});
      } else {
        // Opting out: don't silently install a prerelease that was already downloaded this session.
        // Stable channel is re-evaluated cleanly on next launch.
        autoUpdater.autoInstallOnAppQuit = false;
      }
    }
  });
  ipcMain.on('open-external', (_e, url) => {
    if (typeof url === 'string' && /^https:\/\/paldb\.cc\//.test(url)) shell.openExternal(url);
  });
  ipcMain.on('close-app', () => app.quit());
  ipcMain.on('minimize-app', () => win && win.minimize());
  ipcMain.on('toggle-pin', (_e, value) => {
    if (win) win.setAlwaysOnTop(!!value, 'screen-saver');
    uiState.pinned = !!value; saveState();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Check GitHub Releases for updates (skip in dev and in the portable build).
  if (autoUpdater && app.isPackaged && !process.env.PORTABLE_EXECUTABLE_DIR) {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true; // installs silently when the app closes
    applyUpdaterChannel();
    autoUpdater.on('update-downloaded', (info) => {
      if (win) win.webContents.send('update-ready', info.version);
    });
    autoUpdater.on('error', () => { /* offline / rate-limit — stay quiet */ });
    autoUpdater.checkForUpdates().catch(() => {});
  }
  ipcMain.on('install-update', () => {
    if (autoUpdater) autoUpdater.quitAndInstall();
  });
});

app.on('before-quit', () => flushState());
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
} // end main()
