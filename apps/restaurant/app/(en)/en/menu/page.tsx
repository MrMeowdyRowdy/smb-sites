import type { Metadata } from 'next';
import { MenuView } from '@/views/MenuView';
import { pageMetadata } from '@/seo';

export const metadata: Metadata = pageMetadata('menu', 'en');

export default function Page() {
  return <MenuView locale="en" />;
}
