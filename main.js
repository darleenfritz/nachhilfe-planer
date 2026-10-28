const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, Tray, Menu, nativeImage, screen, ipcMain } = require('electron');

const POPOVER_WIDTH = 380;
const POPOVER_HEIGHT = 560;

let mainWindow = null;
let popover = null;
let tray = null;

const EMPTY_DATA = { students: [], settings: { hourlyRate: 24 } };

function dataFile() {
  return path.join(app.getPath('userData'), 'daten.json');
}

function loadData() {
  try {
    const text = fs.readFileSync(dataFile(), 'utf8');
    return JSON.parse(text);
  } catch (error) {
    if (error.code === 'ENOENT') return structuredClone(EMPTY_DATA);
    throw error;
  }
}

function saveData(data) {
  const file = dataFile();
  const temp = file + '.tmp';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
}

function openMainWindow() {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 820,
    minHeight: 560,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('main.html');

  if (process.platform === 'darwin') app.dock.show();

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (process.platform === 'darwin') app.dock.hide();
  });
}

function createPopover() {
  popover = new BrowserWindow({
    width: POPOVER_WIDTH,
    height: POPOVER_HEIGHT,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    transparent: true,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  popover.loadFile('popover.html');
  popover.on('blur', () => popover.hide());
}

function togglePopover() {
  if (popover.isVisible()) {
    popover.hide();
    return;
  }

  const trayBounds = tray.getBounds();
  const area = screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y }).workArea;
  let x = Math.round(trayBounds.x + trayBounds.width / 2 - POPOVER_WIDTH / 2);
  x = Math.max(area.x + 8, Math.min(area.x + area.width - POPOVER_WIDTH - 8, x));
  const y = Math.round(trayBounds.y + trayBounds.height + 6);

  popover.setPosition(x, y, false);
  popover.show();
  popover.focus();
}

app.whenReady().then(() => {
  createPopover();

  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle('📚');
  tray.setToolTip('Nachhilfe');
  tray.on('click', togglePopover);
  tray.on('right-click', () => {
    tray.popUpContextMenu(Menu.buildFromTemplate([
      { label: 'App öffnen', click: openMainWindow },
      { type: 'separator' },
      { label: 'Beenden', click: () => app.quit() },
    ]));
  });

  const openedAtLogin = app.getLoginItemSettings().wasOpenedAtLogin;
  if (openedAtLogin) {
    if (process.platform === 'darwin') app.dock.hide();
  } else {
    openMainWindow();
  }
});

app.on('activate', openMainWindow);
app.on('window-all-closed', () => {});
ipcMain.on('open-main-window', openMainWindow);
ipcMain.handle('load-data', () => loadData());
ipcMain.handle('save-data', (event, data) => saveData(data));