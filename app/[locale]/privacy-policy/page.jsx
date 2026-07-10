import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { routing } from '@/i18n/routing';

const PATHNAME = '/privacy-policy';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function localizedUrl(locale) {
  const slug = routing.pathnames[PATHNAME][locale];
  return `https://panama-contact.com${locale === 'en' ? '' : `/${locale}`}${slug}`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicyPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: localizedUrl(locale),
      languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l)])),
    },
  };
}

export default async function PrivacyPolicyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicyPage' });

  const sections = [
    ['dataCollectedTitle', 'dataCollectedBody'],
    ['howWeUseItTitle', 'howWeUseItBody'],
    ['dataSharingTitle', 'dataSharingBody'],
    ['retentionTitle', 'retentionBody'],
    ['rightsTitle', 'rightsBody'],
    ['contactTitle', 'contactBody'],
  ];

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-[Gravesend] text-[#324158] mb-2 uppercase">{t('heading')}</h1>
        <p className="text-xs text-gray-400 mb-8">{t('lastUpdated')}</p>
        <p className="text-[#324158]/70 leading-relaxed mb-10">{t('intro')}</p>

        {sections.map(([titleKey, bodyKey]) => (
          <div key={titleKey} className="mb-8">
            <h2 className="text-lg font-[Gravesend] text-[#324158] mb-2">{t(`sections.${titleKey}`)}</h2>
            <p className="text-[#324158]/70 leading-relaxed text-sm">{t(`sections.${bodyKey}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
