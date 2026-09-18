// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical production domain. Required for sitemap + absolute OG URLs.
  // No `base` is set: this deploys to a custom apex domain, not a project path.
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
