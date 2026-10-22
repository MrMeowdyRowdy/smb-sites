import { COOKIE } from '@/lib/auth';

export async function POST() {
  return new Response(null, { status: 303, headers: { Location: '/admin', 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` } });
}
