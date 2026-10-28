const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openMainWindow: () => ipcRenderer.send('open-main-window'),
});