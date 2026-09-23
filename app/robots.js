import { SITE_URL } from '@/i18n/urls';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cuestionario', '/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
