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
  site: 'https://team-filtered.org/',
  experimental: {
    rustCompiler: true
  }
});
