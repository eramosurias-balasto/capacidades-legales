import { NextResponse } from 'next/server';
import { sesionActiva } from '@/lib/session';
import { getInstituciones, getRespuestas } from '@/lib/supabase-server';
import { construirResultados } from '@/lib/dashboard-data';

// GET /api/results (protegido) — datos agregados para el dashboard. Sin cookie => 401.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!sesionActiva()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const [respuestas, instituciones] = await Promise.all([getRespuestas(), getInstituciones()]);
  return NextResponse.json(construirResultados(respuestas, instituciones));
}
