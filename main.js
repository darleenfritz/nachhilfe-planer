const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, Tray, Menu, nativeImage, screen, ipcMain, dialog, shell } = require('electron');

const POPOVER_WIDTH = 380;
const POPOVER_HEIGHT = 560;
const HOLIDAY_API = 'https://openholidaysapi.org/SchoolHolidays';
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const KEEP_BACKUPS = 60;
const BACKUP_PATTERN = /^daten-\d{4}-\d{2}-\d{2}\.json$/;

let mainWindow = null;
let popover = null;
let tray = null;
let quitting = false;
let lastSummary = null;

const EMPTY_DATA = { students: [], settings: { hourlyRate: 24 } };

function dataFile() {
  return path.join(app.getPath('userData'), 'daten.json');
}

function holidayFile() {
  return path.join(app.getPath('userData'), 'ferien.json');
}

function writeJson(file, data) {
  const temp = file + '.tmp';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
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
  writeJson(dataFile(), data);
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function defaultBackupFolder() {
  const icloud = path.join(app.getPath('home'), 'Library', 'Mobile Documents', 'com~apple~CloudDocs');
  if (fs.existsSync(icloud)) return path.join(icloud, 'Nachhilfe-Backup');
  return path.join(app.getPath('documents'), 'Nachhilfe-Backup');
}

function backupFolder(data) {
  return (data && data.settings && data.settings.backupOrdner) || defaultBackupFolder();
}

function backupFiles(folder) {
  try {
    return fs.readdirSync(folder).filter((name) => BACKUP_PATTERN.test(name)).sort();
  } catch (error) {
    return [];
  }
}

function runBackup(data = loadData()) {
  const folder = backupFolder(data);
  fs.mkdirSync(folder, { recursive: true });
  writeJson(path.join(folder, `daten-${todayKey()}.json`), data);
  const files = backupFiles(folder);
  files.slice(0, Math.max(0, files.length - KEEP_BACKUPS)).forEach((name) => fs.unlinkSync(path.join(folder, name)));
  return backupInfo(data);
}

function backupInfo(data = loadData()) {
  const folder = backupFolder(data);
  const files = backupFiles(folder);
  const last = files[files.length - 1];
  return {
    folder,
    count: files.length,
    last: last ? fs.statSync(path.join(folder, last)).mtime.toISOString() : null,
  };
}

function safeBackup(data) {
  try {
    runBackup(data);
  } catch (error) {
    console.error('Sicherung fehlgeschlagen:', error);
  }
}

function insideGitProject(folder) {
  let current = path.resolve(folder);
  while (true) {
    if (fs.existsSync(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

async function chooseBackupFolder() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Ordner für Sicherungen wählen',
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const folder = result.filePaths[0];
  const project = insideGitProject(folder);
  if (project) {
    return {
      error: `Dieser Ordner liegt im Programmierprojekt „${path.basename(project)}“. Sicherungen dort könnten mit auf GitHub landen. Bitte wähl einen anderen Ordner.`,
    };
  }
  return { folder };
}

function readHolidayCache() {
  try {
    return JSON.parse(fs.readFileSync(holidayFile(), 'utf8'));
  } catch (error) {
    return { regions: {} };
  }
}

async function fetchRegion(code) {
  const year = new Date().getFullYear();
  const url = new URL(HOLIDAY_API);
  url.searchParams.set('countryIsoCode', code.slice(0, 2));
  url.searchParams.set('subdivisionCode', code);
  url.searchParams.set('languageIsoCode', 'DE');
  url.searchParams.set('validFrom', `${year - 1}-07-01`);
  url.searchParams.set('validTo', `${year + 1}-09-30`);

  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Die Ferien-API antwortet mit Status ${response.status}`);
  const items = await response.json();

  return items
    .filter((item) => item.nationwide || (item.subdivisions || []).some((s) => s.code === code))
    .map((item) => {
      const name = item.name.find((n) => n.language === 'DE') || item.name[0];
      return { name: name.text, start: item.startDate, end: item.endDate };
    });
}

async function loadHolidays(codes) {
  const cache = readHolidayCache();
  const failed = [];
  let changed = false;

  for (const code of codes) {
    const entry = cache.regions[code];
    const isFresh = entry && Date.now() - new Date(entry.fetchedAt).getTime() < ONE_DAY;
    if (isFresh) continue;
    try {
      cache.regions[code] = { fetchedAt: new Date().toISOString(), holidays: await fetchRegion(code) };
      changed = true;
    } catch (error) {
      failed.push(code);
    }
  }

  if (changed) writeJson(holidayFile(), cache);

  const holidays = {};
  for (const code of codes) {
    holidays[code] = cache.regions[code] ? cache.regions[code].holidays : null;
  }
  return { holidays, failed };
}

function attachDir() {
  return path.join(app.getPath('userData'), 'anhaenge');
}

function attachPath(file) {
  return path.join(attachDir(), path.basename(file));
}

async function pickFiles() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Dateien anhängen',
    properties: ['openFile', 'multiSelections'],
  });
  if (result.canceled) return [];
  fs.mkdirSync(attachDir(), { recursive: true });
  return result.filePaths.map((source) => {
    const name = path.basename(source);
    const file = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${name}`;
    fs.copyFileSync(source, attachPath(file));
    return { name, file };
  });
}

function deleteFile(file) {
  try {
    fs.unlinkSync(attachPath(file));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function openLink(url) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Nur Internetadressen können geöffnet werden.');
  return shell.openExternal(parsed.href);
}

function getAutostart() {
  return app.getLoginItemSettings().openAtLogin;
}

function setAutostart(enabled) {
  app.setLoginItemSettings({ openAtLogin: enabled });
  return getAutostart();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1100,
    height: 720,
    minWidth: 820,
    minHeight: 560,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
  });

  mainWindow.loadFile('main.html');

  mainWindow.on('close', (event) => {
    if (quitting) return;
    event.preventDefault();
    mainWindow.hide();
    if (process.platform === 'darwin') app.dock.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function openMainWindow() {
  if (!mainWindow) createMainWindow();
  if (process.platform === 'darwin') app.dock.show();
  mainWindow.show();
  mainWindow.focus();
  if (popover && popover.isVisible()) popover.hide();
}

function updateSummary(summary) {
  lastSummary = summary;
  if (tray) tray.setTitle(summary.count > 0 ? ` ${summary.count}` : '');
  if (popover) popover.webContents.send('summary', summary);
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

  const trayIcon = nativeImage.createFromPath(path.join(__dirname, 'trayTemplate.png'));
  trayIcon.setTemplateImage(true);
  tray = new Tray(trayIcon);
  tray.setToolTip('Nachhilfe');
  tray.on('click', togglePopover);
  tray.on('right-click', () => {
    tray.popUpContextMenu(Menu.buildFromTemplate([
      { label: 'App öffnen', click: openMainWindow },
      { type: 'separator' },
      { label: 'Beenden', click: () => app.quit() },
    ]));
  });

  createMainWindow();

  const openedAtLogin = app.getLoginItemSettings().wasOpenedAtLogin;
  if (openedAtLogin) {
    if (process.platform === 'darwin') app.dock.hide();
  } else {
    mainWindow.once('ready-to-show', openMainWindow);
  }
});

app.whenReady().then(() => {
  safeBackup();
  setInterval(() => safeBackup(), ONE_HOUR);
});

app.on('before-quit', () => {
  quitting = true;
});

app.on('activate', openMainWindow);
app.on('window-all-closed', () => {});
ipcMain.on('open-main-window', openMainWindow);
ipcMain.handle('load-data', () => loadData());
ipcMain.handle('save-data', (event, data) => {
  saveData(data);
  safeBackup(data);
});
ipcMain.handle('get-autostart', () => getAutostart());
ipcMain.handle('set-autostart', (event, enabled) => setAutostart(enabled));
ipcMain.handle('load-holidays', (event, codes) => loadHolidays(codes));
ipcMain.on('summary', (event, summary) => updateSummary(summary));
ipcMain.handle('get-summary', () => lastSummary);
ipcMain.handle('pick-files', () => pickFiles());
ipcMain.handle('open-file', (event, file) => shell.openPath(attachPath(file)));
ipcMain.handle('delete-file', (event, file) => deleteFile(file));
ipcMain.handle('open-link', (event, url) => openLink(url));
ipcMain.handle('backup-info', () => backupInfo());
ipcMain.handle('backup-now', () => runBackup());
ipcMain.handle('choose-backup-folder', () => chooseBackupFolder());
ipcMain.handle('open-backup-folder', () => {
  const folder = backupFolder(loadData());
  fs.mkdirSync(folder, { recursive: true });
  return shell.openPath(folder);
});