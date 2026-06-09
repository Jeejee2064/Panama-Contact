export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cuestionario', '/admin'],
    },
    sitemap: 'https://panama-contact.com/sitemap.xml',
  };
}
