'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EscalaId, ESCALAS, NUM_ITEMS, ORDEN_ESCALAS } from '@/lib/instrumento';
import {
  TipoInstitucion,
  GENEROS,
  SI_NO_PNR,
  NIVELES_EDUCATIVOS_PADRES,
  NIVELES_EDUCATIVOS_PROPIO,
  ETIQUETAS_GENERO,
  ETIQUETAS_SI_NO_PNR,
  ETIQUETAS_NIVEL_EDUCATIVO,
  MAX_OCUPACION,
  MAX_CURSO_DERECHO_DETALLE,
} from '@/lib/catalogos';
import {
  BarraProgreso,
  BotonesNav,
  CampoNumero,
  CampoTexto,
  GrupoRadio,
  MensajeError,
  Opcion,
  Pregunta,
} from './ui';
import { EscalaLikert } from './EscalaLikert';

type Paso = 'aviso' | 'cohorte' | 'demografia' | EscalaId;

interface Datos {
  cohorte: string;
  curso_derecho_detalle: string;
  edad: string;
  genero: string;
  se_considera_indigena: string;
  se_considera_afro: string;
  nivel_educativo_padre: string;
  nivel_educativo_madre: string;
  nivel_educativo_propio: string;
  ocupacion: string;
  items: Record<EscalaId, (number | null)[]>;
}

function datosIniciales(): Datos {
  const items = {} as Record<EscalaId, (number | null)[]>;
  for (const e of ORDEN_ESCALAS) items[e] = Array<number | null>(NUM_ITEMS[e]).fill(null);
  return {
    cohorte: '',
    curso_derecho_detalle: '',
    edad: '',
    genero: '',
    se_considera_indigena: '',
    se_considera_afro: '',
    nivel_educativo_padre: '',
    nivel_educativo_madre: '',
    nivel_educativo_propio: '',
    ocupacion: '',
    items,
  };
}

const opciones = (valores: readonly string[], etiquetas: Record<string, string>): Opcion[] =>
  valores.map((v) => ({ valor: v, etiqueta: etiquetas[v] }));

