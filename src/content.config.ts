import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Markdown lives in src/content/{projects,devlogs}/ so an Obsidian vault can point there.
// Image paths in frontmatter are relative to the .md file, e.g. ./assets/my-game/cover.png
// Optional fields may be left blank (`itchUrl:`) — Obsidian templates do that, and YAML reads it as null.

const optional = <T extends z.ZodType>(schema: T) =>
  schema.nullish().transform((v) => v ?? undefined);
const list = <T extends z.ZodType>(item: T) =>
  z.array(item).nullish().transform((v) => v ?? []);

const projects = defineCollection({
  // The `slug` frontmatter field becomes the entry id (and the URL: /projects/<slug>/)
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string(),
      coverImage: image(),
      gallery: list(image()),
      itchUrl: optional(z.url()),
      steamUrl: optional(z.url()),
      tags: list(z.string()),
      videoId: optional(z.string()), // YouTube video ID, e.g. dQw4w9WgXcQ
      date: z.coerce.date(),
      featured: z.boolean().nullish().transform((v) => v ?? false),
    }),
});

const devlogs = defineCollection({
  loader: glob({ base: './src/content/devlogs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    project: reference('projects'), // must match an existing project slug — build fails otherwise
    tags: list(z.string()),
  }),
});

export const collections = { projects, devlogs };
