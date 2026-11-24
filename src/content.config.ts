import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Markdown lives in src/content/{projects,devlogs}/ so an Obsidian vault can point there.
// Image paths in frontmatter are relative to the .md file, e.g. ./assets/my-game/cover.png

const projects = defineCollection({
  // The `slug` frontmatter field becomes the entry id (and the URL: /projects/<slug>/)
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string(),
      coverImage: image(),
      gallery: z.array(image()).default([]),
      itchUrl: z.url().optional(),
      steamUrl: z.url().optional(),
      tags: z.array(z.string()).default([]),
      videoId: z.string().optional(), // YouTube video ID, e.g. dQw4w9WgXcQ
      date: z.coerce.date(),
      featured: z.boolean().default(false),
    }),
});

const devlogs = defineCollection({
  loader: glob({ base: './src/content/devlogs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    project: reference('projects'), // must match an existing project slug — build fails otherwise
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, devlogs };
