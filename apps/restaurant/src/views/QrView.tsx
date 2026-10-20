import QRCode from 'qrcode';
import { type Locale, pathFor } from '@smb/i18n';
import { Shell } from '../components/Shell';
import { ui } from '../copy';
import { abs } from '../lib/content';

// Server component: the SVG is generated once at build time.
export async function QrView({ locale }: { locale: Locale }) {
  const u = ui[locale].qrPage;
  const url = abs(pathFor('menu', locale));
  const svg = await QRCode.toString(url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' });
  return (
    <Shell locale={locale} routeId="qr">
      <div className="qr-sheet">
        <h1>{u.h1}</h1>
        <p>{u.lead}</p>
        <div className="qr" role="img" aria-label={u.alt} dangerouslySetInnerHTML={{ __html: svg }} />
        <p>{url}</p>
        <p className="no-print">{u.print}</p>
      </div>
    </Shell>
  );
}
