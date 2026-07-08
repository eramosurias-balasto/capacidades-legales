import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { recodeItem } from './scoring';
import { ESCALAS, ORDEN_ESCALAS, NUM_ITEMS, EscalaId } from './instrumento';

// Ata la lógica SQL de la vista respuestas_por_item (migración 0002) a lib/scoring.ts.
//
// Parte 1: un espejo JS del CASE de la vista se compara EXHAUSTIVAMENTE (todas las escalas,
//          todos los ítems, valores 0..3) contra recodeItem. Si §6 cambia en scoring.ts sin
//          actualizar la vista, esto falla.
// Parte 2: se leen los valores esperados del script runnable
//          (supabase/verificacion/0002_verifica_vista.sql) y se revalidan contra scoring.ts,
//          de modo que un PASS del script en Supabase signifique vista == scoring.ts.

// --- Espejo del CASE de la vista (debe reflejar 0002_constraint_y_vista.sql) ---
function recodeVistaSQL(escala: EscalaId, numItem: number /* 1-based */, valorCrudo: number): number {
  switch (escala) {
    case 'eaj':
    case 'eal':
      return valorCrudo;
    case 'clg':
      return 3 - valorCrudo;
    case 'iaj':
      if ([1, 4, 6, 7, 8].includes(numItem)) return valorCrudo;
      if ([2, 3, 9].includes(numItem)) return 3 - valorCrudo;
      // num_item === 5
      return { 0: 2, 1: 1, 2: 0, 3: 0 }[valorCrudo as 0 | 1 | 2 | 3];
    case 'dpj':
      if ([1, 2, 4, 5].includes(numItem)) return 3 - valorCrudo;
      return valorCrudo; // 3, 6
  }
}

function etiquetaVistaSQL(escala: EscalaId, valorCrudo: number): string {
  if (escala === 'eaj' || escala === 'eal')
    return ['nada cierto', 'casi nada cierto', 'moderadamente cierto', 'totalmente cierto'][valorCrudo];
  if (escala === 'clg')
    return ['muy seguro', 'bastante seguro', 'no muy seguro', 'nada seguro'][valorCrudo];
  return ['totalmente de acuerdo', 'mayoritariamente de acuerdo', 'mayoritariamente en desacuerdo', 'totalmente en desacuerdo'][valorCrudo];
}

describe('Parte 1: el CASE de la vista == lib/scoring.ts (exhaustivo)', () => {
  for (const escala of ORDEN_ESCALAS) {
    it(`${escala}: recode idéntico para todos los ítems × valores 0..3`, () => {
      for (let numItem = 1; numItem <= NUM_ITEMS[escala]; numItem++) {
        for (let v = 0; v <= 3; v++) {
          expect(recodeVistaSQL(escala, numItem, v)).toBe(recodeItem(escala, numItem - 1, v));
        }
      }
    });

    it(`${escala}: etiquetas de la vista == categorías de instrumento.ts`, () => {
      for (let v = 0; v <= 3; v++) {
        expect(etiquetaVistaSQL(escala, v)).toBe(ESCALAS[escala].categorias[v]);
      }
    });
  }
});

describe('Parte 2: valores esperados del script SQL revalidados contra scoring.ts', () => {
  const sql = readFileSync(
    join(process.cwd(), 'supabase', 'verificacion', '0002_verifica_vista.sql'),
    'utf8',
  );

  // Filas esperadas: ('VERIF_x', 'esc', num, valor_crudo, puntaje)
  const filas = [
    ...sql.matchAll(/\('(VERIF_[ABC])',\s*'(eaj|eal|clg|iaj|dpj)',\s*(\d+),\s*(\d+),\s*(\d+)\)/g),
  ].map((m) => ({
    caso: m[1],
    escala: m[2] as EscalaId,
    numItem: Number(m[3]),
    valorCrudo: Number(m[4]),
    puntaje: Number(m[5]),
  }));

  // items sintéticos insertados por caso.
  const items: Record<string, Record<EscalaId, number[]>> = {};
  for (const m of sql.matchAll(/'(\{"eaj".*?\})'::jsonb,\s*'(VERIF_[ABC])'/g)) {
    items[m[2]] = JSON.parse(m[1]);
  }

  it('el script tiene 93 filas esperadas (31 ítems × 3 casos) y 3 casos de items', () => {
    expect(filas).toHaveLength(93);
    expect(Object.keys(items).sort()).toEqual(['VERIF_A', 'VERIF_B', 'VERIF_C']);
  });

  it('cada puntaje esperado coincide con recodeItem de scoring.ts', () => {
    for (const f of filas) {
      expect(recodeItem(f.escala, f.numItem - 1, f.valorCrudo)).toBe(f.puntaje);
    }
  });

  it('el valor_crudo esperado coincide con el ítem insertado en esa posición', () => {
    for (const f of filas) {
      expect(items[f.caso][f.escala][f.numItem - 1]).toBe(f.valorCrudo);
    }
  });
});
