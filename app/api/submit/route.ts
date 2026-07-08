import { NextResponse } from 'next/server';
import { getInstitucionActiva, getSupabaseAdmin } from '@/lib/supabase-server';
import { validarSubmit } from '@/lib/submit-validation';
import { puntuarRespuesta } from '@/lib/scoring';

// POST /api/submit — recibe una respuesta, valida por tipo de institución, puntúa en el
// servidor e inserta en Supabase (SPEC §2/§6). Única puerta de escritura a la BD.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON inválido.' }, { status: 400 });
  }

  const slug = (body as { slug?: unknown })?.slug;
  if (typeof slug !== 'string' || !slug) {
    return NextResponse.json({ error: 'Falta el identificador de la institución.' }, { status: 400 });
  }

  const institucion = await getInstitucionActiva(slug);
  if (!institucion) {
    return NextResponse.json({ error: 'Institución no encontrada o inactiva.' }, { status: 404 });
  }

  const validacion = validarSubmit(body, institucion.tipo);
  if (!validacion.ok) {
    return NextResponse.json({ error: validacion.error }, { status: 400 });
  }
  const r = validacion.limpio;

  // Puntuación en el servidor (nunca en el cliente). Se guarda el crudo en `items`.
  const p = puntuarRespuesta(r.items);
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  const fila = {
    institucion_id: institucion.id,
    acepto_aviso: true,
    cohorte: r.cohorte,
    edad: r.edad,
    genero: r.genero,
    se_considera_indigena: r.se_considera_indigena,
    se_considera_afro: r.se_considera_afro,
    nivel_educativo_padre: r.nivel_educativo_padre,
    nivel_educativo_madre: r.nivel_educativo_madre,
    entidad: r.entidad,
    nivel_educativo_propio: r.nivel_educativo_propio,
    ocupacion: r.ocupacion,
    curso_derecho_detalle: r.curso_derecho_detalle,
    curso_derecho_anio: r.curso_derecho_anio,
    items: r.items,
    eaj_bruta: p.eaj.bruta,
    eaj_rasch: p.eaj.rasch,
    eal_bruta: p.eal.bruta,
    eal_rasch: p.eal.rasch,
    clg_bruta: p.clg.bruta,
    clg_rasch: p.clg.rasch,
    iaj_bruta: p.iaj.bruta,
    iaj_rasch: p.iaj.rasch,
    dpj_bruta: p.dpj.bruta,
    dpj_rasch: p.dpj.rasch,
    duracion_segundos: r.duracion_segundos,
    user_agent: userAgent,
  };

  const { data, error } = await getSupabaseAdmin()
    .from('respuestas')
    .insert(fila)
    .select('id')
    .single();

  if (error) {
    console.error('Error insertando respuesta:', error.message);
    return NextResponse.json({ error: 'No se pudo guardar la respuesta.' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
