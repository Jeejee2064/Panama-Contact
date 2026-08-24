import { routing } from './routing';
import { locales } from './config';

export const SITE_URL = 'https://panama-contact.com';

function withPrefix(locale, path) {
  return `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}${path}`;
}

/** Absolute URL for a static pathname key registered in routing.pathnames (e.g. '/services'). */
export function localizedUrl(pathnameKey, locale) {
  return withPrefix(locale, routing.pathnames[pathnameKey][locale]);
}

/** { canonical, languages, 'x-default' } for a static page — pass directly as `alternates`. */
export function localizedAlternates(pathnameKey, locale) {
  const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(pathnameKey, l)]));
  return {
    canonical: localizedUrl(pathnameKey, locale),
    languages: { ...languages, 'x-default': languages.en },
  };
}

/** Absolute URL for a dynamic '/xxx/[slug]' pathname key, substituting an already-localized slug. */
export function localizedDetailUrl(pathnameKey, locale, slug) {
  return withPrefix(locale, routing.pathnames[pathnameKey][locale].replace('[slug]', slug));
}

/**
 * { canonical, languages, 'x-default' } for a detail page.
 * `getSlugForLocale(l)` must return the already-localized slug for locale `l`
 * (i.e. localizeServiceSlug / localizeWhyPanamaSlug).
 */
export function localizedDetailAlternates(pathnameKey, locale, slug, getSlugForLocale) {
  const languages = Object.fromEntries(
    locales.map((l) => [l, localizedDetailUrl(pathnameKey, l, getSlugForLocale(l))])
  );
  return {
    canonical: localizedDetailUrl(pathnameKey, locale, slug),
    languages: { ...languages, 'x-default': languages.en },
  };
}
