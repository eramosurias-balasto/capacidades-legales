import { NextResponse } from 'next/server';
import { passwordCorrecta, crearValorSesion } from '@/lib/session';
import { COOKIE_SESION, DURACION_SESION_SEG } from '@/lib/session-core';

// POST /api/dashboard/login { password } — setea cookie httpOnly firmada si coincide.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido.' }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;
  if (!passwordCorrecta(password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, crearValorSesion(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION_SESION_SEG,
  });
  return res;
}
