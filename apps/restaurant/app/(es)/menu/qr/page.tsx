import type { Metadata } from 'next';
import { QrView } from '@/views/QrView';
import { pageMetadata } from '@/seo';

export const metadata: Metadata = pageMetadata('qr', 'es');

export default function Page() {
  return <QrView locale="es" />;
}
