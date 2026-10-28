const DAYS = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr'];
const COLORS = ['#FF2E88', '#C6F432', '#3D8BF2', '#F5A623', '#9B6BFF', '#22B573', '#00B8D9', '#F2668F'];

let data = { students: [], settings: { hourlyRate: 24 } };
let canSave = true;
let editingId = null;
let savedTimer = null;

const navItems = document.querySelectorAll('.nav-item');
const studentsNav = document.querySelector('[data-page="students"]');
const pages = document.querySelectorAll('.page');
const eyebrow = document.querySelector('.eyebrow');
const title = document.querySelector('h1');
const newStudentBtn = document.getElementById('new-student-btn');
const placeholderText = document.getElementById('placeholder-text');
const form = document.getElementById('student-form');
const regionLabel = document.getElementById('region-label');
const regionSelect = document.getElementById('region-select');
const schulformSelect = document.getElementById('schulform-select');
const privatFields = document.getElementById('privat-fields');
const plattformFields = document.getElementById('plattform-fields');
const pricePreview = document.getElementById('price-preview');
const termine = document.getElementById('termine');
const terminTemplate = document.getElementById('termin-template');
const studentList = document.getElementById('student-list');
const studentsEmpty = document.getElementById('students-empty');
const archiveList = document.getElementById('archive-list');
const archiveEmpty = document.getElementById('archive-empty');
const archiveBtn = document.getElementById('archive-btn');
const settingsForm = document.getElementById('settings-form');
const ratePreview = document.getElementById('rate-preview');
const settingsSaved = document.getElementById('settings-saved');
const autostartToggle = document.getElementById('autostart-toggle');

