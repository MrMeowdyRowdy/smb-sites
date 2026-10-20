import type { MetadataRoute } from 'next';
import { routes } from '@smb/i18n';
import { abs } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((r) =>
    (['es', 'en'] as const).map((l) => ({
      url: abs(r[l]),
      alternates: { languages: { es: abs(r.es), en: abs(r.en), 'x-default': abs(r.es) } },
    })),
  );
}
