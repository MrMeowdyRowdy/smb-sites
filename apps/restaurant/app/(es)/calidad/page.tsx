import type { Metadata } from 'next';
import { QualityView } from '@/views/QualityView';
import { pageMetadata } from '@/seo';

export const metadata: Metadata = pageMetadata('quality', 'es');

export default function Page() {
  return <QualityView locale="es" />;
}
