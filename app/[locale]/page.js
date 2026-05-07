import { getTranslations, setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import WhyUs from '@/components/sections/WhyUs';
import ServicesPreview from '@/components/sections/ServicesPreview';
import CTA from '@/components/sections/CTA';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://panama-contact.com/${locale === 'en' ? '' : locale}`,
      siteName: 'Panama Contact Services',
      type: 'website',
    },
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
        <Features />
        <ServicesPreview />
        <WhyUs />
        <CTA />
      </div>
    </>
  );
}