// Validación de una respuesta entrante, condicional por tipo de institución (SPEC §6, 0003).
// Función pura y sin dependencias de red: /api/submit (Fase 3) la usa antes de puntuar e
// insertar. Devuelve un objeto normalizado listo para puntuar, o un error legible (→ 400).

import { EscalaId, NUM_ITEMS, ORDEN_ESCALAS } from './instrumento';
import type { ItemsCrudos } from './database.types';
import {
  Cohorte,
  TipoInstitucion,
  cohortesPermitidas,
  GENEROS,
  SI_NO_PNR,
  NIVELES_EDUCATIVOS_PADRES,
  NIVELES_EDUCATIVOS_PROPIO,
  ENTIDADES,
  MAX_OCUPACION,
  MAX_CURSO_DERECHO_DETALLE,
  MIN_ANIO_DERECHO,
  MAX_ANIO_DERECHO,
} from './catalogos';

export interface RespuestaLimpia {
  acepto_aviso: true;
  cohorte: Cohorte;
  edad: number;
  genero: string;
  se_considera_indigena: string;
  se_considera_afro: string;
  nivel_educativo_padre: string;
  nivel_educativo_madre: string;
  entidad: string;
  nivel_educativo_propio: string | null;
  ocupacion: string | null;
  curso_derecho_detalle: string | null;
  curso_derecho_anio: number | null;
  items: ItemsCrudos;
  duracion_segundos: number | null;
}

export type ResultadoValidacion =
  | { ok: true; limpio: RespuestaLimpia }
  | { ok: false; error: string };

function err(error: string): ResultadoValidacion {
  return { ok: false, error };
}

/** true si el valor es "no proporcionado": undefined, null o cadena en blanco. */
function vacio(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

function validarItems(raw: unknown): ItemsCrudos | string {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return 'items debe ser un objeto con las cinco escalas';
  }
  const obj = raw as Record<string, unknown>;
  const limpio = {} as ItemsCrudos;
  for (const escala of ORDEN_ESCALAS) {
    const arr = obj[escala];
    if (!Array.isArray(arr)) return `items.${escala} falta o no es un arreglo`;
    if (arr.length !== NUM_ITEMS[escala]) {
      return `items.${escala} debe tener ${NUM_ITEMS[escala]} elementos, tiene ${arr.length}`;
    }
    for (const v of arr) {
      if (!Number.isInteger(v) || (v as number) < 0 || (v as number) > 3) {
        return `items.${escala} contiene un valor inválido (se esperan enteros 0–3)`;
      }
    }
    limpio[escala] = arr as number[];
  }
  return limpio;
}

