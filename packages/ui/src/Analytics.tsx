/** The single analytics slot: renders nothing unless NEXT_PUBLIC_ANALYTICS_SRC is set. */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  return src ? <script defer src={src} /> : null;
}
