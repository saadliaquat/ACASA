import { app, BrowserWindow } from 'electron';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

app.setAppUserModelId('com.acasa.webapp');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, '../assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl =
    process.env.NODE_ENV === 'production'
      ? `file://${path.join(__dirname, '../out/index.html')}`
      : 'http://localhost:3000';

  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  // On macOS apps stay active until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
