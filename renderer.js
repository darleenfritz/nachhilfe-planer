const DAYS = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr'];
const COLORS = ['#FF2E88', '#C6F432', '#3D8BF2', '#F5A623', '#9B6BFF', '#22B573', '#00B8D9', '#F2668F'];

let data = { students: [], settings: { hourlyRate: 24 } };
let canSave = true;

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

function greeting(hour) {
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

function formatEuro(value) {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function priceFor(minutes) {
  return data.settings.hourlyRate * minutes / 60;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setActiveNav(activeItem) {
  navItems.forEach((item) => item.classList.toggle('active', item === activeItem));
}

function showPage(id) {
  pages.forEach((page) => {
    page.hidden = page.id !== `page-${id}`;
  });
  newStudentBtn.hidden = id === 'student-form';
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

function openForm() {
  resetForm();
  eyebrow.textContent = 'Schüler anlegen';
  title.innerHTML = 'Neuer <em>Schüler.</em>';
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

function addTermin() {
  const row = terminTemplate.content.firstElementChild.cloneNode(true);
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

function readTermine() {
  return [...termine.querySelectorAll('.termin-row')]
    .map((row) => ({
      tag: Number(row.querySelector('[name="tag"]').value),
      zeit: row.querySelector('[name="zeit"]').value,
    }))
    .filter((termin) => termin.zeit);
}

function regionName(student) {
  const land = LAENDER[student.land];
  const region = land.regionen.find((r) => r.code === student.region);
  return region ? region.name : land.name;
}

function studentRow(student) {
  const row = el('div', 'student-row');

  const nameCell = el('div');
  const meta = [student.klasse ? `Klasse ${student.klasse}` : null, student.schulform, regionName(student)]
    .filter(Boolean)
    .join(' · ');
  nameCell.append(el('div', 'student-name', `${student.vorname} ${student.nachname}`.trim()), el('div', 'student-meta', meta));

  const artCell = el('div');
  const isPlattform = student.art === 'plattform';
  artCell.append(el('span', isPlattform ? 'tag tag-plattform' : 'tag', isPlattform ? 'Plattform' : 'Privat'));

  const timeCell = el('div');
  const times = student.termine.map((t) => `${DAYS[t.tag]} ${t.zeit}`).join(', ');
  timeCell.append(el('div', 'student-time', times || 'kein Termin'), el('div', 'student-meta', `${student.dauer} Minuten`));

  const lastCell = el('div');
  if (isPlattform) {
    lastCell.append(el('div', 'student-time', String(student.nachholStart)), el('div', 'student-meta', 'nachzuholen'));
  } else {
    lastCell.append(el('div', 'student-time', formatEuro(priceFor(student.dauer))), el('div', 'student-meta', 'pro Stunde'));
  }

  row.append(nameCell, artCell, timeCell, lastCell);
  return row;
}

function renderStudents() {
  const active = data.students
    .filter((student) => !student.archiviert)
    .sort((a, b) => a.vorname.localeCompare(b.vorname, 'de'));
  studentList.replaceChildren(...active.map(studentRow));
  studentList.hidden = active.length === 0;
  studentsEmpty.hidden = active.length > 0;
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    setActiveNav(item);
    const page = item.dataset.page;
    if (page === 'overview') openOverview();
    else if (page === 'students') openStudents();
    else openPlaceholder(item.lastChild.textContent.trim());
  });
});

newStudentBtn.addEventListener('click', openForm);
document.getElementById('add-termin').addEventListener('click', addTermin);

document.getElementById('cancel-form').addEventListener('click', () => {
  setActiveNav(studentsNav);
  openStudents();
});

form.addEventListener('change', (event) => {
  if (event.target.name === 'land') updateLand();
  if (event.target.name === 'art') updateArt();
  if (event.target.name === 'dauer') updatePrice();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!canSave) {
    alert('Deine Daten konnten beim Start nicht geladen werden. Damit nichts überschrieben wird, ist Speichern gerade gesperrt.');
    return;
  }

  const f = form.elements;
  const art = f.art.value;
  const student = {
    id: crypto.randomUUID(),
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
    farbe: COLORS[data.students.length % COLORS.length],
    archiviert: false,
    angelegt: new Date().toISOString(),
  };

  data.students.push(student);
  try {
    await window.api.saveData(data);
  } catch (error) {
    data.students.pop();
    alert(`Speichern hat nicht geklappt: ${error.message}`);
    return;
  }

  setActiveNav(studentsNav);
  openStudents();
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