'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EscalaId, ESCALAS, NUM_ITEMS, ORDEN_ESCALAS } from '@/lib/instrumento';
import {
  TipoInstitucion,
  GENEROS,
  SI_NO_PNR,
  NIVELES_EDUCATIVOS_PADRES,
  NIVELES_EDUCATIVOS_PROPIO,
  ENTIDADES,
  ETIQUETAS_GENERO,
  ETIQUETAS_SI_NO_PNR,
  ETIQUETAS_NIVEL_EDUCATIVO,
  ETIQUETAS_COHORTE,
  MAX_OCUPACION,
  MAX_CURSO_DERECHO_DETALLE,
  MIN_ANIO_DERECHO,
  MAX_ANIO_DERECHO,
} from '@/lib/catalogos';
import {
  Badge,
  Button,
  CampoLabel,
  ChoiceOption,
  Chip,
  Eyebrow,
  HeavyBar,
  Input,
  Masthead,
  ProgressHairline,
  SelectField,
} from './ds';

// ————— tipos de paso —————
type Paso =
  | { kind: 'portada' }
  | { kind: 'cohorte' }
  | { kind: 'demografia' }
  | { kind: 'intro'; escala: EscalaId; section: number }
  | { kind: 'item'; escala: EscalaId; item: number; section: number; n: number };

interface Datos {
  cohorte: string;
  curso_derecho_detalle: string;
  curso_derecho_anio: string;
  edad: string;
  genero: string;
  se_considera_indigena: string;
  se_considera_afro: string;
  nivel_educativo_padre: string;
  nivel_educativo_madre: string;
  entidad: string;
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
    curso_derecho_anio: '',
    edad: '',
    genero: '',
    se_considera_indigena: '',
    se_considera_afro: '',
    nivel_educativo_padre: '',
    nivel_educativo_madre: '',
    entidad: '',
    nivel_educativo_propio: '',
    ocupacion: '',
    items,
  };
}

const opcionesSelect = (valores: readonly string[], etiquetas: Record<string, string>) =>
  valores.map((v) => ({ valor: v, etiqueta: etiquetas[v] ?? v }));

const columna: CSSProperties = { width: '100%', maxWidth: 600, margin: '0 auto', padding: '0 24px 64px' };

