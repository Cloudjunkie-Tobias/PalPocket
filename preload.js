const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlay', {
  setOpacity: (v) => ipcRenderer.send('set-opacity', v),
  setClickThrough: (v) => ipcRenderer.send('set-click-through', v),
  togglePin: (v) => ipcRenderer.send('toggle-pin', v),
  close: () => ipcRenderer.send('close-app'),
  minimize: () => ipcRenderer.send('minimize-app'),
  onClickThroughChanged: (cb) => ipcRenderer.on('click-through-changed', (_e, v) => cb(v)),
  getStartup: () => ipcRenderer.invoke('get-startup'),
  setStartup: (v) => ipcRenderer.send('set-startup', v),
  openExternal: (url) => ipcRenderer.send('open-external', url),
});
