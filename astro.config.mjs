// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import scopedExternalLinks from './src/plugins/path-filtered-blank-targets';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), mdx(), scopedExternalLinks({
    include: ['/team'],
  })],
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  site: 'https://team-filtered.org/',
});
