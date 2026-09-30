import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Dateiname in Kleinbuchstaben = URL (wie Hugo)
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '').toLowerCase();

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts', generateId }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    description: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages', generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    // Kopfbereich im neuen Design
    hero: z.string().optional(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, pages };
