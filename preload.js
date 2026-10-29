const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openMainWindow: () => ipcRenderer.send('open-main-window'),
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  getAutostart: () => ipcRenderer.invoke('get-autostart'),
  setAutostart: (enabled) => ipcRenderer.invoke('set-autostart', enabled),
  loadHolidays: (codes) => ipcRenderer.invoke('load-holidays', codes),
  sendSummary: (summary) => ipcRenderer.send('summary', summary),
  getSummary: () => ipcRenderer.invoke('get-summary'),
  onSummary: (callback) => ipcRenderer.on('summary', (event, summary) => callback(summary)),
  pickFiles: () => ipcRenderer.invoke('pick-files'),
  openFile: (file) => ipcRenderer.invoke('open-file', file),
  deleteFile: (file) => ipcRenderer.invoke('delete-file', file),
});