const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const WEEKDAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const COLORS = ['#FF2E88', '#C6F432', '#3D8BF2', '#F5A623', '#9B6BFF', '#22B573', '#00B8D9', '#F2668F'];
const DURATIONS = [30, 45, 50, 60];
const RANGE_MONTHS = 3;
const RANGE_STEP = 1;
const PAUSE_PREVIEW_DAYS = 14;
const LOOKBACK_DAYS = 60;
const NORMAL_START = 13 * 60;
const REAL_START = 10 * 60;
const FREE_START = 13 * 60;
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
let extraOpen = false;
let moving = false;
let invoiceFilter = 'alle';
let selectedInvoice = null;
let regRange = '3m';
let examFormOpen = false;
let editingExamId = null;
let examFiles = [];
let examAdded = [];
let examRemoved = [];
let taskFormOpen = false;
let editingTaskId = null;
let taskTags = [];
let taskClasses = [];
let taskFile = null;
let taskFileAdded = null;
let taskFileRemoved = null;
let taskClassFilter = null;
let taskTagFilter = [];

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
const todayList = document.getElementById('today-list');
const todayFree = document.getElementById('today-free');
const tileMoney = document.getElementById('tile-money');
const tileMoneyMeta = document.getElementById('tile-money-meta');
const tileNachhol = document.getElementById('tile-nachhol');
const tileNachholList = document.getElementById('tile-nachhol-list');
const tileBirthday = document.getElementById('tile-birthday');
const tileExam = document.getElementById('tile-exam');
const tileExamKicker = document.getElementById('tile-exam-kicker');
const tileExamDays = document.getElementById('tile-exam-days');
const tileExamMeta = document.getElementById('tile-exam-meta');
const examsNav = document.querySelector('[data-page="exams"]');
const examCount = document.getElementById('exam-count');
const examNew = document.getElementById('exam-new');
const examForm = document.getElementById('exam-form');
const examFormTitle = document.getElementById('exam-form-title');
const examStudent = document.getElementById('exam-student');
const examGradeHint = document.getElementById('exam-grade-hint');
const examFilesBox = document.getElementById('exam-files');
const examAttach = document.getElementById('exam-attach');
const examDelete = document.getElementById('exam-delete');
const examNext = document.getElementById('exam-next');
const examUpcoming = document.getElementById('exam-upcoming');
const examPast = document.getElementById('exam-past');
const taskSearch = document.getElementById('task-search');
const taskNew = document.getElementById('task-new');
const taskForm = document.getElementById('task-form');
const taskFormTitle = document.getElementById('task-form-title');
const taskFileBox = document.getElementById('task-file');
const taskAttach = document.getElementById('task-attach');
const tagChips = document.getElementById('tag-chips');
const tagEntry = document.getElementById('tag-entry');
const tagSuggestions = document.getElementById('tag-suggestions');
const taskClassesBox = document.getElementById('task-classes');
const taskDelete = document.getElementById('task-delete');
const classFilter = document.getElementById('class-filter');
const tagFilter = document.getElementById('tag-filter');
const taskCount = document.getElementById('task-count');
const taskList = document.getElementById('task-list');
const examSection = document.getElementById('exam-section');
const studentExams = document.getElementById('student-exams');
const tileBirthdayList = document.getElementById('tile-birthday-list');
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
const regularSection = document.getElementById('regular-section');
const regValue = document.getElementById('reg-value');
const regDots = document.getElementById('reg-dots');
const regNote = document.getElementById('reg-note');
const regButtons = document.querySelectorAll('[data-reg]');
const lessonHistory = document.getElementById('lesson-history');
const nachholSection = document.getElementById('nachhol-section');
const nachholCount = document.getElementById('nachhol-count');
const nachholHistory = document.getElementById('nachhol-history');
const nachholMinus = document.getElementById('nachhol-minus');
const nachholPlus = document.getElementById('nachhol-plus');
const studentList = document.getElementById('student-list');
const studentsEmpty = document.getElementById('students-empty');
const archiveList = document.getElementById('archive-list');
const archiveEmpty = document.getElementById('archive-empty');
const archiveBtn = document.getElementById('archive-btn');
const settingsForm = document.getElementById('settings-form');
const ratePreview = document.getElementById('rate-preview');
const settingsSaved = document.getElementById('settings-saved');
const autostartToggle = document.getElementById('autostart-toggle');
const backupStatus = document.getElementById('backup-status');
const backupFolderText = document.getElementById('backup-folder');
const backupNowBtn = document.getElementById('backup-now');
const modeButtons = document.querySelectorAll('[data-mode]');
const blockToggle = document.getElementById('block-toggle');
const blockHint = document.getElementById('block-hint');
const extraToggle = document.getElementById('extra-toggle');
const extraForm = document.getElementById('extra-form');
const extraStudent = document.getElementById('extra-student');
const extraNachholRow = document.getElementById('extra-nachhol-row');
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
const moveRow = document.getElementById('move-row');
const moveDate = document.getElementById('move-date');
const moveTime = document.getElementById('move-time');
const moveSave = document.getElementById('move-save');
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
const invoiceList = document.getElementById('invoice-list');
const invoicesEmpty = document.getElementById('invoices-empty');
const statOffen = document.getElementById('stat-offen');
const statVerschickt = document.getElementById('stat-verschickt');
const statBezahlt = document.getElementById('stat-bezahlt');
const statYear = document.getElementById('stat-year');
const filterButtons = document.querySelectorAll('[data-filter]');

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

function mondayOf(date) {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() + 6) % 7));
}

