import { Analytics } from '@smb/ui';
import '../../src/globals.css';
import '../../src/styles/brand.css';
// Shared chrome styles live here too, so every page gets one render-blocking stylesheet for them (Lighthouse FCP/LCP).
import '../../src/styles/header.css';
import '../../src/styles/close.css';
import '../../src/styles/transition.css';
import '../../src/styles/menu-arrival.css';
import { BOOT } from '../../src/boot';
import { hanken } from '../../src/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <noscript>
          <style>{'.lazy-ph{display:none}'}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
