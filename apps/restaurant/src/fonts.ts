import { Hanken_Grotesk } from 'next/font/google';

/** The one family: 500 for display, 400 for text. Self-hosted at build time. */
export const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-hanken' });
