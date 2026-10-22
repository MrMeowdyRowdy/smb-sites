import localFont from 'next/font/local';

/** Voice 1: headlines, UI, prices, numerals. Variable latin file from Google Fonts (OFL, see fonts/OFL.txt), committed so builds need no network. */
export const hanken = localFont({
  src: './fonts/HankenGrotesk-latin-var.woff2',
  weight: '300 600',
  display: 'optional',
  variable: '--font-hanken',
});
