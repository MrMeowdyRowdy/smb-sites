import { metrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(await metrics.registry.metrics(), { headers: { 'Content-Type': metrics.registry.contentType } });
}
