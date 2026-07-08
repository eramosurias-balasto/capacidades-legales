'use client';

import { ReactNode } from 'react';

// Primitivas Tailwind del dashboard (aisladas; no comparten estilos con la encuesta pública).

export function Card({ title, subtitle, children, className = '' }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {title ? <h3 className="text-sm font-semibold text-slate-800">{title}</h3> : null}
      {subtitle ? <p className="mb-2 text-xs text-slate-500">{subtitle}</p> : null}
      {title && !subtitle ? <div className="mb-2" /> : null}
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function Tabs({ tabs, activo, onChange }: { tabs: { id: string; label: string }[]; activo: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activo === t.id ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({ opciones, valor, onChange }: { opciones: { valor: T; label: string }[]; valor: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5">
      {opciones.map((o) => (
        <button
          key={o.valor}
          onClick={() => onChange(o.valor)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            valor === o.valor ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Select({ valor, onChange, opciones }: { valor: string; onChange: (v: string) => void; opciones: { valor: string; label: string }[] }) {
  return (
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
    >
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TablaFrecuencia({ titulo, filas }: { titulo: string; filas: { etiqueta: string; n: number }[] }) {
  const total = filas.reduce((a, f) => a + f.n, 0);
  return (
    <Card title={titulo}>
      <table className="w-full text-sm">
        <tbody>
          {filas.map((f) => (
            <tr key={f.etiqueta} className="border-t border-slate-100">
              <td className="py-1.5 pr-2 text-slate-700">{f.etiqueta}</td>
              <td className="w-12 py-1.5 text-right tabular-nums font-medium text-slate-900">{f.n}</td>
              <td className="w-14 py-1.5 text-right text-xs text-slate-400">
                {total > 0 ? `${Math.round((f.n / total) * 100)}%` : '—'}
              </td>
            </tr>
          ))}
          {filas.length === 0 ? (
            <tr>
              <td className="py-2 text-slate-400" colSpan={3}>
                Sin datos.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </Card>
  );
}

export function AvisoPrudencia() {
  return (
    <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
      Las comparaciones muestran <strong>diferencias observables</strong> entre grupos; no implican
      relaciones causales. La muestra general es de conveniencia y se reporta por separado.
    </p>
  );
}
