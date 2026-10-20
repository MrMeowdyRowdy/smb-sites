import { ogImage, ogSize } from '@/og';

export const size = ogSize;
export const contentType = 'image/png';
export const dynamic = 'force-static';
export const alt = 'Neblina';

export default function Image() {
  return ogImage('es');
}
