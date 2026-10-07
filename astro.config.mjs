// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // BETA: served from the user-site repo globalsushiacademy.github.io, so no
  // `base` is needed. At launch switch back to 'https://globalsushiacademy.com'
  // and restore public/CNAME (see CLAUDE.md "Launch switch").
  site: 'https://globalsushiacademy.github.io',

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
      // TODO(launch): delete this filter and the `noindex` on those pages
      // once the Impressum and Datenschutzerklärung are complete. A finished
      // Impressum is normally indexable; it is excluded only while it is an
      // unfinished stub, so the sitemap doesn't contradict the noindex tag.
      filter: (page) => !/\/(impressum|datenschutz)\/?$/.test(page),
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
