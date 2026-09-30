// Button erst zeigen, wenn man ein Stück nach unten gescrollt hat
const button = document.querySelector('[data-back-to-top]');
const SHOW_AFTER = 600; // px

const update = () => button.classList.toggle('is-hidden', window.scrollY < SHOW_AFTER);

if (button) {
  update();
  window.addEventListener('scroll', update, { passive: true });
}
