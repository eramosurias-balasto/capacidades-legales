import { AvisoGeneralTexto, AVISO_TITULO } from '@/components/encuesta/aviso';

export const metadata = { title: AVISO_TITULO };

// Página pública del aviso al encuestado, con el design system RU.L de la encuesta.
// El mismo texto se muestra en el modal de consentimiento del flujo (components/encuesta/aviso.tsx).
// Se conserva la ruta /aviso-de-privacidad para no romper enlaces externos existentes.

export default function AvisoAlEncuestado() {
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
          margin: '0 0 8px',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-h2)',
          lineHeight: 'var(--lh-heading)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--text-primary)',
        }}
      >
        {AVISO_TITULO}
      </h1>

      <AvisoGeneralTexto />
    </main>
  );
}
