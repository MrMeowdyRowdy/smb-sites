'use client';

import { useEffect, useState } from 'react';

type Props = { src: string; srcSet?: string; sizes?: string; alt: string; width: number; height: number; className?: string; eager?: boolean };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * A picture below the first screen. The first paint carries only a block of the same size (and a <noscript> img for no-JS and
 * crawlers); the real <img> is put in after the page has loaded, so it never competes with the fonts, CSS and hero for the connection.
 */
export function LazyImg({ src, srcSet, sizes, alt, width, height, className, eager }: Props) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t = 0;
    const go = () => { t = window.setTimeout(() => setOn(true), 250); };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => { window.removeEventListener('load', go); window.clearTimeout(t); };
  }, []);
  const style = { aspectRatio: `${width} / ${height}` };
  if (on)
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} width={width} height={height} style={style} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
  const html = `<img class="${esc(className ?? '')}" src="${esc(src)}"${srcSet ? ` srcset="${esc(srcSet)}" sizes="${esc(sizes ?? '')}"` : ''} alt="${esc(alt)}" width="${width}" height="${height}" loading="lazy">`;
  return (
    <>
      <span className={`ph lazy-ph ${className ?? ''}`} style={style} aria-hidden="true" />
      <noscript dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
