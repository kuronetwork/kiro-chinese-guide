// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ⚠️ 換成你的 Cloudflare 自訂網域(含 https://,結尾不要斜線)
//    例如:'https://kiro.yourdomain.com'
//    這個值會被 sitemap 與 <link rel="canonical"> 使用。
const SITE = 'https://kiro-guide.example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // 使用自訂網域時 base 維持 '/';
  // 若改用 https://<user>.github.io/<repo>/ 才需要改成 '/<repo>'
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      // 深色終端機風的語法高亮主題
      theme: 'github-dark-dimmed',
      wrap: false,
    },
  },
});
