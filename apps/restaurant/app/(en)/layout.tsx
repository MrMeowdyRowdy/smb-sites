import { Analytics } from '@smb/ui';
import '../../src/globals.css';
import { hanken } from '../../src/fonts';

// Once per session, and never with reduced motion: the first screen arrives out of thick fog (CSS only, skippable).
const ARRIVE =
  "try{if(!sessionStorage.getItem('neblina-arrived')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.arrive='1';sessionStorage.setItem('neblina-arrived','1')}}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: ARRIVE }} />
        <noscript>
          <style>{'.lazy-ph{display:none}'}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
