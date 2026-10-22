import { cookies } from 'next/headers';
import { COOKIE, verifySession } from '@/lib/auth';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!verifySession((await cookies()).get(COOKIE)?.value)) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  if (!UUID.test(id)) return new Response('Not found', { status: 404 });
  await pool().query("UPDATE appointments SET status = 'cancelled' WHERE id = $1", [id]);
  return new Response(null, { status: 303, headers: { Location: '/admin' } });
}