function greeting(hour) {
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

function formatEuro(value) {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function priceFor(minutes, rate = data.settings.hourlyRate) {
  return rate * minutes / 60;
}

function fullName(student) {
  return `${student.vorname} ${student.nachname}`.trim();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function persist(change) {
  if (!canSave) {
    alert('Deine Daten konnten beim Start nicht geladen werden. Damit nichts überschrieben wird, ist Speichern gerade gesperrt.');
    return false;
  }
  const before = structuredClone(data);
  change();
  try {
    await window.api.saveData(data);
    return true;
  } catch (error) {
    data = before;
    alert(`Speichern hat nicht geklappt: ${error.message}`);
    return false;
  }
}

function setActiveNav(activeItem) {
  navItems.forEach((item) => item.classList.toggle('active', item === activeItem));
}

function showPage(id) {
  pages.forEach((page) => {
    page.hidden = page.id !== `page-${id}`;
  });
  newStudentBtn.hidden = id === 'student-form' || id === 'settings';
}

function openOverview() {
  const now = new Date();
  const weekday = now.toLocaleDateString('de-DE', { weekday: 'long' });
  const month = now.toLocaleDateString('de-DE', { month: 'long' });
  eyebrow.textContent = `${greeting(now.getHours())}, Darleen`;
  title.innerHTML = `${weekday}, <em>${now.getDate()}.</em> ${month}`;
  showPage('overview');
}

function openPlaceholder(name) {
  eyebrow.textContent = 'Nachhilfe';
  title.innerHTML = `${name}<em>.</em>`;
  placeholderText.textContent = `Hier kommt bald die Seite ${name} hin.`;
  showPage('placeholder');
}

function openStudents() {
  eyebrow.textContent = 'Deine Schüler';
  title.innerHTML = 'Schüler<em>.</em>';
  renderStudents();
  showPage('students');
}

function openArchive() {
  eyebrow.textContent = 'Ehemalige Schüler';
  title.innerHTML = 'Archiv<em>.</em>';
  renderArchive();
  showPage('archive');
}

async function openSettings() {
  eyebrow.textContent = 'Deine App';
  title.innerHTML = 'Einstellungen<em>.</em>';
  settingsForm.elements.hourlyRate.value = data.settings.hourlyRate;
  updateRatePreview();
  settingsSaved.hidden = true;
  showPage('settings');
  try {
    autostartToggle.checked = await window.api.getAutostart();
  } catch (error) {
    autostartToggle.disabled = true;
  }
}

function openForm(student = null) {
  resetForm();
  editingId = student ? student.id : null;
  archiveBtn.hidden = !student;
  if (student) {
    fillForm(student);
    eyebrow.textContent = 'Schüler bearbeiten';
    title.textContent = `${student.vorname}.`;
  } else {
    eyebrow.textContent = 'Schüler anlegen';
    title.innerHTML = 'Neuer <em>Schüler.</em>';
  }
  setActiveNav(studentsNav);
  showPage('student-form');
}

function fillSelect(select, options, withEmpty) {
  select.replaceChildren();
  if (withEmpty) select.append(new Option('keine Angabe', ''));
  options.forEach((option) => select.append(new Option(option.text, option.value)));
}

function updateLand() {
  const info = LAENDER[form.elements.land.value];
  regionLabel.textContent = info.regionLabel;
  fillSelect(regionSelect, info.regionen.map((r) => ({ value: r.code, text: r.name })), true);
  fillSelect(schulformSelect, info.schulformen.map((s) => ({ value: s, text: s })), false);
}

function updateArt() {
  const isPrivat = form.elements.art.value === 'privat';
  privatFields.hidden = !isPrivat;
  plattformFields.hidden = isPrivat;
}

function updatePrice() {
  const minutes = Number(form.elements.dauer.value);
  pricePreview.textContent = `${formatEuro(priceFor(minutes))} pro Stunde, bei ${formatEuro(data.settings.hourlyRate)} für 60 Minuten`;
}

function updateRatePreview() {
  const rate = Number(settingsForm.elements.hourlyRate.value);
  if (!Number.isFinite(rate) || rate < 0) {
    ratePreview.textContent = 'Bitte gib einen gültigen Betrag ein.';
    return;
  }
  ratePreview.textContent = `Eine 50-Minuten-Stunde kostet damit ${formatEuro(priceFor(50, rate))}, eine 45-Minuten-Stunde ${formatEuro(priceFor(45, rate))}.`;
}

function addTermin(termin = null) {
  const row = terminTemplate.content.firstElementChild.cloneNode(true);
  if (termin) {
    row.querySelector('[name="tag"]').value = String(termin.tag);
    row.querySelector('[name="zeit"]').value = termin.zeit;
  }
  row.querySelector('.remove-termin').addEventListener('click', () => row.remove());
  termine.append(row);
}

function resetForm() {
  form.reset();
  termine.replaceChildren();
  addTermin();
  updateLand();
  updateArt();
  updatePrice();
}

function fillForm(student) {
  const f = form.elements;
  f.vorname.value = student.vorname;
  f.nachname.value = student.nachname;
  f.geburtstag.value = student.geburtstag || '';
  f.land.value = student.land;
  updateLand();
  f.region.value = student.region || '';
  f.schulform.value = student.schulform;
  f.klasse.value = student.klasse ?? '';
  f.art.value = student.art;
  updateArt();
  if (student.art === 'privat') {
    f.dauer.value = String(student.dauer);
    f.rechnungAn.value = student.rechnungAn || '';
  } else {
    f.nachholStart.value = student.nachholStart;
  }
  updatePrice();
  termine.replaceChildren();
  student.termine.forEach((termin) => addTermin(termin));
  if (student.termine.length === 0) addTermin();
}

function readTermine() {
  return [...termine.querySelectorAll('.termin-row')]
    .map((row) => ({
      tag: Number(row.querySelector('[name="tag"]').value),
      zeit: row.querySelector('[name="zeit"]').value,
    }))
    .filter((termin) => termin.zeit);
}

function readForm() {
  const f = form.elements;
  const art = f.art.value;
  return {
    vorname: f.vorname.value.trim(),
    nachname: f.nachname.value.trim(),
    geburtstag: f.geburtstag.value || null,
    land: f.land.value,
    region: f.region.value || null,
    schulform: f.schulform.value,
    klasse: f.klasse.value ? Number(f.klasse.value) : null,
    art,
    dauer: art === 'privat' ? Number(f.dauer.value) : 45,
    rechnungAn: art === 'privat' ? f.rechnungAn.value.trim() : null,
    nachholStart: art === 'plattform' ? Number(f.nachholStart.value) : 0,
    termine: readTermine(),
  };
}

function regionName(student) {
  const land = LAENDER[student.land];
  const region = land.regionen.find((r) => r.code === student.region);
  return region ? region.name : land.name;
}

function nameCell(student) {
  const cell = el('div');
  const meta = [student.klasse ? `Klasse ${student.klasse}` : null, student.schulform, regionName(student)]
    .filter(Boolean)
    .join(' · ');
  cell.append(el('div', 'student-name', fullName(student)), el('div', 'student-meta', meta));
  return cell;
}

function artCell(student) {
  const cell = el('div');
  const isPlattform = student.art === 'plattform';
  cell.append(el('span', isPlattform ? 'tag tag-plattform' : 'tag', isPlattform ? 'Plattform' : 'Privat'));
  return cell;
}

function studentRow(student) {
  const row = el('div', 'student-row');
  row.tabIndex = 0;
  row.addEventListener('click', () => openForm(student));
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') openForm(student);
  });

  const timeCell = el('div');
  const times = student.termine.map((t) => `${DAYS[t.tag]} ${t.zeit}`).join(', ');
  timeCell.append(el('div', 'student-time', times || 'kein Termin'), el('div', 'student-meta', `${student.dauer} Minuten`));

  const lastCell = el('div');
  if (student.art === 'plattform') {
    lastCell.append(el('div', 'student-time', String(student.nachholStart)), el('div', 'student-meta', 'nachzuholen'));
  } else {
    lastCell.append(el('div', 'student-time', formatEuro(priceFor(student.dauer))), el('div', 'student-meta', 'pro Stunde'));
  }

  row.append(nameCell(student), artCell(student), timeCell, lastCell);
  return row;
}

function archivedRow(student) {
  const row = el('div', 'student-row archived');

  const dateCell = el('div');
  dateCell.append(el('div', 'student-meta', 'archiviert am'), el('div', 'student-time', formatDate(student.archiviertAm)));

  const actionCell = el('div');
  const restoreBtn = el('button', 'btn btn-small', 'Wiederherstellen');
  restoreBtn.addEventListener('click', async () => {
    const saved = await persist(() => {
      const target = data.students.find((s) => s.id === student.id);
      target.archiviert = false;
      delete target.archiviertAm;
    });
    if (saved) renderArchive();
  });
  actionCell.append(restoreBtn);

  row.append(nameCell(student), artCell(student), dateCell, actionCell);
  return row;
}

function byFirstName(a, b) {
  return a.vorname.localeCompare(b.vorname, 'de');
}

function renderStudents() {
  const active = data.students.filter((s) => !s.archiviert).sort(byFirstName);
  studentList.replaceChildren(...active.map(studentRow));
  studentList.hidden = active.length === 0;
  studentsEmpty.hidden = active.length > 0;
}

function renderArchive() {
  const archived = data.students.filter((s) => s.archiviert).sort(byFirstName);
  archiveList.replaceChildren(...archived.map(archivedRow));
  archiveList.hidden = archived.length === 0;
  archiveEmpty.hidden = archived.length > 0;
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    setActiveNav(item);
    const page = item.dataset.page;
    if (page === 'overview') openOverview();
    else if (page === 'students') openStudents();
    else if (page === 'archive') openArchive();
    else if (page === 'settings') openSettings();
    else openPlaceholder(item.lastChild.textContent.trim());
  });
});

