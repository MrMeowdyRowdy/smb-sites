import localFont from 'next/font/local';

/** Voice 2, the map voice: place and altitude labels, captions. Upright 400/500 only (OFL, see fonts/OFL-AlegreyaSans.txt).
 *  Kept in its own module and applied on the home wrapper only, so no other route loads it. */
export const alegreya = localFont({
  src: [
    { path: './fonts/AlegreyaSans-400-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/AlegreyaSans-500-latin.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  // Not preloaded: the map voice is never the LCP text, and on the home it would compete with the first paint (Lighthouse LCP).
  preload: false,
  variable: '--font-alegreya',
});
