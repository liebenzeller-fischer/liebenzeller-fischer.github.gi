import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPosts, postUrl } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  const urls = [
    { loc: '/', lastmod: posts[0]?.data.date },
    ...pages.map((p) => ({ loc: `/${p.id}/`, lastmod: undefined })),
    ...posts.map((p) => ({ loc: postUrl(p), lastmod: p.data.date })),
  ];
  const body = urls
    .map(({ loc, lastmod }) =>
      `  <url><loc>${new URL(loc, site).href}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`,
    )
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
