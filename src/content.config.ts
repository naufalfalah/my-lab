import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const labs = defineCollection({
  // id = file name without extension, e.g. contoh-lab.mdx -> "contoh-lab"
  loader: glob({ pattern: '*.mdx', base: './src/content/labs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    duration: z.number().int().positive(), // total minutes
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    tags: z.array(z.string()).default([]),
    updated: z.coerce.date(),
  }),
});

export const collections = { labs };