function currentWeekStart() {
  const today = startOfDay(new Date());
  const monday = mondayOf(today);
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

function lessonIsOver(datum, zeit, dauer) {
  const todayKey = dayKey(new Date());
  if (datum < todayKey) return true;
  if (datum > todayKey) return false;
  return nowMinutes() >= toMinutes(zeit) + dauer;
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

function shortDate(date) {
  return `${DAYS[date.getDay()]}, ${date.getDate()}. ${shortMonth(date)} ${date.getFullYear()}`;
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

function activeStudent(id) {
  return data.students.find((s) => s.id === id && !s.archiviert) || null;
}

async function persist(change) {
  if (!canSave) {
    showAlert('Deine Daten konnten beim Start nicht geladen werden. Damit nichts überschrieben wird, ist Speichern gerade gesperrt.');
    return false;
  }
  const before = structuredClone(data);
  change();
  try {
    await window.api.saveData(data);
    publishSummary();
    return true;
  } catch (error) {
    data = before;
    showAlert(`Speichern hat nicht geklappt: ${error.message}`);
    return false;
  }
}

const dialog = document.getElementById('dialog');
const dialogKicker = document.getElementById('dialog-kicker');
const dialogText = document.getElementById('dialog-text');
const dialogActions = document.getElementById('dialog-actions');
const dialogQueue = [];
let dialogOpen = false;

function openDialog(options) {
  return new Promise((resolve) => {
    dialogQueue.push({ ...options, resolve });
    if (!dialogOpen) nextDialog();
  });
}

function nextDialog() {
  const current = dialogQueue.shift();
  if (!current) {
    dialogOpen = false;
    dialog.hidden = true;
    return;
  }
  dialogOpen = true;
  const previousFocus = document.activeElement;

  const close = (value) => {
    document.removeEventListener('keydown', onKey, true);
    dialog.hidden = true;
    if (previousFocus && previousFocus.focus) previousFocus.focus();
    current.resolve(value);
    nextDialog();
  };

  const onKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(current.cancelValue);
    }
  };

  dialogKicker.textContent = current.kicker;
  dialogText.textContent = current.text;
  const buttons = current.buttons.map((b) => {
    const btn = el('button', `btn btn-small ${b.className || ''}`.trim(), b.label);
    btn.type = 'button';
    btn.addEventListener('click', () => close(b.value));
    return btn;
  });
  dialogActions.replaceChildren(...buttons);
  dialog.hidden = false;
  document.addEventListener('keydown', onKey, true);
  buttons[buttons.length - 1].focus();
}

function askConfirm(text, okLabel = 'Okay') {
  return openDialog({
    kicker: 'Bist du sicher?',
    text,
    cancelValue: false,
    buttons: [
      { label: 'Abbrechen', value: false },
      { label: okLabel, value: true, className: 'btn-danger' },
    ],
  });
}

function showAlert(text) {
  return openDialog({
    kicker: 'Hinweis',
    text,
    cancelValue: true,
    buttons: [{ label: 'Okay', value: true, className: 'btn-primary' }],
  });
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

function sonderTermine() {
  return data.sonderTermine || [];
}

function nachholKorrekturen() {
  return data.nachholKorrekturen || [];
}

function rechnungen() {
  return data.rechnungen || [];
}

function cancelText(record) {
  if (record.abgesagtVon === 'nichtErschienen') return 'nicht erschienen';
  return `ausgefallen, abgesagt von ${record.abgesagtVon === 'ich' ? 'mir' : 'Schüler'}`;
}

function schulaufgaben() {
  return data.schulaufgaben || [];
}

function examDate(exam) {
  return parseDay(exam.datum);
}

function daysUntil(exam) {
  return dayDiff(startOfDay(new Date()), examDate(exam));
}

function countdownText(days) {
  if (days === 0) return 'heute';
  if (days === 1) return 'morgen';
  return `in ${days} Tagen`;
}

function upcomingExams() {
  const todayKey = dayKey(new Date());
  return schulaufgaben()
    .filter((e) => e.datum >= todayKey && activeStudent(e.studentId))
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

function pastExams() {
  const todayKey = dayKey(new Date());
  return schulaufgaben()
    .filter((e) => e.datum < todayKey && data.students.some((s) => s.id === e.studentId))
    .sort((a, b) => b.datum.localeCompare(a.datum));
}

function gradeHint(student) {
  if (!student) return '';
  if (student.land === 'CH') return 'Schweiz: 6 ist die beste Note, 1 die schlechteste.';
  if (student.land === 'AT') return 'Österreich: 1 ist die beste Note, 5 die schlechteste.';
  return 'Deutschland: 1 ist die beste Note, 6 die schlechteste. In der Oberstufe kannst du auch Punkte eintragen.';
}

function examLabel(exam) {
  const date = examDate(exam);
  return `${exam.art} am ${date.getDate()}.${date.getMonth() + 1}.`;
}

function findRecord(studentId, datum, zeit) {
  return stunden().find((r) => r.studentId === studentId && r.datum === datum && r.zeit === zeit) || null;
}

function movedTo(studentId, datum, zeit) {
  return sonderTermine().find((s) => s.studentId === studentId && s.ersetzt && s.ersetzt.datum === datum && s.ersetzt.zeit === zeit) || null;
}

function sonderAt(studentId, datum, zeit) {
  return sonderTermine().find((s) => s.studentId === studentId && s.datum === datum && s.zeit === zeit) || null;
}

function sonderNote(sonder) {
  if (sonder.ersetzt) return `Ersatz für ${DAYS[parseDay(sonder.ersetzt.datum).getDay()]}`;
  return sonder.nachholung ? 'Nachholstunde' : 'Zusatzstunde';
}

function occurrencesOn(date) {
  const weekday = date.getDay();
  const datum = dayKey(date);
  const result = [];

  if (weekday >= 1 && weekday <= 5) {
    activeStudents().forEach((student) => {
      if (isPausedOn(student, date)) return;
      student.termine
        .filter((t) => t.tag === weekday && !movedTo(student.id, datum, t.zeit))
        .forEach((t) => result.push({ student, date, datum, zeit: t.zeit, start: toMinutes(t.zeit), dauer: student.dauer, sonder: null }));
    });
  }

  sonderTermine()
    .filter((s) => s.datum === datum)
    .forEach((s) => {
      const student = activeStudent(s.studentId);
      if (student) result.push({ student, date, datum, zeit: s.zeit, start: toMinutes(s.zeit), dauer: s.dauer, sonder: s });
    });

  return result;
}

function isLastInMonth(student, date) {
  for (let day = addDays(date, 1); day.getMonth() === date.getMonth(); day = addDays(day, 1)) {
    if (occurrencesOn(day).some((o) => o.student.id === student.id)) return false;
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

function nachholEvents(student) {
  if (student.art !== 'plattform') return [];
  const events = [];
  const today = startOfDay(new Date());
  const createdKey = student.angelegt ? dayKey(new Date(student.angelegt)) : '0000-00-00';

  stunden()
    .filter((r) => r.studentId === student.id && r.status === 'ausgefallen' && r.datum >= createdKey)
    .forEach((r) => {
      const sonder = sonderAt(student.id, r.datum, r.zeit);
      if (!sonder) events.push({ datum: r.datum, delta: 1, text: cancelText(r) });
      else if (sonder.ersetzt) events.push({ datum: r.datum, delta: 1, text: `Ersatztermin ${cancelText(r)}` });
    });

  sonderTermine()
    .filter((s) => s.studentId === student.id && s.nachholung && s.datum >= createdKey)
    .forEach((s) => {
      const record = findRecord(student.id, s.datum, s.zeit);
      const cancelled = Boolean(record) && record.status === 'ausgefallen';
      if (!cancelled && lessonIsOver(s.datum, s.zeit, s.dauer)) events.push({ datum: s.datum, delta: -1, text: 'Nachholstunde gemacht' });
    });

  const startKeys = [createdKey, data.stundenAb || dayKey(today)].sort();
  const first = parseDay(startKeys[1]);
  for (let day = first; day <= today; day = addDays(day, 1)) {
    if (!isPausedOn(student, day)) continue;
    const datum = dayKey(day);
    student.termine
      .filter((t) => t.tag === day.getDay() && !movedTo(student.id, datum, t.zeit))
      .forEach(() => events.push({ datum, delta: 1, text: 'Stunde in pausierten Ferien' }));
  }

  nachholKorrekturen()
    .filter((k) => k.studentId === student.id)
    .forEach((k) => events.push({ datum: k.datum, delta: k.delta, text: 'Korrektur von Hand' }));

  return events.sort((a, b) => b.datum.localeCompare(a.datum));
}

function regStart(student, range) {
  const today = startOfDay(new Date());
  const from = range === 'jahr'
    ? schoolYearStart(today)
    : new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  const keys = [
    dayKey(from),
    data.stundenAb || dayKey(today),
    student.angelegt ? dayKey(new Date(student.angelegt)) : '0000-00-00',
  ].sort();
  return parseDay(keys[2]);
}

function lessonLog(student, range) {
  const today = startOfDay(new Date());
  const log = [];

  for (let day = regStart(student, range); day <= today; day = addDays(day, 1)) {
    const datum = dayKey(day);
    const items = [];
    if (day.getDay() >= 1 && day.getDay() <= 5) {
      const paused = isPausedOn(student, day);
      student.termine
        .filter((t) => t.tag === day.getDay() && !movedTo(student.id, datum, t.zeit))
        .forEach((t) => items.push({ zeit: t.zeit, dauer: student.dauer, paused }));
    }
    sonderTermine()
      .filter((s) => s.studentId === student.id && s.datum === datum)
      .forEach((s) => items.push({ zeit: s.zeit, dauer: s.dauer, paused: false }));

    items
      .sort((a, b) => a.zeit.localeCompare(b.zeit))
      .forEach((item) => {
        if (!lessonIsOver(datum, item.zeit, item.dauer)) return;
        let kind;
        if (item.paused) {
          kind = 'ferien';
        } else {
          const record = findRecord(student.id, datum, item.zeit);
          if (record && record.status === 'stattgefunden') kind = 'da';
          else if (record) kind = record.abgesagtVon === 'ich' ? null : 'weg';
          else kind = student.art === 'plattform' ? 'da' : 'offen';
        }
        if (kind) log.push({ date: day, zeit: item.zeit, kind });
      });
  }

  return log;
}

function regularity(student, range) {
  const log = lessonLog(student, range);
  const count = (kind) => log.filter((e) => e.kind === kind).length;
  const da = count('da');
  const weg = count('weg');
  const ferien = count('ferien');
  return {
    log,
    ohne: da + weg > 0 ? Math.round((da / (da + weg)) * 100) : null,
    mit: da + weg + ferien > 0 ? Math.round((da / (da + weg + ferien)) * 100) : null,
  };
}

function nachholStand(student) {
  return (student.nachholStart || 0) + nachholEvents(student).reduce((sum, e) => sum + e.delta, 0);
}

function lessonPrice(art, values) {
  if (art !== 'privat') return 0;
  if (values.status === 'stattgefunden') return priceFor(values.dauer);
  if (values.abgesagtVon === 'nichtErschienen') return priceFor(values.dauer) / 2;
  return 0;
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
      preis: lessonPrice(art, values),
      thema: values.thema || '',
      letzteImMonat: Boolean(values.letzteImMonat),
      abgesagtVon: values.abgesagtVon || null,
      sonderId: occ.sonder ? occ.sonder.id : null,
      erfasst: new Date().toISOString(),
    });
  });
}

function resetLesson(occ) {
  return persist(() => {
    data.stunden = stunden().filter((r) => !(r.studentId === occ.student.id && r.datum === occ.datum && r.zeit === occ.zeit));
  });
}

function addSonder(sonder) {
  return persist(() => {
    data.sonderTermine = [...sonderTermine(), { id: crypto.randomUUID(), ...sonder }];
  });
}

function deleteSonder(sonder) {
  return persist(() => {
    data.sonderTermine = sonderTermine().filter((s) => s.id !== sonder.id);
    data.stunden = stunden().filter((r) => !(r.studentId === sonder.studentId && r.datum === sonder.datum && r.zeit === sonder.zeit));
  });
}

function isBillable(record) {
  if (record.art !== 'privat') return false;
  return record.status === 'stattgefunden' || record.abgesagtVon === 'nichtErschienen';
}

function toCents(value) {
  return Math.round(value * 100);
}

function centsText(cents) {
  return cents % 100 === 0 ? `${cents / 100}€` : `${(cents / 100).toFixed(2).replace('.', ',')}€`;
}

function monthKey(date) {
  return dayKey(date).slice(0, 7);
}

function monthDate(monat) {
  const [year, month] = monat.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function monthLabel(monat) {
  const date = monthDate(monat);
  return `${monthName(date)} ${date.getFullYear()}`;
}

function invoiceKey(studentId, monat) {
  return `${studentId}|${monat}`;
}

function savedInvoice(studentId, monat) {
  return rechnungen().find((r) => r.studentId === studentId && r.monat === monat) || null;
}

function allInvoices() {
  const groups = new Map();
  stunden().filter(isBillable).forEach((record) => {
    const student = data.students.find((s) => s.id === record.studentId);
    if (!student) return;
    const monat = record.datum.slice(0, 7);
    const key = invoiceKey(student.id, monat);
    if (!groups.has(key)) groups.set(key, { key, student, monat, records: [] });
    groups.get(key).records.push(record);
  });

  const currentMonth = monthKey(new Date());
  const pending = pendingLessons();

  return [...groups.values()].map((inv) => {
    inv.records.sort((a, b) => a.datum.localeCompare(b.datum) || a.zeit.localeCompare(b.zeit));
    inv.cents = inv.records.reduce((sum, r) => sum + toCents(r.preis), 0);
    inv.saved = savedInvoice(inv.student.id, inv.monat);
    inv.status = inv.saved ? inv.saved.status : 'offen';
    inv.edited = Boolean(inv.saved) && typeof inv.saved.text === 'string';
    inv.unconfirmed = pending.filter((o) => o.student.id === inv.student.id && o.datum.startsWith(inv.monat)).length;
    const markedLast = stunden().some((r) => r.studentId === inv.student.id && r.datum.startsWith(inv.monat) && r.letzteImMonat);
    inv.ready = markedLast || inv.monat < currentMonth;
    return inv;
  }).sort((a, b) => b.monat.localeCompare(a.monat) || byFirstName(a.student, b.student));
}

function invoiceLine(record) {
  const date = parseDay(record.datum);
  const day = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
  const end = toTimeString(toMinutes(record.zeit) + record.dauer);
  const note = record.status === 'stattgefunden' ? record.thema : 'nicht erschienen';
  return ['•', day, `${record.zeit}-${end} Uhr`, note, centsText(toCents(record.preis))].filter(Boolean).join(' ');
}

function autoInvoiceText(inv) {
  return [
    `${inv.student.vorname} ${monthName(monthDate(inv.monat))}:`,
    ...inv.records.map(invoiceLine),
    `= ${centsText(inv.cents)}`,
  ].join('\n');
}

function invoiceText(inv) {
  return inv.edited ? inv.saved.text : autoInvoiceText(inv);
}

function updateInvoice(inv, change) {
  return persist(() => {
    data.rechnungen = rechnungen();
    let target = data.rechnungen.find((r) => r.studentId === inv.student.id && r.monat === inv.monat);
    if (!target) {
      target = { id: crypto.randomUUID(), studentId: inv.student.id, monat: inv.monat, status: 'offen', text: null };
      data.rechnungen.push(target);
    }
    change(target);
  });
}

function setInvoiceStatus(inv, status) {
  return updateInvoice(inv, (target) => {
    target.status = status;
    const now = new Date().toISOString();
    if (status === 'offen') {
      target.verschicktAm = null;
      target.bezahltAm = null;
    }
    if (status === 'verschickt') {
      target.verschicktAm = target.verschicktAm || now;
      target.bezahltAm = null;
    }
    if (status === 'bezahlt') {
      target.verschicktAm = target.verschicktAm || now;
      target.bezahltAm = now;
    }
  });
}

function invoiceEditor(inv, statuses, refresh) {
  const box = el('div', 'invoice-editor');

  const area = el('textarea', 'invoice-text');
  area.value = invoiceText(inv);
  area.rows = inv.records.length + 3;
  area.spellcheck = false;
  area.addEventListener('change', async () => {
    const value = area.value;
    await updateInvoice(inv, (target) => {
      target.text = value === autoInvoiceText(inv) ? null : value;
    });
  });

  const actions = el('div', 'todo-actions');

  const copy = el('button', 'btn btn-small btn-primary', 'Kopieren');
  let timer = null;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      copy.textContent = 'Kopiert!';
    } catch (error) {
      copy.textContent = 'Hat nicht geklappt';
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      copy.textContent = 'Kopieren';
    }, 2000);
  });
  actions.append(copy);

  statuses.forEach(([status, label]) => {
    const btn = el('button', 'btn btn-small', label);
    if (inv.status === status) btn.classList.add('chosen');
    btn.addEventListener('click', async () => {
      if (await setInvoiceStatus(inv, status)) refresh();
    });
    actions.append(btn);
  });

  if (inv.edited) {
    const reset = el('button', 'btn btn-small', 'Text neu erstellen');
    reset.addEventListener('click', async () => {
      const saved = await updateInvoice(inv, (target) => {
        target.text = null;
      });
      if (saved) refresh();
    });
    actions.append(reset);
  }

  box.append(area, actions);
  if (inv.edited) box.append(el('div', 'hand invoice-note', 'Text von Hand geändert'));
  if (inv.unconfirmed > 0) {
    box.append(el('div', 'hand invoice-note', `${inv.unconfirmed === 1 ? 'Eine Stunde ist' : `${inv.unconfirmed} Stunden sind`} noch nicht bestätigt`));
  }
  return box;
}

