// Single source of truth for the Casco Notary Services CMS.
//
// It describes (1) which texts exist and where they appear, (2) which lists of
// items (services, prices, FAQ…) exist. The admin editor, the public loader
// (lib/cns/content.js) and the seed SQL (supabase/cns-cms.sql) are all derived
// from this file — to make a new text editable, add a field here.
//
// `key` is a dot path into messages/{en,es}.json → CascoNotaryPage, which is
// also what the public components already consume, so they stay unchanged.

export const CNS_LOCALES = ['en', 'es'];
export const CNS_LOCALE_LABELS = { en: 'English', es: 'Español' };
export const CNS_BASE_PATH = '/casco-notary-services';
export const CNS_DEFAULT_WHATSAPP = '50764357515';

// Lists of rows editable with "add / reorder / hide / delete".
// `path` is where the list lands in the content object.
// `titleKey` / `bodyKey` are the property names the components expect
// (`bodyKey: null` → list of plain strings).
export const CNS_COLLECTIONS = {
  trust: {
    path: 'home.trust.items',
    titleKey: 'title',
    bodyKey: 'description',
    itemLabel: 'Ventaja',
    titleLabel: 'Título',
    bodyLabel: 'Descripción',
    addLabel: 'Añadir una ventaja',
  },
  crossSell: {
    path: 'home.crossSell.items',
    titleKey: null,
    bodyKey: null,
    itemLabel: 'Servicio',
    titleLabel: 'Texto',
    addLabel: 'Añadir una línea',
  },
  services: {
    path: 'services.items',
    titleKey: 'title',
    bodyKey: 'description',
    itemLabel: 'Servicio',
    titleLabel: 'Nombre del servicio',
    bodyLabel: 'Descripción corta',
    addLabel: 'Añadir un servicio',
  },
  remote: {
    path: 'services.remote.items',
    titleKey: null,
    bodyKey: null,
    itemLabel: 'Línea',
    titleLabel: 'Texto',
    addLabel: 'Añadir una línea',
  },
  prices: {
    path: 'pricing.items',
    titleKey: 'label',
    bodyKey: 'price',
    itemLabel: 'Producto',
    titleLabel: 'Producto / servicio',
    bodyLabel: 'Precio',
    bodyPlaceholder: 'Ej. B/. 12.00 por página',
    addLabel: 'Añadir un producto',
  },
  steps: {
    path: 'delivery.process.steps',
    titleKey: 'title',
    bodyKey: 'description',
    itemLabel: 'Paso',
    titleLabel: 'Título del paso',
    bodyLabel: 'Descripción',
    addLabel: 'Añadir un paso',
  },
  faq: {
    path: 'faq.items',
    titleKey: 'question',
    bodyKey: 'answer',
    itemLabel: 'Pregunta',
    titleLabel: 'Pregunta',
    bodyLabel: 'Respuesta',
    addLabel: 'Añadir una pregunta',
  },
};

const t = (key, label, help) => ({ key, label, help, type: 'text' });
const ta = (key, label, help) => ({ key, label, help, type: 'textarea' });
// Same value for every language (e.g. a phone number).
const shared = (field) => ({ ...field, shared: true });

const seo = (prefix) => ({
  id: `${prefix}-seo`,
  title: 'Google (SEO)',
  help: 'Lo que se ve en los resultados de Google y en la pestaña del navegador.',
  fields: [
    t(`${prefix}.meta.title`, 'Título para Google', 'Ideal: menos de 60 caracteres.'),
    ta(`${prefix}.meta.description`, 'Descripción para Google', 'Ideal: entre 120 y 160 caracteres.'),
  ],
});

