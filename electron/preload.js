import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    reloadInfo: () => ipcRenderer.invoke('reload'),
    generateResume: () => ipcRenderer.invoke('generate-resume'),
    generateCoverLetter: () => ipcRenderer.invoke('compile-cover-letter'),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});