function invoiceCard(inv) {
  const card = el('article', 'todo-card');
  const kicker = el('div', 'eyebrow todo-kicker', 'Rechnung · Bereit zum Verschicken');
  const heading = el('div', 'todo-title', `${fullName(inv.student)} `);
  heading.append(el('em', null, monthLabel(inv.monat)));
  const count = inv.records.length;
  const meta = el('div', 'student-meta', `${count} ${count === 1 ? 'Stunde' : 'Stunden'} · ${formatEuro(inv.cents / 100)}${inv.student.rechnungAn ? ` · an ${inv.student.rechnungAn}` : ''}`);
  card.append(kicker, heading, meta, invoiceEditor(inv, [['verschickt', 'Verschickt'], ['bezahlt', 'Schon bezahlt']], renderOverview));
  return card;
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
  publishSummary();
}

function setActiveNav(activeItem) {
  navItems.forEach((item) => item.classList.toggle('active', item === activeItem));
}

function showPage(id) {
  currentPage = id;
  pages.forEach((page) => {
    page.hidden = page.id !== `page-${id}`;
  });
  newStudentBtn.hidden = ['student-form', 'settings', 'holidays', 'schedule', 'invoices', 'exams', 'tasks'].includes(id);
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
  title.innerHTML = 'Stundenplan<em>.</em>';
  editingBlocks = false;
  extraOpen = false;
  selectedLesson = null;
  moving = false;
  showPage('schedule');
  renderSchedule();
}

function openTasks() {
  eyebrow.textContent = 'Material';
  title.innerHTML = 'Aufgaben<em>.</em>';
  showPage('tasks');
  renderTasks();
}

function openExams() {
  eyebrow.textContent = 'Mathe';
  title.innerHTML = 'Schulaufgaben<em>.</em>';
  setActiveNav(examsNav);
  showPage('exams');
  renderExams();
}

function openInvoices() {
  eyebrow.textContent = 'Privatschüler';
  title.innerHTML = 'Rechnungen<em>.</em>';
  showPage('invoices');
  renderInvoices();
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
  renderBackupInfo();
}

function shortFolder(folder) {
  const icloud = folder.indexOf('com~apple~CloudDocs');
  if (icloud >= 0) return `iCloud Drive${folder.slice(icloud + 'com~apple~CloudDocs'.length)}`;
  return folder.replace(/^\/Users\/[^/]+/, '~');
}

async function renderBackupInfo(info = null) {
  try {
    const current = info || await window.api.backupInfo();
    if (current.last) {
      const date = new Date(current.last);
      const time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      backupStatus.textContent = `Letzte Sicherung: ${longDate(date)} um ${time} Uhr`;
    } else {
      backupStatus.textContent = 'Noch keine Sicherung vorhanden.';
    }
    backupFolderText.textContent = `${shortFolder(current.folder)} · ${current.count} ${current.count === 1 ? 'Datei' : 'Dateien'}`;
  } catch (error) {
    backupStatus.textContent = 'Die Sicherung konnte nicht gelesen werden.';
    backupFolderText.textContent = error.message;
  }
}

