// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { stepsPlugin } from './src/lib/satteri-steps.mjs';

// SITE_URL and BASE_PATH are injected by the GitHub Pages workflow
// (from actions/configure-pages), so project pages, user pages and
// custom domains all work without editing this file.
// Locally: BASE_PATH=/my-lab npm run dev  -> test a sub-path deploy.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    // Astro 7 uses Sätteri (not unified/remark/rehype). MDX inherits this processor.
    processor: satteri({ hastPlugins: [stepsPlugin] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
