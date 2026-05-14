'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import {
  resolveServiceSlug, localizeServiceSlug,
  resolveWhyPanamaSlug, localizeWhyPanamaSlug,
} from '@/data/slugs';

const locales = ['en', 'fr', 'es', 'pt', 'de'];

const flagMap = {
  en: 'us',
  fr: 'fr',
  es: 'es',
  pt: 'pt',
  de: 'de',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); // internal template, e.g. /services/[slug]
  const params = useParams();    // actual values, e.g. { slug: 'visa-nations-amies' }

  function switchLocale(nextLocale) {
    if (nextLocale === locale) return;

    if (params?.slug) {
      const currentSlug = String(params.slug);
      let translatedSlug = currentSlug;

      if (pathname === '/services/[slug]') {
        const canonical = resolveServiceSlug(currentSlug, locale);
        translatedSlug = localizeServiceSlug(canonical, nextLocale);
      } else if (pathname === '/why-panama/[slug]') {
        const canonical = resolveWhyPanamaSlug(currentSlug, locale);
        translatedSlug = localizeWhyPanamaSlug(canonical, nextLocale);
      }

      router.replace(
        { pathname, params: { slug: translatedSlug } },
        { locale: nextLocale }
      );
    } else {
      router.replace(pathname, { locale: nextLocale });
    }
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`p-1 rounded-full transition ${
            l === locale
              ? ''
              : 'opacity-70 hover:opacity-100 hover:scale-110'
          }`}
        >
          <span
            className={`fi fi-${flagMap[l]} rounded-full w-5 h-5 block`}
          />
        </button>
      ))}
    </div>
  );
}