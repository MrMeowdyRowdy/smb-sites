// Three closed, off-centre rings (a summit seen from above), tighter on the steep side, with the cherry dot on the inner ring.
const R_OUT = 'M50 6C68 4 88 16 93 36C97 54 90 74 74 86C60 96 38 97 24 88C9 78 4 58 8 41C12 22 32 8 50 6Z';
const R_MID = 'M57 20C70 19 82 29 85 43C88 58 81 72 69 79C58 86 44 84 35 75C26 66 25 50 31 38C36 27 46 21 57 20Z';
const R_IN = 'M64 36C72 35 78 41 79 49C80 57 75 64 68 66C60 68 53 64 52 56C51 48 56 37 64 36Z';

/** The mark. `two` drops the middle ring (16 px use). Decorative unless a label is given. */
export function Mark({ className = '', label, two }: { className?: string; label?: string; two?: boolean }) {
  return (
    <svg className={`mk${two ? ' two' : ''} ${className}`} viewBox="0 0 100 100" {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}>
      <path className="r r1" pathLength={1} d={R_OUT} />
      <path className="r r2" pathLength={1} d={R_MID} />
      <path className="r r3" pathLength={1} d={R_IN} />
      <circle className="dot" cx="52" cy="56" r="6" />
    </svg>
  );
}