export function Encuesta({ slug, tipo }: { slug: string; tipo: TipoInstitucion }) {
  const router = useRouter();
  const flag = `encuesta_enviada_${slug}`;

  const pasos = useMemo<Paso[]>(() => ['aviso', 'cohorte', 'demografia', ...ORDEN_ESCALAS], []);
  const [idx, setIdx] = useState(0);
  const [datos, setDatos] = useState<Datos>(datosIniciales);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [yaEnviada, setYaEnviada] = useState(false);
  const inicioRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem(flag)) setYaEnviada(true);
  }, [flag]);

  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => setDatos((d) => ({ ...d, [k]: v }));

  const setItem = (escala: EscalaId, i: number, valor: number) =>
    setDatos((d) => {
      const arr = d.items[escala].slice();
      arr[i] = valor;
      return { ...d, items: { ...d.items, [escala]: arr } };
    });

  const paso = pasos[idx];

  /** Devuelve un mensaje de error si el paso actual está incompleto, o null si es válido. */
  function validarPaso(p: Paso): string | null {
    if (p === 'cohorte') {
      if (!datos.cohorte) return 'Selecciona una opción para continuar.';
      if (tipo === 'general' && datos.cohorte === 'general_si_curso') {
        if (!datos.curso_derecho_detalle.trim()) return 'Indica cuál clase de Derecho cursaste y cuándo.';
        if (datos.curso_derecho_detalle.trim().length > MAX_CURSO_DERECHO_DETALLE)
          return `El detalle no puede exceder ${MAX_CURSO_DERECHO_DETALLE} caracteres.`;
      }
      return null;
    }
    if (p === 'demografia') {
      const edad = Number(datos.edad);
      if (!datos.edad || !Number.isInteger(edad) || edad < 12 || edad > 99)
        return 'Escribe una edad válida (entre 12 y 99).';
      if (!datos.genero) return 'Selecciona una opción de género.';
      if (!datos.se_considera_indigena) return 'Responde la pregunta sobre pertenencia indígena.';
      if (!datos.se_considera_afro) return 'Responde la pregunta sobre pertenencia afromexicana.';
      if (!datos.nivel_educativo_padre) return 'Selecciona el nivel de estudios de tu padre.';
      if (!datos.nivel_educativo_madre) return 'Selecciona el nivel de estudios de tu madre.';
      if (tipo === 'general') {
        if (!datos.nivel_educativo_propio) return 'Selecciona tu máximo nivel de estudios.';
        if (!datos.ocupacion.trim()) return 'Escribe tu ocupación.';
        if (datos.ocupacion.trim().length > MAX_OCUPACION)
          return `La ocupación no puede exceder ${MAX_OCUPACION} caracteres.`;
      }
      return null;
    }
    if (p !== 'aviso') {
      // paso de escala
      if (datos.items[p].some((v) => v === null)) return 'Responde todos los ítems para continuar.';
      return null;
    }
    return null;
  }

  function avanzar() {
    if (paso === 'aviso') {
      inicioRef.current = Date.now(); // duración: desde aceptar el aviso
      setError(null);
      setIdx((i) => i + 1);
      return;
    }
    const err = validarPaso(paso);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (idx < pasos.length - 1) setIdx((i) => i + 1);
    else void enviar();
  }

  function retroceder() {
    setError(null);
    setIdx((i) => Math.max(0, i - 1));
  }

  async function enviar() {
    setEnviando(true);
    setError(null);
    const items = {} as Record<EscalaId, number[]>;
    for (const e of ORDEN_ESCALAS) items[e] = datos.items[e] as number[];

    const payload: Record<string, unknown> = {
      slug,
      acepto_aviso: true,
      cohorte: datos.cohorte,
      edad: Number(datos.edad),
      genero: datos.genero,
      se_considera_indigena: datos.se_considera_indigena,
      se_considera_afro: datos.se_considera_afro,
      nivel_educativo_padre: datos.nivel_educativo_padre,
      nivel_educativo_madre: datos.nivel_educativo_madre,
      items,
      duracion_segundos: inicioRef.current
        ? Math.round((Date.now() - inicioRef.current) / 1000)
        : null,
    };
    if (tipo === 'general') {
      payload.nivel_educativo_propio = datos.nivel_educativo_propio;
      payload.ocupacion = datos.ocupacion.trim();
      if (datos.cohorte === 'general_si_curso') payload.curso_derecho_detalle = datos.curso_derecho_detalle.trim();
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        try {
          window.localStorage.setItem(flag, '1');
        } catch {
          /* localStorage puede fallar en modo restringido; no es crítico */
        }
        router.push('/gracias');
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? 'No se pudo enviar la encuesta. Intenta de nuevo.');
    } catch {
      setError('Hubo un problema de conexión. Revisa tu internet e intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (yaEnviada) {
    return (
      <Marco>
        <h1 className="mb-3 text-xl font-semibold">Ya registramos tu respuesta</h1>
        <p className="text-slate-600">
          Desde este dispositivo ya se envió una respuesta a esta encuesta. ¡Gracias por participar!
        </p>
      </Marco>
    );
  }

  const esUltimo = idx === pasos.length - 1;

  return (
    <Marco>
      {paso !== 'aviso' ? <BarraProgreso actual={idx} total={pasos.length} /> : null}
      <MensajeError>{error}</MensajeError>

      {paso === 'aviso' ? <PantallaAviso /> : null}
      {paso === 'cohorte' ? (
        <PantallaCohorte tipo={tipo} datos={datos} set={set} />
      ) : null}
      {paso === 'demografia' ? <PantallaDemografia tipo={tipo} datos={datos} set={set} /> : null}
      {paso !== 'aviso' && paso !== 'cohorte' && paso !== 'demografia' ? (
        <EscalaLikert
          escala={ESCALAS[paso]}
          valores={datos.items[paso]}
          onChange={(i, v) => setItem(paso, i, v)}
        />
      ) : null}

      <BotonesNav
        onAtras={idx > 0 ? retroceder : undefined}
        onSiguiente={avanzar}
        textoSiguiente={paso === 'aviso' ? 'Acepto y quiero continuar' : esUltimo ? 'Enviar' : 'Siguiente'}
        ocupado={enviando}
      />
    </Marco>
  );
}

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">{children}</div>
    </main>
  );
}

function PantallaAviso() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Aviso de privacidad</h1>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        <p>
          Esta encuesta es <strong>anónima</strong> y tiene fines exclusivamente académicos (una
          tesina de licenciatura en Derecho). No se recopilan datos que te identifiquen: ni tu
          nombre, ni tu correo, ni tu teléfono.
        </p>
        <p>Tus respuestas se usarán únicamente de forma agregada para el análisis de la tesina.</p>
        <p>
          {/* TODO: URL pendiente del aviso de privacidad completo */}
          <a href="#" className="font-medium text-slate-900 underline">
            Aviso de privacidad
          </a>
        </p>
      </div>
    </div>
  );
}

