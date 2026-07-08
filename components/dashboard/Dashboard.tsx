'use client';

import { useCallback, useEffect, useState } from 'react';
import { EscalaId, ESCALAS, ORDEN_ESCALAS } from '@/lib/instrumento';
import type { DemografiaTipo, EscalaResumen, ResultadosDashboard } from '@/lib/dashboard-data';
import { AvisoPrudencia, Card, Segmented, Select, StatCard, Tabs, TablaFrecuencia } from './ui';
import { BarrasApiladasItem, BarrasComparacion, Histograma, LineaPorDia } from './charts';
import { Inicio } from './Inicio';
import { TABS, TAB_DEFAULT, type TabId } from './tabs';

type Poblacion = 'escolar' | 'general';

export function Dashboard() {
  const [datos, setDatos] = useState<ResultadosDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>(TAB_DEFAULT);
  const [poblacion, setPoblacion] = useState<Poblacion>('escolar');
  const [escalaSel, setEscalaSel] = useState<EscalaId>('eaj');
  const [actualizado, setActualizado] = useState<string>('');

  const cargar = useCallback(async () => {
    try {
      const res = await fetch('/api/results', { cache: 'no-store' });
      if (res.status === 401) {
        window.location.reload(); // sesión expirada → vuelve al login
        return;
      }
      if (!res.ok) throw new Error('No se pudo cargar');
      const j = (await res.json()) as ResultadosDashboard;
      setDatos(j);
      setError(null);
      setActualizado(new Date().toLocaleTimeString('es-MX'));
    } catch {
      setError('No se pudieron cargar los datos.');
    }
  }, []);

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 60_000); // auto-refresh 60 s
    return () => clearInterval(t);
  }, [cargar]);

  async function salir() {
    await fetch('/api/dashboard/logout', { method: 'POST' });
    window.location.reload();
  }

  const pobOpts = [
    { valor: 'escolar' as Poblacion, label: `Escolar${datos ? ` (${datos.porTipo.escolar})` : ''}` },
    { valor: 'general' as Poblacion, label: `General${datos ? ` (${datos.porTipo.general})` : ''}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard — Capacidades legales</h1>
          <p className="text-xs text-slate-500">
            {actualizado ? `Actualizado ${actualizado}` : 'Cargando…'} · auto-refresh 60 s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={cargar} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:border-slate-400">
            Actualizar
          </button>
          <button onClick={salir} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900">
            Salir
          </button>
        </div>
      </header>

      {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <Tabs tabs={TABS} activo={tab} onChange={(t) => setTab(t as TabId)} />

      {tab !== 'inicio' && tab !== 'resumen' && tab !== 'exportar' ? (
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-slate-500">Población:</span>
          <Segmented opciones={pobOpts} valor={poblacion} onChange={setPoblacion} />
        </div>
      ) : null}

      {tab === 'inicio' ? (
        <div className="mt-5">
          <Inicio />
        </div>
      ) : !datos ? (
        <p className="mt-8 text-sm text-slate-400">Cargando datos…</p>
      ) : (
        <div className="mt-5">
          {tab === 'resumen' ? <Resumen datos={datos} /> : null}
          {tab === 'puntuaciones' ? <Puntuaciones datos={datos} poblacion={poblacion} /> : null}
          {tab === 'nivel-item' ? (
            <NivelItem datos={datos} poblacion={poblacion} escala={escalaSel} onEscala={setEscalaSel} />
          ) : null}
          {tab === 'demografia' ? <Demografia demo={datos.demografia[poblacion]} /> : null}
          {tab === 'exportar' ? <Exportar /> : null}
        </div>
      )}
    </div>
  );
}

function Resumen({ datos }: { datos: ResultadosDashboard }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={datos.totalN} />
        <StatCard label="Escolar" value={datos.porTipo.escolar} />
        <StatCard label="General" value={datos.porTipo.general} />
        <StatCard label="Instituciones" value={datos.instituciones.filter((i) => i.n > 0).length} hint="con ≥1 respuesta" />
      </div>

      <Card title="Respuestas por día" subtitle="Escolar y general por separado">
        <LineaPorDia data={datos.porDia} />
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Por institución">
          <table className="w-full text-sm">
            <tbody>
              {datos.instituciones.map((i) => (
                <tr key={i.id} className="border-t border-slate-100">
                  <td className="py-1.5 text-slate-700">{i.nombre}</td>
                  <td className="py-1.5 text-xs text-slate-400">{i.tipo}</td>
                  <td className="w-10 py-1.5 text-right font-medium tabular-nums">{i.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Por cohorte" subtitle="Los 4 valores (escolar / general)">
          <table className="w-full text-sm">
            <tbody>
              {datos.porCohorte.map((c) => (
                <tr key={c.cohorte} className="border-t border-slate-100">
                  <td className="py-1.5 text-slate-700">{c.etiqueta}</td>
                  <td className="w-10 py-1.5 text-right font-medium tabular-nums">{c.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function ResumenEscala({ nombre, r, mostrarInstitucion }: { nombre: string; r: EscalaResumen; mostrarInstitucion: boolean }) {
  return (
    <Card title={nombre} subtitle={`n = ${r.n} · media ${r.media} · mediana ${r.mediana} · DE ${r.de} (Rasch 0–100)`}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">Distribución</p>
          <Histograma bins={r.histograma} />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">Media por cohorte (±DE)</p>
          <BarrasComparacion grupos={r.porCohorte} />
        </div>
      </div>
      {mostrarInstitucion && r.porInstitucion && r.porInstitucion.length > 0 ? (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium text-slate-500">Media por institución (±DE)</p>
          <BarrasComparacion grupos={r.porInstitucion} />
        </div>
      ) : null}
    </Card>
  );
}

function Puntuaciones({ datos, poblacion }: { datos: ResultadosDashboard; poblacion: Poblacion }) {
  return (
    <div className="space-y-4">
      <AvisoPrudencia />
      {ORDEN_ESCALAS.map((e) => (
        <ResumenEscala key={e} nombre={ESCALAS[e].nombre} r={datos.escalas[e][poblacion]} mostrarInstitucion={poblacion === 'escolar'} />
      ))}
    </div>
  );
}

function NivelItem({
  datos,
  poblacion,
  escala,
  onEscala,
}: {
  datos: ResultadosDashboard;
  poblacion: Poblacion;
  escala: EscalaId;
  onEscala: (e: EscalaId) => void;
}) {
  const ni = datos.nivelItem[escala];
  const items = ni[poblacion];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Escala:</span>
        <Select valor={escala} onChange={(v) => onEscala(v as EscalaId)} opciones={ORDEN_ESCALAS.map((e) => ({ valor: e, label: ESCALAS[e].nombre }))} />
      </div>
      <Card title="Distribución de respuestas por ítem" subtitle="Barras apiladas por categoría de respuesta">
        <BarrasApiladasItem items={items} categorias={ni.categorias} />
        <ol className="mt-3 space-y-0.5 text-xs text-slate-500">
          {items.map((it) => (
            <li key={it.num}>
              <span className="font-medium text-slate-600">{it.num}.</span> {it.texto}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function Demografia({ demo }: { demo: DemografiaTipo }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TablaFrecuencia titulo={demo.edad.titulo} filas={demo.edad.filas} />
      <TablaFrecuencia titulo={demo.genero.titulo} filas={demo.genero.filas} />
      <TablaFrecuencia titulo={demo.indigena.titulo} filas={demo.indigena.filas} />
      <TablaFrecuencia titulo={demo.afro.titulo} filas={demo.afro.filas} />
      <TablaFrecuencia titulo={demo.nivelPadre.titulo} filas={demo.nivelPadre.filas} />
      <TablaFrecuencia titulo={demo.nivelMadre.titulo} filas={demo.nivelMadre.filas} />
      {demo.nivelPropio ? <TablaFrecuencia titulo={demo.nivelPropio.titulo} filas={demo.nivelPropio.filas} /> : null}
      {demo.ocupacion ? <TablaFrecuencia titulo={demo.ocupacion.titulo} filas={demo.ocupacion.filas} /> : null}
    </div>
  );
}

function Exportar() {
  return (
    <div className="space-y-4">
      <Card title="CSV maestro" subtitle="Un renglón por respuesta: todos los campos, items crudos, recodificados, brutas y Rasch P&B.">
        <a href="/api/export" className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900" download>
          Descargar respuestas_maestro.csv
        </a>
      </Card>
      <Card title="CSV por escala (formato easyRasch)" subtitle="Columnas dif_* + q1…qN recodificadas (mínimo 0). Uno por escala.">
        <div className="flex flex-wrap gap-2">
          {ORDEN_ESCALAS.map((e) => (
            <a
              key={e}
              href={`/api/export-rasch?escala=${e}`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:border-slate-400"
              download
            >
              {e.toUpperCase()}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
