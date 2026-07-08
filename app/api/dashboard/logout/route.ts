import { NextResponse } from 'next/server';
import { COOKIE_SESION } from '@/lib/session-core';

// POST /api/dashboard/logout — borra la cookie de sesión.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
