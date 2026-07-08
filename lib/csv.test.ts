import { describe, it, expect } from 'vitest';
import { construirCsvMaestro, construirCsvRasch, COLUMNAS_DIF } from './csv';
import type { Institucion, Respuesta } from './database.types';

const instituciones: Institucion[] = [
  { id: 1, slug: 'inst-a', nombre: 'Institución A', activa: true, tipo: 'escolar' },
];

// Respuesta conocida (misma verificada end-to-end): brutas esperadas
// eaj 15/76.5, eal 3/26.7, clg 10/56.5, iaj 21/71.8, dpj 12/64.2.
const respuesta: Respuesta = {
  id: 'resp-1',
  institucion_id: 1,
  creada_en: '2026-07-08T20:40:26.000Z',
  acepto_aviso: true,
  cohorte: 'curso_primavera_2026',
  edad: 17,
  genero: 'hombre',
  se_considera_indigena: 'no',
  se_considera_afro: 'no',
  nivel_educativo_padre: 'posgrado',
  nivel_educativo_madre: 'licenciatura',
  nivel_educativo_propio: null,
  ocupacion: null,
  curso_derecho_detalle: null,
  items: {
    eaj: [2, 2, 2, 3, 3, 3],
    eal: [0, 0, 1, 2],
    clg: [1, 2, 1, 1, 1, 2],
    iaj: [3, 0, 0, 2, 0, 3, 0, 3, 1],
    dpj: [0, 1, 3, 2, 1, 1],
  },
  eaj_bruta: 15, eaj_rasch: 76.5,
  eal_bruta: 3, eal_rasch: 26.7,
  clg_bruta: 10, clg_rasch: 56.5,
  iaj_bruta: 21, iaj_rasch: 71.8,
  dpj_bruta: 12, dpj_rasch: 64.2,
  duracion_segundos: 534,
  user_agent: 'test-agent',
};

function parse(csv: string) {
  const [head, ...rows] = csv.split('\n');
  const cols = head.split(',');
  return rows.map((r) => {
    const vals = r.split(',');
    const o: Record<string, string> = {};
    cols.forEach((c, i) => (o[c] = vals[i]));
    return o;
  });
}

describe('CSV maestro', () => {
  const filas = parse(construirCsvMaestro([respuesta], instituciones));
  const f = filas[0];

  it('incluye metadatos y tipo/slug de la institución', () => {
    expect(f.tipo).toBe('escolar');
    expect(f.institucion_slug).toBe('inst-a');
    expect(f.cohorte).toBe('curso_primavera_2026');
    expect(f.edad).toBe('17');
  });

  it('reproduce las brutas y Rasch de la respuesta conocida', () => {
    expect(f.eaj_bruta).toBe('15');
    expect(f.eaj_rasch).toBe('76.5');
    expect(f.eal_rasch).toBe('26.7');
    expect(f.clg_bruta).toBe('10');
    expect(f.iaj_bruta).toBe('21');
    expect(f.iaj_rasch).toBe('71.8');
    expect(f.dpj_rasch).toBe('64.2');
  });

  it('guarda crudo y recodificado por ítem (incl. reglas especiales)', () => {
    expect(f.eaj_i1_crudo).toBe('2');
    expect(f.eaj_i1_recod).toBe('2'); // directo
    expect(f.clg_i1_crudo).toBe('1');
    expect(f.clg_i1_recod).toBe('2'); // 3 - 1
    expect(f.iaj_i5_crudo).toBe('0');
    expect(f.iaj_i5_recod).toBe('2'); // regla especial ítem 5
    expect(f.dpj_i3_crudo).toBe('3');
    expect(f.dpj_i3_recod).toBe('3'); // directo
  });
});

describe('CSV export-rasch', () => {
  const csv = construirCsvRasch('iaj', [respuesta], instituciones);
  const [head, fila] = csv.split('\n');

  it('tiene las columnas dif_* exactas y luego q1…q9', () => {
    expect(head).toBe([...COLUMNAS_DIF, 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'].join(','));
  });

  it('escribe dif_* correctos (institución = slug, tipo, cohorte, genero, edad)', () => {
    const v = fila.split(',');
    expect(v.slice(0, 5)).toEqual(['escolar', 'curso_primavera_2026', 'hombre', 'inst-a', '17']);
  });

  it('los q son el recodificado (mínimo 0; ítem 5 colapsado)', () => {
    const v = fila.split(',').slice(5).map(Number);
    // iaj [3,0,0,2,0,3,0,3,1] -> [3,3,3,2,2,3,0,3,2]
    expect(v).toEqual([3, 3, 3, 2, 2, 3, 0, 3, 2]);
    expect(Math.min(...v)).toBe(0);
  });
});
