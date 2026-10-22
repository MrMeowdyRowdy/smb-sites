import type { Metadata } from 'next';
import { ConfirmationView } from '@/views/ConfirmationView';

export const metadata: Metadata = { title: 'Cita confirmada | Dental Alameda', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ConfirmationView locale="es" id={(await params).id} />;
}
