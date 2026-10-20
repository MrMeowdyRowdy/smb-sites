import { Analytics } from '@smb/ui';
import '../../src/globals.css';
import { hanken } from '../../src/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={hanken.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