function openForm(student = null) {
  resetForm();
  editingId = student ? student.id : null;
  archiveBtn.hidden = !student;
  historySection.hidden = !student;
  regularSection.hidden = !student;
  examSection.hidden = !student;
  nachholSection.hidden = !student || student.art !== 'plattform';
  if (student) {
    fillForm(student);
    renderHistory(student);
    renderRegularity(student);
    renderStudentExams(student);
    if (student.art === 'plattform') renderNachhol(student);
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
  const extraText = occ.sonder ? ` · ${sonderNote(occ.sonder)}` : '';
  const meta = el('div', 'student-meta', `${formatTime(occ.start)} Uhr · ${occ.dauer} Minuten · ${formatEuro(priceFor(occ.dauer))}${extraText}`);

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
      const noShow = el('button', 'btn btn-small', `Nicht erschienen · ${formatEuro(priceFor(occ.dauer) / 2)}`);
      noShow.addEventListener('click', () => save({ status: 'ausgefallen', dauer: occ.dauer, abgesagtVon: 'nichtErschienen' }));
      extra.replaceChildren(label, pupil, me, noShow);
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

function todayLessons() {
  const today = startOfDay(new Date());
  const now = nowMinutes();
  return occurrencesOn(today)
    .sort((a, b) => a.start - b.start)
    .map((o) => {
      const record = findRecord(o.student.id, o.datum, o.zeit);
      const end = o.start + o.dauer;
      let kind = 'upcoming';
      let status = '';
      if (record && record.status === 'stattgefunden') {
        kind = 'done';
        status = 'stattgefunden';
      } else if (record) {
        kind = 'cancelled';
        status = record.abgesagtVon === 'nichtErschienen' ? 'nicht erschienen' : 'ausgefallen';
      } else if (now >= end) {
        kind = o.student.art === 'plattform' ? 'done' : 'pending';
        status = o.student.art === 'plattform' ? 'vorbei' : 'noch bestätigen';
      } else if (now >= o.start) {
        kind = 'now';
        status = 'läuft gerade';
      }
      const art = o.student.art === 'plattform' ? 'Plattform' : 'Privat';
      return {
        zeit: formatTime(o.start),
        ende: formatTime(end),
        endMinutes: end,
        name: fullName(o.student),
        vorname: o.student.vorname,
        farbe: o.student.farbe,
        meta: `${art} · ${o.dauer} Min${o.sonder ? ` · ${sonderNote(o.sonder)}` : ''}`,
        kind,
        status,
      };
    });
}

function freeText(lessons) {
  const active = lessons.filter((l) => l.kind !== 'cancelled');
  if (lessons.length === 0) return 'Heute keine Stunden.';
  if (active.length === 0) return 'Heute fällt alles aus.';
  const lastEnd = Math.max(...active.map((l) => l.endMinutes));
  if (nowMinutes() >= lastEnd) return 'Für heute geschafft!';
  return `Frei ab ${formatTime(lastEnd)}.`;
}

function pausedToday() {
  const today = startOfDay(new Date());
  if (today.getDay() === 0 || today.getDay() === 6) return [];
  return activeStudents()
    .filter((s) => s.termine.some((t) => t.tag === today.getDay()) && isPausedOn(s, today))
    .map((s) => s.vorname);
}

function upcomingBirthdays() {
  const today = startOfDay(new Date());
  return activeStudents()
    .filter((s) => s.geburtstag)
    .map((s) => {
      const born = parseDay(s.geburtstag);
      let next = new Date(today.getFullYear(), born.getMonth(), born.getDate());
      if (next < today) next = new Date(today.getFullYear() + 1, born.getMonth(), born.getDate());
      const days = dayDiff(today, next);
      const age = next.getFullYear() - born.getFullYear();
      let when = `in ${days} Tagen`;
      if (days === 0) when = 'heute';
      if (days === 1) when = 'morgen';
      return { name: s.vorname, age, days, text: `${s.vorname} wird ${when} ${age}!` };
    })
    .filter((b) => b.days <= 7)
    .sort((a, b) => a.days - b.days);
}

function todoTexts() {
  const texts = [];
  const classStudents = classTodos();
  if (classStudents.length > 0) texts.push(`Klassen prüfen: ${classStudents.map((s) => s.vorname).join(', ')}`);
  pendingLessons().forEach((o) => texts.push(`Stunde ${o.student.vorname}, ${DAYS[o.date.getDay()]} ${formatTime(o.start)} bestätigen`));
  allInvoices()
    .filter((inv) => inv.status === 'offen' && inv.ready && inv.unconfirmed === 0)
    .forEach((inv) => texts.push(`Rechnung ${inv.student.vorname}, ${monthName(monthDate(inv.monat))} verschicken`));
  holidayTodos().forEach((group) => {
    group.entries.forEach(({ student }) => texts.push(`${group.holiday.name}: macht ${student.vorname} weiter?`));
  });
  return texts;
}

function nextExamSummary() {
  const exam = upcomingExams()[0];
  if (!exam || daysUntil(exam) > 14) return null;
  const student = activeStudent(exam.studentId);
  const date = examDate(exam);
  return {
    art: exam.art,
    name: student.vorname,
    days: daysUntil(exam),
    when: countdownText(daysUntil(exam)),
    date: `${DAYS[date.getDay()]}, ${date.getDate()}. ${shortMonth(date)}`,
    themen: exam.themen || '',
  };
}

function buildSummary() {
  const unpaid = allInvoices().filter((inv) => inv.status !== 'bezahlt');
  const texts = todoTexts();
  return {
    exam: nextExamSummary(),
    count: texts.length,
    todos: texts,
    lessons: todayLessons(),
    free: freeText(todayLessons()),
    paused: pausedToday(),
    unpaidCents: unpaid.reduce((sum, inv) => sum + inv.cents, 0),
    unsentCents: unpaid.filter((inv) => inv.status === 'offen').reduce((sum, inv) => sum + inv.cents, 0),
    unpaidNames: [...new Set(unpaid.map((inv) => inv.student.vorname))],
    nachhol: activeStudents()
      .filter((s) => s.art === 'plattform')
      .map((s) => ({ name: s.vorname, stand: nachholStand(s) }))
      .filter((n) => n.stand > 0),
    birthdays: upcomingBirthdays(),
  };
}

function publishSummary() {
  try {
    window.api.sendSummary(buildSummary());
  } catch (error) {
    console.error(error);
  }
}

function renderToday(summary) {
  if (summary.lessons.length === 0) {
    todayList.replaceChildren(el('div', 'today-empty', 'Keine Stunden heute.'));
  } else {
    todayList.replaceChildren(...summary.lessons.map((lesson) => {
      const row = el('div', `today-row ${lesson.kind}`);
      row.style.setProperty('--c', lesson.farbe);
      const info = el('div');
      const name = el('div', 'today-name', lesson.name);
      if (lesson.kind === 'done') name.append(el('span', 'wg-check', '✓'));
      info.append(name, el('div', 'student-meta', lesson.meta));
      row.append(el('div', 'today-time', lesson.zeit), info);
      if (lesson.status && lesson.kind !== 'done') row.append(el('div', 'hand today-status', lesson.status));
      return row;
    }));
  }

  const freeNodes = [summary.free];
  if (summary.paused.length > 0) freeNodes.push(el('span', 'hand today-paused', `${summary.paused.join(', ')} pausiert`));
  todayFree.replaceChildren(...freeNodes);

  tileMoney.textContent = formatEuro(summary.unpaidCents / 100);
  tileMoneyMeta.textContent = summary.unpaidCents === 0
    ? 'Alles bezahlt.'
    : `${summary.unpaidNames.join(', ')}${summary.unsentCents > 0 ? ` · davon ${formatEuro(summary.unsentCents / 100)} noch nicht verschickt` : ''}`;

  tileNachhol.hidden = !activeStudents().some((s) => s.art === 'plattform');
  tileNachholList.replaceChildren(...(summary.nachhol.length === 0
    ? [el('div', 'student-meta', 'Nichts nachzuholen.')]
    : summary.nachhol.map((n) => {
      const row = el('div', 'tile-row');
      row.append(el('span', null, n.name), el('span', 'tile-count', String(n.stand)));
      return row;
    })));

  tileExam.hidden = !summary.exam;
  if (summary.exam) {
    tileExamKicker.textContent = `${summary.exam.art} · ${summary.exam.name}`;
    tileExamDays.replaceChildren(
      summary.exam.days <= 1 ? summary.exam.when : String(summary.exam.days),
      summary.exam.days <= 1 ? '' : el('small', null, 'Tage'),
    );
    tileExamMeta.textContent = `${summary.exam.date}${summary.exam.themen ? ` · ${summary.exam.themen}` : ''}`;
  }

  tileBirthday.hidden = summary.birthdays.length === 0;
  tileBirthdayList.replaceChildren(...summary.birthdays.map((b) => el('div', 'hand tile-birthday-text', b.text)));
}

function renderOverview() {
  const summary = buildSummary();
  renderToday(summary);
  window.api.sendSummary(summary);

  const cards = [
    ...pendingLessons().map(lessonCard),
    ...allInvoices().filter((inv) => inv.status === 'offen' && inv.ready && inv.unconfirmed === 0).map(invoiceCard),
    ...holidayTodos().map(todoCard),
  ];
  const classStudents = classTodos();
  if (classStudents.length > 0) cards.unshift(classCard(classStudents));

  todoList.replaceChildren(...cards);
  todoBlock.hidden = cards.length === 0;
  overviewEmpty.hidden = cards.length > 0;
}

function viewStart() {
  return scheduleMode === 'real' ? REAL_START : NORMAL_START;
}

function gridY(minutes) {
  return ((minutes - viewStart()) / SLOT) * SLOT_HEIGHT;
}

function snapMinutes(pixels) {
  const slot = Math.floor(pixels / SLOT_HEIGHT);
  const minutes = viewStart() + slot * SLOT;
  return Math.min(Math.max(minutes, viewStart()), DAY_END - SLOT);
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

function weekDays() {
  return scheduleMode === 'real' ? [1, 2, 3, 4, 5, 6, 0] : [1, 2, 3, 4, 5];
}

function dateForTag(tag) {
  return addDays(weekStart, tag === 0 ? 6 : tag - 1);
}

function weekLessons() {
  const lessons = [];
  const sunday = addDays(weekStart, 6);

  activeStudents().forEach((student) => {
    student.termine.forEach((termin) => {
      const date = dateForTag(termin.tag);
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
        sonder: null,
        movedTo: null,
      };
      if (scheduleMode === 'real') {
        const moved = movedTo(student.id, lesson.datum, lesson.zeit);
        if (isPausedOn(student, date)) {
          lesson.kind = 'paused';
          lesson.note = 'pausiert';
        } else if (moved) {
          lesson.kind = 'moved';
          lesson.movedTo = moved;
          lesson.note = `verschoben → ${DAYS[parseDay(moved.datum).getDay()]}`;
        } else {
          lesson.record = findRecord(student.id, lesson.datum, lesson.zeit);
          if (lesson.record && lesson.record.status === 'ausgefallen') {
            lesson.kind = 'cancelled';
            lesson.note = lesson.record.abgesagtVon === 'nichtErschienen' ? 'nicht erschienen' : 'ausgefallen';
          }
        }
      }
      lessons.push(lesson);
    });
  });

  if (scheduleMode === 'real') {
    sonderTermine()
      .filter((s) => s.datum >= dayKey(weekStart) && s.datum <= dayKey(sunday))
      .forEach((sonder) => {
        const student = activeStudent(sonder.studentId);
        if (!student) return;
        const date = parseDay(sonder.datum);
        const record = findRecord(student.id, sonder.datum, sonder.zeit);
        const cancelled = record && record.status === 'ausgefallen';
        lessons.push({
          student,
          tag: date.getDay(),
          date,
          datum: sonder.datum,
          zeit: sonder.zeit,
          start: toMinutes(sonder.zeit),
          dauer: sonder.dauer,
          kind: cancelled ? 'cancelled' : 'extra',
          note: cancelled ? 'ausgefallen' : sonderNote(sonder),
          record,
          sonder,
          movedTo: null,
        });
      });
  }

  if (scheduleMode === 'real') {
    lessons
      .filter((l) => l.kind === 'normal' || l.kind === 'extra')
      .forEach((l) => {
        const exam = examAfterLesson(l);
        if (exam) l.note = examLabel(exam);
      });
  }

  return lessons;
}

function examAfterLesson(lesson) {
  const exam = schulaufgaben()
    .filter((e) => e.studentId === lesson.student.id && e.datum > lesson.datum && dayDiff(lesson.date, examDate(e)) <= 14)
    .sort((a, b) => a.datum.localeCompare(b.datum))[0];
  if (!exam) return null;
  for (let day = addDays(lesson.date, 1); dayKey(day) < exam.datum; day = addDays(day, 1)) {
    if (occurrencesOn(day).some((o) => o.student.id === lesson.student.id)) return null;
  }
  return exam;
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

  const sunday = addDays(weekStart, 6);
  const fromText = weekStart.getMonth() === sunday.getMonth() ? `${weekStart.getDate()}.` : `${weekStart.getDate()}. ${monthName(weekStart)}`;
  weekTitle.replaceChildren(`${fromText} `, el('em', null, 'bis'), ` ${sunday.getDate()}. ${monthName(sunday)}`);
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
  const top = Math.max(lesson.start, viewStart());
  const bottom = Math.min(lesson.start + lesson.dauer, DAY_END);
  const box = el('div', `wg-lesson ${lesson.kind}`);
  box.style.setProperty('--c', lesson.student.farbe);
  box.style.top = `${gridY(top)}px`;
  box.style.height = `${gridY(bottom) - gridY(top)}px`;
  box.title = `${fullName(lesson.student)}, ${formatTime(lesson.start)} Uhr, ${lesson.dauer} Minuten${lesson.note ? `, ${lesson.note}` : ''}`;

  const name = el('div', 'wg-lesson-name', lesson.student.vorname);
  if (lesson.record && lesson.record.status === 'stattgefunden') name.append(el('span', 'wg-check', '✓'));
  box.append(name, el('div', 'wg-lesson-time', `${formatTime(lesson.start)} · ${lesson.dauer} Min`));
  if (lesson.note) box.append(el('div', 'hand wg-lesson-note', lesson.note));

  if (scheduleMode === 'real' && lesson.kind !== 'paused') {
    box.classList.add('clickable');
    if (isSelectedLesson(lesson)) box.classList.add('selected');
    box.addEventListener('click', () => {
      selectedLesson = isSelectedLesson(lesson) ? null : { studentId: lesson.student.id, datum: lesson.datum, zeit: lesson.zeit };
      moving = false;
      renderSchedule();
    });
  }
  return box;
}

function renderWeekGrid(lessons) {
  const start = viewStart();
  const height = `${gridY(DAY_END)}px`;
  const todayKey = dayKey(new Date());

  const times = el('div', 'wg-times');
  const timesBody = el('div', 'wg-body');
  timesBody.style.height = height;
  for (let m = start; m <= DAY_END; m += 60) {
    const label = el('div', 'wg-time-label', formatTime(m));
    label.style.top = `${gridY(m)}px`;
    timesBody.append(label);
  }
  times.append(el('div', 'wg-head'), timesBody);

  const columns = weekDays().map((tag) => {
    const date = dateForTag(tag);
    const isWeekend = tag === 0 || tag === 6;
    const column = el('div', isWeekend ? 'wg-day weekend' : 'wg-day');

    const head = el('div', 'wg-head');
    head.append(el('div', 'wg-day-name', DAYS[tag]));
    if (scheduleMode === 'real') {
      head.append(el('div', 'wg-day-date', `${date.getDate()}. ${shortMonth(date)}`));
      if (dayKey(date) === todayKey) head.classList.add('today');
    }

    const body = el('div', 'wg-body');
    body.style.height = height;
    for (let m = start; m <= DAY_END; m += 60) {
      const line = el('div', 'wg-hour');
      line.style.top = `${gridY(m)}px`;
      body.append(line);
    }

    blockedTimes()
      .filter((b) => b.tag === tag)
      .forEach((block) => {
        const from = Math.max(toMinutes(block.von), start);
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
      .filter((l) => l.tag === tag && l.start < DAY_END && l.start + l.dauer > start)
      .forEach((lesson) => body.append(lessonBlock(lesson)));

    if (!isWeekend) {
      body.addEventListener('pointerdown', (event) => startDrag(event, body, tag));
      body.addEventListener('pointermove', moveDrag);
      body.addEventListener('pointerup', endDrag);
    }

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
    if (await action()) {
      moving = false;
      renderSchedule();
    }
  });
  return btn;
}

function renderLessonDetail(lessons) {
  const lesson = scheduleMode === 'real' ? lessons.find(isSelectedLesson) : null;
  lessonDetail.hidden = !lesson;
  if (!lesson) {
    moving = false;
    return;
  }

  const { student, date, record } = lesson;
  const isPrivat = student.art === 'privat';
  lessonDetailKicker.textContent = fullName(student);
  lessonDetailTitle.replaceChildren(`${weekdayName(date)}, `, el('em', null, `${date.getDate()}. ${monthName(date)}`));

  const buttons = [];
  let status;

  if (lesson.kind === 'moved') {
    const target = parseDay(lesson.movedTo.datum);
    status = `verschoben auf ${longDate(target)}, ${formatTime(toMinutes(lesson.movedTo.zeit))} Uhr`;
    buttons.push(lessonActionButton('Verschiebung aufheben', '', () => deleteSonder(lesson.movedTo)));
  } else {
    if (!record) status = isPrivat ? 'noch nicht bestätigt' : 'findet statt';
    else if (record.status === 'ausgefallen') status = cancelText(record);
    else status = `stattgefunden, ${record.dauer} Minuten${record.thema ? `, Thema: ${record.thema}` : ''}`;
    if (lesson.sonder) status = `${sonderNote(lesson.sonder)} · ${status}`;

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
      const last = isLastInMonth(student, date);
      buttons.push(lessonActionButton('Ausgefallen: Schüler', '', () => saveLesson(lesson, { status: 'ausgefallen', dauer: lesson.dauer, abgesagtVon: 'schueler', letzteImMonat: last })));
      buttons.push(lessonActionButton('Ausgefallen: ich', '', () => saveLesson(lesson, { status: 'ausgefallen', dauer: lesson.dauer, abgesagtVon: 'ich', letzteImMonat: last })));
      if (isPrivat) {
        buttons.push(lessonActionButton('Nicht erschienen', '', () => saveLesson(lesson, { status: 'ausgefallen', dauer: lesson.dauer, abgesagtVon: 'nichtErschienen', letzteImMonat: last })));
      }
      if (!lesson.sonder) {
        const moveBtn = el('button', 'btn btn-small', 'Verschieben');
        moveBtn.addEventListener('click', () => {
          moving = !moving;
          moveDate.value = lesson.datum;
          moveTime.value = lesson.zeit;
          moveRow.hidden = !moving;
        });
        buttons.push(moveBtn);
      }
    }
    if (lesson.sonder) {
      buttons.push(lessonActionButton('Löschen', 'btn-archive', () => deleteSonder(lesson.sonder)));
    }
  }

  lessonDetailMeta.textContent = `${formatTime(lesson.start)} Uhr · ${lesson.dauer} Minuten · ${status}`;
  lessonDetailButtons.replaceChildren(...buttons);
  moveRow.hidden = !moving;

  moveSave.onclick = async () => {
    if (!moveDate.value || !moveTime.value) return;
    if (moveDate.value === lesson.datum && moveTime.value === lesson.zeit) return;
    const saved = await addSonder({
      studentId: student.id,
      datum: moveDate.value,
      zeit: moveTime.value,
      dauer: lesson.dauer,
      nachholung: false,
      ersetzt: { datum: lesson.datum, zeit: lesson.zeit },
    });
    if (saved) {
      moving = false;
      selectedLesson = null;
      renderSchedule();
    }
  };
}

function freeTimes(lessons) {
  const result = [];
  [1, 2, 3, 4, 5].forEach((tag) => {
    const busy = [
      ...blockedTimes().filter((b) => b.tag === tag).map((b) => [toMinutes(b.von), toMinutes(b.bis)]),
      ...lessons.filter((l) => l.tag === tag && (l.kind === 'normal' || l.kind === 'extra')).map((l) => [l.start, l.start + l.dauer]),
    ].sort((a, b) => a[0] - b[0]);

    let cursor = FREE_START;
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
          .map((l) => `${l.student.vorname} ${l.kind === 'moved' ? 'verschoben' : l.note}`);
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

function updateExtraStudent() {
  const student = activeStudent(extraStudent.value);
  if (!student) return;
  const isPlattform = student.art === 'plattform';
  extraForm.elements.dauer.value = String(student.dauer);
  extraNachholRow.hidden = !isPlattform;
  if (!isPlattform) extraForm.elements.nachholung.checked = false;
}

function renderExtraForm() {
  extraToggle.classList.toggle('active', extraOpen);
  extraForm.hidden = !extraOpen;
  if (!extraOpen) return;
  if (extraStudent.options.length === 0 || extraStudent.dataset.filled !== 'yes') {
    fillSelect(extraStudent, activeStudents().map((s) => ({ value: s.id, text: fullName(s) })), false);
    extraStudent.dataset.filled = 'yes';
    const today = startOfDay(new Date());
    const base = scheduleMode === 'real' && (today < weekStart || today > addDays(weekStart, 6)) ? weekStart : today;
    extraForm.elements.datum.value = dayKey(base);
    updateExtraStudent();
  }
}

function renderSchedule() {
  eyebrow.textContent = `${formatTime(viewStart())} bis ${formatTime(DAY_END)} Uhr`;
  modeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === scheduleMode));
  blockToggle.classList.toggle('active', editingBlocks);
  blockToggle.textContent = editingBlocks ? 'Fertig' : 'Zeiten blockieren';
  blockHint.hidden = !editingBlocks;
  renderExtraForm();

  const lessons = weekLessons();
  renderWeekNav();
  renderWeekGrid(lessons);
  renderScheduleLegend();
  renderLessonDetail(lessons);
  renderFreeTimes(lessons);
}

function invoiceRow(inv) {
  const row = el('div', 'invoice-row');
  row.tabIndex = 0;
  if (selectedInvoice === inv.key) row.classList.add('selected');

  const nameCell = el('div');
  const name = el('div', 'student-name');
  const dot = el('span', 'tl-dot');
  dot.style.background = inv.student.farbe;
  name.append(dot, fullName(inv.student));
  nameCell.append(name, el('div', 'student-meta', monthLabel(inv.monat)));
  if (!inv.ready) nameCell.append(el('div', 'hand', 'Monat läuft noch'));

  const count = inv.records.length;
  const countCell = el('div', 'student-meta', `${count} ${count === 1 ? 'Stunde' : 'Stunden'}`);
  const sumCell = el('div', 'student-time', formatEuro(inv.cents / 100));
  const labels = { offen: 'offen', verschickt: 'verschickt', bezahlt: 'bezahlt' };
  const statusCell = el('div');
  statusCell.append(el('span', `inv-status ${inv.status}`, labels[inv.status]));

  row.append(nameCell, countCell, sumCell, statusCell);

  const toggle = () => {
    selectedInvoice = selectedInvoice === inv.key ? null : inv.key;
    renderInvoices();
  };
  row.addEventListener('click', toggle);
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') toggle();
  });
  return row;
}

function renderInvoices() {
  const list = allInvoices();
  const year = new Date().getFullYear();
  const sum = (items) => formatEuro(items.reduce((total, inv) => total + inv.cents, 0) / 100);

  statOffen.textContent = sum(list.filter((inv) => inv.status === 'offen'));
  statVerschickt.textContent = sum(list.filter((inv) => inv.status === 'verschickt'));
  statBezahlt.textContent = sum(list.filter((inv) => inv.status === 'bezahlt' && inv.saved.bezahltAm && new Date(inv.saved.bezahltAm).getFullYear() === year));
  statYear.textContent = String(year);

  filterButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === invoiceFilter));

  const shown = list.filter((inv) => invoiceFilter === 'alle' || inv.status === invoiceFilter);
  const nodes = [];
  shown.forEach((inv) => {
    nodes.push(invoiceRow(inv));
    if (selectedInvoice === inv.key) {
      const holder = el('div', 'invoice-open');
      holder.append(invoiceEditor(inv, [['offen', 'Offen'], ['verschickt', 'Verschickt'], ['bezahlt', 'Bezahlt']], renderInvoices));
      nodes.push(holder);
    }
  });

  invoiceList.replaceChildren(...nodes);
  invoiceList.hidden = shown.length === 0;
  invoicesEmpty.hidden = shown.length > 0;
  invoicesEmpty.textContent = list.length === 0 ? 'Noch keine Rechnungen. Sobald du Privatstunden bestätigst, erscheinen sie hier.' : 'Keine Rechnungen mit diesem Status.';
}

