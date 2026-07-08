// Puntuación de las cinco escalas (SPEC §6). SE EJECUTA EN EL SERVIDOR.
//
// Convención de captura: en `items` se guarda el índice 0–3 de la opción elegida, en el
// orden en que la categoría aparece en lib/instrumento.ts (SIN invertir). Aquí se aplican
// las recodificaciones e inversiones para obtener el puntaje por ítem, la puntuación bruta
// y su conversión Rasch P&B (0–100).
//
// Guardar el crudo permite recalibrar Rasch después (ver DECISIONES.md D3).

import { EscalaId, NUM_ITEMS } from './instrumento';

/**
 * Tablas de conversión Rasch de Pleasence & Balmer (2018).
 * Índice del arreglo = puntuación bruta; valor = puntuación 0–100.
 * Copiadas literalmente del SPEC §6.
 */
export const RASCH: Record<EscalaId, number[]> = {
  eaj: [0.0, 7.4, 13.2, 17.7, 21.7, 25.5, 29.1, 32.6, 36.2, 40.1, 44.6, 50.2, 57.7, 65.3, 71.2, 76.5, 82.3, 89.9, 100.0],
  eal: [0.0, 11.1, 19.8, 26.7, 32.8, 38.9, 45.2, 52.2, 60.3, 69.1, 78.1, 88.4, 100.0],
  clg: [0.0, 9.4, 17.0, 23.3, 28.9, 34.3, 38.4, 42.7, 47.0, 51.5, 56.5, 61.9, 67.2, 72.1, 76.7, 81.2, 86.1, 92.3, 100.0],
  iaj: [0.0, 9.3, 16.2, 21.2, 25.2, 28.7, 31.8, 34.6, 37.3, 39.9, 42.4, 44.8, 47.3, 49.7, 52.2, 54.6, 57.2, 59.9, 62.6, 65.5, 68.6, 71.8, 75.4, 79.5, 84.3, 91.0, 100.0],
  dpj: [0.0, 9.9, 17.5, 23.2, 28.2, 32.8, 37.4, 42.0, 46.6, 51.3, 55.7, 60.0, 64.2, 68.4, 72.8, 77.5, 83.0, 90.3, 100.0],
};

/**
 * Recodifica un ítem crudo (índice 0–3) al puntaje del ítem según la regla de su escala.
 * `itemIndex` es 0-based dentro de la escala.
 *
 * Reglas del SPEC §6:
 * - EAJ / EAL: puntaje = índice (captura directa).
 * - CLG: puntaje = 3 − índice (muy seguro=3 … nada seguro=0).
 * - IAJ: ítems 1,4,6,7,8 = índice; ítems 2,3,9 = 3 − índice;
 *        ítem 5 (regla especial): [ac.total=2, ac.mayor=1, desac.mayor=0, desac.total=0].
 * - DPJ: ítems 1,2,4,5 = 3 − índice; ítems 3,6 = índice.
 */
export function recodeItem(escala: EscalaId, itemIndex: number, raw: number): number {
  if (!Number.isInteger(raw) || raw < 0 || raw > 3) {
    throw new RangeError(`Valor de ítem fuera de rango 0–3: ${raw} (${escala}[${itemIndex}])`);
  }
  const n = itemIndex + 1; // posición 1-based, para leer las reglas como en el SPEC

  switch (escala) {
    case 'eaj':
    case 'eal':
      return raw;

    case 'clg':
      return 3 - raw;

    case 'iaj':
      if (n === 5) {
        // Regla especial: colapsa las dos categorías de desacuerdo en 0 (SPEC §6, D3).
        return [2, 1, 0, 0][raw];
      }
      // Acuerdo → mayor inaccesibilidad en 2,3,9 (invertidos); directo en 1,4,6,7,8.
      return [2, 3, 9].includes(n) ? 3 - raw : raw;

    case 'dpj':
      // Acuerdo → mayor desigualdad en 1,2,4,5 (invertidos); directo en 3,6.
      return [3, 6].includes(n) ? raw : 3 - raw;
  }
}

export interface PuntajeEscala {
  /** Puntaje por ítem ya recodificado, en orden. */
  porItem: number[];
  /** Puntuación bruta (suma de puntajes por ítem). */
  bruta: number;
  /** Puntuación Rasch P&B (0–100) correspondiente a la bruta. */
  rasch: number;
}

/**
 * Puntúa una escala completa a partir de sus ítems crudos (índices 0–3, en orden de captura).
 * Valida la longitud contra NUM_ITEMS y devuelve puntajes por ítem, bruta y Rasch.
 */
export function puntuarEscala(escala: EscalaId, raw: number[]): PuntajeEscala {
  const esperado = NUM_ITEMS[escala];
  if (raw.length !== esperado) {
    throw new RangeError(`La escala ${escala} espera ${esperado} ítems, recibió ${raw.length}`);
  }
  const porItem = raw.map((v, i) => recodeItem(escala, i, v));
  const bruta = porItem.reduce((a, b) => a + b, 0);
  const tabla = RASCH[escala];
  if (bruta < 0 || bruta >= tabla.length) {
    throw new RangeError(`Bruta ${bruta} fuera del rango de la tabla Rasch de ${escala} (0–${tabla.length - 1})`);
  }
  return { porItem, bruta, rasch: tabla[bruta] };
}

/** Resultado de puntuar las cinco escalas de una respuesta. */
export type PuntajesRespuesta = Record<EscalaId, PuntajeEscala>;

/**
 * Puntúa una respuesta completa (los cinco arreglos de ítems crudos).
 * `items` viene con la forma {"eaj":[...],"eal":[...],"clg":[...],"iaj":[...],"dpj":[...]}.
 */
export function puntuarRespuesta(items: Record<EscalaId, number[]>): PuntajesRespuesta {
  return {
    eaj: puntuarEscala('eaj', items.eaj),
    eal: puntuarEscala('eal', items.eal),
    clg: puntuarEscala('clg', items.clg),
    iaj: puntuarEscala('iaj', items.iaj),
    dpj: puntuarEscala('dpj', items.dpj),
  };
}
