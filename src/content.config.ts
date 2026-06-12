import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

// 教學章節集合。每篇 .mdx 放在 src/content/docs/ 下。
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    // 章節標題
    title: z.string(),
    // 一句話描述,用於頁首與 <meta description>
    description: z.string().default(''),
    // 所屬大段落(側欄分組標籤)
    section: z.string(),
    // 全站排序;同段落用相近數字,段落之間留間隔
    order: z.number(),
  }),
});

export const collections = { docs };