function renderRegularity(student) {
  const reg = regularity(student, regRange);
  regButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.reg === regRange));

  if (reg.ohne === null && reg.mit === null) {
    regValue.replaceChildren(el('span', 'reg-none', 'Noch keine Stunden'), el('small', null, 'Sobald Stunden vorbei sind, siehst du hier, wie regelmäßig sie stattfinden.'));
  } else {
    const main = reg.ohne === null ? 'keine Angabe' : `${reg.ohne} %`;
    const second = reg.mit === null ? '' : ` · mit Ferien ${reg.mit} %`;
    regValue.replaceChildren(main, el('small', null, `regelmäßig ohne Ferien${second}`));
  }

  const labels = { da: 'stattgefunden', weg: 'vom Schüler abgesagt', ferien: 'Ferien pausiert', offen: 'noch nicht bestätigt' };
  regDots.replaceChildren(...reg.log.map((entry) => {
    const dot = el('span', `reg-dot ${entry.kind}`);
    dot.dataset.tip = `${shortDate(entry.date)}, ${entry.zeit} Uhr: ${labels[entry.kind]}`;
    return dot;
  }));

  const start = regStart(student, regRange);
  regNote.textContent = `Gezählt ab ${longDate(start)} ${start.getFullYear()}. Absagen von dir zählen nicht gegen den Schüler.`;
}

