// Núcleo de sesión del dashboard: firma/verificación HMAC y comparación de contraseña.
// PURO (recibe el secreto por parámetro) para poder testearse sin `server-only` ni env.
// El wrapper con env y cookies vive en lib/session.ts (server-only).

import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE_SESION = 'dash_session';
export const DURACION_SESION_SEG = 60 * 60 * 8; // 8 horas

function firma(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function comparaConstante(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Crea el valor de cookie firmado: `<exp>.<hmac(exp)>` (exp en segundos epoch). */
export function crearValorSesion(secret: string, ahoraMs = Date.now(), durSeg = DURACION_SESION_SEG): string {
  const exp = Math.floor(ahoraMs / 1000) + durSeg;
  const payload = String(exp);
  return `${payload}.${firma(secret, payload)}`;
}

/** Valida firma y expiración de un valor de cookie. */
export function valorSesionValido(secret: string, valor: string | undefined | null, ahoraMs = Date.now()): boolean {
  if (!valor) return false;
  const punto = valor.indexOf('.');
  if (punto <= 0) return false;
  const payload = valor.slice(0, punto);
  const sig = valor.slice(punto + 1);
  if (!comparaConstante(sig, firma(secret, payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Math.floor(ahoraMs / 1000);
}

/** Comparación en tiempo constante de la contraseña del dashboard. */
export function passwordCorrecta(real: string, intento: unknown): boolean {
  if (typeof intento !== 'string' || intento.length === 0) return false;
  return comparaConstante(intento, real);
}
