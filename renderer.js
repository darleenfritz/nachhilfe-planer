const DAYS = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr'];
const COLORS = ['#FF2E88', '#C6F432', '#3D8BF2', '#F5A623', '#9B6BFF', '#22B573', '#00B8D9', '#F2668F'];
const RANGE_MONTHS = 3;
const RANGE_STEP = 1;

let data = { students: [], settings: { hourlyRate: 24 } };
let canSave = true;
let editingId = null;
let savedTimer = null;
let currentPage = 'overview';
let holidays = {};
let holidayFailed = [];
let holidayView = 'rows';
let rangeStart = startOfMonth(new Date());
let selected = null;

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
const viewButtons = document.querySelectorAll('.view-switch .btn');
const holidayNotice = document.getElementById('holiday-notice');
const rowsView = document.getElementById('holiday-rows-view');
const calendarView = document.getElementById('holiday-calendar-view');
const rangeTitle = document.getElementById('range-title');
const timeline = document.getElementById('timeline');
const holidayDetail = document.getElementById('holiday-detail');
const detailStudent = document.getElementById('detail-student');
const detailTitle = document.getElementById('detail-title');
const detailDates = document.getElementById('detail-dates');
const detailButtons = document.querySelectorAll('.detail-buttons .btn');
const detailAllRow = document.getElementById('detail-all-row');
const detailAll = document.getElementById('detail-all');
const detailAllLabel = document.getElementById('detail-all-label');
const calendarLegend = document.getElementById('calendar-legend');
const yearCalendar = document.getElementById('year-calendar');

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function dayDiff(from, to) {
  return Math.round((to - from) / 86400000);
}

function parseDay(text) {
  const [year, month, day] = text.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function dayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function monthName(date) {
  return date.toLocaleDateString('de-DE', { month: 'long' });
}

function shortMonth(date) {
  return date.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '');
}

function longDate(date) {
  return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

function schoolYearStart(date = new Date()) {
  const year = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
  return new Date(year, 8, 1);
}

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

function byFirstName(a, b) {
  return a.vorname.localeCompare(b.vorname, 'de');
}

function activeStudents() {
  return data.students.filter((s) => !s.archiviert).sort(byFirstName);
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

function studentCode(student) {
  return student.region ? apiCode(student.land, student.region) : null;
}

function studentHolidays(student) {
  const code = studentCode(student);
  if (!code) return null;
  return holidays[code] || [];
}

function holidayKey(holiday) {
  return `${holiday.start}_${holiday.end}`;
}

function holidayStatus(student, holiday) {
  return (student.ferien && student.ferien[holidayKey(holiday)]) || 'offen';
}

function sameRegion(student) {
  const code = studentCode(student);
  return activeStudents().filter((s) => s.id !== student.id && studentCode(s) === code);
}

function lastLessonBefore(student, startDate) {
  const weekdays = student.termine.map((t) => t.tag);
  for (let i = 1; i <= 14; i++) {
    const day = addDays(startDate, -i);
    if (weekdays.includes(day.getDay())) return day;
  }
  return null;
}

async function refreshHolidays() {
  const codes = [...new Set(activeStudents().map(studentCode).filter(Boolean))];
  if (codes.length === 0) return;
  try {
    const result = await window.api.loadHolidays(codes);
    holidays = result.holidays;
    holidayFailed = result.failed;
  } catch (error) {
    holidayFailed = codes;
  }
  if (currentPage === 'holidays') renderHolidays();
}

function setActiveNav(activeItem) {
  navItems.forEach((item) => item.classList.toggle('active', item === activeItem));
}

function showPage(id) {
  currentPage = id;
  pages.forEach((page) => {
    page.hidden = page.id !== `page-${id}`;
  });
  newStudentBtn.hidden = ['student-form', 'settings', 'holidays'].includes(id);
}

function openOverview() {
  const now = new Date();
  eyebrow.textContent = `${greeting(now.getHours())}, Darleen`;
  title.innerHTML = `${now.toLocaleDateString('de-DE', { weekday: 'long' })}, <em>${now.getDate()}.</em> ${monthName(now)}`;
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

function openHolidays() {
  const start = schoolYearStart();
  eyebrow.textContent = `Schuljahr ${start.getFullYear()}/${String(start.getFullYear() + 1).slice(2)}`;
  title.innerHTML = 'Ferien<em>.</em>';
  showPage('holidays');
  renderHolidays();
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
    if (saved) {
      renderArchive();
      refreshHolidays();
    }
  });
  actionCell.append(restoreBtn);

  row.append(nameCell(student), artCell(student), dateCell, actionCell);
  return row;
}

function renderStudents() {
  const active = activeStudents();
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

function renderHolidays() {
  holidayNotice.hidden = holidayFailed.length === 0;
  holidayNotice.textContent = 'Die Ferien konnten gerade nicht aus dem Internet geladen werden. Du siehst den zuletzt gespeicherten Stand.';
  viewButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.view === holidayView));
  rowsView.hidden = holidayView !== 'rows';
  calendarView.hidden = holidayView !== 'calendar';
  if (holidayView === 'rows') {
    renderTimeline();
    renderDetail();
  } else {
    renderCalendar();
  }
}

