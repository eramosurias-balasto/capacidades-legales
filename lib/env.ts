import 'server-only';

// Acceso centralizado a variables de entorno del servidor (SPEC §8).
// Getters perezosos: se validan al usarse (en tiempo de request), no al importar, para no
// romper `next build` cuando las variables aún no están configuradas.
//
// REGLA CRÍTICA: SUPABASE_SERVICE_ROLE_KEY jamás se expone al cliente ni se prefija con
// NEXT_PUBLIC_. Este módulo está marcado `server-only`: importarlo desde el cliente falla.

function requerido(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}. Ver .env.example y SPEC §8.`);
  }
  return valor;
}

export const serverEnv = {
  get supabaseUrl() {
    return requerido('SUPABASE_URL');
  },
  get supabaseServiceRoleKey() {
    return requerido('SUPABASE_SERVICE_ROLE_KEY');
  },
  get dashboardPassword() {
    return requerido('DASHBOARD_PASSWORD');
  },
  get sessionSecret() {
    return requerido('SESSION_SECRET');
  },
  /** Público; disponible en el cliente vía process.env.NEXT_PUBLIC_APP_URL. */
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? '';
  },
};
