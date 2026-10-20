import type { Metadata } from 'next';
import { HomeView } from '@/views/HomeView';
import { pageMetadata } from '@/seo';

export const metadata: Metadata = pageMetadata('home', 'en');

export default function Page() {
  return <HomeView locale="en" />;
}
