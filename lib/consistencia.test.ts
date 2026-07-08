import { describe, it, expect } from 'vitest';
import { construirResultados } from './dashboard-data';
import { construirCsvMaestro, construirCsvRasch } from './csv';
import { RASCH } from './scoring';
import { ORDEN_ESCALAS, NUM_ITEMS, EscalaId } from './instrumento';
import type { Institucion, ItemsCrudos, Respuesta } from './database.types';

// QA §3: 5 respuestas variadas (mezcla escolar/general). Verifica que Resumen, histogramas,
// Nivel ítem, CSV maestro y CSV export-rasch cuadren ENTRE SÍ (mismas funciones que el dashboard).

const instituciones: Institucion[] = [
  { id: 1, slug: 'inst-a', nombre: 'Institución A', activa: true, tipo: 'escolar' },
  { id: 2, slug: 'inst-b', nombre: 'Institución B', activa: true, tipo: 'escolar' },
  { id: 3, slug: 'inst-c', nombre: 'Institución C', activa: true, tipo: 'escolar' },
  { id: 4, slug: 'general', nombre: 'General', activa: true, tipo: 'general' },
];

function resp(over: Partial<Respuesta> & { institucion_id: number; cohorte: Respuesta['cohorte']; items: ItemsCrudos }): Respuesta {
  return {
    id: crypto.randomUUID(),
    creada_en: '2026-07-08T10:00:00.000Z',
    acepto_aviso: true,
    edad: 17,
    genero: 'mujer',
    se_considera_indigena: 'no',
    se_considera_afro: 'no',
    nivel_educativo_padre: 'secundaria',
    nivel_educativo_madre: 'primaria',
    entidad: 'Jalisco',
    nivel_educativo_propio: null,
    ocupacion: null,
    curso_derecho_detalle: null,
    curso_derecho_anio: null,
    eaj_bruta: null, eaj_rasch: null, eal_bruta: null, eal_rasch: null, clg_bruta: null, clg_rasch: null,
    iaj_bruta: null, iaj_rasch: null, dpj_bruta: null, dpj_rasch: null,
    duracion_segundos: 100, user_agent: 'qa',
    ...over,
  };
}

const it0 = (): ItemsCrudos => ({ eaj: [0, 0, 0, 0, 0, 0], eal: [0, 0, 0, 0], clg: [0, 0, 0, 0, 0, 0], iaj: [0, 0, 0, 0, 0, 0, 0, 0, 0], dpj: [0, 0, 0, 0, 0, 0] });
const it3 = (): ItemsCrudos => ({ eaj: [3, 3, 3, 3, 3, 3], eal: [3, 3, 3, 3], clg: [3, 3, 3, 3, 3, 3], iaj: [3, 3, 3, 3, 3, 3, 3, 3, 3], dpj: [3, 3, 3, 3, 3, 3] });
const itMix = (): ItemsCrudos => ({ eaj: [0, 1, 2, 3, 2, 1], eal: [1, 2, 3, 0], clg: [0, 1, 2, 3, 1, 2], iaj: [3, 0, 1, 2, 0, 3, 1, 2, 0], dpj: [0, 3, 2, 1, 3, 0] });

const respuestas: Respuesta[] = [
  resp({ institucion_id: 1, cohorte: 'curso_primavera_2026', items: it0(), creada_en: '2026-07-08T09:00:00Z' }),
  resp({ institucion_id: 2, cohorte: 'cursara_otono_2026', items: it3(), genero: 'hombre', creada_en: '2026-07-08T10:00:00Z' }),
  resp({ institucion_id: 3, cohorte: 'curso_primavera_2026', items: itMix(), creada_en: '2026-07-09T10:00:00Z' }),
  resp({ institucion_id: 4, cohorte: 'general_si_curso', items: itMix(), edad: 40, entidad: 'Ciudad de México', nivel_educativo_propio: 'licenciatura', ocupacion: 'Abogada', curso_derecho_detalle: 'Diplomado', curso_derecho_anio: 2015, creada_en: '2026-07-09T11:00:00Z' }),
  resp({ institucion_id: 4, cohorte: 'general_no_curso', items: it3(), edad: 55, entidad: 'Prefiero no responder', nivel_educativo_propio: 'posgrado', ocupacion: 'Docente', creada_en: '2026-07-10T10:00:00Z' }),
];