export function Encuesta({ slug, tipo }: { slug: string; tipo: TipoInstitucion }) {
  const router = useRouter();
  const flag = `encuesta_enviada_${slug}`;

  const pasos = useMemo<Paso[]>(() => {
    const s: Paso[] = [{ kind: 'portada' }, { kind: 'cohorte' }, { kind: 'demografia' }];
    ORDEN_ESCALAS.forEach((e, k) => {
      const section = 4 + k;
      const n = NUM_ITEMS[e];
      s.push({ kind: 'intro', escala: e, section });
      for (let i = 0; i < n; i++) s.push({ kind: 'item', escala: e, item: i, section, n });
    });
    return s;
  }, []);

  const [idx, setIdx] = useState(0);
  const [datos, setDatos] = useState<Datos>(datosIniciales);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [yaEnviada, setYaEnviada] = useState(false);
  const inicioRef = useRef<number | null>(null);
  const enviandoRef = useRef(false); // guard síncrono contra doble envío (doble tap)

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
  const esUltimo = idx === pasos.length - 1;

  // ————— progreso y etiqueta de sección —————
  function pctDe(p: Paso): number {
    switch (p.kind) {
      case 'portada':
        return 0;
      case 'cohorte':
        return (1 / 8) * 100;
      case 'demografia':
        return (2 / 8) * 100;
      case 'intro':
        return ((p.section - 1) / 8) * 100;
      case 'item':
        return ((p.section - 1 + (p.item + 1) / p.n) / 8) * 100;
    }
  }
  function seccionDe(p: Paso): string {
    switch (p.kind) {
      case 'portada':
        return '';
      case 'cohorte':
        return 'Sección 2 de 8';
      case 'demografia':
        return 'Sección 3 de 8';
      default:
        return `Sección ${p.section} de 8`;
    }
  }

  // ————— validación por paso —————
  function pasoValido(p: Paso): boolean {
    if (p.kind === 'cohorte') {
      if (!datos.cohorte) return false;
      if (tipo === 'general' && datos.cohorte === 'general_si_curso') {
        const detalleOk = datos.curso_derecho_detalle.trim().length > 0 && datos.curso_derecho_detalle.trim().length <= MAX_CURSO_DERECHO_DETALLE;
        const anio = Number(datos.curso_derecho_anio);
        const anioOk = Number.isInteger(anio) && anio >= MIN_ANIO_DERECHO && anio <= MAX_ANIO_DERECHO;
        return detalleOk && anioOk;
      }
      return true;
    }
    if (p.kind === 'demografia') {
      const edad = Number(datos.edad);
      if (!datos.edad || !Number.isInteger(edad) || edad < 12 || edad > 99) return false;
      if (!datos.genero || !datos.se_considera_indigena || !datos.se_considera_afro) return false;
      if (!datos.nivel_educativo_padre || !datos.nivel_educativo_madre || !datos.entidad) return false;
      if (tipo === 'general') {
        if (!datos.nivel_educativo_propio) return false;
        if (!datos.ocupacion.trim() || datos.ocupacion.trim().length > MAX_OCUPACION) return false;
      }
      return true;
    }
    if (p.kind === 'item') return datos.items[p.escala][p.item] !== null;
    return true;
  }

  function avanzar() {
    if (paso.kind === 'portada') {
      inicioRef.current = Date.now();
      setIdx((i) => i + 1);
      return;
    }
    if (esUltimo) {
      void enviar();
      return;
    }
    setIdx((i) => i + 1);
  }
  function retroceder() {
    setError(null);
    setIdx((i) => Math.max(0, i - 1));
  }

  async function enviar() {
    if (enviandoRef.current) return; // ya hay un envío en curso: evita duplicados por doble tap
    enviandoRef.current = true;
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
      entidad: datos.entidad,
      items,
      duracion_segundos: inicioRef.current ? Math.round((Date.now() - inicioRef.current) / 1000) : null,
    };
    if (tipo === 'general') {
      payload.nivel_educativo_propio = datos.nivel_educativo_propio;
      payload.ocupacion = datos.ocupacion.trim();
      if (datos.cohorte === 'general_si_curso') {
        payload.curso_derecho_detalle = datos.curso_derecho_detalle.trim();
        payload.curso_derecho_anio = Number(datos.curso_derecho_anio);
      }
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
          /* modo restringido: no crítico */
        }
        const j = (await res.json().catch(() => ({}))) as { id?: string };
        const folio = j.id ? j.id.replace(/-/g, '').slice(-6).toUpperCase() : '';
        router.push(folio ? `/gracias?folio=${folio}` : '/gracias');
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? 'No se pudo enviar la encuesta. Intente de nuevo.');
      enviandoRef.current = false; // permite reintentar tras un error
    } catch {
      setError('Hubo un problema de conexión. Revise su internet e intente de nuevo.');
      enviandoRef.current = false;
    } finally {
      setEnviando(false);
    }
  }

  if (yaEnviada) return <YaEnviada />;

  const ctaLabel =
    paso.kind === 'portada'
      ? 'Acepto y quiero continuar'
      : paso.kind === 'intro'
      ? 'Empezar la sección'
      : esUltimo
      ? 'Terminar'
      : 'Continuar';

  const pct = pctDe(paso);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Masthead sectionLabel={seccionDe(paso)} />
      <ProgressHairline pct={pct} />
      {paso.kind !== 'portada' ? (
        <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: '6px 24px 0' }}>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono-sm)', letterSpacing: 'var(--tracking-mono)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(pct)}% completado
          </div>
        </div>
      ) : null}

      <div style={columna}>
        {error ? (
          <p role="alert" style={{ margin: '20px 0 0', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--danger-bg)', color: 'var(--danger-ink)', fontSize: 'var(--text-sm)' }}>
            {error}
          </p>
        ) : null}

        {paso.kind === 'portada' ? <Portada /> : null}
        {paso.kind === 'cohorte' ? <Cohorte tipo={tipo} datos={datos} set={set} /> : null}
        {paso.kind === 'demografia' ? <Demografia tipo={tipo} datos={datos} set={set} /> : null}
        {paso.kind === 'intro' ? <EscalaIntro escala={paso.escala} /> : null}
        {paso.kind === 'item' ? (
          <ItemLikert paso={paso} valor={datos.items[paso.escala][paso.item]} onSelect={(v) => setItem(paso.escala, paso.item, v)} />
        ) : null}

        {/* Navegación */}
        {paso.kind === 'item' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
            <Button variant="ghost" size="md" onClick={retroceder}>
              Atrás
            </Button>
            <div style={{ flex: 1 }}>
              <Button variant="primary" size="lg" fullWidth disabled={!pasoValido(paso) || enviando} onClick={avanzar}>
                {enviando ? 'Enviando…' : ctaLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: paso.kind === 'portada' ? 0 : 36 }}>
            <Button variant="primary" size="lg" pill={paso.kind === 'portada'} fullWidth disabled={!pasoValido(paso) || enviando} onClick={avanzar}>
              {enviando ? 'Enviando…' : ctaLabel}
            </Button>
            {paso.kind !== 'portada' && idx > 0 ? (
              <div style={{ marginTop: 12 }}>
                <Button variant="ghost" size="md" onClick={retroceder}>
                  Atrás
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/* ————————————————————— Pantallas ————————————————————— */

function Portada() {
  return (
    <section className="ru-fade" style={{ paddingTop: 56 }}>
      <HeavyBar />
      <Eyebrow>Estudio académico · tesina de Derecho</Eyebrow>
      <h1
        className="ru-balance"
        style={{
          margin: '20px 0 0',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-h1)',
          lineHeight: 'var(--lh-snug)',
          letterSpacing: 'var(--tracking-display)',
          color: 'var(--text-primary)',
        }}
      >
        ¿Qué tan capaz se siente de enfrentar un problema legal serio por su cuenta?
      </h1>
      <p style={{ margin: '24px 0 0', fontSize: 'var(--text-lead)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', maxWidth: '44ch' }}>
        Un despido injusto, una deuda que no reconoce, el despojo de una vivienda. Este estudio mide qué tan preparadas se sienten las personas para
        afrontar problemas legales como estos, y dónde el acceso a la justicia se queda corto.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', margin: '32px 0' }}>
        <Badge tone="neutral">5–7 minutos</Badge>
        <Badge tone="accent" dot>
          anónimo
        </Badge>
      </div>

      <div style={{ borderTop: 'var(--rule-thin) solid var(--border-default)', paddingTop: 24 }}>
        <p style={{ margin: '0 0 20px', fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', maxWidth: '48ch' }}>
          Al continuar acepta el{' '}
          <a href="/aviso-de-privacidad" target="_blank" rel="noopener noreferrer">aviso de privacidad</a> de este estudio. Sus respuestas son anónimas: no pedimos su nombre ni datos que permitan identificarle.
        </p>
      </div>
    </section>
  );
}

function Cohorte({ tipo, datos, set }: { tipo: TipoInstitucion; datos: Datos; set: <K extends keyof Datos>(k: K, v: Datos[K]) => void }) {
  const escolar = tipo === 'escolar';
  const opciones = escolar
    ? [
        { valor: 'curso_primavera_2026', etiqueta: ETIQUETAS_COHORTE.curso_primavera_2026 },
        { valor: 'cursara_otono_2026', etiqueta: ETIQUETAS_COHORTE.cursara_otono_2026 },
      ]
    : [
        { valor: 'general_si_curso', etiqueta: 'Sí' },
        { valor: 'general_no_curso', etiqueta: 'No' },
      ];
  const pregunta = escolar
    ? '¿Cuál es su situación respecto a la materia de Derecho en su escuela?'
    : '¿Alguna vez ha cursado una clase de Derecho?';
  const ayuda = escolar ? '' : 'Cuenta cualquier curso, taller o formación sobre Derecho, dentro o fuera de la escuela.';

  return (
    <section className="ru-fade" style={{ paddingTop: 40 }}>
      <Eyebrow>Contacto con el Derecho</Eyebrow>
      <h2 className="ru-balance" style={tituloH2}>
        {pregunta}
      </h2>
      {ayuda ? <p style={{ margin: '16px 0 28px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)' }}>{ayuda}</p> : <div style={{ height: 24 }} />}

      <div role="radiogroup" aria-label={pregunta} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opciones.map((o) => (
          <ChoiceOption key={o.valor} label={o.etiqueta} selected={datos.cohorte === o.valor} onSelect={() => set('cohorte', o.valor)} size="sm" />
        ))}
      </div>

      {tipo === 'general' && datos.cohorte === 'general_si_curso' ? (
        <div className="ru-fade" style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input
            label="¿Qué tipo de programa fue?"
            value={datos.curso_derecho_detalle}
            onChange={(v) => set('curso_derecho_detalle', v)}
            maxLength={MAX_CURSO_DERECHO_DETALLE}
            placeholder="Preparatoria, un diplomado, el trabajo…"
            required
          />
          <div style={{ maxWidth: 200 }}>
            <Input
              label="¿En qué año terminó su última clase de Derecho?"
              value={datos.curso_derecho_anio}
              onChange={(v) => set('curso_derecho_anio', v)}
              type="number"
              mono
              inputMode="numeric"
              placeholder="2018"
              required
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Demografia({ tipo, datos, set }: { tipo: TipoInstitucion; datos: Datos; set: <K extends keyof Datos>(k: K, v: Datos[K]) => void }) {
  const niveles = opcionesSelect(NIVELES_EDUCATIVOS_PADRES, ETIQUETAS_NIVEL_EDUCATIVO);
  return (
    <section className="ru-fade" style={{ paddingTop: 40 }}>
      <Eyebrow>Sobre usted</Eyebrow>
      <h2 style={tituloH2}>Unos datos generales</h2>
      <p style={{ margin: '16px 0 32px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', maxWidth: '46ch' }}>
        Sirven para describir a quienes participan. No permiten identificarle.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ maxWidth: 160 }}>
          <Input label="Edad" value={datos.edad} onChange={(v) => set('edad', v)} type="number" mono inputMode="numeric" placeholder="16" required />
        </div>

        <GrupoChips label="Género" opciones={opcionesSelect(GENEROS, ETIQUETAS_GENERO)} valor={datos.genero} onChange={(v) => set('genero', v)} />
        <GrupoChips label="¿Se considera una persona indígena?" opciones={opcionesSelect(SI_NO_PNR, ETIQUETAS_SI_NO_PNR)} valor={datos.se_considera_indigena} onChange={(v) => set('se_considera_indigena', v)} />
        <GrupoChips label="¿Se considera una persona afromexicana o afrodescendiente?" opciones={opcionesSelect(SI_NO_PNR, ETIQUETAS_SI_NO_PNR)} valor={datos.se_considera_afro} onChange={(v) => set('se_considera_afro', v)} />

        {tipo === 'general' ? (
          <SelectField label="Máximo nivel de estudios" value={datos.nivel_educativo_propio} onChange={(v) => set('nivel_educativo_propio', v)} options={opcionesSelect(NIVELES_EDUCATIVOS_PROPIO, ETIQUETAS_NIVEL_EDUCATIVO)} required />
        ) : null}

        <SelectField label="Máximo nivel de estudios del padre" value={datos.nivel_educativo_padre} onChange={(v) => set('nivel_educativo_padre', v)} options={niveles} required />
        <SelectField label="Máximo nivel de estudios de la madre" value={datos.nivel_educativo_madre} onChange={(v) => set('nivel_educativo_madre', v)} options={niveles} required />
        <SelectField label="Entidad federativa" value={datos.entidad} onChange={(v) => set('entidad', v)} options={ENTIDADES} required />

        {tipo === 'general' ? (
          <Input
            label="¿Cuál es su ocupación?"
            value={datos.ocupacion}
            onChange={(v) => set('ocupacion', v)}
            maxLength={MAX_OCUPACION}
            placeholder="Docente, comerciante, estudiante…"
            hint="Por ejemplo: 'comerciante', 'contadora'. No incluya nombres ni datos personales."
            required
          />
        ) : null}
      </div>
    </section>
  );
}

function GrupoChips({ label, opciones, valor, onChange }: { label: string; opciones: { valor: string; etiqueta: string }[]; valor: string; onChange: (v: string) => void }) {
  return (
    <div>
      <CampoLabel>{label}</CampoLabel>
      <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {opciones.map((o) => (
          <Chip key={o.valor} label={o.etiqueta} selected={valor === o.valor} onSelect={() => onChange(o.valor)} />
        ))}
      </div>
    </div>
  );
}

function EscalaIntro({ escala }: { escala: EscalaId }) {
  const e = ESCALAS[escala];
  const n = e.items.length;
  // La instrucción se conserva íntegra y verbatim; solo se resalta EN NEGRITAS su oración-
  // pregunta final (la parte más importante). Se parte en el último "¿" sin alterar el texto.
  const idxPregunta = e.instruccion.lastIndexOf('¿');
  const instrPrefijo = idxPregunta > 0 ? e.instruccion.slice(0, idxPregunta) : e.instruccion;
  const instrPregunta = idxPregunta > 0 ? e.instruccion.slice(idxPregunta) : '';
  return (
    <section className="ru-fade" style={{ paddingTop: 44 }}>
      {/* Sin nombre de escala en el cuestionario: podría sesgar las respuestas. */}
      <div style={{ marginBottom: 24 }}>
        <Badge tone="accent">{n} afirmaciones</Badge>
      </div>
      <h2 style={{ ...tituloH2, fontSize: 'var(--text-h3)', margin: '0 0 8px' }}>Antes de empezar esta sección</h2>
      <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)' }}>
        {instrPrefijo}
        {instrPregunta ? (
          <strong style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>{instrPregunta}</strong>
        ) : null}
      </p>
      <div style={{ borderLeft: 'var(--rule-medium) solid var(--accent)', paddingLeft: 16, margin: '28px 0 0' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)' }}>
          Verá una afirmación por pantalla. Elija en cada una la opción que mejor le describa; puede cambiar su respuesta antes de avanzar.
        </p>
      </div>
    </section>
  );
}

function ItemLikert({ paso, valor, onSelect }: { paso: { escala: EscalaId; item: number; n: number }; valor: number | null; onSelect: (v: number) => void }) {
  const e = ESCALAS[paso.escala];
  const texto = e.items[paso.item];
  // Sin nombre de escala (evita sesgo). Solo el conteo neutral de afirmaciones.
  const meta = `Afirmación ${paso.item + 1} de ${paso.n}`;
  return (
    <section style={{ paddingTop: 40 }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono-sm)', letterSpacing: 'var(--tracking-mono)', color: 'var(--text-muted)' }}>{meta}</span>
      </div>

      {/* Recordatorio persistente de la pregunta central (versión singular); la afirmación
          sigue siendo la protagonista. Texto de UI de instrumento.ts (D13). */}
      <p style={{ margin: '0 0 16px', fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)' }}>
        {e.preguntaCorta}
      </p>

      <p
        key={meta}
        className="ru-fade ru-pretty"
        style={{
          margin: '0 0 32px',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-medium)',
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--lh-heading)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--text-primary)',
          minHeight: '2.6em',
        }}
      >
        {texto}
      </p>

      <div role="radiogroup" aria-label={texto} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {e.categorias.map((c, i) => (
          <ChoiceOption key={i} label={c} selected={valor === i} onSelect={() => onSelect(i)} size="lg" />
        ))}
      </div>
    </section>
  );
}

function YaEnviada() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Masthead sectionLabel="" />
      <div style={{ ...columna, paddingTop: 72, textAlign: 'center' }}>
        <HeavyBar center />
        <h2 style={{ ...tituloH2, maxWidth: '22ch', margin: '0 auto' }}>Ya registramos su respuesta</h2>
        <p style={{ margin: '20px auto 0', maxWidth: '42ch', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)' }}>
          Desde este dispositivo ya se envió una respuesta a esta encuesta. Gracias por su participación anónima.
        </p>
      </div>
    </div>
  );
}

const tituloH2: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-display)',
  fontWeight: 'var(--fw-semibold)',
  fontSize: 'var(--text-h2)',
  lineHeight: 'var(--lh-heading)',
  letterSpacing: 'var(--tracking-tight)',
  color: 'var(--text-primary)',
};
