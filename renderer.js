const DAYS = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr'];
const WEEKDAYS_LONG = ['', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
const COLORS = ['#FF2E88', '#C6F432', '#3D8BF2', '#F5A623', '#9B6BFF', '#22B573', '#00B8D9', '#F2668F'];
const DURATIONS = [30, 45, 50, 60];
const RANGE_MONTHS = 3;
const RANGE_STEP = 1;
const PAUSE_PREVIEW_DAYS = 14;
const LOOKBACK_DAYS = 60;
const DAY_START = 13 * 60;
const DAY_END = 20 * 60;
const SLOT = 15;
const SLOT_HEIGHT = 19;
const MIN_FREE = 45;

let data = { students: [], settings: { hourlyRate: 24 } };
let canSave = true;
let editingId = null;
let savedTimer = null;
let copyTimer = null;
let currentPage = 'overview';
let holidays = {};
let holidayFailed = [];
let holidayView = 'rows';
let rangeStart = startOfMonth(new Date());
let selected = null;
let scheduleMode = 'normal';
let weekStart = currentWeekStart();
let editingBlocks = false;
let drag = null;
let selectedLesson = null;

const navItems = document.querySelectorAll('.nav-item');
const studentsNav = document.querySelector('[data-page="students"]');
const pages = document.querySelectorAll('.page');
const eyebrow = document.querySelector('.eyebrow');
const title = document.querySelector('h1');
const newStudentBtn = document.getElementById('new-student-btn');
const placeholderText = document.getElementById('placeholder-text');
const todoBlock = document.getElementById('todo-block');
const todoList = document.getElementById('todo-list');
const overviewEmpty = document.getElementById('overview-empty');
const form = document.getElementById('student-form');
const regionLabel = document.getElementById('region-label');
const regionSelect = document.getElementById('region-select');
const schulformSelect = document.getElementById('schulform-select');
const privatFields = document.getElementById('privat-fields');
const plattformFields = document.getElementById('plattform-fields');
const pricePreview = document.getElementById('price-preview');
const termine = document.getElementById('termine');
const terminTemplate = document.getElementById('termin-template');
const historySection = document.getElementById('history-section');
const lessonHistory = document.getElementById('lesson-history');
const studentList = document.getElementById('student-list');
const studentsEmpty = document.getElementById('students-empty');
const archiveList = document.getElementById('archive-list');
const archiveEmpty = document.getElementById('archive-empty');
const archiveBtn = document.getElementById('archive-btn');
const settingsForm = document.getElementById('settings-form');
const ratePreview = document.getElementById('rate-preview');
const settingsSaved = document.getElementById('settings-saved');
const autostartToggle = document.getElementById('autostart-toggle');
const modeButtons = document.querySelectorAll('[data-mode]');
const blockToggle = document.getElementById('block-toggle');
const blockHint = document.getElementById('block-hint');
const weekPrev = document.getElementById('week-prev');
const weekNext = document.getElementById('week-next');
const weekToday = document.getElementById('week-today');
const weekTitle = document.getElementById('week-title');
const weekInfo = document.getElementById('week-info');
const weekGrid = document.getElementById('week-grid');
const scheduleLegend = document.getElementById('schedule-legend');
const lessonDetail = document.getElementById('lesson-detail');
const lessonDetailKicker = document.getElementById('lesson-detail-kicker');
const lessonDetailTitle = document.getElementById('lesson-detail-title');
const lessonDetailMeta = document.getElementById('lesson-detail-meta');
const lessonDetailButtons = document.getElementById('lesson-detail-buttons');
const freeTitle = document.getElementById('free-title');
const freeList = document.getElementById('free-list');
const freeCopy = document.getElementById('free-copy');
const viewButtons = document.querySelectorAll('[data-view]');
const holidayNotice = document.getElementById('holiday-notice');
const rowsView = document.getElementById('holiday-rows-view');
const calendarView = document.getElementById('holiday-calendar-view');
const rangeTitle = document.getElementById('range-title');
const timeline = document.getElementById('timeline');
const holidayDetail = document.getElementById('holiday-detail');
const detailStudent = document.getElementById('detail-student');
const detailTitle = document.getElementById('detail-title');
const detailDates = document.getElementById('detail-dates');
const detailButtons = document.querySelectorAll('.detail-buttons [data-status]');
const detailAllRow = document.getElementById('detail-all-row');
const detailAll = document.getElementById('detail-all');
const detailAllLabel = document.getElementById('detail-all-label');
const calendarLegend = document.getElementById('calendar-legend');
const yearCalendar = document.getElementById('year-calendar');

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function currentWeekStart() {
  const today = startOfDay(new Date());
  const monday = addDays(today, -((today.getDay() + 6) % 7));
  return today.getDay() === 0 || today.getDay() === 6 ? addDays(monday, 7) : monday;
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

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function nowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function formatTime(minutes) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

function toTimeString(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
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

function weekdayName(date) {
  return date.toLocaleDateString('de-DE', { weekday: 'long' });
}

function schoolYearStart(date = new Date()) {
  const year = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
  return new Date(year, 8, 1);
}

function schoolYear(date = new Date()) {
  return schoolYearStart(date).getFullYear();
}

function schoolYearLabel(year) {
  return `${year}/${String(year + 1).slice(2)}`;
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

function holidayOn(student, date) {
  const key = dayKey(date);
  return (studentHolidays(student) || []).find((h) => h.start <= key && key <= h.end) || null;
}

function isPausedOn(student, date) {
  const holiday = holidayOn(student, date);
  return Boolean(holiday) && holidayStatus(student, holiday) === 'pausiert';
}

function sameRegion(student) {
  const code = studentCode(student);
  return activeStudents().filter((s) => s.id !== student.id && studentCode(s) === code);
}

function lessonDays(student) {
  return student.termine.map((t) => t.tag);
}

function lastLessonBefore(student, startDate) {
  const weekdays = lessonDays(student);
  for (let i = 1; i <= 14; i++) {
    const day = addDays(startDate, -i);
    if (weekdays.includes(day.getDay())) return day;
  }
  return null;
}

function firstLessonAfter(student, endDate) {
  const weekdays = lessonDays(student);
  for (let i = 1; i <= 14; i++) {
    const day = addDays(endDate, i);
    if (weekdays.includes(day.getDay())) return day;
  }
  return null;
}

function stunden() {
  return data.stunden || [];
}

function findRecord(studentId, datum, zeit) {
  return stunden().find((r) => r.studentId === studentId && r.datum === datum && r.zeit === zeit) || null;
}

function occurrencesOn(date) {
  const weekday = date.getDay();
  if (weekday === 0 || weekday === 6) return [];
  const datum = dayKey(date);
  const result = [];
  activeStudents().forEach((student) => {
    if (isPausedOn(student, date)) return;
    student.termine
      .filter((t) => t.tag === weekday)
      .forEach((t) => result.push({ student, date, datum, zeit: t.zeit, start: toMinutes(t.zeit), dauer: student.dauer }));
  });
  return result;
}

function isLastInMonth(student, date) {
  for (let day = addDays(date, 1); day.getMonth() === date.getMonth(); day = addDays(day, 1)) {
    if (lessonDays(student).includes(day.getDay()) && !isPausedOn(student, day)) return false;
  }
  return true;
}

function pendingLessons() {
  const today = startOfDay(new Date());
  const todayKey = dayKey(today);
  const firstDay = data.stundenAb ? parseDay(data.stundenAb) : today;
  const lookback = addDays(today, -LOOKBACK_DAYS);
  const start = firstDay > lookback ? firstDay : lookback;
  const result = [];

  for (let day = start; day <= today; day = addDays(day, 1)) {
    occurrencesOn(day)
      .filter((o) => o.student.art === 'privat')
      .forEach((o) => {
        if (findRecord(o.student.id, o.datum, o.zeit)) return;
        if (o.datum === todayKey && nowMinutes() < o.start + o.dauer) return;
        result.push(o);
      });
  }

  return result.sort((a, b) => a.datum.localeCompare(b.datum) || a.start - b.start);
}

function saveLesson(occ, values) {
  const art = occ.student.art;
  return persist(() => {
    data.stunden = stunden().filter((r) => !(r.studentId === occ.student.id && r.datum === occ.datum && r.zeit === occ.zeit));
    data.stunden.push({
      id: crypto.randomUUID(),
      studentId: occ.student.id,
      datum: occ.datum,
      zeit: occ.zeit,
      art,
      status: values.status,
      dauer: values.dauer,
      preis: values.status === 'stattgefunden' && art === 'privat' ? priceFor(values.dauer) : 0,
      thema: values.thema || '',
      letzteImMonat: Boolean(values.letzteImMonat),
      abgesagtVon: values.abgesagtVon || null,
      erfasst: new Date().toISOString(),
    });
  });
}

function resetLesson(occ) {
  return persist(() => {
    data.stunden = stunden().filter((r) => !(r.studentId === occ.student.id && r.datum === occ.datum && r.zeit === occ.zeit));
  });
}

function pauseNote(student) {
  const list = studentHolidays(student);
  if (!list) return null;
  const today = startOfDay(new Date());
  const todayKey = dayKey(today);
  const previewKey = dayKey(addDays(today, PAUSE_PREVIEW_DAYS));

  const paused = list
    .filter((h) => holidayStatus(student, h) === 'pausiert' && h.end >= todayKey && h.start <= previewKey)
    .sort((a, b) => a.start.localeCompare(b.start))[0];
  if (!paused) return null;

  if (paused.start <= todayKey) return `pausiert bis ${longDate(parseDay(paused.end))}`;
  return `pausiert ab ${longDate(parseDay(paused.start))}`;
}

function setHolidayStatus(ids, key, status) {
  return persist(() => {
    ids.forEach((id) => {
      const target = data.students.find((s) => s.id === id);
      target.ferien = target.ferien || {};
      if (status) target.ferien[key] = status;
      else delete target.ferien[key];
    });
  });
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
  if (currentPage === 'overview') renderOverview();
  if (currentPage === 'students') renderStudents();
  if (currentPage === 'schedule') renderSchedule();
}

function setActiveNav(activeItem) {
  navItems.forEach((item) => item.classList.toggle('active', item === activeItem));
}

function showPage(id) {
  currentPage = id;
  pages.forEach((page) => {
    page.hidden = page.id !== `page-${id}`;
  });
  newStudentBtn.hidden = ['student-form', 'settings', 'holidays', 'schedule'].includes(id);
}

function openOverview() {
  const now = new Date();
  eyebrow.textContent = `${greeting(now.getHours())}, Darleen`;
  title.innerHTML = `${weekdayName(now)}, <em>${now.getDate()}.</em> ${monthName(now)}`;
  showPage('overview');
  renderOverview();
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

function openSchedule() {
  eyebrow.textContent = `${formatTime(DAY_START)} bis ${formatTime(DAY_END)} Uhr`;
  title.innerHTML = 'Stundenplan<em>.</em>';
  editingBlocks = false;
  selectedLesson = null;
  showPage('schedule');
  renderSchedule();
}

function openArchive() {
  eyebrow.textContent = 'Ehemalige Schüler';
  title.innerHTML = 'Archiv<em>.</em>';
  renderArchive();
  showPage('archive');
}

function openHolidays() {
  eyebrow.textContent = `Schuljahr ${schoolYearLabel(schoolYear())}`;
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
  historySection.hidden = !student;
  if (student) {
    fillForm(student);
    renderHistory(student);
    eyebrow.textContent = 'Schüler bearbeiten';
    title.textContent = `${student.vorname}.`;
  } else {
    eyebrow.textContent = 'Schüler anlegen';
    title.innerHTML = 'Neuer <em>Schüler.</em>';
  }
  setActiveNav(studentsNav);
  showPage('student-form');
}

function holidayTodos() {
  const today = startOfDay(new Date());
  const todayKey = dayKey(today);
  const groups = new Map();

  activeStudents().forEach((student) => {
    const list = studentHolidays(student);
    if (!list) return;

    list.forEach((holiday) => {
      if (holiday.end < todayKey) return;
      if (holidayStatus(student, holiday) !== 'offen') return;

      const from = parseDay(holiday.start);
      const lastLesson = lastLessonBefore(student, from);
      const askFrom = lastLesson || addDays(from, -7);
      if (today < askFrom) return;

      const groupKey = `${studentCode(student)}|${holidayKey(holiday)}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { holiday, region: regionName(student), entries: [] });
      }
      groups.get(groupKey).entries.push({ student, lastLesson });
    });
  });

  return [...groups.values()].sort((a, b) => a.holiday.start.localeCompare(b.holiday.start));
}

function summerEnd(student, year) {
  const list = studentHolidays(student);
  if (!list) return null;
  const summer = list.find((h) => h.name.includes('Sommer') && h.end >= `${year}-07-01` && h.end <= `${year}-10-31`);
  return summer ? parseDay(summer.end) : null;
}

function classTodos() {
  const today = startOfDay(new Date());
  const year = schoolYear(today);

  return activeStudents().filter((student) => {
    if (student.schuljahrGeprueft >= year) return false;
    const end = summerEnd(student, year) || new Date(year, 7, 31);
    const askFrom = firstLessonAfter(student, end) || addDays(end, 1);
    return today >= askFrom;
  });
}

function lessonHint(lastLesson) {
  if (!lastLesson) return 'kein Termin vorher';
  const diff = dayDiff(startOfDay(new Date()), lastLesson);
  if (diff === 0) return 'heute letzte Stunde';
  if (diff < 0) return `letzte Stunde war am ${weekdayName(lastLesson)}`;
  return `letzte Stunde am ${weekdayName(lastLesson)}`;
}

function statusButtons(ids, key) {
  const actions = el('div', 'todo-actions');
  [['weiter', 'Macht weiter'], ['pausiert', 'Pausiert']].forEach(([status, label]) => {
    const btn = el('button', 'btn btn-small', label);
    btn.addEventListener('click', async () => {
      const saved = await setHolidayStatus(ids, key, status);
      if (saved) renderOverview();
    });
    actions.append(btn);
  });
  return actions;
}

function todoCard(group) {
  const { holiday, region, entries } = group;
  const key = holidayKey(holiday);
  const card = el('article', 'todo-card');

  const kicker = el('div', 'eyebrow todo-kicker', 'Ferien · Wie geht es weiter?');
  const heading = el('div', 'todo-title', `${holiday.name} `);
  heading.append(el('em', null, region));
  const dates = el('div', 'student-meta', `${longDate(parseDay(holiday.start))} bis ${longDate(parseDay(holiday.end))}`);

  const rows = el('div', 'todo-rows');
  entries.forEach(({ student, lastLesson }) => {
    const row = el('div', 'todo-row');
    const name = el('div', 'todo-name', fullName(student));
    name.append(el('small', null, lessonHint(lastLesson)));
    row.append(name, statusButtons([student.id], key));
    rows.append(row);
  });

  if (entries.length > 1) {
    const row = el('div', 'todo-row');
    row.append(el('div', 'todo-name', 'Für alle'), statusButtons(entries.map((e) => e.student.id), key));
    rows.append(row);
  }

  card.append(kicker, heading, dates, rows);
  return card;
}

async function markClassChecked(student, newClass) {
  const year = schoolYear();
  return persist(() => {
    const target = data.students.find((s) => s.id === student.id);
    target.schuljahrGeprueft = year;
    if (newClass !== undefined) target.klasse = newClass;
  });
}

function classCard(students) {
  const year = schoolYear();
  const card = el('article', 'todo-card');

  const kicker = el('div', 'eyebrow todo-kicker', 'Neues Schuljahr');
  const heading = el('div', 'todo-title', 'Klassen prüfen ');
  heading.append(el('em', null, schoolYearLabel(year)));
  const hint = el('div', 'student-meta', 'Die Sommerferien sind vorbei. Stimmen die Klassen noch?');

  const rows = el('div', 'todo-rows');
  students.forEach((student) => {
    const row = el('div', 'todo-row');
    const name = el('div', 'todo-name', fullName(student));
    name.append(el('small', null, student.klasse ? `bisher Klasse ${student.klasse}` : 'keine Klasse eingetragen'));

    const actions = el('div', 'todo-actions');
    if (student.klasse) {
      const up = el('button', 'btn btn-small btn-primary', `Auf ${student.klasse + 1} setzen`);
      up.addEventListener('click', async () => {
        if (await markClassChecked(student, student.klasse + 1)) renderOverview();
      });
      actions.append(up);
    }

    const keep = el('button', 'btn btn-small', 'Passt so');
    keep.addEventListener('click', async () => {
      if (await markClassChecked(student)) renderOverview();
    });

    const edit = el('button', 'btn btn-small', 'Bearbeiten');
    edit.addEventListener('click', async () => {
      if (await markClassChecked(student)) openForm(data.students.find((s) => s.id === student.id));
    });

    actions.append(keep, edit);
    row.append(name, actions);
    rows.append(row);
  });

  card.append(kicker, heading, hint, rows);
  return card;
}

function lessonCard(occ) {
  const card = el('article', 'todo-card');
  const kicker = el('div', 'eyebrow todo-kicker', 'Stunde · Hat sie stattgefunden?');
  const heading = el('div', 'todo-title', `${fullName(occ.student)} `);
  heading.append(el('em', null, `${weekdayName(occ.date)}, ${occ.date.getDate()}. ${monthName(occ.date)}`));
  const meta = el('div', 'student-meta', `${formatTime(occ.start)} Uhr · ${occ.dauer} Minuten · ${formatEuro(priceFor(occ.dauer))}`);

  const fields = el('div', 'lesson-fields');
  const topic = el('input', 'lesson-topic');
  topic.type = 'text';
  topic.placeholder = 'Thema (optional)';
  const checkLabel = el('label', 'check-label');
  const check = el('input');
  check.type = 'checkbox';
  check.checked = isLastInMonth(occ.student, occ.date);
  checkLabel.append(check, 'Letzte Stunde im Monat');
  fields.append(topic, checkLabel);

  const extra = el('div', 'lesson-extra');
  extra.hidden = true;
  let extraMode = null;

  const values = () => ({ thema: topic.value.trim(), letzteImMonat: check.checked });

  async function save(extraValues) {
    if (await saveLesson(occ, { ...values(), ...extraValues })) renderOverview();
  }

  function showExtra(mode) {
    if (extraMode === mode) {
      extra.hidden = true;
      extraMode = null;
      return;
    }
    extraMode = mode;
    extra.hidden = false;
    if (mode === 'anders') {
      const label = el('span', 'lesson-extra-label', 'Tatsächliche Länge:');
      const buttons = DURATIONS.map((minutes) => {
        const btn = el('button', 'btn btn-small', `${minutes} Min · ${formatEuro(priceFor(minutes))}`);
        if (minutes === occ.dauer) btn.classList.add('chosen');
        btn.addEventListener('click', () => save({ status: 'stattgefunden', dauer: minutes }));
        return btn;
      });
      extra.replaceChildren(label, ...buttons);
    } else {
      const label = el('span', 'lesson-extra-label', 'Wer hat abgesagt?');
      const pupil = el('button', 'btn btn-small', 'Schüler');
      pupil.addEventListener('click', () => save({ status: 'ausgefallen', dauer: occ.dauer, abgesagtVon: 'schueler' }));
      const me = el('button', 'btn btn-small', 'Ich');
      me.addEventListener('click', () => save({ status: 'ausgefallen', dauer: occ.dauer, abgesagtVon: 'ich' }));
      extra.replaceChildren(label, pupil, me);
    }
  }

  const actions = el('div', 'lesson-fields');
  const yes = el('button', 'btn btn-small btn-primary', 'Ja');
  yes.addEventListener('click', () => save({ status: 'stattgefunden', dauer: occ.dauer }));
  const other = el('button', 'btn btn-small', 'Anders');
  other.addEventListener('click', () => showExtra('anders'));
  const cancelled = el('button', 'btn btn-small', 'Ausgefallen');
  cancelled.addEventListener('click', () => showExtra('ausgefallen'));
  const buttons = el('div', 'todo-actions');
  buttons.append(yes, other, cancelled);
  actions.append(buttons);

  card.append(kicker, heading, meta, fields, actions, extra);
  return card;
}

function renderOverview() {
  const cards = [
    ...pendingLessons().map(lessonCard),
    ...holidayTodos().map(todoCard),
  ];
  const classStudents = classTodos();
  if (classStudents.length > 0) cards.unshift(classCard(classStudents));

  todoList.replaceChildren(...cards);
  todoBlock.hidden = cards.length === 0;
  overviewEmpty.hidden = cards.length > 0;
}

function gridY(minutes) {
  return ((minutes - DAY_START) / SLOT) * SLOT_HEIGHT;
}

function snapMinutes(pixels) {
  const slot = Math.floor(pixels / SLOT_HEIGHT);
  const minutes = DAY_START + slot * SLOT;
  return Math.min(Math.max(minutes, DAY_START), DAY_END - SLOT);
}

function blockedTimes() {
  return data.blockiert || [];
}

function mergeBlocks(blocks) {
  const merged = [];
  [...blocks]
    .sort((a, b) => a.tag - b.tag || toMinutes(a.von) - toMinutes(b.von))
    .forEach((block) => {
      const last = merged[merged.length - 1];
      if (last && last.tag === block.tag && toMinutes(block.von) <= toMinutes(last.bis)) {
        if (toMinutes(block.bis) > toMinutes(last.bis)) last.bis = block.bis;
      } else {
        merged.push({ ...block });
      }
    });
  return merged;
}

function weekLessons() {
  const lessons = [];
  activeStudents().forEach((student) => {
    student.termine.forEach((termin) => {
      const date = addDays(weekStart, termin.tag - 1);
      const lesson = {
        student,
        tag: termin.tag,
        date,
        datum: dayKey(date),
        zeit: termin.zeit,
        start: toMinutes(termin.zeit),
        dauer: student.dauer,
        kind: 'normal',
        note: '',
        record: null,
      };
      if (scheduleMode === 'real') {
        if (isPausedOn(student, date)) {
          lesson.kind = 'paused';
          lesson.note = 'pausiert';
        } else {
          lesson.record = findRecord(student.id, lesson.datum, lesson.zeit);
          if (lesson.record && lesson.record.status === 'ausgefallen') {
            lesson.kind = 'cancelled';
            lesson.note = 'ausgefallen';
          }
        }
      }
      lessons.push(lesson);
    });
  });
  return lessons;
}

function weekHolidayInfo() {
  const friday = addDays(weekStart, 4);
  const names = new Set();
  activeStudents().forEach((student) => {
    (studentHolidays(student) || []).forEach((h) => {
      if (h.start <= dayKey(friday) && h.end >= dayKey(weekStart)) {
        names.add(`${h.name} in ${regionName(student)}`);
      }
    });
  });
  return [...names].join(', ');
}

function renderWeekNav() {
  const isReal = scheduleMode === 'real';
  [weekPrev, weekNext, weekToday, weekInfo].forEach((node) => {
    node.hidden = !isReal;
  });

  if (!isReal) {
    weekTitle.replaceChildren('Deine ', el('em', null, 'normale'), ' Woche');
    return;
  }

  const friday = addDays(weekStart, 4);
  const fromText = weekStart.getMonth() === friday.getMonth() ? `${weekStart.getDate()}.` : `${weekStart.getDate()}. ${monthName(weekStart)}`;
  weekTitle.replaceChildren(`${fromText} `, el('em', null, 'bis'), ` ${friday.getDate()}. ${monthName(friday)}`);
  const holidayText = weekHolidayInfo();
  weekInfo.textContent = `KW ${isoWeek(weekStart)}${holidayText ? ` · ${holidayText}` : ''}`;
}

function startDrag(event, body, tag) {
  if (!editingBlocks || event.target.closest('.wg-blocked')) return;
  const rect = body.getBoundingClientRect();
  const anchor = snapMinutes(event.clientY - rect.top);
  const draft = el('div', 'wg-draft');
  body.append(draft);
  drag = { body, tag, anchor, from: anchor, to: anchor + SLOT, draft };
  body.setPointerCapture(event.pointerId);
  drawDraft();
}

function moveDrag(event) {
  if (!drag) return;
  const rect = drag.body.getBoundingClientRect();
  const current = snapMinutes(event.clientY - rect.top);
  drag.from = Math.min(drag.anchor, current);
  drag.to = Math.max(drag.anchor, current) + SLOT;
  drawDraft();
}

function drawDraft() {
  drag.draft.style.top = `${gridY(drag.from)}px`;
  drag.draft.style.height = `${gridY(drag.to) - gridY(drag.from)}px`;
}

async function endDrag() {
  if (!drag) return;
  const { tag, from, to } = drag;
  drag = null;
  await persist(() => {
    data.blockiert = mergeBlocks([...blockedTimes(), { tag, von: toTimeString(from), bis: toTimeString(to) }]);
  });
  renderSchedule();
}

async function removeBlock(block) {
  const saved = await persist(() => {
    data.blockiert = blockedTimes().filter((b) => !(b.tag === block.tag && b.von === block.von && b.bis === block.bis));
  });
  if (saved) renderSchedule();
}

function isSelectedLesson(lesson) {
  return Boolean(selectedLesson)
    && selectedLesson.studentId === lesson.student.id
    && selectedLesson.datum === lesson.datum
    && selectedLesson.zeit === lesson.zeit;
}

function lessonBlock(lesson) {
  const top = Math.max(lesson.start, DAY_START);
  const bottom = Math.min(lesson.start + lesson.dauer, DAY_END);
  const box = el('div', `wg-lesson ${lesson.kind}`);
  box.style.setProperty('--c', lesson.student.farbe);
  box.style.top = `${gridY(top)}px`;
  box.style.height = `${gridY(bottom) - gridY(top)}px`;
  box.title = `${fullName(lesson.student)}, ${formatTime(lesson.start)} Uhr, ${lesson.dauer} Minuten`;

  const name = el('div', 'wg-lesson-name', lesson.student.vorname);
  if (lesson.record && lesson.record.status === 'stattgefunden') name.append(el('span', 'wg-check', '✓'));
  box.append(name, el('div', 'wg-lesson-time', `${formatTime(lesson.start)} · ${lesson.dauer} Min`));
  if (lesson.note) box.append(el('div', 'hand wg-lesson-note', lesson.note));

  if (scheduleMode === 'real' && lesson.kind !== 'paused') {
    box.classList.add('clickable');
    if (isSelectedLesson(lesson)) box.classList.add('selected');
    box.addEventListener('click', () => {
      selectedLesson = isSelectedLesson(lesson) ? null : { studentId: lesson.student.id, datum: lesson.datum, zeit: lesson.zeit };
      renderSchedule();
    });
  }
  return box;
}

function renderWeekGrid(lessons) {
  const height = `${gridY(DAY_END)}px`;
  const todayKey = dayKey(new Date());

  const times = el('div', 'wg-times');
  const timesBody = el('div', 'wg-body');
  timesBody.style.height = height;
  for (let m = DAY_START; m <= DAY_END; m += 60) {
    const label = el('div', 'wg-time-label', formatTime(m));
    label.style.top = `${gridY(m)}px`;
    timesBody.append(label);
  }
  times.append(el('div', 'wg-head'), timesBody);

  const columns = [1, 2, 3, 4, 5].map((tag) => {
    const date = addDays(weekStart, tag - 1);
    const column = el('div', 'wg-day');

    const head = el('div', 'wg-head');
    head.append(el('div', 'wg-day-name', DAYS[tag]));
    if (scheduleMode === 'real') {
      head.append(el('div', 'wg-day-date', `${date.getDate()}. ${shortMonth(date)}`));
      if (dayKey(date) === todayKey) head.classList.add('today');
    }

    const body = el('div', 'wg-body');
    body.style.height = height;
    for (let m = DAY_START; m <= DAY_END; m += 60) {
      const line = el('div', 'wg-hour');
      line.style.top = `${gridY(m)}px`;
      body.append(line);
    }

    blockedTimes()
      .filter((b) => b.tag === tag)
      .forEach((block) => {
        const from = Math.max(toMinutes(block.von), DAY_START);
        const to = Math.min(toMinutes(block.bis), DAY_END);
        if (to <= from) return;
        const box = el('div', 'wg-blocked', 'blockiert');
        box.style.top = `${gridY(from)}px`;
        box.style.height = `${gridY(to) - gridY(from)}px`;
        box.title = `blockiert ${formatTime(from)} bis ${formatTime(to)}`;
        box.addEventListener('click', () => {
          if (editingBlocks) removeBlock(block);
        });
        body.append(box);
      });

    lessons
      .filter((l) => l.tag === tag && l.start < DAY_END && l.start + l.dauer > DAY_START)
      .forEach((lesson) => body.append(lessonBlock(lesson)));

    body.addEventListener('pointerdown', (event) => startDrag(event, body, tag));
    body.addEventListener('pointermove', moveDrag);
    body.addEventListener('pointerup', endDrag);

    column.append(head, body);
    return column;
  });

  weekGrid.classList.toggle('editing', editingBlocks);
  weekGrid.replaceChildren(times, ...columns);
}

function renderScheduleLegend() {
  const items = scheduleMode === 'real'
    ? [['sw-normal', 'findet statt'], ['sw-dashed', 'pausiert, verschoben oder ausgefallen'], ['sw-extra', 'Ersatz- oder Zusatzstunde'], ['sw-blocked', 'blockiert']]
    : [['sw-normal', 'feste Termine'], ['sw-blocked', 'blockiert']];
  scheduleLegend.replaceChildren(...items.map(([cls, text]) => {
    const item = el('span');
    item.append(el('span', `legend-swatch ${cls}`), text);
    return item;
  }));
}

function lessonActionButton(label, className, action) {
  const btn = el('button', `btn btn-small ${className}`.trim(), label);
  btn.addEventListener('click', async () => {
    if (await action()) renderSchedule();
  });
  return btn;
}

function renderLessonDetail(lessons) {
  const lesson = scheduleMode === 'real' ? lessons.find(isSelectedLesson) : null;
  lessonDetail.hidden = !lesson;
  if (!lesson) return;

  const { student, date, record } = lesson;
  const isPrivat = student.art === 'privat';
  lessonDetailKicker.textContent = fullName(student);
  lessonDetailTitle.replaceChildren(`${weekdayName(date)}, `, el('em', null, `${date.getDate()}. ${monthName(date)}`));

  let status;
  if (!record) status = isPrivat ? 'noch nicht bestätigt' : 'findet statt';
  else if (record.status === 'ausgefallen') status = `ausgefallen, abgesagt von ${record.abgesagtVon === 'ich' ? 'mir' : 'Schüler'}`;
  else status = `stattgefunden, ${record.dauer} Minuten${record.thema ? `, Thema: ${record.thema}` : ''}`;
  lessonDetailMeta.textContent = `${formatTime(lesson.start)} Uhr · ${lesson.dauer} Minuten · ${status}`;

  const buttons = [];
  if (record) {
    buttons.push(lessonActionButton('Zurücksetzen', '', () => resetLesson(lesson)));
  } else {
    if (isPrivat) {
      buttons.push(lessonActionButton('Stattgefunden', 'btn-primary', () => saveLesson(lesson, {
        status: 'stattgefunden',
        dauer: lesson.dauer,
        letzteImMonat: isLastInMonth(student, date),
      })));
    }
    buttons.push(lessonActionButton('Ausgefallen: Schüler', '', () => saveLesson(lesson, { status: 'ausgefallen', dauer: lesson.dauer, abgesagtVon: 'schueler' })));
    buttons.push(lessonActionButton('Ausgefallen: ich', '', () => saveLesson(lesson, { status: 'ausgefallen', dauer: lesson.dauer, abgesagtVon: 'ich' })));
  }
  lessonDetailButtons.replaceChildren(...buttons);
}

function freeTimes(lessons) {
  const result = [];
  [1, 2, 3, 4, 5].forEach((tag) => {
    const busy = [
      ...blockedTimes().filter((b) => b.tag === tag).map((b) => [toMinutes(b.von), toMinutes(b.bis)]),
      ...lessons.filter((l) => l.tag === tag && (l.kind === 'normal' || l.kind === 'extra')).map((l) => [l.start, l.start + l.dauer]),
    ].sort((a, b) => a[0] - b[0]);

    let cursor = DAY_START;
    const gaps = [];
    busy.forEach(([from, to]) => {
      if (from > cursor) gaps.push([cursor, Math.min(from, DAY_END)]);
      cursor = Math.max(cursor, to);
    });
    if (cursor < DAY_END) gaps.push([cursor, DAY_END]);

    gaps
      .filter(([from, to]) => to - from >= MIN_FREE)
      .forEach(([from, to]) => {
        const reasons = lessons
          .filter((l) => l.tag === tag && ['paused', 'moved', 'cancelled'].includes(l.kind) && l.start < to && l.start + l.dauer > from)
          .map((l) => `${l.student.vorname} ${l.note}`);
        result.push({ tag, from, to, reasons });
      });
  });
  return result;
}

function renderFreeTimes(lessons) {
  const list = freeTimes(lessons);
  freeTitle.textContent = scheduleMode === 'real' ? 'Diese Woche' : 'Jede Woche';

  if (list.length === 0) {
    freeList.replaceChildren(el('div', 'free-empty', 'Keine freien Zeiten.'));
  } else {
    freeList.replaceChildren(...list.map((slot) => {
      const row = el('div', 'free-row');
      const time = el('span', 'free-time', `${formatTime(slot.from)} bis ${formatTime(slot.to)}`);
      slot.reasons.forEach((reason) => time.append(el('span', 'hand free-reason', reason)));
      row.append(el('span', 'free-day', DAYS[slot.tag]), time);
      return row;
    }));
  }

  freeCopy.disabled = list.length === 0;
  freeCopy.onclick = async () => {
    const heading = scheduleMode === 'real'
      ? `Freie Zeiten vom ${weekStart.getDate()}. ${monthName(weekStart)} bis ${addDays(weekStart, 4).getDate()}. ${monthName(addDays(weekStart, 4))}:`
      : 'Meine freien Zeiten:';
    const lines = list.map((slot) => `${WEEKDAYS_LONG[slot.tag]} ${formatTime(slot.from)} bis ${formatTime(slot.to)} Uhr`);
    try {
      await navigator.clipboard.writeText([heading, ...lines].join('\n'));
      freeCopy.textContent = 'Kopiert!';
    } catch (error) {
      freeCopy.textContent = 'Hat nicht geklappt';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      freeCopy.textContent = 'Kopieren';
    }, 2000);
  };
}

function renderSchedule() {
  modeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === scheduleMode));
  blockToggle.classList.toggle('active', editingBlocks);
  blockToggle.textContent = editingBlocks ? 'Fertig' : 'Zeiten blockieren';
  blockHint.hidden = !editingBlocks;

  const lessons = weekLessons();
  renderWeekNav();
  renderWeekGrid(lessons);
  renderScheduleLegend();
  renderLessonDetail(lessons);
  renderFreeTimes(lessons);
}

function renderHistory(student) {
  const records = stunden()
    .filter((r) => r.studentId === student.id)
    .sort((a, b) => b.datum.localeCompare(a.datum) || b.zeit.localeCompare(a.zeit));

  if (records.length === 0) {
    lessonHistory.replaceChildren(el('div', 'history-empty', 'Noch keine Stunden erfasst.'));
    return;
  }

  lessonHistory.replaceChildren(...records.map((record) => {
    const date = parseDay(record.datum);
    const row = el('div', 'history-row');
    const dateText = `${DAYS[date.getDay()] || ''}, ${date.getDate()}. ${shortMonth(date)} ${date.getFullYear()}`;
    const statusText = record.status === 'ausgefallen'
      ? `ausgefallen (${record.abgesagtVon === 'ich' ? 'ich' : 'Schüler'})`
      : `${record.dauer} Min`;
    row.append(
      el('span', 'history-date', dateText),
      el('span', `history-status ${record.status}`, statusText),
      el('span', null, record.thema || ''),
      el('span', 'history-price', record.preis ? formatEuro(record.preis) : ''),
    );
    return row;
  }));
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

  const first = nameCell(student);
  const pause = pauseNote(student);
  if (pause) first.append(el('div', 'hand', pause));

  const timeCell = el('div');
  const times = student.termine.map((t) => `${DAYS[t.tag]} ${t.zeit}`).join(', ');
  timeCell.append(el('div', 'student-time', times || 'kein Termin'), el('div', 'student-meta', `${student.dauer} Minuten`));

  const lastCell = el('div');
  if (student.art === 'plattform') {
    lastCell.append(el('div', 'student-time', String(student.nachholStart)), el('div', 'student-meta', 'nachzuholen'));
  } else {
    lastCell.append(el('div', 'student-time', formatEuro(priceFor(student.dauer))), el('div', 'student-meta', 'pro Stunde'));
  }

  row.append(first, artCell(student), timeCell, lastCell);
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
  const today = startOfDay(new Date());
  if (today >= start && today < end) {
    const line = el('div', 'tl-today');
    line.style.left = `${(dayDiff(start, today) / total) * 100}%`;
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
    else if (page === 'schedule') openSchedule();
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
        schuljahrGeprueft: schoolYear(),
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

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    scheduleMode = btn.dataset.mode;
    selectedLesson = null;
    renderSchedule();
  });
});

blockToggle.addEventListener('click', () => {
  editingBlocks = !editingBlocks;
  selectedLesson = null;
  renderSchedule();
});

weekPrev.addEventListener('click', () => {
  weekStart = addDays(weekStart, -7);
  selectedLesson = null;
  renderSchedule();
});

weekNext.addEventListener('click', () => {
  weekStart = addDays(weekStart, 7);
  selectedLesson = null;
  renderSchedule();
});

weekToday.addEventListener('click', () => {
  weekStart = currentWeekStart();
  selectedLesson = null;
  renderSchedule();
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
    const clicked = btn.dataset.status;
    const newStatus = holidayStatus(student, holiday) === clicked ? null : clicked;
    const ids = [student.id, ...(detailAll.checked ? sameRegion(student).map((s) => s.id) : [])];

    const saved = await setHolidayStatus(ids, holidayKey(holiday), newStatus);
    if (saved) {
      renderTimeline();
      renderDetail();
    }
  });
});

setInterval(() => {
  if (currentPage !== 'overview') return;
  if (todoList.contains(document.activeElement)) return;
  renderOverview();
}, 60000);

async function init() {
  try {
    data = await window.api.loadData();
  } catch (error) {
    canSave = false;
    alert(`Deine Daten konnten nicht geladen werden: ${error.message}`);
  }

  const year = schoolYear();
  const missing = data.students.filter((s) => s.schuljahrGeprueft === undefined);
  if (canSave && (missing.length > 0 || !data.stundenAb)) {
    await persist(() => {
      missing.forEach((s) => {
        data.students.find((t) => t.id === s.id).schuljahrGeprueft = year;
      });
      if (!data.stundenAb) data.stundenAb = dayKey(new Date());
    });
  }

  openOverview();
  refreshHolidays();
}

init();