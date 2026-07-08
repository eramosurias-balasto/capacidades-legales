// Agregaciones del dashboard (SPEC §7). Puro y testeable. REGLA DURA: escolar y general
// se calculan SIEMPRE por separado; nunca se agregan juntos.

import { EscalaId, ESCALAS, ORDEN_ESCALAS, NUM_ITEMS } from './instrumento';
import { puntuarRespuesta, PuntajesRespuesta } from './scoring';
import { media, mediana, desviacion, redondear } from './estadistica';
import {
  COHORTES_ESCOLAR,
  COHORTES_GENERAL,
  GENEROS,
  SI_NO_PNR,
  NIVELES_EDUCATIVOS_PADRES,
  NIVELES_EDUCATIVOS_PROPIO,
  ETIQUETAS_GENERO,
  ETIQUETAS_SI_NO_PNR,
  ETIQUETAS_NIVEL_EDUCATIVO,
  TipoInstitucion,
} from './catalogos';
import type { Institucion, Respuesta } from './database.types';

// Etiquetas de cohorte explícitas para el dashboard (más claras que "Sí"/"No").
const LABEL_COHORTE: Record<string, string> = {
  curso_primavera_2026: 'Cursó (primavera 2026)',
  cursara_otono_2026: 'Cursará (otoño 2026)',
  general_si_curso: 'Sí cursó Derecho',
  general_no_curso: 'No cursó Derecho',
};

export interface EstatGrupo {
  grupo: string;
  etiqueta: string;
  n: number;
  media: number;
  mediana: number;
  de: number;
}
export interface BinHistograma {
  etiqueta: string;
  desde: number;
  hasta: number;
  conteo: number;
}
export interface EscalaResumen {
  n: number;
  media: number;
  mediana: number;
  de: number;
  histograma: BinHistograma[];
  porCohorte: EstatGrupo[];
  porInstitucion?: EstatGrupo[]; // solo escolar
}
export interface EscalaBloque {
  escolar: EscalaResumen;
  general: EscalaResumen;
}
export interface ItemDist {
  num: number;
  texto: string;
  conteos: number[]; // longitud 4, en orden de captura
}
export interface NivelItemEscala {
  categorias: string[];
  escolar: ItemDist[];
  general: ItemDist[];
}
export interface FilaFrecuencia {
  valor: string;
  etiqueta: string;
  n: number;
}
export interface TablaFrecuencia {
  titulo: string;
  filas: FilaFrecuencia[];
}
export interface DemografiaTipo {
  genero: TablaFrecuencia;
  indigena: TablaFrecuencia;
  afro: TablaFrecuencia;
  nivelPadre: TablaFrecuencia;
  nivelMadre: TablaFrecuencia;
  edad: TablaFrecuencia;
  nivelPropio?: TablaFrecuencia; // solo general
  ocupacion?: TablaFrecuencia; // solo general
}
export interface ResultadosDashboard {
  generadoEn: string;
  totalN: number;
  porTipo: { escolar: number; general: number };
  instituciones: { id: number; slug: string; nombre: string; tipo: TipoInstitucion; n: number }[];
  porCohorte: { cohorte: string; etiqueta: string; n: number }[];
  porDia: { fecha: string; escolar: number; general: number }[];
  escalas: Record<EscalaId, EscalaBloque>;
  nivelItem: Record<EscalaId, NivelItemEscala>;
  demografia: { escolar: DemografiaTipo; general: DemografiaTipo };
}

function estadisticos(valores: number[]) {
  return {
    n: valores.length,
    media: redondear(media(valores), 1),
    mediana: redondear(mediana(valores), 1),
    de: redondear(desviacion(valores), 1),
  };
}

function histograma(valores: number[]): BinHistograma[] {
  const bins: BinHistograma[] = Array.from({ length: 10 }, (_, i) => ({
    etiqueta: `${i * 10}–${i * 10 + 10}`,
    desde: i * 10,
    hasta: i * 10 + 10,
    conteo: 0,
  }));
  for (const v of valores) {
    let idx = Math.floor(v / 10);
    if (idx > 9) idx = 9;
    if (idx < 0) idx = 0;
    bins[idx].conteo++;
  }
  return bins;
}

