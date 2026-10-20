import type { Locale } from '@smb/i18n';
import { Shell } from '../components/Shell';
import { qualityCopy } from '../copy';
import { quality } from '../lib/quality';

const day = (iso: string) => iso.slice(0, 10);

export function QualityView({ locale }: { locale: Locale }) {
  const c = qualityCopy[locale];
  const q = quality;
  return (
    <Shell locale={locale} routeId="quality">
      <h1>{c.h1}</h1>
      <p>{c.lead}</p>
      {q && (
        <>
          <section aria-labelledby="q-tests">
            <h2 id="q-tests">{c.unit} / {c.e2e}</h2>
            <ul>
              <li>
                {c.unit}: {q.unit.passed}/{q.unit.total} {c.passed}, {q.unit.failed} {c.failed}
              </li>
              <li>
                {c.e2e}: {q.e2e.passed}/{q.e2e.total} {c.passed}, {q.e2e.failed} {c.failed}, {q.e2e.skipped} {c.skipped}
              </li>
            </ul>
          </section>

          <section aria-labelledby="q-lh">
            <h2 id="q-lh">{c.lighthouse}</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">{c.url}</th>
                  <th scope="col">{c.perf}</th>
                  <th scope="col">{c.a11y}</th>
                  <th scope="col">{c.bp}</th>
                  <th scope="col">{c.seo}</th>
                  <th scope="col">{c.lcp}</th>
                </tr>
              </thead>
              <tbody>
                {q.lighthouse.map((r) => (
                  <tr key={r.path}>
                    <th scope="row">{r.path}</th>
                    <td>{Math.round(r.performance * 100)}</td>
                    <td>{Math.round(r.accessibility * 100)}</td>
                    <td>{Math.round(r.bestPractices * 100)}</td>
                    <td>{Math.round(r.seo * 100)}</td>
                    <td>{Math.round(r.lcp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section aria-labelledby="q-axe">
            <h2 id="q-axe">{c.axe}</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">{c.route}</th>
                  <th scope="col">{c.violations}</th>
                </tr>
              </thead>
              <tbody>
                {q.axe.map((r) => (
                  <tr key={r.route}>
                    <th scope="row">{r.route}</th>
                    <td>{r.violations === 0 ? c.axeNone : r.violations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      <section aria-labelledby="q-up">
        <h2 id="q-up">{c.uptime}</h2>
        <p>{c.uptimeNote}</p>
      </section>

      <section aria-labelledby="q-deploy">
        <h2 id="q-deploy">{c.deploy}</h2>
        <p>{c.deployInfo}</p>
        <p>{q?.deploy.url ? `${c.live} ${q.deploy.url}` : c.pending}</p>
      </section>

      {q && (
        <section aria-labelledby="q-build">
          <h2 id="q-build">{c.build}</h2>
          <ul>
            <li>{c.commit}: {q.commit}</li>
            <li>{c.date}: {day(q.generated)}</li>
            <li>{c.node}: {q.node}</li>
            <li>{c.next}: {q.next}</li>
          </ul>
        </section>
      )}
    </Shell>
  );
}
