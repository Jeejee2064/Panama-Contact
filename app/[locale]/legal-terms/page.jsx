import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { routing } from '@/i18n/routing';
import LegalDocument from '@/components/legal/LegalDocument';

const PATHNAME = '/legal-terms';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function localizedUrl(locale) {
  const slug = routing.pathnames[PATHNAME][locale];
  return `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}${slug}`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LegalTermsPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: localizedUrl(locale),
      languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l)])),
    },
  };
}

export default async function LegalTermsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocument locale={locale} namespace="LegalTermsPage" />;
}
