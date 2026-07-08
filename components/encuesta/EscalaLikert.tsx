'use client';

import { Escala } from '@/lib/instrumento';

// Presenta una escala como matriz Likert en desktop (md+) y como tarjetas apiladas en móvil
// (SPEC §4). Inputs controlados por `valores` (índice 0–3 de captura, null si sin responder).

export function EscalaLikert({
  escala,
  valores,
  onChange,
}: {
  escala: Escala;
  valores: (number | null)[];
  onChange: (itemIndex: number, valorCrudo: number) => void;
}) {
  const { instruccion, items, categorias } = escala;

  return (
    <div>
      <p className="mb-6 text-sm leading-relaxed text-slate-700">{instruccion}</p>

      {/* Desktop: matriz */}
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr>
            <th className="w-2/5 p-2" />
            {categorias.map((c) => (
              <th key={c} className="p-2 text-center align-bottom text-xs font-medium text-slate-500">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((texto, i) => (
            <tr key={i} className="border-t border-slate-200">
              <td className="p-2 align-top text-slate-800">
                <span className="mr-1 font-medium text-slate-400">{i + 1}.</span>
                {texto}
              </td>
              {categorias.map((c, ci) => (
                <td key={ci} className="p-2 text-center">
                  <label className="inline-flex cursor-pointer items-center justify-center p-2">
                    <span className="sr-only">{c}</span>
                    <input
                      type="radio"
                      name={`${escala.id}-${i}`}
                      checked={valores[i] === ci}
                      onChange={() => onChange(i, ci)}
                      className="h-5 w-5 accent-slate-800"
                    />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Móvil: tarjetas apiladas */}
      <div className="space-y-4 md:hidden">
        {items.map((texto, i) => (
          <fieldset key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <legend className="sr-only">Ítem {i + 1}</legend>
            <p className="mb-3 text-sm text-slate-800">
              <span className="mr-1 font-medium text-slate-400">{i + 1}.</span>
              {texto}
            </p>
            <div className="grid gap-2">
              {categorias.map((c, ci) => {
                const sel = valores[i] === ci;
                return (
                  <label
                    key={ci}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      sel ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${escala.id}-${i}-m`}
                      checked={sel}
                      onChange={() => onChange(i, ci)}
                      className="sr-only"
                    />
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                        sel ? 'border-white' : 'border-slate-400'
                      }`}
                    >
                      {sel ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>
                    {c}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