function examRow(exam, showName) {
  const student = data.students.find((s) => s.id === exam.studentId);
  const date = examDate(exam);
  const row = el('div', 'exam-row');
  row.tabIndex = 0;

  const dateCell = el('div', 'exam-date');
  dateCell.append(el('strong', null, String(date.getDate())), el('small', null, `${shortMonth(date)} ${date.getFullYear()}`));

  const info = el('div');
  const head = el('div', 'student-name');
  if (showName && student) {
    const dot = el('span', 'tl-dot');
    dot.style.background = student.farbe;
    head.append(dot, `${student.vorname} · `);
  }
  head.append(exam.art);
  const metaParts = [weekdayName(date), exam.themen].filter(Boolean);
  if (exam.dateien && exam.dateien.length > 0) metaParts.push(`📎 ${exam.dateien.length}`);
  info.append(head, el('div', 'student-meta', metaParts.join(' · ')));

  const right = el('div', 'exam-right');
  if (exam.note) {
    right.append(el('span', 'exam-grade', exam.note));
  } else if (exam.datum >= dayKey(new Date())) {
    right.append(el('span', 'hand exam-countdown', countdownText(daysUntil(exam))));
  } else {
    right.append(el('span', 'student-meta', 'Note fehlt'));
  }

  row.append(dateCell, info, right);
  const open = () => openExamForm(exam);
  row.addEventListener('click', open);
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') open();
  });
  return row;
}

function renderExamFiles() {
  examFilesBox.replaceChildren(...examFiles.map((f) => {
    const row = el('div', 'exam-file');
    const name = el('button', 'exam-file-name', `📎 ${f.name}`);
    name.type = 'button';
    name.addEventListener('click', async () => {
      const error = await window.api.openFile(f.file);
      if (error) showAlert(`Die Datei konnte nicht geöffnet werden: ${error}`);
    });
    const remove = el('button', 'btn-icon', '×');
    remove.type = 'button';
    remove.setAttribute('aria-label', `${f.name} entfernen`);
    remove.addEventListener('click', () => {
      examFiles = examFiles.filter((x) => x.file !== f.file);
      if (examAdded.includes(f.file)) {
        examAdded = examAdded.filter((x) => x !== f.file);
        window.api.deleteFile(f.file);
      } else {
        examRemoved.push(f.file);
      }
      renderExamFiles();
    });
    row.append(name, remove);
    return row;
  }));
}

function updateExamHint() {
  examGradeHint.textContent = gradeHint(activeStudent(examStudent.value) || data.students.find((s) => s.id === examStudent.value));
}

function openExamForm(exam = null, studentId = null) {
  if (currentPage !== 'exams') openExams();
  examFormOpen = true;
  editingExamId = exam ? exam.id : null;
  examFiles = exam && exam.dateien ? [...exam.dateien] : [];
  examAdded = [];
  examRemoved = [];

  const options = activeStudents().map((s) => ({ value: s.id, text: fullName(s) }));
  if (exam && !activeStudent(exam.studentId)) {
    const old = data.students.find((s) => s.id === exam.studentId);
    if (old) options.push({ value: old.id, text: `${fullName(old)} (Archiv)` });
  }
  fillSelect(examStudent, options, false);

  const f = examForm.elements;
  examForm.reset();
  f.studentId.value = exam ? exam.studentId : (studentId || (options[0] && options[0].value) || '');
  f.datum.value = exam ? exam.datum : '';
  f.art.value = exam ? exam.art : 'Schulaufgabe';
  f.note.value = exam ? exam.note || '' : '';
  f.themen.value = exam ? exam.themen || '' : '';
  f.notiz.value = exam ? exam.notiz || '' : '';

  examFormTitle.textContent = exam ? 'Schulaufgabe bearbeiten' : 'Schulaufgabe eintragen';
  examDelete.hidden = !exam;
  updateExamHint();
  renderExamFiles();
  renderExams();
  examForm.scrollIntoView({ block: 'nearest' });
}

function closeExamForm() {
  examFormOpen = false;
  editingExamId = null;
  examFiles = [];
  examAdded = [];
  examRemoved = [];
  renderExams();
}

function renderExams() {
  examForm.hidden = !examFormOpen;
  examNew.classList.toggle('active', examFormOpen && !editingExamId);

  const upcoming = upcomingExams();
  const past = pastExams();
  examCount.textContent = upcoming.length === 0
    ? 'Keine kommenden Schulaufgaben.'
    : `${upcoming.length} ${upcoming.length === 1 ? 'kommende Schulaufgabe' : 'kommende Schulaufgaben'}`;

  const next = upcoming[0];
  examNext.hidden = !next;
  if (next) {
    const student = activeStudent(next.studentId);
    const date = examDate(next);
    const days = daysUntil(next);
    const big = el('div', 'exam-next-days', days <= 1 ? countdownText(days) : String(days));
    if (days > 1) big.append(el('small', null, 'Tage'));
    const text = el('div', 'exam-next-text');
    const heading = el('div', 'detail-title', `${student.vorname} `);
    heading.append(el('em', null, next.art));
    text.append(
      el('div', 'eyebrow', 'Nächste Schulaufgabe'),
      heading,
      el('div', 'student-meta', `${longDate(date)}${next.themen ? ` · ${next.themen}` : ''}`),
    );
    if (next.notiz) text.append(el('div', 'hand exam-next-note', next.notiz));
    if (next.dateien && next.dateien.length > 0) {
      const files = el('div', 'exam-files');
      next.dateien.forEach((f) => {
        const btn = el('button', 'exam-file-name', `📎 ${f.name}`);
        btn.addEventListener('click', async () => {
          const error = await window.api.openFile(f.file);
          if (error) showAlert(`Die Datei konnte nicht geöffnet werden: ${error}`);
        });
        files.append(btn);
      });
      text.append(files);
    }
    examNext.replaceChildren(big, text);
  }

  examUpcoming.replaceChildren(...(upcoming.length === 0
    ? [el('div', 'history-empty', 'Gerade steht keine Schulaufgabe an.')]
    : upcoming.map((e) => examRow(e, true))));
  examPast.replaceChildren(...(past.length === 0
    ? [el('div', 'history-empty', 'Noch keine vergangenen Schulaufgaben.')]
    : past.map((e) => examRow(e, true))));
}

function renderStudentExams(student) {
  const list = schulaufgaben()
    .filter((e) => e.studentId === student.id)
    .sort((a, b) => b.datum.localeCompare(a.datum));
  studentExams.replaceChildren(...(list.length === 0
    ? [el('div', 'history-empty', 'Noch keine Schulaufgaben eingetragen.')]
    : list.map((e) => examRow(e, false))));
}

const CLASS_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function aufgaben() {
  return data.aufgaben || [];
}

function normalize(text) {
  return text.toLocaleLowerCase('de-DE').trim();
}

