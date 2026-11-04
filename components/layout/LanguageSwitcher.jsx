'use client';

import { useLocale } from 'next-intl';
import { getPathname, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import {
  resolveServiceSlug, localizeServiceSlug,
  resolveWhyPanamaSlug, localizeWhyPanamaSlug,
} from '@/data/slugs';

const ALL_LOCALES = ['en', 'fr', 'es', 'pt', 'de'];

const flagMap = {
  en: 'us',
  fr: 'fr',
  es: 'es',
  pt: 'pt',
  de: 'de',
};

// `locales` lets callers restrict which flags are offered — e.g. pages that
// only exist in a subset of locales (see RESTRICTED_LOCALES in Header.jsx)
// should not show flags that would route into a 404.
export default function LanguageSwitcher({ locales = ALL_LOCALES }) {
  const locale = useLocale();
  const pathname = usePathname(); // internal template, e.g. /services/[slug]
  const params = useParams();    // actual values, e.g. { slug: 'visa-nations-amies' }

  // Real <a href> links (not router.push buttons) so crawlers can follow them
  // to every language version of the current page.
  function hrefFor(nextLocale) {
    if (!params?.slug) return getPathname({ href: pathname, locale: nextLocale });

    const currentSlug = String(params.slug);
    let translatedSlug = currentSlug;

    if (pathname === '/services/[slug]') {
      const canonical = resolveServiceSlug(currentSlug, locale);
      translatedSlug = localizeServiceSlug(canonical, nextLocale);
    } else if (pathname === '/why-panama/[slug]') {
      const canonical = resolveWhyPanamaSlug(currentSlug, locale);
      translatedSlug = localizeWhyPanamaSlug(canonical, nextLocale);
    }

    return getPathname({ href: { pathname, params: { slug: translatedSlug } }, locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <a
          key={l}
          href={hrefFor(l)}
          hrefLang={l}
          aria-label={l.toUpperCase()}
          aria-current={l === locale ? 'true' : undefined}
          className={`p-1 rounded-full transition ${
            l === locale
              ? ''
              : 'opacity-70 hover:opacity-100 hover:scale-110'
          }`}
        >
          <span
            className={`fi fi-${flagMap[l]} rounded-full w-5 h-5 block`}
          />
        </a>
      ))}
    </div>
  );
}