const R = construirResultados(respuestas, instituciones);
const maestro = parseCsv(construirCsvMaestro(respuestas, instituciones));

function parseCsv(csv: string) {
  const [head, ...rows] = csv.split('\n');
  const cols = head.split(',');
  return rows.map((r) => {
    const vals = r.split(',');
    const o: Record<string, string> = {};
    cols.forEach((c, i) => (o[c] = vals[i]));
    return o;
  });
}

describe('QA consistencia: Resumen', () => {
  it('n totales y por tipo cuadran', () => {
    expect(R.totalN).toBe(5);
    expect(R.porTipo).toEqual({ escolar: 3, general: 2 });
    expect(R.instituciones.reduce((a, i) => a + i.n, 0)).toBe(5);
  });
  it('por cohorte (4 valores) suma el total', () => {
    expect(R.porCohorte.reduce((a, c) => a + c.n, 0)).toBe(5);
  });
  it('respuestas por día separan escolar/general y suman correcto', () => {
    const tot = R.porDia.reduce((a, d) => a + d.escolar + d.general, 0);
    expect(tot).toBe(5);
  });
});

describe('QA consistencia: histogramas y nivel ítem', () => {
  for (const e of ORDEN_ESCALAS) {
    it(`${e}: histograma y n por tipo cuadran con la muestra`, () => {
      expect(R.escalas[e].escolar.n).toBe(3);
      expect(R.escalas[e].general.n).toBe(2);
      expect(R.escalas[e].escolar.histograma.reduce((a, b) => a + b.conteo, 0)).toBe(3);
      expect(R.escalas[e].general.histograma.reduce((a, b) => a + b.conteo, 0)).toBe(2);
    });
    it(`${e}: nivel ítem — cada ítem suma n de su tipo`, () => {
      for (const it of R.nivelItem[e].escolar) expect(it.conteos.reduce((a, b) => a + b, 0)).toBe(3);
      for (const it of R.nivelItem[e].general) expect(it.conteos.reduce((a, b) => a + b, 0)).toBe(2);
    });
  }
});

describe('QA consistencia: CSV maestro', () => {
  it('un renglón por respuesta e incluye entidad y curso_derecho_anio', () => {
    expect(maestro).toHaveLength(5);
    expect(maestro[3].entidad).toBe('Ciudad de México');
    expect(maestro[3].curso_derecho_anio).toBe('2015');
    expect(maestro[4].entidad).toBe('Prefiero no responder');
    expect(maestro[0].curso_derecho_anio).toBe(''); // escolar → null
  });
  it('bruta = suma de recodificados y rasch = tabla P&B, por escala', () => {
    maestro.forEach((fila) => {
      for (const e of ORDEN_ESCALAS) {
        const recod = Array.from({ length: NUM_ITEMS[e] }, (_, i) => Number(fila[`${e}_i${i + 1}_recod`]));
        const bruta = Number(fila[`${e}_bruta`]);
        expect(recod.reduce((a, b) => a + b, 0)).toBe(bruta);
        expect(Number(fila[`${e}_rasch`])).toBe(RASCH[e][bruta]);
      }
    });
  });
});

describe('QA consistencia: CSV export-rasch cuadra con el maestro', () => {
  for (const e of ORDEN_ESCALAS) {
    it(`${e}: dif_* presentes y q1..qN = recodificado (sum = bruta del maestro; min 0)`, () => {
      const csv = construirCsvRasch(e as EscalaId, respuestas, instituciones);
      const [head, ...rows] = csv.split('\n');
      expect(head.split(',').slice(0, 5)).toEqual(['dif_tipo', 'dif_cohorte', 'dif_genero', 'dif_institucion', 'dif_edad']);
      rows.forEach((row, idx) => {
        const vals = row.split(',');
        const qs = vals.slice(5).map(Number);
        expect(qs).toHaveLength(NUM_ITEMS[e]);
        expect(Math.min(...qs)).toBeGreaterThanOrEqual(0);
        // La suma de q (rasch) debe igualar la bruta del maestro para ese renglón/escala.
        expect(qs.reduce((a, b) => a + b, 0)).toBe(Number(maestro[idx][`${e}_bruta`]));
        // dif_institucion = slug; dif_tipo coherente.
        expect(['inst-a', 'inst-b', 'inst-c', 'general']).toContain(vals[3]);
      });
    });
  }
});
