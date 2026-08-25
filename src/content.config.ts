import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./posts", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()),
    type: z.enum(["guide", "post", "til"]).optional(),
    published: z.boolean().optional(),
  }),
});

export const collections = { blog };