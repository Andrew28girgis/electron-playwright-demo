// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runPlaywrightDemo: () => ipcRenderer.invoke('run-playwright-demo'),
  onStep: (callback) => ipcRenderer.on('playwright-step', (e, msg) => callback(msg))
});
