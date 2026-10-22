import { COOKIE, SESSION_SECONDS, checkPassword, secret, signSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const back = (to: string, headers: Record<string, string> = {}) => new Response(null, { status: 303, headers: { Location: to, ...headers } });

export async function POST(req: Request) {
  if (!secret()) return new Response('SESSION_SECRET is not set (16+ characters)', { status: 500 });
  const password = String((await req.formData().catch(() => null))?.get('password') ?? '');
  if (!checkPassword(password)) return back('/admin?error=1');
  // Secure is opt-in: the local stack serves plain HTTP. Set COOKIE_SECURE=true behind TLS.
  const secure = process.env.COOKIE_SECURE === 'true' ? '; Secure' : '';
  return back('/admin', { 'Set-Cookie': `${COOKIE}=${signSession()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}` });
}
