
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send_noti: () => ipcRenderer.send('send_noti')
});