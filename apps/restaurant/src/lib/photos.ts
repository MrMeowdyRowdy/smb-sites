import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'photos');
const has = (f: string) => fs.existsSync(path.join(dir, f));

/** Pixel size from a WebP header (lossy, lossless or extended), so the markup never guesses the ratio. */
function webpSize(file: string): { width: number; height: number } | null {
  const b = Buffer.alloc(32);
  const fd = fs.openSync(path.join(dir, file), 'r');
  fs.readSync(fd, b, 0, 32, 0);
  fs.closeSync(fd);
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  if (kind === 'VP8L') {
    const v = b.readUInt32LE(21);
    return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 };
  }
  if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  return null;
}

export type Photo = { src: string; srcSet?: string; width?: number; height?: number };

/**
 * public/photos/<name>.webp|png (a single file, e.g. a cut-out or a derivative made for one slot), or <name>-1600.webp with the
 * smaller <name>-480 and <name>-800 as a srcset. Returns null when the file does not exist; the page then shows a flat block.
 */
export function photoSrc(name: string): Photo | null {
  for (const e of ['webp', 'png', 'avif', 'jpg']) {
    if (!has(`${name}.${e}`)) continue;
    return { src: `/photos/${name}.${e}`, ...(e === 'webp' ? webpSize(`${name}.${e}`) : null) };
  }
  if (!has(`${name}-1600.webp`)) return null;
  const small = [480, 800].filter((w) => has(`${name}-${w}.webp`));
  const srcSet = small.length ? [...small.map((w) => `/photos/${name}-${w}.webp ${w}w`), `/photos/${name}-1600.webp 1600w`].join(', ') : undefined;
  return { src: `/photos/${name}-1600.webp`, srcSet, ...webpSize(`${name}-1600.webp`) };
}
