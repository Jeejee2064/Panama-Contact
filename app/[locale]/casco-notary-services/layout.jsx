import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCnsContent } from '@/lib/cns/content';
import CascoHeader from '@/components/casco-notary/CascoHeader';
import CascoNav from '@/components/casco-notary/CascoNav';
import CascoFooter from '@/components/casco-notary/CascoFooter';

// Shared chrome for the whole Casco Notary mini-site (hub page + all
// sub-pages) — the site's global Header/Footer are suppressed for these
// routes (see BARE_HEADER_PATHS / NO_FOOTER_PATHS in components/layout).
const SUPPORTED_LOCALES = ['en', 'es'];

export default async function CascoNotaryLayout({ children, params }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  setRequestLocale(locale);

  const { chrome } = await getCnsContent(locale);

  return (
    <div>
      <CascoHeader backLabel={chrome.backToSite} />
      <CascoNav labels={chrome.nav} />
      {children}
      <CascoFooter copy={chrome.footer} />
    </div>
  );
}
