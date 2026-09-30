// Forellen, Äschen und Barben schwimmen ab und zu durch den Hintergrund.
const layer = document.querySelector('[data-fish-swim]');
const template = document.getElementById('fish-swim-template');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Verhalten je Art: Höhe im Fenster (0 = oben, 1 = unten), Größe, Dauer einer Durchquerung,
// Gruppengröße und Tempo von Schwanzschlag/Auf-und-Ab
const SPECIES = {
  forelle: { weight: 4, y: [0.1, 0.9], size: [60, 105], duration: [13000, 20000], group: [1, 2], tail: 0.6, bob: 2.8 },
  aesche: { weight: 3, y: [0.15, 0.75], size: [70, 115], duration: [16000, 24000], group: [1, 3], tail: 0.8, bob: 3.4 },
  barbe: { weight: 3, y: [0.55, 0.95], size: [80, 130], duration: [22000, 32000], group: [2, 4], tail: 1.1, bob: 4.2 },
};

const FIRST_DELAY = [500, 1500]; // erste Fische nach 0,5–1,5 s
const PAUSE = [1500, 4500]; // danach alle 1,5–4,5 s neue
const MAX_FISH = 14; // höchstens so viele gleichzeitig

const rand = ([min, max]) => min + Math.random() * (max - min);
const randInt = ([min, max]) => Math.floor(rand([min, max + 1]));
let active = 0;

function pickSpecies() {
  const entries = Object.entries(SPECIES);
  let r = Math.random() * entries.reduce((sum, [, s]) => sum + s.weight, 0);
  for (const [name, s] of entries) if ((r -= s.weight) < 0) return [name, s];
  return entries[0];
}

function swimOne(name, s, { left, y, size, duration, delay }) {
  if (active >= MAX_FISH) return;
  active++;

  const fish = template.content.querySelector(`[data-species="${name}"]`).cloneNode(true);
  fish.style.setProperty('--size', `${size}px`);
  fish.style.setProperty('--alpha', rand([0.1, 0.17]).toFixed(2));
  fish.style.setProperty('--tail', `${(s.tail * rand([0.85, 1.15])).toFixed(2)}s`);
  fish.style.setProperty('--bob', `${(s.bob * rand([0.85, 1.15])).toFixed(2)}s`);
  fish.classList.toggle('is-left', left);
  layer.append(fish);

  const from = left ? innerWidth + size : -size * 1.5;
  const to = left ? -size * 1.5 : innerWidth + size;
  const drift = rand([-60, 60]);

  const anim = fish.animate(
    [
      { transform: `translate(${from}px, ${y}px)` },
      { transform: `translate(${(from + to) / 2}px, ${y + drift / 2 + rand([-25, 25])}px)` },
      { transform: `translate(${to}px, ${y + drift}px)` },
    ],
    { duration, delay, easing: 'linear', fill: 'backwards' },
  );

  anim.onfinish = anim.oncancel = () => {
    fish.remove();
    active--;
  };
}

// eine Art auswählen und einzeln oder als kleine Gruppe losschicken
function spawn() {
  if (document.hidden || reduceMotion.matches) return;
  const [name, s] = pickSpecies();
  const left = Math.random() < 0.5;
  const baseY = rand(s.y) * innerHeight;
  const baseSize = rand(s.size);
  const baseDuration = rand(s.duration);
  const count = randInt(s.group);

  for (let i = 0; i < count; i++) {
    swimOne(name, s, {
      left,
      y: baseY + (i === 0 ? 0 : rand([-45, 45])),
      size: baseSize * (i === 0 ? 1 : rand([0.75, 0.95])),
      duration: baseDuration * rand([0.95, 1.05]),
      delay: i === 0 ? 0 : rand([400, 1800]),
    });
  }
}

function schedule(delay) {
  setTimeout(() => {
    spawn();
    schedule(rand(PAUSE));
  }, delay);
}

if (layer && template) schedule(rand(FIRST_DELAY));
