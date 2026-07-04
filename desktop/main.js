// Thin desktop shell: loads the live site so the app is always the latest version
// (the game's service worker makes it launch offline after the first online run),
// and falls back to the bundled copy if the very first launch happens offline.
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const SITE = 'https://35packof5gum.github.io/monopoly/';

function create() {
  const w = new BrowserWindow({
    width: 1280,
    height: 880,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#12161c',
    autoHideMenuBar: true,
    title: 'Monopoly 1v1',
    icon: path.join(__dirname, 'icon-512.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  w.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  w.webContents.on('did-fail-load', (e, code) => {
    if (code !== -3) w.loadFile(path.join(__dirname, 'index.html'));
  });
  w.loadURL(SITE);
}

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
