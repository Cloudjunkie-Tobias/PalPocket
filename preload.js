const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlay', {
  setOpacity: (v) => ipcRenderer.send('set-opacity', v),
  setClickThrough: (v) => ipcRenderer.send('set-click-through', v),
  togglePin: (v) => ipcRenderer.send('toggle-pin', v),
  close: () => ipcRenderer.send('close-app'),
  minimize: () => ipcRenderer.send('minimize-app'),
  onClickThroughChanged: (cb) => ipcRenderer.on('click-through-changed', (_e, v) => cb(v)),
  getVersion: () => ipcRenderer.invoke('get-version'),
  getStartup: () => ipcRenderer.invoke('get-startup'),
  setStartup: (v) => ipcRenderer.send('set-startup', v),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  onUpdateReady: (cb) => ipcRenderer.on('update-ready', (_e, version) => cb(version)),
  installUpdate: () => ipcRenderer.send('install-update'),
});
