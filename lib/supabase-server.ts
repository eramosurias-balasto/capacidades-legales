import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { serverEnv } from './env';
import type { Institucion } from './database.types';

// Único punto de contacto con Supabase (SPEC §2). Usa SUPABASE_SERVICE_ROLE_KEY, que
// ignora RLS. SOLO debe importarse desde código de servidor (API routes / componentes de
// servidor). El módulo `server-only` hace fallar cualquier import desde el cliente.

let cliente: SupabaseClient | null = null;

/** Cliente Supabase de servicio (singleton). Nunca exponer al navegador. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!cliente) {
    cliente = createClient(serverEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cliente;
}

/**
 * Busca una institución activa por slug. Devuelve null si no existe o está inactiva
 * (usado para 404 en /encuesta/[slug] y para validar en /api/submit).
 */
export async function getInstitucionActiva(slug: string): Promise<Institucion | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('instituciones')
    .select('id, slug, nombre, activa')
    .eq('slug', slug)
    .eq('activa', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Error consultando institución "${slug}": ${error.message}`);
  }
  return (data as Institucion | null) ?? null;
}
