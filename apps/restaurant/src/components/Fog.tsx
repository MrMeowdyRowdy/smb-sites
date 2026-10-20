import { site } from '../lib/content';

/** The atmosphere layer: two drifting noise sheets. Switched by site.json "atmosphere"; nothing renders for "none". */
export function Fog({ className = '' }: { className?: string }) {
  if (site.atmosphere !== 'fog') return null;
  return (
    <span className={`fog ${className}`} aria-hidden="true" data-fog>
      <i className="fog-a" />
      <i className="fog-b" />
    </span>
  );
}