export const CNS_PAGES = [
  {
    slug: 'home',
    title: 'Inicio',
    description: 'La página principal de Casco Notary Services.',
    path: CNS_BASE_PATH,
    sections: [
      {
        id: 'home-hero',
        title: 'Cabecera (lo primero que se ve)',
        help: 'Título grande, texto de introducción y los dos botones.',
        fields: [
          t('home.eyebrowSuffix', 'Frase en dorado encima del título'),
          t('home.h1', 'Título principal'),
          ta('home.subhead', 'Texto de introducción'),
          t('home.ctaPrimary', 'Botón principal', 'Abre WhatsApp.'),
          t('home.ctaSecondary', 'Botón secundario', 'Lleva a la página de precios.'),
        ],
      },
      {
        id: 'home-trust',
        title: 'Franja “Por qué elegirnos”',
        help: 'Las 4 ventajas en tarjetas debajo de la cabecera (esta franja no tiene título visible).',
        fields: [],
        collection: 'trust',
      },
      {
        id: 'home-teaser',
        title: 'Vista previa de servicios',
        help: 'Se muestran los 4 primeros servicios de la lista de la página “Servicios” (para cambiarlos, reordénalos allí). Aquí solo se editan los textos alrededor.',
        fields: [
          t('home.servicesTeaser.heading', 'Título'),
          ta('home.servicesTeaser.intro', 'Texto de introducción'),
          t('home.servicesTeaser.seeAllLabel', 'Botón “ver todos los servicios”', 'Escribe {count} donde va el número: se reemplaza solo por la cantidad real de servicios. Ej.: Ver los {count} servicios'),
          t('home.servicesTeaser.pricingLabel', 'Botón “ver precios”'),
        ],
      },
      {
        id: 'home-crosssell',
        title: 'Bloque “Powered by Panama Contact”',
        fields: [
          t('home.crossSell.heading', 'Título'),
          ta('home.crossSell.body', 'Texto'),
          t('home.crossSell.linkServices', 'Enlace 1 (servicios de Panama Contact)'),
          t('home.crossSell.linkHome', 'Enlace 2 (sobre Panama Contact)'),
        ],
        collection: 'crossSell',
      },
      {
        id: 'home-corporate',
        title: 'Tarifas corporativas',
        fields: [
          t('home.corporate.heading', 'Título'),
          ta('home.corporate.body', 'Texto'),
          t('home.corporate.cta', 'Texto del botón'),
          ta('home.corporate.whatsappMessage', 'Mensaje de WhatsApp pre-escrito', 'Lo que aparece escrito cuando el cliente abre WhatsApp desde este botón.'),
        ],
      },
      seo('home'),
    ],
  },
  {
    slug: 'services',
    title: 'Servicios',
    description: 'La lista de servicios, los servicios remotos y las traducciones.',
    path: `${CNS_BASE_PATH}/services`,
    sections: [
      {
        id: 'services-hero',
        title: 'Cabecera',
        fields: [t('services.heading', 'Título principal'), ta('services.intro', 'Texto de introducción')],
      },
      {
        id: 'services-list',
        title: 'Lista de servicios',
        help: 'Las tarjetas de servicios. También se muestran los primeros en la página de inicio.',
        fields: [ta('services.footnote', 'Nota debajo de la lista')],
        collection: 'services',
      },
      {
        id: 'services-remote',
        title: 'Servicios a distancia',
        fields: [
          t('services.remote.heading', 'Título'),
          ta('services.remote.intro', 'Texto de introducción'),
          ta('services.remote.note', 'Nota al final'),
        ],
        collection: 'remote',
      },
      {
        id: 'services-translations',
        title: 'Traducciones oficiales',
        fields: [t('services.translations.heading', 'Título'), ta('services.translations.body', 'Texto')],
      },
      seo('services'),
    ],
  },
  {
    slug: 'pricing',
    title: 'Precios',
    description: 'La tabla de precios y el aviso legal.',
    path: `${CNS_BASE_PATH}/pricing`,
    sections: [
      {
        id: 'pricing-hero',
        title: 'Cabecera',
        fields: [t('pricing.heading', 'Título principal')],
      },
      {
        id: 'pricing-table',
        title: 'Tabla de precios',
        help: 'Cada fila es un producto con su precio. El precio es un texto libre: puede ser “B/. 12.00”, “Desde B/. 50.00” o “Bajo pedido”.',
        fields: [
          ta('pricing.note', 'Nota encima de la tabla'),
          ta('pricing.deliveryNote', 'Nota debajo de la tabla (entregas)'),
        ],
        collection: 'prices',
      },
      {
        id: 'pricing-disclaimer',
        title: 'Aviso legal',
        fields: [
          t('pricing.disclaimer.heading', 'Título'),
          ta('pricing.disclaimer.body1', 'Párrafo 1'),
          ta('pricing.disclaimer.body2', 'Párrafo 2'),
        ],
      },
      seo('pricing'),
    ],
  },
  {
    slug: 'delivery',
    title: 'Entrega',
    description: 'Recogida y entrega de documentos, pasos del proceso y ubicación.',
    path: `${CNS_BASE_PATH}/delivery`,
    sections: [
      {
        id: 'delivery-hero',
        title: 'Cabecera',
        fields: [t('delivery.heading', 'Título principal'), ta('delivery.intro', 'Texto de introducción')],
      },
      {
        id: 'delivery-process',
        title: 'Cómo funciona (pasos)',
        help: 'Los pasos se numeran solos en el orden de la lista.',
        fields: [t('delivery.process.heading', 'Título')],
        collection: 'steps',
      },
      {
        id: 'delivery-terms',
        title: 'Plazos y condiciones de entrega',
        fields: [
          t('delivery.standard', 'Entrega estándar'),
          t('delivery.urgent', 'Entrega urgente'),
          t('delivery.airport', 'Entrega al aeropuerto'),
          t('delivery.restriction', 'Restricción de zona'),
        ],
      },
      {
        id: 'delivery-location',
        title: 'Ubicación',
        fields: [
          t('delivery.location.heading', 'Título'),
          ta('delivery.location.intro', 'Texto de introducción'),
          ta('delivery.location.address', 'Dirección'),
          t('delivery.location.directions', 'Texto del botón “cómo llegar”'),
        ],
      },
      seo('delivery'),
    ],
  },
  {
    slug: 'faq',
    title: 'Preguntas frecuentes',
    description: 'Las preguntas y respuestas.',
    path: `${CNS_BASE_PATH}/faq`,
    sections: [
      {
        id: 'faq-hero',
        title: 'Título',
        fields: [t('faq.heading', 'Título principal')],
      },
      {
        id: 'faq-list',
        title: 'Preguntas y respuestas',
        help: 'Se envían también a Google como datos estructurados (FAQ).',
        fields: [],
        collection: 'faq',
      },
      seo('faq'),
    ],
  },
  {
    slug: 'general',
    title: 'Común a todas las páginas',
    description: 'WhatsApp, menú, llamado a la acción final y pie de página.',
    path: CNS_BASE_PATH,
    sections: [
      {
        id: 'general-whatsapp',
        title: 'WhatsApp',
        help: 'Todos los botones de WhatsApp del sitio usan estos datos.',
        fields: [
          shared(t('chrome.whatsappNumber', 'Número de WhatsApp', 'Solo cifras, con el código del país. Ej. 50764357515')),
          ta('chrome.whatsappMessage', 'Mensaje pre-escrito', 'Lo que aparece escrito cuando el cliente abre WhatsApp.'),
        ],
      },
      {
        id: 'general-nav',
        title: 'Menú de navegación',
        help: 'Los nombres de los enlaces del menú.',
        fields: [
          t('chrome.nav.home', 'Inicio'),
          t('chrome.nav.services', 'Servicios'),
          t('chrome.nav.pricing', 'Precios'),
          t('chrome.nav.delivery', 'Entrega'),
          t('chrome.nav.faq', 'Preguntas frecuentes'),
        ],
      },
      {
        id: 'general-cta',
        title: 'Llamado a la acción (final de cada página)',
        fields: [
          t('chrome.finalCta.heading', 'Título'),
          ta('chrome.finalCta.body', 'Texto'),
          t('chrome.finalCta.cta', 'Texto del botón'),
        ],
      },
      {
        id: 'general-footer',
        title: 'Cabecera y pie de página',
        fields: [
          t('chrome.backToSite', 'Enlace “volver a Panama Contact” (arriba)'),
          t('chrome.footer.tagline', 'Frase del pie de página'),
          t('chrome.footer.backHome', 'Texto “Powered by”'),
          ta('chrome.footer.address', 'Dirección'),
          t('chrome.footer.rights', 'Derechos reservados'),
          t('chrome.footer.privacyLabel', 'Enlace de política de privacidad'),
          t('chrome.footer.termsLabel', 'Enlace de términos y condiciones'),
        ],
      },
    ],
  },
];

export function getCnsPage(slug) {
  return CNS_PAGES.find((p) => p.slug === slug) || null;
}

export function allTextFields() {
  return CNS_PAGES.flatMap((p) => p.sections.flatMap((s) => s.fields));
}

export function allTextKeys() {
  return allTextFields().map((f) => f.key);
}
