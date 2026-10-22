import { type Locale, otherLocale } from '@smb/i18n';
import { content } from '@/lib/content';
import { bookingPath, copy } from '@/copy';

export function Shell({ locale, children, switchTo }: { locale: Locale; children: React.ReactNode; switchTo?: string }) {
  const c = copy(locale);
  const other = otherLocale(locale);
  return (
    <>
      <a className="sr skip" href="#main">{c.skip}</a>
      <header>
        <a href={bookingPath(locale)}><strong>{content.name}</strong></a>
        <nav aria-label={locale === 'es' ? 'Idioma' : 'Language'}>
          <a href={switchTo ?? bookingPath(other)} lang={other} hrefLang={other}>{other === 'en' ? 'English' : 'Español'}</a>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="muted"><small>{c.demo}</small></footer>
    </>
  );
}
