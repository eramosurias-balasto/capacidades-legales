import type { CSSProperties, ReactNode } from 'react';

// Texto del "Aviso general a la persona encuestada" — versión definitiva del autor
// (27 de octubre de 2026; instrumento definitivo). Fuente única compartida por el modal de
// consentimiento del flujo (components/encuesta/Encuesta.tsx) y la página pública
// /aviso-de-privacidad. No es texto del instrumento validado.

export const AVISO_TITULO = 'Aviso general a la persona encuestada';
export const AVISO_ACTUALIZADO = '27 de octubre de 2026';

const h2: CSSProperties = {
  margin: '28px 0 8px',
  fontFamily: 'var(--font-display)',
  fontWeight: 'var(--fw-semibold)',
  fontSize: 'var(--text-h4)',
  lineHeight: 'var(--lh-heading)',
  letterSpacing: 'var(--tracking-tight)',
  color: 'var(--text-primary)',
};
const p: CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-body)',
  lineHeight: 'var(--lh-relaxed)',
  color: 'var(--text-secondary)',
};

const SECCIONES: { n: number; titulo: string; cuerpo: ReactNode }[] = [
  {
    n: 1,
    titulo: 'Naturaleza del estudio',
    cuerpo:
      'La presente encuesta forma parte de la tesina para obtener el título de Licenciatura en Derecho por el Instituto Tecnológico Autónomo de México, del autor Ernesto Ramos Urías, bajo la dirección de la Dra. Ana María Zorrilla Noriega. Se trata de un trabajo de carácter académico; el cuestionario no evalúa a quien lo responde ni busca tener incidencia alguna en su desempeño escolar.',
  },
  {
    n: 2,
    titulo: 'Finalidad',
    cuerpo:
      'El estudio busca determinar si un instrumento desarrollado en Inglaterra para medir la confianza de una persona ante un problema legal funciona igualmente entre estudiantes mexicanos de Educación Media Superior. El análisis recae sobre el comportamiento del instrumento, no sobre las respuestas individuales, y sus resultados se presentan siempre de forma agregada.',
  },
  {
    n: 3,
    titulo: 'Anonimato y Seguridad de los Datos',
    cuerpo:
      'No se solicita el nombre, correo electrónico, teléfono ni domicilio de quien responde la encuesta. Tampoco se guarda su dirección IP. El enlace de acceso permite identificar únicamente a la escuela de procedencia, pero no a la persona. Como no se recopila información que permita identificar directamente a los participantes, las respuestas no pueden relacionarse con una persona en particular. Sin embargo, en grupos pequeños, la combinación de algunos datos podría dar indicios sobre la identidad de alguien. La información se guarda en una base de datos a la que únicamente tiene acceso el autor del estudio. No se vende ni se comparte con la escuela, sus profesores o terceros con fines comerciales. Los datos podrían compartirse con otros investigadores para que puedan revisar o repetir el estudio, siempre que se elimine cualquier información que permita identificar a los participantes.',
  },
  {
    n: 4,
    titulo: 'Participación voluntaria',
    cuerpo:
      'Responder es enteramente voluntario. Es posible no participar, o abandonar el cuestionario en cualquier momento antes de enviarlo, sin que ello traiga consecuencia alguna; en tal caso, las respuestas no quedan registradas.',
  },
  {
    n: 5,
    titulo: 'Dudas',
    cuerpo: (
      <>
        Cualquier duda sobre el estudio o sobre este aviso puede dirigirse a Ernesto Neftalí Ramos Urías,{' '}
        <a href="mailto:ernesto@ramosurias.com">ernesto@ramosurias.com</a>.
      </>
    ),
  },
];

/**
 * Cuerpo del aviso (secciones numeradas + cierre + fecha), sin encabezado propio.
 * El contenedor (modal o página) provee el título y el marco.
 */
export function AvisoGeneralTexto() {
  return (
    <>
      {SECCIONES.map((s) => (
        <section key={s.n}>
          <h2 style={h2}>
            {s.n}. {s.titulo}
          </h2>
          <p style={p}>{s.cuerpo}</p>
        </section>
      ))}

      <p style={{ ...p, margin: '28px 0 0', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
        Al continuar, el encuestado manifiesta haber leído este aviso y aceptar participar.
      </p>

      <p
        style={{
          margin: '24px 0 0',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-mono-sm)',
          letterSpacing: 'var(--tracking-mono)',
          color: 'var(--text-muted)',
        }}
      >
        Última actualización: {AVISO_ACTUALIZADO}.
      </p>
    </>
  );
}