function allTags() {
  const tags = new Map();
  aufgaben().forEach((a) => a.tags.forEach((t) => {
    const key = normalize(t);
    if (!tags.has(key)) tags.set(key, { name: t, count: 0 });
    tags.get(key).count += 1;
  }));
  return [...tags.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

function classText(klassen) {
  if (klassen.length === 0) return '';
  const sorted = [...klassen].sort((a, b) => a - b);
  const isRange = sorted.length > 2 && sorted.every((k, i) => i === 0 || k === sorted[i - 1] + 1);
  if (isRange) return `Klasse ${sorted[0]} bis ${sorted[sorted.length - 1]}`;
  return `Klasse ${sorted.join(', ')}`;
}

function filteredTasks() {
  const words = normalize(taskSearch.value).split(/\s+/).filter(Boolean);
  return aufgaben()
    .filter((a) => taskClassFilter === null || a.klassen.length === 0 || a.klassen.includes(taskClassFilter))
    .filter((a) => taskTagFilter.every((tag) => a.tags.some((t) => normalize(t) === tag)))
    .filter((a) => {
      const haystack = normalize([a.titel, ...a.tags, a.notiz || '', a.url || '', a.datei ? a.datei.name : ''].join(' '));
      return words.every((w) => haystack.includes(w));
    })
    .sort((a, b) => a.titel.localeCompare(b.titel, 'de'));
}

function pill(text, active, onClick) {
  const btn = el('button', 'class-pill', text);
  btn.type = 'button';
  if (active) btn.classList.add('active');
  btn.addEventListener('click', onClick);
  return btn;
}

function renderTaskFilters() {
  const used = [...new Set(aufgaben().flatMap((a) => a.klassen))].sort((a, b) => a - b);
  classFilter.replaceChildren(
    pill('Alle', taskClassFilter === null, () => {
      taskClassFilter = null;
      renderTasks();
    }),
    ...used.map((k) => pill(String(k), taskClassFilter === k, () => {
      taskClassFilter = taskClassFilter === k ? null : k;
      renderTasks();
    })),
  );

  const tags = allTags();
  tagFilter.replaceChildren(...(tags.length === 0
    ? [el('span', 'student-meta', 'Noch keine Themen.')]
    : tags.map((tag) => {
      const key = normalize(tag.name);
      const btn = pill(`${tag.name} ${tag.count}`, taskTagFilter.includes(key), () => {
        taskTagFilter = taskTagFilter.includes(key) ? taskTagFilter.filter((t) => t !== key) : [...taskTagFilter, key];
        renderTasks();
      });
      btn.classList.add('tag-pill');
      return btn;
    })));
}

function hostName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (error) {
    return url;
  }
}

function cleanUrl(text) {
  if (!text) return null;
  const withProtocol = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    return new URL(withProtocol).href;
  } catch (error) {
    return undefined;
  }
}

function taskRow(task) {
  const row = el('div', 'task-row');

  const info = el('div', 'task-info');
  info.append(el('div', 'student-name', task.titel));
  const meta = [classText(task.klassen), task.url ? hostName(task.url) : '', task.datei ? `📎 ${task.datei.name}` : '']
    .filter(Boolean)
    .join(' · ');
  if (meta) info.append(el('div', 'student-meta', meta));
  if (task.tags.length > 0) {
    const tags = el('div', 'task-tags');
    task.tags.forEach((t) => {
      const chip = el('button', 'task-tag', t);
      chip.type = 'button';
      chip.addEventListener('click', () => {
        const key = normalize(t);
        if (!taskTagFilter.includes(key)) taskTagFilter = [...taskTagFilter, key];
        renderTasks();
      });
      tags.append(chip);
    });
    info.append(tags);
  }
  if (task.notiz) info.append(el('div', 'hand task-note', task.notiz));

  const actions = el('div', 'todo-actions task-actions');
  const open = el('button', 'btn btn-small btn-primary', 'Öffnen');
  open.addEventListener('click', async () => {
    try {
      if (task.url) await window.api.openLink(task.url);
      else if (task.datei) {
        const error = await window.api.openFile(task.datei.file);
        if (error) showAlert(`Die Datei konnte nicht geöffnet werden: ${error}`);
      }
    } catch (error) {
      showAlert(`Konnte nicht geöffnet werden: ${error.message}`);
    }
  });
  actions.append(open);

  if (task.url) {
    const copy = el('button', 'btn btn-small', 'Link kopieren');
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(task.url);
        copy.textContent = 'Kopiert!';
      } catch (error) {
        copy.textContent = 'Hat nicht geklappt';
      }
      setTimeout(() => {
        copy.textContent = 'Link kopieren';
      }, 2000);
    });
    actions.append(copy);
  }

  const edit = el('button', 'btn btn-small', 'Bearbeiten');
  edit.addEventListener('click', () => openTaskForm(task));
  actions.append(edit);

  row.append(info, actions);
  return row;
}

function renderTasks() {
  taskForm.hidden = !taskFormOpen;
  taskNew.classList.toggle('active', taskFormOpen && !editingTaskId);
  renderTaskFilters();

  const list = filteredTasks();
  const total = aufgaben().length;
  if (total === 0) taskCount.textContent = 'Noch keine Aufgaben gespeichert.';
  else if (list.length === total) taskCount.textContent = `${total} ${total === 1 ? 'Aufgabe' : 'Aufgaben'}`;
  else taskCount.textContent = `${list.length} von ${total} Aufgaben`;

  taskList.replaceChildren(...(list.length === 0 && total > 0
    ? [el('div', 'history-empty', 'Nichts gefunden. Probier ein anderes Wort oder nimm einen Filter weg.')]
    : list.map(taskRow)));
}

function renderTagChips() {
  tagChips.replaceChildren(...taskTags.map((t) => {
    const chip = el('span', 'task-tag');
    const remove = el('button', 'tag-remove', '×');
    remove.type = 'button';
    remove.setAttribute('aria-label', `${t} entfernen`);
    remove.addEventListener('click', () => {
      taskTags = taskTags.filter((x) => x !== t);
      renderTagChips();
    });
    chip.append(t, remove);
    return chip;
  }));
  tagSuggestions.replaceChildren(...allTags()
    .filter((t) => !taskTags.some((x) => normalize(x) === normalize(t.name)))
    .map((t) => new Option(t.name)));
}

function addTagFromEntry() {
  const parts = tagEntry.value.split(',').map((p) => p.trim()).filter(Boolean);
  parts.forEach((part) => {
    const existing = allTags().find((t) => normalize(t.name) === normalize(part));
    const name = existing ? existing.name : part;
    if (!taskTags.some((x) => normalize(x) === normalize(name))) taskTags.push(name);
  });
  tagEntry.value = '';
  renderTagChips();
}

function renderTaskClasses() {
  taskClassesBox.replaceChildren(...CLASS_LEVELS.map((k) => pill(String(k), taskClasses.includes(k), () => {
    taskClasses = taskClasses.includes(k) ? taskClasses.filter((x) => x !== k) : [...taskClasses, k];
    renderTaskClasses();
  })));
}

function renderTaskFile() {
  taskAttach.hidden = Boolean(taskFile);
  if (!taskFile) {
    taskFileBox.replaceChildren();
    return;
  }
  const row = el('div', 'exam-file');
  const name = el('button', 'exam-file-name', `📎 ${taskFile.name}`);
  name.type = 'button';
  name.addEventListener('click', async () => {
    const error = await window.api.openFile(taskFile.file);
    if (error) showAlert(`Die Datei konnte nicht geöffnet werden: ${error}`);
  });
  const remove = el('button', 'btn-icon', '×');
  remove.type = 'button';
  remove.setAttribute('aria-label', 'Datei entfernen');
  remove.addEventListener('click', () => {
    if (taskFileAdded === taskFile.file) {
      window.api.deleteFile(taskFile.file);
      taskFileAdded = null;
    } else {
      taskFileRemoved = taskFile.file;
    }
    taskFile = null;
    renderTaskFile();
  });
  row.append(name, remove);
  taskFileBox.replaceChildren(row);
}

function openTaskForm(task = null) {
  taskFormOpen = true;
  editingTaskId = task ? task.id : null;
  taskTags = task ? [...task.tags] : [];
  taskClasses = task ? [...task.klassen] : [];
  taskFile = task && task.datei ? { ...task.datei } : null;
  taskFileAdded = null;
  taskFileRemoved = null;

  taskForm.reset();
  const f = taskForm.elements;
  f.titel.value = task ? task.titel : '';
  f.url.value = task ? task.url || '' : '';
  f.notiz.value = task ? task.notiz || '' : '';
  tagEntry.value = '';

  taskFormTitle.textContent = task ? 'Aufgabe bearbeiten' : 'Aufgabe hinzufügen';
  taskDelete.hidden = !task;
  renderTagChips();
  renderTaskClasses();
  renderTaskFile();
  renderTasks();
  taskForm.scrollIntoView({ block: 'nearest' });
  f.titel.focus();
}

function closeTaskForm() {
  taskFormOpen = false;
  editingTaskId = null;
  renderTasks();
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
    const row = el('div', 'history-row');
    let statusText = `${record.dauer} Min`;
    if (record.abgesagtVon === 'nichtErschienen') statusText = 'nicht erschienen';
    else if (record.status === 'ausgefallen') statusText = `ausgefallen (${record.abgesagtVon === 'ich' ? 'ich' : 'Schüler'})`;
    row.append(
      el('span', 'history-date', shortDate(parseDay(record.datum))),
      el('span', `history-status ${record.status}`, statusText),
      el('span', null, record.thema || ''),
      el('span', 'history-price', record.preis ? formatEuro(record.preis) : ''),
    );
    return row;
  }));
}

function renderNachhol(student) {
  const stand = nachholStand(student);
  nachholCount.replaceChildren(String(stand), el('small', null, stand === 1 ? 'Stunde nachzuholen' : 'Stunden nachzuholen'));

  const rows = nachholEvents(student).map((event) => {
    const row = el('div', 'nachhol-row');
    const sign = event.delta > 0 ? '+' : '−';
    row.append(
      el('span', `nachhol-delta ${event.delta > 0 ? 'plus' : 'minus'}`, `${sign}${Math.abs(event.delta)}`),
      el('span', 'history-date', shortDate(parseDay(event.datum))),
      el('span', null, event.text),
    );
    return row;
  });

  const startRow = el('div', 'nachhol-row');
  startRow.append(
    el('span', 'nachhol-delta', String(student.nachholStart || 0)),
    el('span', 'history-date', 'Start'),
    el('span', null, 'beim Anlegen eingetragen'),
  );

  nachholHistory.replaceChildren(...rows, startRow);
}

