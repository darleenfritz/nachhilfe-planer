const navItems = document.querySelectorAll('.nav-item');
const eyebrow = document.querySelector('.eyebrow');
const title = document.querySelector('h1');
const placeholder = document.querySelector('.placeholder');

function greeting(hour) {
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

function showOverview() {
  const now = new Date();
  const weekday = now.toLocaleDateString('de-DE', { weekday: 'long' });
  const month = now.toLocaleDateString('de-DE', { month: 'long' });
  eyebrow.textContent = `${greeting(now.getHours())}, Darleen`;
  title.innerHTML = `${weekday}, <em>${now.getDate()}.</em> ${month}`;
  placeholder.textContent = 'Hier kommt bald deine Übersicht hin.';
}

function showPage(name) {
  eyebrow.textContent = 'Nachhilfe';
  title.innerHTML = `${name}<em>.</em>`;
  placeholder.textContent = `Hier kommt bald die Seite ${name} hin.`;
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((other) => other.classList.remove('active'));
    item.classList.add('active');
    const name = item.lastChild.textContent.trim();
    if (name === 'Übersicht') {
      showOverview();
    } else {
      showPage(name);
    }
  });
});

showOverview();