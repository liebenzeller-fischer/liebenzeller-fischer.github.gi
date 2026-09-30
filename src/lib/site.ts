import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE = {
  title: 'Fischerverein Bad Liebenzell e.V.',
  description: 'Fischerverein Bad Liebenzell e.V.',
  author: 'Fischerverein Bad Liebenzell e.V.',
  logo: '/images/logo.jpg',
  // absichtlich mit (at) statt @, damit Spam-Programme die Adresse schwerer finden
  email: 'webadmin(at)liebenzeller-fischer.de',
  founded: 1994,
  perPage: 9, // 3er-Raster
};

export const MENU = [
  { name: 'Aktuelles', url: '/post/' },
  { name: 'Über uns', url: '/ueber-uns/' },
  { name: 'Gewässer', url: '/gewaesser/' },
  { name: 'Tageskarten', url: '/tageskarte/' },
  { name: 'Kontakt', url: '/kontakt/' },
];

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// entspricht Hugos urlize | lower
export const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');

// Pfade in Front Matter sind relativ ("images/..."), im Markdown absolut
export const asset = (p: string) => (p.startsWith('/') || p.startsWith('http') ? p : `/${p}`);

export const postUrl = (post: Post) => `/post/${post.id}/`;

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const LONG = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const dateLong = (d: Date) => LONG.format(d);
export const day = (d: Date) => String(d.getUTCDate()).padStart(2, '0');
export const month = (d: Date) => MONTHS[d.getUTCMonth()];

export interface PageInfo {
  current: number;
  total: number;
  url: (n: number) => string;
}

/** Teilt Beiträge in Seiten auf; Seite 1 liegt unter `base`, weitere unter `base/page/n/`. */
export function paginate(posts: Post[], base: string) {
  const total = Math.max(1, Math.ceil(posts.length / SITE.perPage));
  const url = (n: number) => (n === 1 ? base : `${base}page/${n}/`);
  return Array.from({ length: total }, (_, i) => ({
    posts: posts.slice(i * SITE.perPage, (i + 1) * SITE.perPage),
    info: { current: i + 1, total, url } satisfies PageInfo,
  }));
}

/** Alle Werte eines Taxonomie-Felds mit den zugehörigen Beiträgen. */
export function terms(posts: Post[], field: 'tags' | 'categories') {
  const map = new Map<string, { name: string; posts: Post[] }>();
  for (const post of posts) {
    for (const name of post.data[field]) {
      const slug = slugify(name);
      if (!map.has(slug)) map.set(slug, { name, posts: [] });
      map.get(slug)!.posts.push(post);
    }
  }
  return map;
}

/** Klartext für den Suchindex (entspricht Hugos .Plain). */
export const plain = (md = '') =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
