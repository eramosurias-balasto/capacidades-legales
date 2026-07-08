import { NextResponse } from 'next/server';
import { sesionActiva } from '@/lib/session';
import { getInstituciones, getRespuestas } from '@/lib/supabase-server';
import { construirCsvMaestro } from '@/lib/csv';

// GET /api/export (protegido) — CSV maestro, un renglón por respuesta. Sin cookie => 401.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!sesionActiva()) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const [respuestas, instituciones] = await Promise.all([getRespuestas(), getInstituciones()]);
  const csv = construirCsvMaestro(respuestas, instituciones);
  const fecha = new Date().toISOString().slice(0, 10);
  // BOM para que Excel reconozca UTF-8 (acentos correctos).
  return new NextResponse('﻿' + csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="respuestas_maestro_${fecha}.csv"`,
    },
  });
}
