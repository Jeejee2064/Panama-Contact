import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { localizedAlternates } from '@/i18n/urls';
import LegalDocument from '@/components/legal/LegalDocument';

const PATHNAME = '/legal-terms';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LegalTermsPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(PATHNAME, locale),
  };
}

export default async function LegalTermsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocument locale={locale} namespace="LegalTermsPage" />;
}
