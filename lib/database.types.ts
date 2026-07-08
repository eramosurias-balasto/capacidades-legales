// Tipos del esquema Postgres (SPEC §3). Escritos a mano; mantener en sync con
// supabase/migrations/0001_init.sql. `items` guarda el crudo de captura (índices 0–3).

import type { EscalaId } from './instrumento';

/** Ítems crudos de captura: índice 0–3 por opción elegida, SIN invertir. */
export type ItemsCrudos = Record<EscalaId, number[]>;

export interface Institucion {
  id: number;
  slug: string;
  nombre: string;
  activa: boolean;
}

export interface Respuesta {
  id: string;
  institucion_id: number;
  creada_en: string;

  acepto_aviso: boolean;
  cohorte: 'curso_primavera_2026' | 'cursara_otono_2026';

  edad: number | null;
  genero: string | null;
  se_considera_indigena: string | null;
  se_considera_afro: string | null;
  nivel_educativo_padre: string | null;
  nivel_educativo_madre: string | null;

  items: ItemsCrudos;

  eaj_bruta: number | null;
  eaj_rasch: number | null;
  eal_bruta: number | null;
  eal_rasch: number | null;
  clg_bruta: number | null;
  clg_rasch: number | null;
  iaj_bruta: number | null;
  iaj_rasch: number | null;
  dpj_bruta: number | null;
  dpj_rasch: number | null;

  duracion_segundos: number | null;
  user_agent: string | null;
}

/** Campos que inserta el servidor en /api/submit (el resto los pone la BD). */
export type RespuestaInsert = Omit<Respuesta, 'id' | 'creada_en'>;