function trackBackground(track, start, end, total) {
  for (let day = start; day < end; day = addDays(day, 1)) {
    const left = (dayDiff(start, day) / total) * 100;
    if (day.getDay() === 0 || day.getDay() === 6) {
      const weekend = el('div', 'tl-weekend');
      weekend.style.left = `${left}%`;
      weekend.style.width = `${100 / total}%`;
      track.append(weekend);
    }
    if (day.getDay() === 1) {
      const week = el('div', 'tl-week');
      week.style.left = `${left}%`;
      track.append(week);
    }
  }
  const today = new Date();
  if (today >= start && today < end) {
    const line = el('div', 'tl-today');
    line.style.left = `${(dayDiff(start, new Date(today.getFullYear(), today.getMonth(), today.getDate())) / total) * 100}%`;
    track.append(line);
  }
}

function renderTimeline() {
  const start = rangeStart;
  const end = addMonths(start, RANGE_MONTHS);
  const last = addDays(end, -1);
  const total = dayDiff(start, end);
  const percent = (date) => (dayDiff(start, date) / total) * 100;

  const sameYear = start.getFullYear() === last.getFullYear();
  rangeTitle.replaceChildren(
    `${monthName(start)}${sameYear ? '' : ` ${start.getFullYear()}`} `,
    el('em', null, 'bis'),
    ` ${monthName(last)} ${last.getFullYear()}`,
  );

  const monthsLine = el('div', 'tl-line');
  const monthsTrack = el('div', 'tl-track tl-months');
  for (let month = start; month < end; month = addMonths(month, 1)) {
    const label = el('div', 'tl-month', `${monthName(month)} ${month.getFullYear()}`);
    label.style.left = `${percent(month)}%`;
    monthsTrack.append(label);
  }
  monthsLine.append(el('div', 'tl-name'), monthsTrack);

  const weeksLine = el('div', 'tl-line');
  const weeksTrack = el('div', 'tl-track tl-weeks');
  for (let day = start; day < end; day = addDays(day, 1)) {
    if (day.getDay() !== 1) continue;
    const label = el('div', 'tl-week-label');
    label.style.left = `${percent(day)}%`;
    label.append(el('strong', null, `${day.getDate()}. ${shortMonth(day)}`), el('small', null, `KW ${isoWeek(day)}`));
    weeksTrack.append(label);
  }
  weeksLine.append(el('div', 'tl-name'), weeksTrack);

  const rows = activeStudents().map((student) => {
    const row = el('div', 'tl-line tl-row');
    const name = el('div', 'tl-name');
    const nameLine = el('div', 'tl-student');
    const dot = el('span', 'tl-dot');
    dot.style.background = student.farbe;
    nameLine.append(dot, fullName(student));
    const metaText = student.region ? regionName(student) : `${LAENDER[student.land].regionLabel} fehlt`;
    name.append(nameLine, el('div', 'student-meta tl-student-meta', metaText));

    const track = el('div', 'tl-track');
    trackBackground(track, start, end, total);

    const list = studentHolidays(student);
    if (list === null) {
      track.append(el('div', 'hand tl-missing', `${LAENDER[student.land].regionLabel} eintragen, dann erscheinen hier die Ferien`));
    } else {
      list.forEach((holiday) => {
        const from = parseDay(holiday.start);
        const to = addDays(parseDay(holiday.end), 1);
        if (to <= start || from >= end) return;
        const visibleFrom = from < start ? start : from;
        const visibleTo = to > end ? end : to;
        const status = holidayStatus(student, holiday);
        const bar = el('button', `tl-bar status-${status}`);
        bar.style.setProperty('--c', student.farbe);
        bar.style.left = `${percent(visibleFrom)}%`;
        bar.style.width = `${percent(visibleTo) - percent(visibleFrom)}%`;
        bar.title = `${holiday.name}: ${longDate(from)} bis ${longDate(addDays(to, -1))}`;
        bar.setAttribute('aria-label', `${fullName(student)}, ${bar.title}`);
        if (selected && selected.studentId === student.id && selected.key === holidayKey(holiday)) {
          bar.classList.add('selected');
        }
        bar.addEventListener('click', () => {
          selected = { studentId: student.id, key: holidayKey(holiday) };
          renderTimeline();
          renderDetail();
        });
        track.append(bar);
      });
    }

    row.append(name, track);
    return row;
  });

  timeline.replaceChildren(monthsLine, weeksLine, ...rows);
}

function selectedInfo() {
  if (!selected) return null;
  const student = data.students.find((s) => s.id === selected.studentId);
  if (!student) return null;
  const holiday = (studentHolidays(student) || []).find((h) => holidayKey(h) === selected.key);
  if (!holiday) return null;
  return { student, holiday };
}

