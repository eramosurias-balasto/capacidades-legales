import 'server-only';
import { cookies } from 'next/headers';
import { serverEnv } from './env';
import {
  COOKIE_SESION,
  crearValorSesion as crearValorSesionCore,
  passwordCorrecta as passwordCorrectaCore,
  valorSesionValido,
} from './session-core';

// Wrapper server-only sobre session-core: inyecta el secreto/contraseña de entorno y lee
// la cookie de sesión. Lo usan las API routes protegidas y la página /dashboard.

/** Contraseña correcta contra DASHBOARD_PASSWORD. */
export function passwordCorrecta(intento: unknown): boolean {
  return passwordCorrectaCore(serverEnv.dashboardPassword, intento);
}

/** Nuevo valor de cookie firmado con SESSION_SECRET. */
export function crearValorSesion(): string {
  return crearValorSesionCore(serverEnv.sessionSecret);
}

/** true si la request trae una cookie de sesión válida y vigente. */
export function sesionActiva(): boolean {
  const valor = cookies().get(COOKIE_SESION)?.value;
  return valorSesionValido(serverEnv.sessionSecret, valor);
}
