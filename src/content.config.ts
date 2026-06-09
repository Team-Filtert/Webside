import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';


const updates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/updates' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.date(),
    summary: z.string(),
  }),
});

export const collections = {
    updates,
};