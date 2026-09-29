import type { CSSProperties, ReactNode } from 'react';

// Texto del "Aviso general al encuestado" entregado por el autor (29 de septiembre de 2026).
// Fuente única compartida por el modal de consentimiento del flujo (components/encuesta/Encuesta.tsx)
// y la página pública /aviso-de-privacidad. No es texto del instrumento validado.

export const AVISO_TITULO = 'Aviso general al encuestado';
export const AVISO_ACTUALIZADO = '29 de septiembre de 2026';

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
      'La presente encuesta forma parte de la tesina de licenciatura en derecho de Ernesto Ramos Urías, en el Instituto Tecnológico Autónomo de México, bajo la dirección de la Dra. Ana María Zorrilla Noriega. Se trata de un trabajo de carácter estrictamente académico; el cuestionario no evalúa a quien lo responde ni tiene incidencia alguna en su desempeño escolar.',
  },
  {
    n: 2,
    titulo: 'Finalidad',
    cuerpo:
      'El estudio busca determinar si un instrumento desarrollado en Inglaterra para medir la confianza de una persona ante un problema legal funciona igualmente entre estudiantes mexicanos de educación media superior. El análisis recae sobre el comportamiento del instrumento, no sobre las respuestas individuales, y sus resultados se presentan siempre de forma agregada.',
  },
  {
    n: 3,
    titulo: 'Información que se recaba',
    cuerpo:
      'Además de las respuestas al cuestionario, se recaban siete datos de contexto: edad, género, autoadscripción indígena, autoadscripción afromexicana o afrodescendiente, nivel máximo de estudios del padre, nivel máximo de estudios de la madre y entidad federativa. Las dos preguntas de autoadscripción se formulan en los mismos términos que emplea el Censo de Población y Vivienda.',
  },
  {
    n: 4,
    titulo: 'Información que no se recaba',
    cuerpo:
      'No se solicita el nombre, el correo electrónico, el teléfono ni el domicilio de quien responde, ni se almacena su dirección IP. El enlace de acceso identifica únicamente a la institución educativa de procedencia, y no a la persona.',
  },
  {
    n: 5,
    titulo: 'Anonimato',
    cuerpo:
      'Toda vez que no se recaba dato alguno que identifique al encuestado, sus respuestas no pueden vincularse con él de manera directa. No obstante, la combinación de varios datos de contexto podría, dentro de un grupo reducido, apuntar a una persona.',
  },
  {
    n: 6,
    titulo: 'Resguardo de la información',
    cuerpo:
      'La información se almacena en una base de datos a la que sólo tiene acceso el autor del estudio. No se vende, no se comparte con la institución educativa ni con su personal docente, y no se transfiere a terceros con fines comerciales. Los datos, desprovistos de cualquier elemento identificable, podrían compartirse con otros investigadores para verificar o replicar el análisis, conforme a la práctica ordinaria en la investigación académica.',
  },
  {
    n: 7,
    titulo: 'Participación voluntaria',
    cuerpo:
      'La dirección de la institución autorizó la aplicación de la encuesta, pero dicha autorización no sustituye la decisión de cada estudiante: responder es enteramente voluntario. Es posible no participar, o abandonar el cuestionario en cualquier momento antes de enviarlo, sin que ello traiga consecuencia alguna; en tal caso, las respuestas no quedan registradas.',
  },
  {
    n: 8,
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
