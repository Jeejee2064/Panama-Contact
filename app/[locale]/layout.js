import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import AffiliateLinkTracker from '@/components/analytics/AffiliateLinkTracker';
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

// Add the Google Business Profile, LinkedIn and directory URLs here: sameAs is
// the main entity-disambiguation signal for search and AI engines.
const SAME_AS = ['https://wa.me/50764357515'];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    metadataBase: new URL('https://www.panama-contact.com'),
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        en: '/',
        es: '/es',
        fr: '/fr',
        pt: '/pt',
        de: '/de',
        'x-default': '/',
      },
    },
    icons: {
      icon: [
        { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/icons/site.webmanifest',
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Panama Contact Services — Your relocation experts in Panama' }],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.jpg'],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  const localePath = locale === 'en' ? '' : `/${locale}`;
  const ORG_ID = 'https://www.panama-contact.com/#organization';

  // One entity across all pages/locales (same @id), referenced by WebSite.
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'Panamá Contact',
    legalName: 'Panama Contact Services, S.A.',
    description: 'Expert relocation, residency visa, company formation, banking, and real estate services in Panama.',
    url: `https://www.panama-contact.com${localePath}`,
    logo: 'https://www.panama-contact.com/icons/apple-touch-icon.png',
    image: 'https://www.panama-contact.com/og-image.jpg',
    telephone: ['+50764357515', '+5073185882'],
    email: 'info@panama-contact.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ph Jeronimo, Avenida B y calle 10 este, planta baja - San Felipe',
      addressLocality: 'Ciudad de Panamá',
      addressRegion: 'Panamá',
      addressCountry: 'PA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 8.9534375, longitude: -79.5366875 },
    areaServed: { '@type': 'Country', name: 'Panama' },
    knowsLanguage: ['en', 'fr', 'es', 'pt', 'de'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+50764357515',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Spanish', 'Portuguese', 'German'],
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: SAME_AS,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `https://www.panama-contact.com${localePath}/#website`,
    name: 'Panamá Contact',
    url: `https://www.panama-contact.com${localePath}`,
    inLanguage: locale,
    publisher: { '@id': ORG_ID },
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
          <AffiliateLinkTracker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}