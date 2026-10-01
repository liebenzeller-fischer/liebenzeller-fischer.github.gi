// Volltextsuche über /index.json (Seite /search/)
import Fuse from 'fuse.js';
import Mark from 'mark.js';

const query = new URLSearchParams(location.search).get('s')?.trim() ?? '';
const input = document.getElementById('search-input');
const status = document.querySelector('[data-search-status]');
const results = document.querySelector('[data-search-results]');

input.value = query;
if (!query) input.focus();

const escape = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// gleiches Markup wie blocks/post-card
const card = (item) => `
  <article class="post-card">
    <div class="post-card__media"><img src="/${escape(item.image)}" alt="" loading="lazy"></div>
    <div class="post-card__body">
      <div class="post-card__meta">
        <time>${escape(item.dateLong)}</time>
        ${item.tags[0] ? `<span class="post-card__tag">${escape(item.tags[0])}</span>` : ''}
      </div>
      <h3 class="post-card__title"><a href="${escape(item.permalink)}">${escape(item.title)}</a></h3>
      ${item.description ? `<p class="post-card__excerpt">${escape(item.description)}</p>` : ''}
      <span class="post-card__more" aria-hidden="true">Weiterlesen →</span>
    </div>
  </article>`;

async function run() {
  if (!query) return;
  status.textContent = 'Suche läuft …';

  const index = await fetch('/index.json').then((r) => r.json());
  const fuse = new Fuse(index, {
    threshold: 0,
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'contents', weight: 0.5 },
      { name: 'tags', weight: 0.3 },
      { name: 'categories', weight: 0.3 },
    ],
  });
  const hits = fuse.search(query);

  status.textContent = hits.length
    ? `${hits.length} ${hits.length === 1 ? 'Beitrag' : 'Beiträge'} zu „${query}“`
    : `Zu „${query}“ haben wir leider nichts gefunden – hier beißt gerade nichts an.`;
  results.innerHTML = hits.map((hit) => card(hit.item)).join('');
  new Mark(results.querySelectorAll('.post-card__title, .post-card__excerpt')).mark(query);
}

run();
