import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE, getPosts, postUrl } from '../lib/site';

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: SITE.title,
    description: SITE.description,
    site: site!,
    items: (await getPosts()).map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: postUrl(post),
    })),
    customData: '<language>de-de</language>',
  });
