import { describe, it, expect } from 'vitest';
import { recodeItem, puntuarEscala, puntuarRespuesta, RASCH } from './scoring';
import { NUM_ITEMS, ORDEN_ESCALAS } from './instrumento';

// Todos los valores esperados fueron calculados a mano contra el SPEC §6.

describe('RASCH: longitud de las tablas = bruta máxima + 1', () => {
  // EAJ/CLG/DPJ: 6 ítems × 3 = 18 → 19 valores. EAL: 4×3=12 → 13.
  // IAJ: 8 ítems × 3 + ítem 5 (máx 2) = 26 → 27 valores.
  const esperado: Record<string, number> = { eaj: 19, eal: 13, clg: 19, iaj: 27, dpj: 19 };
  for (const id of ORDEN_ESCALAS) {
    it(`${id} tiene ${esperado[id]} valores`, () => {
      expect(RASCH[id]).toHaveLength(esperado[id]);
      expect(RASCH[id][0]).toBe(0.0);
      expect(RASCH[id][RASCH[id].length - 1]).toBe(100.0);
    });
  }
});

describe('EAJ (captura directa)', () => {
  it('todo 0 → bruta 0, rasch 0', () => {
    expect(puntuarEscala('eaj', [0, 0, 0, 0, 0, 0])).toMatchObject({ bruta: 0, rasch: 0.0 });
  });
  it('todo 3 → bruta 18, rasch 100', () => {
    expect(puntuarEscala('eaj', [3, 3, 3, 3, 3, 3])).toMatchObject({ bruta: 18, rasch: 100.0 });
  });
  it('mixto [0,1,2,3,3,2] → bruta 11, rasch 50.2', () => {
    const r = puntuarEscala('eaj', [0, 1, 2, 3, 3, 2]);
    expect(r.porItem).toEqual([0, 1, 2, 3, 3, 2]);
    expect(r).toMatchObject({ bruta: 11, rasch: 50.2 });
  });
});

describe('EAL (captura directa, 4 ítems)', () => {
  it('todo 0 → bruta 0, rasch 0', () => {
    expect(puntuarEscala('eal', [0, 0, 0, 0])).toMatchObject({ bruta: 0, rasch: 0.0 });
  });
  it('todo 3 → bruta 12, rasch 100', () => {
    expect(puntuarEscala('eal', [3, 3, 3, 3])).toMatchObject({ bruta: 12, rasch: 100.0 });
  });
  it('mixto [3,2,1,0] → bruta 6, rasch 45.2', () => {
    expect(puntuarEscala('eal', [3, 2, 1, 0])).toMatchObject({ bruta: 6, rasch: 45.2 });
  });
});

describe('CLG (invertida: puntaje = 3 − índice)', () => {
  it('todo 0 (muy seguro) → bruta 18, rasch 100', () => {
    const r = puntuarEscala('clg', [0, 0, 0, 0, 0, 0]);
    expect(r.porItem).toEqual([3, 3, 3, 3, 3, 3]);
    expect(r).toMatchObject({ bruta: 18, rasch: 100.0 });
  });
  it('todo 3 (nada seguro) → bruta 0, rasch 0', () => {
    expect(puntuarEscala('clg', [3, 3, 3, 3, 3, 3])).toMatchObject({ bruta: 0, rasch: 0.0 });
  });
  it('mixto [0,1,2,3,0,1] → bruta 11, rasch 61.9', () => {
    const r = puntuarEscala('clg', [0, 1, 2, 3, 0, 1]);
    expect(r.porItem).toEqual([3, 2, 1, 0, 3, 2]);
    expect(r).toMatchObject({ bruta: 11, rasch: 61.9 });
  });
});

