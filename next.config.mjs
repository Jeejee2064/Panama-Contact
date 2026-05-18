import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ─── Friendly-Nations slug renames (old → new) ─────────────────────────
      {
        source: '/fr/services/visa-nations-amies-panama',
        destination: '/fr/services/visa-pays-amis-panama',
        permanent: true,
      },
      {
        source: '/es/servicios/visa-naciones-amigas-panama',
        destination: '/es/servicios/visa-paises-amigas-panama',
        permanent: true,
      },
      {
        source: '/pt/servicos/visto-nacoes-amigas-panama',
        destination: '/pt/servicos/visto-paises-amigas-panama',
        permanent: true,
      },

      // ─── Old sitemap submitted wrong base paths for ES/PT services ──────────
      // ES: /es/services/* → /es/servicios/*
      {
        source: '/es/services/:slug*',
        destination: '/es/servicios/:slug*',
        permanent: true,
      },
      // PT: /pt/services/* → /pt/servicos/*
      {
        source: '/pt/services/:slug*',
        destination: '/pt/servicos/:slug*',
        permanent: true,
      },

      // ─── Old sitemap submitted wrong why-panama paths ───────────────────────
      // ES: /es/why-panama/* → /es/por-que-panama/*
      {
        source: '/es/why-panama/:slug*',
        destination: '/es/por-que-panama/:slug*',
        permanent: true,
      },
      // PT: /pt/why-panama/* → /pt/por-que-panama/*
      {
        source: '/pt/why-panama/:slug*',
        destination: '/pt/por-que-panama/:slug*',
        permanent: true,
      },
      // FR: /fr/why-panama/* → /fr/pourquoi-panama/*
      {
        source: '/fr/why-panama/:slug*',
        destination: '/fr/pourquoi-panama/:slug*',
        permanent: true,
      },

      // ─── Old sitemap submitted wrong static pages ───────────────────────────
      { source: '/es/services',   destination: '/es/servicios',                        permanent: true },
      { source: '/pt/services',   destination: '/pt/servicos',                         permanent: true },
      { source: '/es/why-panama', destination: '/es/por-que-panama',                   permanent: true },
      { source: '/pt/why-panama', destination: '/pt/por-que-panama',                   permanent: true },
      { source: '/fr/why-panama', destination: '/fr/pourquoi-s-installer-au-panama',   permanent: true },
      { source: '/es/contact',    destination: '/es/contacto',                         permanent: true },
      { source: '/pt/contact',    destination: '/pt/contato',                          permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
