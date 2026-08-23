// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Merges the @astrojs/sitemap chunk files (sitemap-0.xml, sitemap-1.xml, …)
 * into a single sitemap.xml at the site root after every build.
 */
const mergeSitemaps = () => ({
  name: 'merge-sitemaps',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const dist = fileURLToPath(dir);
      const files = (await readdir(dist)).filter((f) => /^sitemap-\d+\.xml$/.test(f));
      if (!files.length) return;
      let urls = '';
      for (const file of files) {
        const content = await readFile(join(dist, file), 'utf8');
        urls += (content.match(/<url>[\s\S]*?<\/url>/g) ?? []).join('');
      }
      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
        ' xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' +
        ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' +
        ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' +
        ' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">' +
        urls +
        '</urlset>';
      await writeFile(join(dist, 'sitemap.xml'), xml);
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://tjwaterfrontservices.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap(), mergeSitemaps()]
});