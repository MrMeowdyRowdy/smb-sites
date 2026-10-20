import type { Locale } from './locale';

/** Shared UI strings (components in packages/ui). Page copy lives in the app. */
const es = {
  skipLink: 'Saltar al contenido',
  languageSwitch: { label: 'Idioma', switchTo: 'English', switchToLang: 'en' },
  whatsapp: { cta: 'Escríbenos por WhatsApp', opensIn: 'se abre en una pestaña nueva' },
  contactForm: {
    name: 'Nombre',
    message: 'Mensaje',
    send: 'Enviar por WhatsApp',
    nameRequired: 'Escribe tu nombre.',
    messageRequired: 'Escribe tu mensaje.',
    hint: 'Se abrirá WhatsApp con tu mensaje listo para enviar.',
  },
  messages: {
    orderIntro: 'Hola, quisiera hacer este pedido:',
    total: 'Total',
    contactIntro: 'Hola, les escribo desde el sitio web.',
    name: 'Nombre',
    message: 'Mensaje',
  },
};

const en: typeof es = {
  skipLink: 'Skip to content',
  languageSwitch: { label: 'Language', switchTo: 'Español', switchToLang: 'es' },
  whatsapp: { cta: 'Message us on WhatsApp', opensIn: 'opens in a new tab' },
  contactForm: {
    name: 'Name',
    message: 'Message',
    send: 'Send on WhatsApp',
    nameRequired: 'Enter your name.',
    messageRequired: 'Enter your message.',
    hint: 'WhatsApp opens with your message ready to send.',
  },
  messages: {
    orderIntro: 'Hello, I would like to place this order:',
    total: 'Total',
    contactIntro: 'Hello, I am writing from the website.',
    name: 'Name',
    message: 'Message',
  },
};

export type Dictionary = typeof es;
export const dictionaries: Record<Locale, Dictionary> = { es, en };
export const t = (locale: Locale): Dictionary => dictionaries[locale];
