const { app, BrowserWindow, globalShortcut, ipcMain, screen, shell } = require('electron');
const path = require('path');

// Auto-update via GitHub Releases (installed builds only; the portable exe can't self-update).
let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { /* dev without dep */ }

let win = null;
let clickThrough = false;

function createWindow() {
  const { width: sw } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: 380,
    height: 640,
    x: sw - 400,
    y: 40,
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

  // Keep above fullscreen-borderless games.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

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
  win.webContents.send('click-through-changed', clickThrough);
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Control+Alt+N', toggleShow);
  globalShortcut.register('Control+Alt+C', toggleClickThrough);

  ipcMain.on('set-opacity', (_e, value) => {
    if (win) win.setOpacity(Math.max(0.15, Math.min(1, value)));
  });
  ipcMain.on('set-click-through', (_e, value) => {
    if (!win) return;
    clickThrough = !!value;
    win.setIgnoreMouseEvents(clickThrough, { forward: true });
  });
  ipcMain.handle('get-startup', () => app.getLoginItemSettings().openAtLogin);
  ipcMain.on('set-startup', (_e, value) => {
    app.setLoginItemSettings({ openAtLogin: !!value });
  });
  ipcMain.on('open-external', (_e, url) => {
    if (typeof url === 'string' && /^https:\/\/paldb\.cc\//.test(url)) shell.openExternal(url);
  });
  ipcMain.on('close-app', () => app.quit());
  ipcMain.on('minimize-app', () => win && win.minimize());
  ipcMain.on('toggle-pin', (_e, value) => {
    if (win) win.setAlwaysOnTop(!!value, 'screen-saver');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Check GitHub Releases for updates (skip in dev and in the portable build).
  if (autoUpdater && app.isPackaged && !process.env.PORTABLE_EXECUTABLE_DIR) {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true; // installs silently when the app closes
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