function PantallaCohorte({
  tipo,
  datos,
  set,
}: {
  tipo: TipoInstitucion;
  datos: Datos;
  set: <K extends keyof Datos>(k: K, v: Datos[K]) => void;
}) {
  if (tipo === 'general') {
    return (
      <>
        <Pregunta titulo="¿Alguna vez has cursado alguna clase de Derecho?">
          <GrupoRadio
            name="cohorte"
            valor={datos.cohorte}
            onChange={(v) => set('cohorte', v)}
            opciones={[
              { valor: 'general_si_curso', etiqueta: 'Sí' },
              { valor: 'general_no_curso', etiqueta: 'No' },
            ]}
          />
        </Pregunta>
        {datos.cohorte === 'general_si_curso' ? (
          <Pregunta titulo="¿Cuál y cuándo? (por ejemplo: 'Derecho mercantil, en la universidad, 2015')">
            <CampoTexto
              id="curso_derecho_detalle"
              valor={datos.curso_derecho_detalle}
              onChange={(v) => set('curso_derecho_detalle', v)}
              maxLength={MAX_CURSO_DERECHO_DETALLE}
            />
          </Pregunta>
        ) : null}
      </>
    );
  }
  return (
    <Pregunta titulo="¿Cuál es tu situación respecto a la materia de Derecho en tu escuela?">
      <GrupoRadio
        name="cohorte"
        valor={datos.cohorte}
        onChange={(v) => set('cohorte', v)}
        opciones={[
          { valor: 'curso_primavera_2026', etiqueta: 'La cursé en primavera 2026' },
          { valor: 'cursara_otono_2026', etiqueta: 'La voy a cursar en otoño 2026' },
        ]}
      />
    </Pregunta>
  );
}

function PantallaDemografia({
  tipo,
  datos,
  set,
}: {
  tipo: TipoInstitucion;
  datos: Datos;
  set: <K extends keyof Datos>(k: K, v: Datos[K]) => void;
}) {
  const nivelPadres = opciones(NIVELES_EDUCATIVOS_PADRES, ETIQUETAS_NIVEL_EDUCATIVO);
  return (
    <div>
      <Pregunta titulo="¿Cuántos años tienes?">
        <CampoNumero id="edad" valor={datos.edad} onChange={(v) => set('edad', v)} min={12} max={99} placeholder="Edad" />
      </Pregunta>

      <Pregunta titulo="Género">
        <GrupoRadio name="genero" valor={datos.genero} onChange={(v) => set('genero', v)} opciones={opciones(GENEROS, ETIQUETAS_GENERO)} />
      </Pregunta>

      <Pregunta titulo="¿Te consideras una persona indígena?">
        <GrupoRadio
          name="indigena"
          valor={datos.se_considera_indigena}
          onChange={(v) => set('se_considera_indigena', v)}
          opciones={opciones(SI_NO_PNR, ETIQUETAS_SI_NO_PNR)}
        />
      </Pregunta>

      <Pregunta titulo="¿Te consideras una persona afromexicana o afrodescendiente?">
        <GrupoRadio
          name="afro"
          valor={datos.se_considera_afro}
          onChange={(v) => set('se_considera_afro', v)}
          opciones={opciones(SI_NO_PNR, ETIQUETAS_SI_NO_PNR)}
        />
      </Pregunta>

      <Pregunta titulo="¿Cuál es el máximo nivel de estudios de tu padre?">
        <GrupoRadio
          name="nivel_padre"
          valor={datos.nivel_educativo_padre}
          onChange={(v) => set('nivel_educativo_padre', v)}
          opciones={nivelPadres}
        />
      </Pregunta>

      <Pregunta titulo="¿Cuál es el máximo nivel de estudios de tu madre?">
        <GrupoRadio
          name="nivel_madre"
          valor={datos.nivel_educativo_madre}
          onChange={(v) => set('nivel_educativo_madre', v)}
          opciones={nivelPadres}
        />
      </Pregunta>

      {tipo === 'general' ? (
        <>
          <Pregunta titulo="¿Cuál es tu máximo nivel de estudios?">
            <GrupoRadio
              name="nivel_propio"
              valor={datos.nivel_educativo_propio}
              onChange={(v) => set('nivel_educativo_propio', v)}
              opciones={opciones(NIVELES_EDUCATIVOS_PROPIO, ETIQUETAS_NIVEL_EDUCATIVO)}
            />
          </Pregunta>
          <Pregunta titulo="¿Cuál es tu ocupación?">
            <CampoTexto
              id="ocupacion"
              valor={datos.ocupacion}
              onChange={(v) => set('ocupacion', v)}
              maxLength={MAX_OCUPACION}
              placeholder="Por ejemplo: docente, comerciante, estudiante…"
            />
          </Pregunta>
        </>
      ) : null}
    </div>
  );
}
