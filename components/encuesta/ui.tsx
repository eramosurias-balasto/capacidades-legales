'use client';

import { ReactNode } from 'react';

// Piezas presentacionales reutilizables del flujo de encuesta. Diseño sobrio, mobile-first.

export function BarraProgreso({ actual, total }: { actual: number; total: number }) {
  const pct = total <= 1 ? 0 : Math.round((actual / (total - 1)) * 100);
  return (
    <div className="mb-6" aria-hidden>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-slate-800 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-xs text-slate-500">{pct}%</p>
    </div>
  );
}

export function Pregunta({
  titulo,
  ayuda,
  children,
}: {
  titulo: string;
  ayuda?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mb-6">
      <legend className="mb-2 block text-base font-medium text-slate-900">{titulo}</legend>
      {ayuda ? <p className="mb-3 text-sm text-slate-500">{ayuda}</p> : null}
      {children}
    </fieldset>
  );
}

export interface Opcion {
  valor: string;
  etiqueta: string;
}

/** Grupo de radios apilado (una opción por renglón), estilo tarjeta seleccionable. */
export function GrupoRadio({
  name,
  valor,
  opciones,
  onChange,
}: {
  name: string;
  valor: string;
  opciones: Opcion[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {opciones.map((o) => {
        const sel = valor === o.valor;
        return (
          <label
            key={o.valor}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
              sel ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.valor}
              checked={sel}
              onChange={() => onChange(o.valor)}
              className="sr-only"
            />
            <span
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                sel ? 'border-white' : 'border-slate-400'
              }`}
            >
              {sel ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </span>
            <span>{o.etiqueta}</span>
          </label>
        );
      })}
    </div>
  );
}

export function CampoNumero({
  id,
  valor,
  onChange,
  min,
  max,
  placeholder,
}: {
  id: string;
  valor: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={valor}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-slate-800 focus:outline-none"
    />
  );
}

export function CampoTexto({
  id,
  valor,
  onChange,
  maxLength,
  placeholder,
}: {
  id: string;
  valor: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <input
        id={id}
        type="text"
        value={valor}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-slate-800 focus:outline-none"
      />
      {maxLength ? (
        <p className="mt-1 text-right text-xs text-slate-400">
          {valor.length}/{maxLength}
        </p>
      ) : null}
    </div>
  );
}

export function MensajeError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}

export function BotonesNav({
  onAtras,
  onSiguiente,
  textoSiguiente = 'Siguiente',
  deshabilitado = false,
  ocupado = false,
}: {
  onAtras?: () => void;
  onSiguiente: () => void;
  textoSiguiente?: string;
  deshabilitado?: boolean;
  ocupado?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {onAtras ? (
        <button
          type="button"
          onClick={onAtras}
          className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Atrás
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onSiguiente}
        disabled={deshabilitado || ocupado}
        className="rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {ocupado ? 'Enviando…' : textoSiguiente}
      </button>
    </div>
  );
}