export function construirResultados(respuestas: Respuesta[], instituciones: Institucion[]): ResultadosDashboard {
  const instMap = new Map(instituciones.map((i) => [i.id, i]));
  const tipoDe = (r: Respuesta): TipoInstitucion => instMap.get(r.institucion_id)?.tipo ?? 'escolar';

  const punt = new WeakMap<Respuesta, PuntajesRespuesta>();
  for (const r of respuestas) punt.set(r, puntuarRespuesta(r.items));
  const rasch = (r: Respuesta, e: EscalaId) => punt.get(r)![e].rasch;

  const escolar = respuestas.filter((r) => tipoDe(r) === 'escolar');
  const general = respuestas.filter((r) => tipoDe(r) === 'general');

  // --- Instituciones con n ---
  const instituciones_n = instituciones
    .map((i) => ({
      id: i.id,
      slug: i.slug,
      nombre: i.nombre,
      tipo: i.tipo,
      n: respuestas.filter((r) => r.institucion_id === i.id).length,
    }))
    .sort((a, b) => (a.tipo === b.tipo ? a.nombre.localeCompare(b.nombre) : a.tipo.localeCompare(b.tipo)));

  // --- Por cohorte (4 valores) ---
  const porCohorte = [...COHORTES_ESCOLAR, ...COHORTES_GENERAL].map((c) => ({
    cohorte: c,
    etiqueta: LABEL_COHORTE[c] ?? c,
    n: respuestas.filter((r) => r.cohorte === c).length,
  }));

  // --- Respuestas por día (escolar vs general por separado) ---
  const dias = new Map<string, { escolar: number; general: number }>();
  for (const r of respuestas) {
    const fecha = r.creada_en.slice(0, 10); // YYYY-MM-DD
    const d = dias.get(fecha) ?? { escolar: 0, general: 0 };
    d[tipoDe(r)]++;
    dias.set(fecha, d);
  }
  const porDia = [...dias.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([fecha, d]) => ({ fecha, ...d }));

  // --- Puntuaciones por escala ---
  function resumen(rows: Respuesta[], e: EscalaId, cohortes: readonly string[], conInstitucion: boolean): EscalaResumen {
    const valores = rows.map((r) => rasch(r, e));
    const porCohorteEstat: EstatGrupo[] = cohortes.map((c) => {
      const sub = rows.filter((r) => r.cohorte === c).map((r) => rasch(r, e));
      return { grupo: c, etiqueta: LABEL_COHORTE[c] ?? c, ...estadisticos(sub) };
    });
    let porInstitucion: EstatGrupo[] | undefined;
    if (conInstitucion) {
      const ids = [...new Set(rows.map((r) => r.institucion_id))];
      porInstitucion = ids
        .map((id) => {
          const inst = instMap.get(id);
          const sub = rows.filter((r) => r.institucion_id === id).map((r) => rasch(r, e));
          return { grupo: inst?.slug ?? String(id), etiqueta: inst?.nombre ?? String(id), ...estadisticos(sub) };
        })
        .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta));
    }
    return { ...estadisticos(valores), histograma: histograma(valores), porCohorte: porCohorteEstat, porInstitucion };
  }

  const escalas = {} as Record<EscalaId, EscalaBloque>;
  for (const e of ORDEN_ESCALAS) {
    escalas[e] = {
      escolar: resumen(escolar, e, COHORTES_ESCOLAR, true),
      general: resumen(general, e, COHORTES_GENERAL, false),
    };
  }

  // --- Nivel ítem ---
  function itemsDist(rows: Respuesta[], e: EscalaId): ItemDist[] {
    return ESCALAS[e].items.map((texto, i) => {
      const conteos = [0, 0, 0, 0];
      for (const r of rows) {
        const v = r.items[e][i];
        if (v >= 0 && v <= 3) conteos[v]++;
      }
      return { num: i + 1, texto, conteos };
    });
  }
  const nivelItem = {} as Record<EscalaId, NivelItemEscala>;
  for (const e of ORDEN_ESCALAS) {
    nivelItem[e] = { categorias: ESCALAS[e].categorias, escolar: itemsDist(escolar, e), general: itemsDist(general, e) };
  }

  // --- Demografía ---
  function tablaCat(
    rows: Respuesta[],
    getKey: (r: Respuesta) => string | null,
    orden: readonly string[],
    etiquetas: Record<string, string>,
    titulo: string,
  ): TablaFrecuencia {
    return {
      titulo,
      filas: orden.map((v) => ({ valor: v, etiqueta: etiquetas[v] ?? v, n: rows.filter((r) => getKey(r) === v).length })),
    };
  }
  function tablaEdad(rows: Respuesta[]): TablaFrecuencia {
    const rangos: [string, number, number][] = [
      ['12–14', 12, 14],
      ['15–17', 15, 17],
      ['18–24', 18, 24],
      ['25–34', 25, 34],
      ['35–44', 35, 44],
      ['45–59', 45, 59],
      ['60+', 60, 200],
    ];
    return {
      titulo: 'Edad',
      filas: rangos.map(([lab, lo, hi]) => ({
        valor: lab,
        etiqueta: lab,
        n: rows.filter((r) => r.edad != null && r.edad >= lo && r.edad <= hi).length,
      })),
    };
  }
  function tablaOcupacion(rows: Respuesta[]): TablaFrecuencia {
    const m = new Map<string, number>();
    for (const r of rows) {
      const o = (r.ocupacion ?? '').trim();
      if (o) m.set(o, (m.get(o) ?? 0) + 1);
    }
    return {
      titulo: 'Ocupación',
      filas: [...m.entries()].sort((a, b) => b[1] - a[1]).map(([v, n]) => ({ valor: v, etiqueta: v, n })),
    };
  }
  function demografia(rows: Respuesta[], incluirGeneral: boolean): DemografiaTipo {
    const base: DemografiaTipo = {
      genero: tablaCat(rows, (r) => r.genero, GENEROS, ETIQUETAS_GENERO, 'Género'),
      indigena: tablaCat(rows, (r) => r.se_considera_indigena, SI_NO_PNR, ETIQUETAS_SI_NO_PNR, '¿Se considera indígena?'),
      afro: tablaCat(rows, (r) => r.se_considera_afro, SI_NO_PNR, ETIQUETAS_SI_NO_PNR, '¿Se considera afromexicano/a?'),
      nivelPadre: tablaCat(rows, (r) => r.nivel_educativo_padre, NIVELES_EDUCATIVOS_PADRES, ETIQUETAS_NIVEL_EDUCATIVO, 'Nivel educativo del padre'),
      nivelMadre: tablaCat(rows, (r) => r.nivel_educativo_madre, NIVELES_EDUCATIVOS_PADRES, ETIQUETAS_NIVEL_EDUCATIVO, 'Nivel educativo de la madre'),
      edad: tablaEdad(rows),
    };
    if (incluirGeneral) {
      base.nivelPropio = tablaCat(rows, (r) => r.nivel_educativo_propio, NIVELES_EDUCATIVOS_PROPIO, ETIQUETAS_NIVEL_EDUCATIVO, 'Nivel educativo propio');
      base.ocupacion = tablaOcupacion(rows);
    }
    return base;
  }

  return {
    generadoEn: new Date().toISOString(),
    totalN: respuestas.length,
    porTipo: { escolar: escolar.length, general: general.length },
    instituciones: instituciones_n,
    porCohorte,
    porDia,
    escalas,
    nivelItem,
    demografia: { escolar: demografia(escolar, false), general: demografia(general, true) },
  };
}
