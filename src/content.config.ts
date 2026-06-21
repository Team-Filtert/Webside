import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from 'astro/zod';

export const collections = {
    members: defineCollection({
        loader: glob({ base: './src/data/members', pattern: '**/*.{md,mdx}' }),
        schema: z.object({
            name: z.string(),
            description: z.string(),
            image: z.string().optional(),
            departments: z.array(z.string()).min(1),
            language: z.string().optional(),
        }),
    }),
    departments: defineCollection({
        loader: file('./src/data/departments.json'),
        schema: z.object({
            name: z.string(),
            head: reference('members').optional(),
        }),
    }),
    updates: defineCollection({
        loader: glob({ base: './src/content/updates', pattern: '**/*.{md,mdx}' }),
        schema: z.object({
            title: z.string(),
            summary: z.string().optional(),
            author: z.array(reference('members')),
            published: z.date().or(z.enum(["draft"])),
        }),
    }),
};
