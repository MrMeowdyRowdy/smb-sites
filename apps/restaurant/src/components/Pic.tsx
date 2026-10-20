import { photoSrc } from '../lib/photos';
import { LazyImg } from './LazyImg';

/** A graded photo from public/photos, or a flat tonal block of the same size until the file exists. */
export function Pic({ name, alt, w, h, priority, defer, className, sizes = '(max-width: 760px) 90vw, 32vw' }: { name: string; alt: string; w: number; h: number; priority?: boolean; defer?: boolean; className?: string; sizes?: string }) {
  const found = photoSrc(name);
  const style = { aspectRatio: `${found?.width ?? w} / ${found?.height ?? h}` };
  if (!found)
    return (
      <div className={`ph ${className ?? ''}`} style={style} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} data-photo={name} />
    );
  const [width, height] = [found.width ?? w, found.height ?? h];
  if (!priority || defer) return <LazyImg src={found.src} srcSet={found.srcSet} sizes={sizes} alt={alt} width={width} height={height} className={className} eager={!!defer} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={found.src} srcSet={found.srcSet} sizes={found.srcSet ? sizes : undefined} alt={alt} width={width} height={height} style={style} loading="eager" fetchPriority="high" decoding="async" />;
}
