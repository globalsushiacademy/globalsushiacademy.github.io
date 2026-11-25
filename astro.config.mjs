// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Served from the user-site repo globalsushiacademy.github.io under a
  // custom domain, so no `base` is needed.
  site: 'https://globalsushiacademy.com',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      // English stays unprefixed (/courses); German lives at /de/courses.
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-GB', de: 'de-DE' },
      },
    }),
  ],

  vite: {
    // Tailwind 4 ships as a Vite plugin. The old @astrojs/tailwind
    // integration is Tailwind 3 only and is not used here.
    plugins: [tailwindcss()],
  },
});
