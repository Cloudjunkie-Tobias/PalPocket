const { app, BrowserWindow, globalShortcut, ipcMain, screen, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Auto-update via GitHub Releases (installed builds only; the portable exe can't self-update).
let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { /* dev without dep */ }

let win = null;
let clickThrough = false;

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
function saveState() {
  // debounce — move/resize fire rapidly
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try { fs.writeFileSync(STATE_FILE, JSON.stringify(uiState)); } catch (e) { /* ignore */ }
  }, 400);
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
  clickThrough = !!uiState.clickThrough;
  win.setOpacity(Math.max(0.15, Math.min(1, uiState.opacity || 1)));
  if (clickThrough) win.setIgnoreMouseEvents(true, { forward: true });

  // Keep above fullscreen-borderless games.
  win.setAlwaysOnTop(!!uiState.pinned, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Persist window geometry as the user moves/resizes it.
  const rememberBounds = () => { if (win && !win.isMinimized()) { uiState.bounds = win.getBounds(); saveState(); } };
  win.on('move', rememberBounds);
  win.on('resize', rememberBounds);

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
  // Alpha client (beta on) accepts pre-releases: the GitHub provider then picks the newest release
  // INCLUDING prereleases and reads its latest.yml. Everyone else ignores prereleases and stays on stable.
  autoUpdater.allowPrerelease = !!uiState.beta;
}

app.whenReady().then(() => {
  loadState();
  createWindow();

  globalShortcut.register('Control+Alt+N', toggleShow);
  globalShortcut.register('Control+Alt+C', toggleClickThrough);

  ipcMain.on('set-opacity', (_e, value) => {
    const v = Math.max(0.15, Math.min(1, value));
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
  }));
  ipcMain.on('set-beta', (_e, value) => {
    uiState.beta = !!value; saveState();
    applyUpdaterChannel();
    // Re-check right away so enabling the channel picks up a waiting prerelease.
    if (autoUpdater && app.isPackaged && !process.env.PORTABLE_EXECUTABLE_DIR) {
      autoUpdater.checkForUpdates().catch(() => {});
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

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
