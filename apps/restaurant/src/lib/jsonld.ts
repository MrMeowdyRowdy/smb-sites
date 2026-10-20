import type { Locale } from '@smb/i18n';
import { abs, menu, pick, site } from './content';
import { pathFor } from '@smb/i18n';

/** schema.org CafeOrCoffeeShop (a Restaurant subtype), built from the two content files. */
export function cafeJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: site.name,
    description: pick(site.description, locale),
    url: abs(pathFor('home', locale)),
    telephone: `+${site.whatsapp}`,
    priceRange: site.priceRange,
    servesCuisine: site.servesCuisine,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: {
      '@type': 'Menu',
      url: abs(pathFor('menu', locale)),
      hasMenuSection: menu.categories.map((c) => ({
        '@type': 'MenuSection',
        name: pick(c.name, locale),
        hasMenuItem: menu.items
          .filter((i) => i.category === c.id)
          .map((i) => ({
            '@type': 'MenuItem',
            name: pick(i.name, locale),
            description: pick(i.description, locale),
            offers: { '@type': 'Offer', price: i.price.toFixed(2), priceCurrency: 'USD' },
          })),
      })),
    },
  };
}
