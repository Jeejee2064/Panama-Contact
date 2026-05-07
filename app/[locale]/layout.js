import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import '../globals.css';

import localFont from 'next/font/local';
const gravesend = localFont({
  src: '../../public/fonts/gravesend.otf',
  variable: '--font-gravesend'
});

const lagasignatica = localFont({
  src: '../../public/fonts/lagasignatica.otf',
  variable: '--font-lagasignatica'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    metadataBase: new URL('https://panama-contact.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        es: '/es',
        fr: '/fr',
        pt: '/pt',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Panama Contact Services',
    description: 'Expert relocation, residency visa, company formation, banking, and real estate services in Panama.',
    url: 'https://panama-contact.com',
    telephone: '+50764357515',
    email: 'info@panama-contact.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Edificio Dekel - Oficina 4 - Nivel 200, Plaza Santa Ana',
      addressLocality: 'Ciudad de Panamá',
      addressCountry: 'PA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 8.9936, longitude: -79.5197 },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+50764357515',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Spanish', 'Portuguese'],
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: ['https://wa.me/50764357515'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Panama Contact Services',
    url: 'https://panama-contact.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://panama-contact.com/services?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={locale} className={`${gravesend.variable} ${lagasignatica.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}