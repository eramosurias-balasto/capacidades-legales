import type { CSSProperties } from 'react';

export const metadata = { title: 'Aviso de privacidad' };

// Página pública del aviso de privacidad, con el design system RU.L de la encuesta.
// Texto definitivo entregado por el autor (última actualización: julio de 2026).

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
        Estudio sobre capacidades legales internas en México
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

      <h2 style={h2}>Responsable</h2>
      <p style={p}>
        Este estudio forma parte de la tesina de licenciatura en Derecho de Ernesto Ramos Urías (Instituto Tecnológico Autónomo de
        México). El autor es responsable del tratamiento de la información recolectada.
      </p>

      <h2 style={h2}>Finalidad</h2>
      <p style={p}>
        La información se recolecta con fines exclusivamente académicos: medir capacidades legales internas mediante un instrumento
        psicométrico adaptado al contexto mexicano, como parte de una investigación de titulación. Los resultados se analizarán y
        publicarán únicamente de forma agregada.
      </p>

      <h2 style={h2}>Qué se recolecta</h2>
      <p style={p}>
        Sus respuestas al cuestionario y datos demográficos generales (edad, género, entidad federativa, escolaridad, entre otros). La
        encuesta NO solicita ni almacena su nombre, correo electrónico, teléfono, dirección IP ni ningún otro dato que permita
        identificarle. El enlace por el que accede indica únicamente la institución o grupo de procedencia.
      </p>

      <h2 style={h2}>Anonimato</h2>
      <p style={p}>
        Sus respuestas son anónimas desde el momento de su registro: no existe forma técnica de vincularlas con usted. Por la misma
        razón, una vez enviadas no es posible localizarlas para modificarlas o eliminarlas de manera individual.
      </p>

      <h2 style={h2}>Campos de texto libre</h2>
      <p style={p}>
        Algunas preguntas permiten escribir una respuesta propia. Le pedimos no incluir en ellas nombres, lugares de trabajo específicos
        ni cualquier dato que pudiera identificarle a usted o a terceros.
      </p>

      <h2 style={h2}>Transferencias</h2>
      <p style={p}>
        La información no se venderá, compartirá ni transferirá a terceros. Se almacena en una base de datos con acceso restringido y se
        utilizará únicamente para los fines académicos descritos.
      </p>

      <h2 style={h2}>Participación voluntaria</h2>
      <p style={p}>
        Responder esta encuesta es voluntario. Puede abandonarla en cualquier momento antes de enviarla, sin consecuencia alguna; en ese
        caso, sus respuestas no quedan registradas.
      </p>

      <h2 style={h2}>Contacto</h2>
      <p style={p}>
        Para cualquier duda sobre este estudio o este aviso, puede escribir a{' '}
        <a href="mailto:eramosurias@gmail.com">eramosurias@gmail.com</a>.
      </p>

      <p
        style={{
          margin: '40px 0 0',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-mono-sm)',
          letterSpacing: 'var(--tracking-mono)',
          color: 'var(--text-muted)',
        }}
      >
        Última actualización: julio de 2026.
      </p>
    </main>
  );
}
