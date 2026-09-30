import { getPosts, paginate, terms, type PageInfo, type Post } from './site';

export type TaxonomyProps =
  | { kind: 'index'; items: { slug: string; name: string; count: number }[] }
  | { kind: 'term'; name: string; posts: Post[]; info: PageInfo };

/** Pfade für /<tax>/, /<tax>/<term>/ und /<tax>/<term>/page/n/ */
export async function taxonomyPaths(field: 'tags' | 'categories') {
  const map = terms(await getPosts(), field);
  const items = [...map].map(([slug, t]) => ({ slug, name: t.name, count: t.posts.length }));
  items.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  return [
    { params: { path: undefined }, props: { kind: 'index', items } as TaxonomyProps },
    ...[...map].flatMap(([slug, t]) =>
      paginate(t.posts, `/${field}/${slug}/`).map(({ posts, info }) => ({
        params: { path: info.current === 1 ? slug : `${slug}/page/${info.current}` },
        props: { kind: 'term', name: t.name, posts, info } as TaxonomyProps,
      })),
    ),
  ];
}