async function addNachholKorrektur(delta) {
  const student = data.students.find((s) => s.id === editingId);
  if (!student) return;
  const saved = await persist(() => {
    data.nachholKorrekturen = [...nachholKorrekturen(), {
      id: crypto.randomUUID(),
      studentId: student.id,
      datum: dayKey(new Date()),
      delta,
    }];
  });
  if (saved) renderNachhol(data.students.find((s) => s.id === editingId));
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
  const regValueShort = regularity(student, '3m').ohne;
  const regText = regValueShort === null ? '' : ` · ${regValueShort} % regelmäßig`;
  timeCell.append(el('div', 'student-time', times || 'kein Termin'), el('div', 'student-meta', `${student.dauer} Minuten${regText}`));

  const lastCell = el('div');
  if (student.art === 'plattform') {
    lastCell.append(el('div', 'student-time', String(nachholStand(student))), el('div', 'student-meta', 'nachzuholen'));
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
    else if (page === 'invoices') openInvoices();
    else if (page === 'exams') openExams();
    else if (page === 'tasks') openTasks();
    else if (page === 'archive') openArchive();
    else if (page === 'settings') openSettings();
    else openPlaceholder(item.lastChild.textContent.trim());
  });
});

newStudentBtn.addEventListener('click', () => openForm());
document.getElementById('add-termin').addEventListener('click', () => addTermin());
nachholMinus.addEventListener('click', () => addNachholKorrektur(-1));
nachholPlus.addEventListener('click', () => addNachholKorrektur(1));

document.getElementById('cancel-form').addEventListener('click', () => {
  setActiveNav(studentsNav);
  openStudents();
});

archiveBtn.addEventListener('click', async () => {
  const student = data.students.find((s) => s.id === editingId);
  if (!student) return;
  if (!(await askConfirm(`${fullName(student)} ins Archiv verschieben? Du kannst den Schüler dort jederzeit wiederherstellen.`, 'Archivieren'))) return;

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

backupNowBtn.addEventListener('click', async () => {
  try {
    await renderBackupInfo(await window.api.backupNow());
    backupNowBtn.textContent = 'Gesichert!';
  } catch (error) {
    showAlert(`Die Sicherung hat nicht geklappt: ${error.message}`);
  }
  setTimeout(() => {
    backupNowBtn.textContent = 'Jetzt sichern';
  }, 2000);
});

document.getElementById('backup-open').addEventListener('click', async () => {
  const error = await window.api.openBackupFolder();
  if (error) showAlert(`Der Ordner konnte nicht geöffnet werden: ${error}`);
});

document.getElementById('backup-choose').addEventListener('click', async () => {
  const folder = await window.api.chooseBackupFolder();
  if (!folder) return;
  const saved = await persist(() => {
    data.settings.backupOrdner = folder;
  });
  if (saved) renderBackupInfo(await window.api.backupNow());
});

autostartToggle.addEventListener('change', async () => {
  try {
    autostartToggle.checked = await window.api.setAutostart(autostartToggle.checked);
  } catch (error) {
    autostartToggle.checked = !autostartToggle.checked;
    showAlert(`Der Autostart konnte nicht geändert werden: ${error.message}`);
  }
});

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    scheduleMode = btn.dataset.mode;
    selectedLesson = null;
    moving = false;
    renderSchedule();
  });
});

blockToggle.addEventListener('click', () => {
  editingBlocks = !editingBlocks;
  selectedLesson = null;
  moving = false;
  renderSchedule();
});

extraToggle.addEventListener('click', () => {
  extraOpen = !extraOpen;
  extraStudent.dataset.filled = 'no';
  renderSchedule();
});

extraStudent.addEventListener('change', updateExtraStudent);

document.getElementById('extra-cancel').addEventListener('click', () => {
  extraOpen = false;
  renderSchedule();
});

extraForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const f = extraForm.elements;
  const student = activeStudent(f.studentId.value);
  if (!student || !f.datum.value || !f.zeit.value) return;

  const saved = await addSonder({
    studentId: student.id,
    datum: f.datum.value,
    zeit: f.zeit.value,
    dauer: Number(f.dauer.value),
    nachholung: student.art === 'plattform' && f.nachholung.checked,
    ersetzt: null,
  });

  if (saved) {
    extraOpen = false;
    scheduleMode = 'real';
    weekStart = mondayOf(parseDay(f.datum.value));
    selectedLesson = null;
    renderSchedule();
  }
});

weekPrev.addEventListener('click', () => {
  weekStart = addDays(weekStart, -7);
  selectedLesson = null;
  moving = false;
  renderSchedule();
});

weekNext.addEventListener('click', () => {
  weekStart = addDays(weekStart, 7);
  selectedLesson = null;
  moving = false;
  renderSchedule();
});

weekToday.addEventListener('click', () => {
  weekStart = currentWeekStart();
  selectedLesson = null;
  moving = false;
  renderSchedule();
});

taskSearch.addEventListener('input', renderTasks);

taskNew.addEventListener('click', () => {
  if (taskFormOpen && !editingTaskId) closeTaskForm();
  else openTaskForm();
});

tagEntry.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addTagFromEntry();
  } else if (event.key === 'Backspace' && tagEntry.value === '' && taskTags.length > 0) {
    taskTags.pop();
    renderTagChips();
  }
});

tagEntry.addEventListener('change', () => {
  if (allTags().some((t) => t.name === tagEntry.value)) addTagFromEntry();
});

document.getElementById('tag-input').addEventListener('click', () => tagEntry.focus());

taskAttach.addEventListener('click', async () => {
  try {
    const files = await window.api.pickFiles();
    if (files.length === 0) return;
    files.slice(1).forEach((f) => window.api.deleteFile(f.file));
    if (taskFileAdded) window.api.deleteFile(taskFileAdded);
    taskFile = files[0];
    taskFileAdded = files[0].file;
    renderTaskFile();
  } catch (error) {
    showAlert(`Die Datei konnte nicht angehängt werden: ${error.message}`);
  }
});

document.getElementById('task-cancel').addEventListener('click', () => {
  if (taskFileAdded) window.api.deleteFile(taskFileAdded);
  closeTaskForm();
});

taskDelete.addEventListener('click', async () => {
  const task = aufgaben().find((a) => a.id === editingTaskId);
  if (!task) return;
  if (!(await askConfirm(`„${task.titel}“ wirklich löschen?`, 'Löschen'))) return;
  const saved = await persist(() => {
    data.aufgaben = aufgaben().filter((a) => a.id !== task.id);
  });
  if (saved) {
    if (task.datei) window.api.deleteFile(task.datei.file);
    if (taskFileAdded) window.api.deleteFile(taskFileAdded);
    closeTaskForm();
  }
});

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (tagEntry.value.trim()) addTagFromEntry();
  const f = taskForm.elements;
  const url = cleanUrl(f.url.value.trim());
  if (url === undefined) {
    showAlert('Der Link sieht nicht richtig aus. Kopiere ihn am besten direkt aus dem Browser.');
    return;
  }
  if (!url && !taskFile) {
    showAlert('Bitte gib einen Link ein oder hänge eine Datei an.');
    return;
  }
  const values = {
    titel: f.titel.value.trim(),
    url: url || null,
    datei: taskFile,
    tags: taskTags,
    klassen: [...taskClasses].sort((a, b) => a - b),
    notiz: f.notiz.value.trim(),
  };
  const saved = await persist(() => {
    data.aufgaben = aufgaben();
    const existing = data.aufgaben.find((a) => a.id === editingTaskId);
    if (existing) Object.assign(existing, values);
    else data.aufgaben.push({ id: crypto.randomUUID(), ...values, angelegt: new Date().toISOString() });
  });
  if (saved) {
    if (taskFileRemoved) window.api.deleteFile(taskFileRemoved);
    taskFileAdded = null;
    closeTaskForm();
  }
});

examNew.addEventListener('click', () => {
  if (examFormOpen && !editingExamId) closeExamForm();
  else openExamForm();
});

examStudent.addEventListener('change', updateExamHint);

examAttach.addEventListener('click', async () => {
  try {
    const files = await window.api.pickFiles();
    examFiles = [...examFiles, ...files];
    examAdded = [...examAdded, ...files.map((f) => f.file)];
    renderExamFiles();
  } catch (error) {
    showAlert(`Die Dateien konnten nicht angehängt werden: ${error.message}`);
  }
});

document.getElementById('exam-cancel').addEventListener('click', () => {
  examAdded.forEach((file) => window.api.deleteFile(file));
  closeExamForm();
});

examDelete.addEventListener('click', async () => {
  const exam = schulaufgaben().find((e) => e.id === editingExamId);
  if (!exam) return;
  if (!(await askConfirm(`${exam.art} am ${longDate(examDate(exam))} wirklich löschen? Angehängte Dateien werden auch gelöscht.`, 'Löschen'))) return;
  const saved = await persist(() => {
    data.schulaufgaben = schulaufgaben().filter((e) => e.id !== exam.id);
  });
  if (saved) {
    [...(exam.dateien || []).map((f) => f.file), ...examAdded].forEach((file) => window.api.deleteFile(file));
    closeExamForm();
  }
});

examForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const f = examForm.elements;
  if (!f.studentId.value || !f.datum.value) return;
  const values = {
    studentId: f.studentId.value,
    datum: f.datum.value,
    art: f.art.value,
    note: f.note.value.trim(),
    themen: f.themen.value.trim(),
    notiz: f.notiz.value.trim(),
    dateien: examFiles,
  };
  const saved = await persist(() => {
    data.schulaufgaben = schulaufgaben();
    const existing = data.schulaufgaben.find((e) => e.id === editingExamId);
    if (existing) Object.assign(existing, values);
    else data.schulaufgaben.push({ id: crypto.randomUUID(), ...values, angelegt: new Date().toISOString() });
  });
  if (saved) {
    examRemoved.forEach((file) => window.api.deleteFile(file));
    examAdded = [];
    closeExamForm();
  }
});

document.getElementById('student-exam-add').addEventListener('click', () => {
  if (editingId) openExamForm(null, editingId);
});

regButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    regRange = btn.dataset.reg;
    const student = data.students.find((s) => s.id === editingId);
    if (student) renderRegularity(student);
  });
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    invoiceFilter = btn.dataset.filter;
    selectedInvoice = null;
    renderInvoices();
  });
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
  if (currentPage === 'overview' && !todoList.contains(document.activeElement)) openOverview();
  else publishSummary();
}, 60000);

async function init() {
  try {
    data = await window.api.loadData();
  } catch (error) {
    canSave = false;
    showAlert(`Deine Daten konnten nicht geladen werden: ${error.message}`);
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
