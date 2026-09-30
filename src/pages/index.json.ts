// Suchindex für plugins/search/search.js (Format wie Hugos index.json)
import type { APIRoute } from 'astro';
import { dateLong, day, getPosts, month, plain, postUrl } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const index = posts.map((post) => ({
    title: post.data.title,
    date: day(post.data.date),
    month: month(post.data.date),
    dateLong: dateLong(post.data.date),
    description: post.data.description,
    tags: post.data.tags,
    image: post.data.image,
    categories: post.data.categories,
    contents: plain(post.body),
    permalink: new URL(postUrl(post), site).href,
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
};
