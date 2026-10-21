import localFont from 'next/font/local';

/** The one family: 500 for display, 400 for text. Variable latin file from Google Fonts (OFL, see fonts/OFL.txt), committed so builds need no network. */
export const hanken = localFont({
  src: './fonts/HankenGrotesk-latin-var.woff2',
  weight: '400 500',
  display: 'optional',
  variable: '--font-hanken',
});