/** Valida `payload` para una institución del `tipo` dado. */
export function validarSubmit(payload: unknown, tipo: TipoInstitucion): ResultadoValidacion {
  if (typeof payload !== 'object' || payload === null) return err('cuerpo inválido');
  const p = payload as Record<string, unknown>;

  // Consentimiento (SPEC §4: sin aceptar no hay encuesta).
  if (p.acepto_aviso !== true) return err('acepto_aviso debe ser true');

  // Ítems.
  const items = validarItems(p.items);
  if (typeof items === 'string') return err(items);

  // Edad.
  if (!Number.isInteger(p.edad) || (p.edad as number) < 12 || (p.edad as number) > 99) {
    return err('edad debe ser un entero entre 12 y 99');
  }

  // Demografía común (todas con opción de escape → obligatorias y dentro de catálogo).
  if (!GENEROS.includes(p.genero as never)) return err('genero fuera de catálogo');
  if (!SI_NO_PNR.includes(p.se_considera_indigena as never)) return err('se_considera_indigena fuera de catálogo');
  if (!SI_NO_PNR.includes(p.se_considera_afro as never)) return err('se_considera_afro fuera de catálogo');
  if (!NIVELES_EDUCATIVOS_PADRES.includes(p.nivel_educativo_padre as never)) {
    return err('nivel_educativo_padre fuera de catálogo');
  }
  if (!NIVELES_EDUCATIVOS_PADRES.includes(p.nivel_educativo_madre as never)) {
    return err('nivel_educativo_madre fuera de catálogo');
  }

  // Entidad federativa: obligatoria para todos los flujos (migración 0004).
  if (!ENTIDADES.includes(p.entidad as never)) return err('entidad fuera de catálogo');

  // Cohorte según tipo (valores escolares solo escolar y viceversa).
  const permitidas = cohortesPermitidas(tipo);
  if (!permitidas.includes(p.cohorte as string)) {
    return err(`cohorte "${String(p.cohorte)}" no permitida para institución ${tipo}`);
  }
  const cohorte = p.cohorte as Cohorte;

  // Campos condicionales por tipo.
  let nivel_educativo_propio: string | null = null;
  let ocupacion: string | null = null;
  let curso_derecho_detalle: string | null = null;
  let curso_derecho_anio: number | null = null;

  if (tipo === 'general') {
    // Nivel educativo propio: obligatorio, catálogo sin 'no_lo_se'.
    if (!NIVELES_EDUCATIVOS_PROPIO.includes(p.nivel_educativo_propio as never)) {
      return err('nivel_educativo_propio obligatorio y fuera de catálogo (sin "No lo sé")');
    }
    nivel_educativo_propio = p.nivel_educativo_propio as string;

    // Ocupación: obligatoria, texto libre no vacío, máx. 120.
    if (vacio(p.ocupacion)) return err('ocupacion es obligatoria para el público general');
    if (typeof p.ocupacion !== 'string' || p.ocupacion.trim().length > MAX_OCUPACION) {
      return err(`ocupacion debe ser texto de máximo ${MAX_OCUPACION} caracteres`);
    }
    ocupacion = p.ocupacion.trim();

    // Detalle y año del curso de Derecho: obligatorios solo si cohorte = general_si_curso.
    if (cohorte === 'general_si_curso') {
      if (vacio(p.curso_derecho_detalle)) return err('curso_derecho_detalle es obligatorio si cursó Derecho');
      if (typeof p.curso_derecho_detalle !== 'string' || p.curso_derecho_detalle.trim().length > MAX_CURSO_DERECHO_DETALLE) {
        return err(`curso_derecho_detalle debe ser texto de máximo ${MAX_CURSO_DERECHO_DETALLE} caracteres`);
      }
      curso_derecho_detalle = p.curso_derecho_detalle.trim();

      if (vacio(p.curso_derecho_anio)) return err('curso_derecho_anio es obligatorio si cursó Derecho');
      const anio = Number(p.curso_derecho_anio);
      if (!Number.isInteger(anio) || anio < MIN_ANIO_DERECHO || anio > MAX_ANIO_DERECHO) {
        return err(`curso_derecho_anio debe ser un año entre ${MIN_ANIO_DERECHO} y ${MAX_ANIO_DERECHO}`);
      }
      curso_derecho_anio = anio;
    } else {
      // general_no_curso: no deben traer detalle ni año.
      if (!vacio(p.curso_derecho_detalle)) return err('curso_derecho_detalle no aplica cuando no se cursó Derecho');
      if (!vacio(p.curso_derecho_anio)) return err('curso_derecho_anio no aplica cuando no se cursó Derecho');
    }
  } else {
    // escolar: los campos exclusivos de general no deben venir.
    if (!vacio(p.nivel_educativo_propio)) return err('nivel_educativo_propio no aplica al flujo escolar');
    if (!vacio(p.ocupacion)) return err('ocupacion no aplica al flujo escolar');
    if (!vacio(p.curso_derecho_detalle)) return err('curso_derecho_detalle no aplica al flujo escolar');
    if (!vacio(p.curso_derecho_anio)) return err('curso_derecho_anio no aplica al flujo escolar');
  }

  // Duración (metadato opcional).
  let duracion_segundos: number | null = null;
  if (!vacio(p.duracion_segundos)) {
    if (!Number.isInteger(p.duracion_segundos) || (p.duracion_segundos as number) < 0) {
      return err('duracion_segundos debe ser un entero no negativo');
    }
    duracion_segundos = p.duracion_segundos as number;
  }

  return {
    ok: true,
    limpio: {
      acepto_aviso: true,
      cohorte,
      edad: p.edad as number,
      genero: p.genero as string,
      se_considera_indigena: p.se_considera_indigena as string,
      se_considera_afro: p.se_considera_afro as string,
      nivel_educativo_padre: p.nivel_educativo_padre as string,
      nivel_educativo_madre: p.nivel_educativo_madre as string,
      entidad: p.entidad as string,
      nivel_educativo_propio,
      ocupacion,
      curso_derecho_detalle,
      curso_derecho_anio,
      items,
      duracion_segundos,
    },
  };
}
