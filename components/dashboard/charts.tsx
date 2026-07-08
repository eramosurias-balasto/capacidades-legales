'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BinHistograma, EstatGrupo, ItemDist } from '@/lib/dashboard-data';

// Paleta sobria (4 categorías Likert).
const CAT_COLORS = ['#1e293b', '#475569', '#94a3b8', '#cbd5e1'];
const ACENTO = '#334155';

export function LineaPorDia({ data }: { data: { fecha: string; escolar: number; general: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="escolar" name="Escolar" stroke={ACENTO} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="general" name="General" stroke="#94a3b8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Histograma({ bins }: { bins: BinHistograma[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={bins} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={44} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="conteo" name="Respuestas" fill={ACENTO} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Barras de media Rasch por grupo, con barra de error = ±DE. */
export function BarrasComparacion({ grupos }: { grupos: EstatGrupo[] }) {
  const data = grupos.map((g) => ({ etiqueta: g.etiqueta, media: g.media, n: g.n, de: g.de, err: g.de }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={48} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="media" name="Media Rasch (0–100)" fill={ACENTO} radius={[3, 3, 0, 0]}>
          <ErrorBar dataKey="err" width={4} strokeWidth={1.5} stroke="#94a3b8" direction="y" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Barras apiladas: distribución de las 4 categorías por ítem. */
export function BarrasApiladasItem({ items, categorias }: { items: ItemDist[]; categorias: string[] }) {
  const data = items.map((it) => ({
    item: `${it.num}`,
    c0: it.conteos[0],
    c1: it.conteos[1],
    c2: it.conteos[2],
    c3: it.conteos[3],
  }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, items.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="item" tick={{ fontSize: 11 }} width={24} />
        <Tooltip />
        <Legend />
        {[0, 1, 2, 3].map((k) => (
          <Bar key={k} dataKey={`c${k}`} name={categorias[k]} stackId="a" fill={CAT_COLORS[k]}>
            {k === 0 ? data.map((_, i) => <Cell key={i} />) : null}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
