/**
 * UI strings and locale helpers.
 *
 * Page *content* belongs in content collections / .astro pages. This file is
 * only for chrome: navigation, footer, buttons, skip links.
 *
 * German here is real German, not machine output. If a string has no reviewed
 * translation yet, leave it in English and mark it — see the gsa-content skill.
 */

export const languages = {
  en: 'English',
  de: 'Deutsch',
} as const;

export const defaultLang = 'en' satisfies keyof typeof languages;

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'site.name': 'Global Sushi Academy',
    'site.tagline': 'Master the Art of Authentic Japanese Sushi',
    'nav.courses': 'Courses',
    'nav.about': 'About',
    'nav.certification': 'Certification',
    'nav.international': 'International Students',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.career': 'Career',
    'nav.faq': 'FAQ',
    'nav.skip': 'Skip to main content',
    'nav.menu': 'Menu',
    'footer.legal': 'Legal',
    'footer.imprint': 'Imprint',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': 'All rights reserved.',
    'lang.switch': 'Sprache wechseln: Deutsch',
    'cta.courses': 'View courses',
    'cta.contact': 'Contact us',
    '404.title': 'Page not found',
    '404.body': 'That page does not exist. It may have moved during our site rebuild.',
    '404.home': 'Go to the homepage',
  },
  de: {
    'site.name': 'Global Sushi Academy',
    'site.tagline': 'Die Kunst des authentischen japanischen Sushi',
    'nav.courses': 'Kurse',
    'nav.about': 'Über uns',
    'nav.certification': 'Zertifikat',
    'nav.international': 'Internationale Studierende',
    'nav.gallery': 'Galerie',
    'nav.contact': 'Kontakt',
    'nav.career': 'Karriere',
    'nav.faq': 'FAQ',
    'nav.skip': 'Zum Hauptinhalt springen',
    'nav.menu': 'Menü',
    'footer.legal': 'Rechtliches',
    'footer.imprint': 'Impressum',
    'footer.privacy': 'Datenschutzerklärung',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'lang.switch': 'Switch language: English',
    'cta.courses': 'Kurse ansehen',
    'cta.contact': 'Kontakt aufnehmen',
    '404.title': 'Seite nicht gefunden',
    '404.body':
      'Diese Seite existiert nicht. Möglicherweise wurde sie beim Relaunch verschoben.',
    '404.home': 'Zur Startseite',
  },
} as const;

/** Read the locale out of a URL pathname. Falls back to the default locale. */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

/** Returns a `t('key')` function bound to a locale. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Build a path for the given locale.
 * `localePath('en', '/courses')` -> '/courses'
 * `localePath('de', '/courses')` -> '/de/courses'
 */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean === '/' ? '' : clean}`;
}

/** The same page in the other locale, for the language switcher. */
export function alternatePath(lang: Lang, url: URL): string {
  const other: Lang = lang === 'en' ? 'de' : 'en';
  const stripped = lang === defaultLang
    ? url.pathname
    : url.pathname.replace(new RegExp(`^/${lang}`), '') || '/';
  return localePath(other, stripped);
}