function renderDetail() {
  const info = selectedInfo();
  holidayDetail.hidden = !info;
  if (!info) return;
  const { student, holiday } = info;
  const from = parseDay(holiday.start);
  const to = parseDay(holiday.end);
  const lastLesson = lastLessonBefore(student, from);

  detailStudent.textContent = `Ausgewählt · ${fullName(student)}`;
  detailTitle.replaceChildren(`${holiday.name} `, el('em', null, regionName(student)));
  detailDates.textContent = `${longDate(from)} bis ${longDate(to)}${lastLesson ? ` · letzte Stunde vorher: ${longDate(lastLesson)}` : ''}`;

  const status = holidayStatus(student, holiday);
  detailButtons.forEach((btn) => btn.classList.toggle('chosen', btn.dataset.status === status));

  const others = sameRegion(student);
  detailAllRow.hidden = others.length === 0;
  detailAllLabel.textContent = `Für alle aus ${regionName(student)} übernehmen (${others.map((s) => s.vorname).join(', ')})`;
}

function renderCalendar() {
  const students = activeStudents().filter((s) => studentHolidays(s) !== null);
  const missing = activeStudents().filter((s) => studentHolidays(s) === null);

  const legendItems = students.map((student) => {
    const item = el('span');
    const dot = el('span', 'legend-dot');
    dot.style.background = student.farbe;
    item.append(dot, student.vorname);
    return item;
  });
  if (missing.length > 0) {
    legendItems.push(el('span', 'student-meta', `Ohne Bundesland bzw. Kanton: ${missing.map((s) => s.vorname).join(', ')}`));
  }
  calendarLegend.replaceChildren(...legendItems);

  const todayKey = dayKey(new Date());
  const start = schoolYearStart();
  const months = [];

  for (let i = 0; i < 12; i++) {
    const month = addMonths(start, i);
    const box = el('div');
    const heading = el('div', 'cal-month-title', `${monthName(month)} `);
    heading.append(el('small', null, String(month.getFullYear())));

    const weekdays = el('div', 'cal-weekdays');
    ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].forEach((d) => weekdays.append(el('span', null, d)));

    const days = el('div', 'cal-days');
    const offset = (month.getDay() + 6) % 7;
    for (let j = 0; j < offset; j++) days.append(el('div'));

    for (let day = month; day.getMonth() === month.getMonth(); day = addDays(day, 1)) {
      const key = dayKey(day);
      const cell = el('div', 'cal-day');
      if (day.getDay() === 0 || day.getDay() === 6) cell.classList.add('weekend');
      if (key === todayKey) cell.classList.add('today');
      cell.append(el('span', 'cal-num', String(day.getDate())));

      const stripes = el('div', 'cal-stripes');
      students.forEach((student) => {
        const stripe = el('span', 'cal-stripe');
        const holiday = studentHolidays(student).find((h) => h.start <= key && key <= h.end);
        if (holiday) {
          stripe.classList.add(holidayStatus(student, holiday));
          stripe.style.setProperty('--c', student.farbe);
          stripe.title = `${student.vorname}: ${holiday.name}`;
        }
        stripes.append(stripe);
      });
      cell.append(stripes);
      days.append(cell);
    }

    box.append(heading, weekdays, days);
    months.push(box);
  }

  yearCalendar.replaceChildren(...months);
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    setActiveNav(item);
    const page = item.dataset.page;
    if (page === 'overview') openOverview();
    else if (page === 'students') openStudents();
    else if (page === 'holidays') openHolidays();
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
    refreshHolidays();
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

viewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    holidayView = btn.dataset.view;
    renderHolidays();
  });
});

document.getElementById('range-prev').addEventListener('click', () => {
  rangeStart = addMonths(rangeStart, -RANGE_STEP);
  renderTimeline();
});

document.getElementById('range-next').addEventListener('click', () => {
  rangeStart = addMonths(rangeStart, RANGE_STEP);
  renderTimeline();
});

document.getElementById('range-today').addEventListener('click', () => {
  rangeStart = startOfMonth(new Date());
  renderTimeline();
});

detailButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const info = selectedInfo();
    if (!info) return;
    const { student, holiday } = info;
    const key = holidayKey(holiday);
    const clicked = btn.dataset.status;
    const newStatus = holidayStatus(student, holiday) === clicked ? null : clicked;
    const ids = [student.id, ...(detailAll.checked ? sameRegion(student).map((s) => s.id) : [])];

    const saved = await persist(() => {
      ids.forEach((id) => {
        const target = data.students.find((s) => s.id === id);
        target.ferien = target.ferien || {};
        if (newStatus) target.ferien[key] = newStatus;
        else delete target.ferien[key];
      });
    });

    if (saved) {
      renderTimeline();
      renderDetail();
    }
  });
});

async function init() {
  try {
    data = await window.api.loadData();
  } catch (error) {
    canSave = false;
    alert(`Deine Daten konnten nicht geladen werden: ${error.message}`);
  }
  openOverview();
  refreshHolidays();
}

init();