newStudentBtn.addEventListener('click', () => openForm());
document.getElementById('add-termin').addEventListener('click', () => addTermin());

document.getElementById('cancel-form').addEventListener('click', () => {
  setActiveNav(studentsNav);
  openStudents();
});

archiveBtn.addEventListener('click', async () => {
  const student = data.students.find((s) => s.id === editingId);
  if (!student) return;
  if (!confirm(`${fullName(student)} ins Archiv verschieben? Du kannst den Schüler dort jederzeit wiederherstellen.`)) return;

  const saved = await persist(() => {
    const target = data.students.find((s) => s.id === editingId);
    target.archiviert = true;
    target.archiviertAm = new Date().toISOString();
  });
  if (saved) {
    setActiveNav(studentsNav);
    openStudents();
  }
});

form.addEventListener('change', (event) => {
  if (event.target.name === 'land') updateLand();
  if (event.target.name === 'art') updateArt();
  if (event.target.name === 'dauer') updatePrice();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = readForm();

  const saved = await persist(() => {
    if (editingId) {
      const student = data.students.find((s) => s.id === editingId);
      Object.assign(student, values);
    } else {
      data.students.push({
        id: crypto.randomUUID(),
        ...values,
        farbe: COLORS[data.students.length % COLORS.length],
        archiviert: false,
        angelegt: new Date().toISOString(),
      });
    }
  });

  if (saved) {
    setActiveNav(studentsNav);
    openStudents();
  }
});

settingsForm.addEventListener('input', () => {
  updateRatePreview();
  settingsSaved.hidden = true;
});

settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const rate = Number(settingsForm.elements.hourlyRate.value);
  if (!Number.isFinite(rate) || rate < 0) return;

  const saved = await persist(() => {
    data.settings.hourlyRate = rate;
  });

  if (saved) {
    settingsSaved.hidden = false;
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => {
      settingsSaved.hidden = true;
    }, 2500);
  }
});

autostartToggle.addEventListener('change', async () => {
  try {
    autostartToggle.checked = await window.api.setAutostart(autostartToggle.checked);
  } catch (error) {
    autostartToggle.checked = !autostartToggle.checked;
    alert(`Der Autostart konnte nicht geändert werden: ${error.message}`);
  }
});

async function init() {
  try {
    data = await window.api.loadData();
  } catch (error) {
    canSave = false;
    alert(`Deine Daten konnten nicht geladen werden: ${error.message}`);
  }
  openOverview();
}

init();