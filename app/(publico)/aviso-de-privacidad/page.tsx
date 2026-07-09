import type { CSSProperties } from 'react';

export const metadata = { title: 'Aviso de privacidad' };

// Página pública del aviso de privacidad, con el design system RU.L de la encuesta.
//
// BORRADOR PENDIENTE DE REVISIÓN DEL AUTOR — el texto de abajo es un borrador simplificado.
// El autor entregará la versión definitiva; solo se sustituye el contenido de las secciones,
// sin tocar la estructura ni el estilo.

const h2: CSSProperties = {
  margin: '32px 0 8px',
  fontFamily: 'var(--font-display)',
  fontWeight: 'var(--fw-semibold)',
  fontSize: 'var(--text-h4)',
  lineHeight: 'var(--lh-heading)',
  letterSpacing: 'var(--tracking-tight)',
  color: 'var(--text-primary)',
};
const p: CSSProperties = {
  margin: '0',
  fontSize: 'var(--text-body)',
  lineHeight: 'var(--lh-relaxed)',
  color: 'var(--text-secondary)',
};

export default function AvisoDePrivacidad() {
  return (
    <main style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ width: 44, height: 6, background: 'var(--accent)', borderRadius: 2, marginBottom: 28 }} />
      <div
        style={{
          fontFamily: 'var(--font-text)',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-label)',
          letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}
      >
        Estudio de capacidades legales
      </div>
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-h2)',
          lineHeight: 'var(--lh-heading)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--text-primary)',
        }}
      >
        Aviso de privacidad
      </h1>
      <p style={{ ...p, margin: '12px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono-sm)', letterSpacing: 'var(--tracking-mono)', color: 'var(--text-muted)' }}>
        borrador · pendiente de revisión del autor
      </p>

      {/* ↓↓↓ BORRADOR PENDIENTE DE REVISIÓN DEL AUTOR — sustituir por el texto definitivo ↓↓↓ */}

      <h2 style={h2}>Responsable del estudio</h2>
      <p style={p}>
        Ernesto Ramos Urías, postulante a la licenciatura en Derecho por el Instituto Tecnológico Autónomo de México (ITAM), es el
        responsable de este estudio y del tratamiento de las respuestas.
      </p>

      <h2 style={h2}>Finalidad</h2>
      <p style={p}>
        Las respuestas se recaban con una finalidad exclusivamente académica: una tesina de licenciatura en Derecho que mide las
        capacidades legales de la población. Los datos se usan únicamente de forma agregada para ese análisis.
      </p>

      <h2 style={h2}>Datos que se recolectan</h2>
      <p style={p}>
        Se recolectan sus respuestas a las escalas de la encuesta y algunos datos demográficos generales (por ejemplo, edad, género,
        entidad federativa y nivel de estudios), sin identificadores personales. Sirven solo para describir a quienes participan.
      </p>

      <h2 style={h2}>Carácter anónimo</h2>
      <p style={p}>
        La encuesta es anónima. No se recolecta su nombre, correo electrónico, teléfono, dirección IP ni ningún otro identificador que
        permita vincular las respuestas con usted.
      </p>

      <h2 style={h2}>Campos de texto libre</h2>
      <p style={p}>
        Algunas preguntas admiten texto libre (por ejemplo, la ocupación). Le pedimos <strong>no escribir su nombre ni datos
        personales</strong> en esos campos, para conservar el anonimato de sus respuestas.
      </p>

      <h2 style={h2}>Transferencias</h2>
      <p style={p}>
        No se realizan transferencias de sus datos a terceros. Se conservan únicamente para el análisis de esta investigación.
      </p>

      <h2 style={h2}>Contacto</h2>
      <p style={p}>
        Si tiene dudas sobre este aviso o sobre el estudio, puede escribir a{' '}
        <a href="mailto:eramosurias@gmail.com">eramosurias@gmail.com</a>.
      </p>

      {/* ↑↑↑ FIN DEL BORRADOR PENDIENTE DE REVISIÓN DEL AUTOR ↑↑↑ */}
    </main>
  );
}
