import type { Metadata } from 'next';
import { BookingView } from '@/views/BookingView';

export const metadata: Metadata = { title: 'Book your appointment | Dental Alameda' };
export const dynamic = 'force-dynamic';

export default function Page() {
  return <BookingView locale="en" />;
}
