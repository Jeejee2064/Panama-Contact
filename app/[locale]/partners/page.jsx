import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { localizedAlternates } from '@/i18n/urls';
import PartnersGrid from '@/components/partners/PartnersGrid';

const PATHNAME = '/partners';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PartnersPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(PATHNAME, locale),
  };
}

export default async function PartnersPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PartnersGrid locale={locale} />;
}
