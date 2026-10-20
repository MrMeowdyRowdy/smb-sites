import type { Metadata } from 'next';
import { type Locale, type RouteId, pathFor } from '@smb/i18n';
import { meta } from './copy';
import { siteUrl } from './lib/content';

export function pageMetadata(id: RouteId, locale: Locale): Metadata {
  const { title, description } = meta[id][locale];
  const path = pathFor(id, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: { es: pathFor(id, 'es'), en: pathFor(id, 'en'), 'x-default': pathFor(id, 'es') },
    },
    openGraph: { title, description, url: path, siteName: 'Neblina', type: 'website', locale: locale === 'es' ? 'es_EC' : 'en_US' },
  };
}
