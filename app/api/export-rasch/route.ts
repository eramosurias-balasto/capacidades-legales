import { NextResponse } from 'next/server';
import { sesionActiva } from '@/lib/session';
import { getInstituciones, getRespuestas } from '@/lib/supabase-server';
import { construirCsvRasch } from '@/lib/csv';
import { ORDEN_ESCALAS, EscalaId } from '@/lib/instrumento';

// GET /api/export-rasch?escala=<eaj|eal|clg|iaj|dpj> (protegido) — CSV formato easyRasch.
// Sin cookie => 401. SIN BOM (R/easyRasch lee UTF-8 directo y el BOM ensucia la 1a columna).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!sesionActiva()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const escala = new URL(req.url).searchParams.get('escala') as EscalaId | null;
  if (!escala || !ORDEN_ESCALAS.includes(escala)) {
    return NextResponse.json({ error: 'Parámetro escala inválido.' }, { status: 400 });
  }
  const [respuestas, instituciones] = await Promise.all([getRespuestas(), getInstituciones()]);
  const csv = construirCsvRasch(escala, respuestas, instituciones);
  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="rasch_${escala}_${fecha}.csv"`,
    },
  });
}
