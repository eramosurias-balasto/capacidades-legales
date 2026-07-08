// Construcción de los dos CSV de exportación (SPEC §7.5). Puro y testeable.
// UTF-8, separador coma, decimales con punto (JS por defecto).

import { EscalaId, NUM_ITEMS, ORDEN_ESCALAS } from './instrumento';
import { puntuarRespuesta, recodeItem } from './scoring';
import type { Institucion, Respuesta } from './database.types';

function esc(valor: unknown): string {
  if (valor === null || valor === undefined) return '';
  const s = String(valor);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function fila(campos: unknown[]): string {
  return campos.map(esc).join(',');
}

function mapaInstituciones(instituciones: Institucion[]): Map<number, Institucion> {
  return new Map(instituciones.map((i) => [i.id, i]));
}

/**
 * CSV maestro: un renglón por respuesta con todos los campos, items crudos, puntajes por
 * ítem recodificados, brutas y Rasch P&B. Recalcula la puntuación desde el crudo para que
 * el archivo sea auto-consistente (SPEC §10, criterio: "el CSV maestro reproduce las
 * puntuaciones").
 */
export function construirCsvMaestro(respuestas: Respuesta[], instituciones: Institucion[]): string {
  const inst = mapaInstituciones(instituciones);

  const encabezado: string[] = [
    'id',
    'creada_en',
    'tipo',
    'institucion_slug',
    'institucion_nombre',
    'cohorte',
    'edad',
    'genero',
    'se_considera_indigena',
    'se_considera_afro',
    'nivel_educativo_padre',
    'nivel_educativo_madre',
    'nivel_educativo_propio',
    'ocupacion',
    'curso_derecho_detalle',
    'duracion_segundos',
    'user_agent',
  ];
  for (const e of ORDEN_ESCALAS) for (let i = 1; i <= NUM_ITEMS[e]; i++) encabezado.push(`${e}_i${i}_crudo`);
  for (const e of ORDEN_ESCALAS) for (let i = 1; i <= NUM_ITEMS[e]; i++) encabezado.push(`${e}_i${i}_recod`);
  for (const e of ORDEN_ESCALAS) encabezado.push(`${e}_bruta`, `${e}_rasch`);

  const lineas: string[] = [encabezado.join(',')];

  for (const r of respuestas) {
    const p = puntuarRespuesta(r.items);
    const institucion = inst.get(r.institucion_id);
    const campos: unknown[] = [
      r.id,
      r.creada_en,
      institucion?.tipo ?? '',
      institucion?.slug ?? '',
      institucion?.nombre ?? '',
      r.cohorte,
      r.edad,
      r.genero,
      r.se_considera_indigena,
      r.se_considera_afro,
      r.nivel_educativo_padre,
      r.nivel_educativo_madre,
      r.nivel_educativo_propio,
      r.ocupacion,
      r.curso_derecho_detalle,
      r.duracion_segundos,
      r.user_agent,
    ];
    for (const e of ORDEN_ESCALAS) for (const v of r.items[e]) campos.push(v); // crudo
    for (const e of ORDEN_ESCALAS) for (const v of p[e].porItem) campos.push(v); // recodificado
    for (const e of ORDEN_ESCALAS) campos.push(p[e].bruta, p[e].rasch);
    lineas.push(fila(campos));
  }

  return lineas.join('\n');
}

/** Encabezados fijos de agrupación (DIF) del CSV easyRasch, en orden. */
export const COLUMNAS_DIF = ['dif_tipo', 'dif_cohorte', 'dif_genero', 'dif_institucion', 'dif_edad'] as const;

/**
 * CSV por escala en formato easyRasch: columnas dif_* de agrupación y luego SOLO q1…qN con
 * el puntaje por ítem YA RECODIFICADO (categoría mínima = 0). `dif_institucion` = slug.
 */
export function construirCsvRasch(escala: EscalaId, respuestas: Respuesta[], instituciones: Institucion[]): string {
  const inst = mapaInstituciones(instituciones);
  const n = NUM_ITEMS[escala];

  const encabezado = [...COLUMNAS_DIF, ...Array.from({ length: n }, (_, i) => `q${i + 1}`)];
  const lineas: string[] = [encabezado.join(',')];

  for (const r of respuestas) {
    const institucion = inst.get(r.institucion_id);
    const crudos = r.items[escala];
    const qs = crudos.map((v, i) => recodeItem(escala, i, v));
    const campos: unknown[] = [
      institucion?.tipo ?? '',
      r.cohorte,
      r.genero,
      institucion?.slug ?? '',
      r.edad,
      ...qs,
    ];
    lineas.push(fila(campos));
  }

  return lineas.join('\n');
}