describe('IAJ (inversiones 2,3,9 + regla especial ítem 5)', () => {
  it('todo 0 (acuerdo total) → bruta 11, rasch 44.8', () => {
    // directos 1,4,6,7,8 = 0; invertidos 2,3,9 = 3; ítem 5 (raw 0) = 2.
    const r = puntuarEscala('iaj', [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(r.porItem).toEqual([0, 3, 3, 0, 2, 0, 0, 0, 3]);
    expect(r).toMatchObject({ bruta: 11, rasch: 44.8 });
  });
  it('todo 3 (desacuerdo total) → bruta 15, rasch 54.6', () => {
    const r = puntuarEscala('iaj', [3, 3, 3, 3, 3, 3, 3, 3, 3]);
    expect(r.porItem).toEqual([3, 0, 0, 3, 0, 3, 3, 3, 0]);
    expect(r).toMatchObject({ bruta: 15, rasch: 54.6 });
  });
  it('bruta máxima 26 → rasch 100', () => {
    // ítems 1,4,6,7,8 en desacuerdo (raw 3 → 3); 2,3,9 en acuerdo (raw 0 → 3); ítem 5 raw 0 → 2.
    const r = puntuarEscala('iaj', [3, 0, 0, 3, 0, 3, 3, 3, 0]);
    expect(r.porItem).toEqual([3, 3, 3, 3, 2, 3, 3, 3, 3]);
    expect(r).toMatchObject({ bruta: 26, rasch: 100.0 });
  });
  it('regla especial ítem 5: raw 0→2, 1→1, 2→0, 3→0', () => {
    expect(recodeItem('iaj', 4, 0)).toBe(2);
    expect(recodeItem('iaj', 4, 1)).toBe(1);
    expect(recodeItem('iaj', 4, 2)).toBe(0);
    expect(recodeItem('iaj', 4, 3)).toBe(0);
  });
});

describe('DPJ (inversiones 1,2,4,5; directos 3,6)', () => {
  it('todo 0 (acuerdo total) → bruta 12, rasch 64.2', () => {
    const r = puntuarEscala('dpj', [0, 0, 0, 0, 0, 0]);
    expect(r.porItem).toEqual([3, 3, 0, 3, 3, 0]);
    expect(r).toMatchObject({ bruta: 12, rasch: 64.2 });
  });
  it('todo 3 (desacuerdo total) → bruta 6, rasch 37.4', () => {
    const r = puntuarEscala('dpj', [3, 3, 3, 3, 3, 3]);
    expect(r.porItem).toEqual([0, 0, 3, 0, 0, 3]);
    expect(r).toMatchObject({ bruta: 6, rasch: 37.4 });
  });
  it('mixto [0,3,3,0,3,0] → bruta 9, rasch 51.3 (verifica directos 3 y 6)', () => {
    const r = puntuarEscala('dpj', [0, 3, 3, 0, 3, 0]);
    // ítem 3 (raw 3, directo) = 3; ítem 6 (raw 0, directo) = 0.
    expect(r.porItem).toEqual([3, 0, 3, 3, 0, 0]);
    expect(r).toMatchObject({ bruta: 9, rasch: 51.3 });
  });
});

describe('validaciones', () => {
  it('rechaza índice fuera de 0–3', () => {
    expect(() => recodeItem('eaj', 0, 4)).toThrow(RangeError);
    expect(() => recodeItem('eaj', 0, -1)).toThrow(RangeError);
    expect(() => recodeItem('eaj', 0, 1.5)).toThrow(RangeError);
  });
  it('rechaza longitud incorrecta de escala', () => {
    expect(() => puntuarEscala('eaj', [0, 0, 0])).toThrow(RangeError);
    expect(() => puntuarEscala('iaj', new Array(NUM_ITEMS.iaj + 1).fill(0))).toThrow(RangeError);
  });
});

describe('puntuarRespuesta integra las cinco escalas', () => {
  it('respuesta en cero devuelve las cinco brutas mínimas correctas', () => {
    const r = puntuarRespuesta({
      eaj: [0, 0, 0, 0, 0, 0],
      eal: [0, 0, 0, 0],
      clg: [0, 0, 0, 0, 0, 0],
      iaj: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      dpj: [0, 0, 0, 0, 0, 0],
    });
    expect(r.eaj.bruta).toBe(0);
    expect(r.eal.bruta).toBe(0);
    expect(r.clg.bruta).toBe(18); // CLG invertida
    expect(r.iaj.bruta).toBe(11);
    expect(r.dpj.bruta).toBe(12);
  });
});
