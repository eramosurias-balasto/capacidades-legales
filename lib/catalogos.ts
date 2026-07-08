// Catálogos canónicos de demografía, cohorte y tipo de institución (DECISIONES.md D4/D5/D10/D11).
// Los valores `snake_case` son los que se ALMACENAN; las etiquetas son lo que ve el usuario.
// Fuente compartida por: validación de /api/submit, flujo de encuesta y exports.

export type TipoInstitucion = 'escolar' | 'general';
export const TIPOS_INSTITUCION = ['escolar', 'general'] as const satisfies readonly TipoInstitucion[];

// --- Cohorte (SPEC §4, extendida en 0003) ---
export const COHORTES_ESCOLAR = ['curso_primavera_2026', 'cursara_otono_2026'] as const;
export const COHORTES_GENERAL = ['general_si_curso', 'general_no_curso'] as const;
export type Cohorte = (typeof COHORTES_ESCOLAR)[number] | (typeof COHORTES_GENERAL)[number];

/** Valores de cohorte válidos según el tipo de institución. */
export function cohortesPermitidas(tipo: TipoInstitucion): readonly string[] {
  return tipo === 'escolar' ? COHORTES_ESCOLAR : COHORTES_GENERAL;
}

// --- Demografía común a TODOS los tipos ---
export const GENEROS = ['mujer', 'hombre', 'otro', 'prefiero_no_responder'] as const;
export const SI_NO_PNR = ['si', 'no', 'prefiero_no_responder'] as const;

/** Nivel educativo de padre y madre (se pregunta a todos): incluye 'no_lo_se'. */
export const NIVELES_EDUCATIVOS_PADRES = [
  'sin_estudios',
  'primaria',
  'secundaria',
  'preparatoria',
  'licenciatura',
  'posgrado',
  'no_lo_se',
] as const;

/** Nivel educativo propio (solo general): mismo catálogo SIN 'no_lo_se'. */
export const NIVELES_EDUCATIVOS_PROPIO = [
  'sin_estudios',
  'primaria',
  'secundaria',
  'preparatoria',
  'licenciatura',
  'posgrado',
] as const;

// --- Límites de campos de texto libre ---
export const MAX_OCUPACION = 120;
export const MAX_CURSO_DERECHO_DETALLE = 200;

// --- Etiquetas visibles (para la UI del flujo y encabezados legibles) ---
export const ETIQUETAS_GENERO: Record<(typeof GENEROS)[number], string> = {
  mujer: 'Mujer',
  hombre: 'Hombre',
  otro: 'Otro',
  prefiero_no_responder: 'Prefiero no responder',
};

export const ETIQUETAS_SI_NO_PNR: Record<(typeof SI_NO_PNR)[number], string> = {
  si: 'Sí',
  no: 'No',
  prefiero_no_responder: 'Prefiero no responder',
};

export const ETIQUETAS_NIVEL_EDUCATIVO: Record<(typeof NIVELES_EDUCATIVOS_PADRES)[number], string> = {
  sin_estudios: 'Sin estudios',
  primaria: 'Primaria',
  secundaria: 'Secundaria',
  preparatoria: 'Preparatoria o bachillerato',
  licenciatura: 'Licenciatura',
  posgrado: 'Posgrado',
  no_lo_se: 'No lo sé',
};

export const ETIQUETAS_COHORTE: Record<Cohorte, string> = {
  curso_primavera_2026: 'La cursé en primavera 2026',
  cursara_otono_2026: 'La voy a cursar en otoño 2026',
  general_si_curso: 'Sí',
  general_no_curso: 'No',
};
