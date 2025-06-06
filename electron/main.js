import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,  // allow require/import in renderer
      contextIsolation: false, // disable context isolation so window can access Node APIs
    },
  });

  win.loadFile(path.join(__dirname, 'renderer.html'));
}

app.whenReady().then(createWindow);

// Quit when all windows closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});