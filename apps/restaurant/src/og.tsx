import { ImageResponse } from 'next/og';
import type { Locale } from '@smb/i18n';
import { site, pick } from './lib/content';

export const ogSize = { width: 1200, height: 630 };

export function ogImage(locale: Locale) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#1f2a2b', color: '#f4efe6' }}>
        <div style={{ fontSize: 120, fontWeight: 700 }}>{site.name}</div>
        <div style={{ fontSize: 44, marginTop: 24 }}>{pick(site.tagline, locale)}</div>
        <div style={{ fontSize: 28, marginTop: 48, opacity: 0.7 }}>{`${site.address.neighborhood}, ${site.address.city}`}</div>
      </div>
    ),
    ogSize,
  );
}
