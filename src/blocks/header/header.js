// Mobiles Menü und Schatten beim Scrollen
const header = document.querySelector('[data-header]');
const toggle = header.querySelector('[data-nav-toggle]');
const nav = document.getElementById('site-nav');

const setOpen = (open) => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
};

toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setOpen(false);
});

// Menü schließen, wenn der Bildschirm breit genug für die Desktop-Navigation wird
matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setOpen(false));

const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
