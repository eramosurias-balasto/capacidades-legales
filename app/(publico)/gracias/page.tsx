export const metadata = { title: 'Gracias' };

// Pantalla de gracias (RU.L). Muestra un folio anónimo en mono: los últimos 6 caracteres del
// uuid de la respuesta, que llega por query (?folio=XXXXXX) desde el flujo. Sin masthead.
export default function Gracias({ searchParams }: { searchParams: { folio?: string } }) {
  const folio = (searchParams.folio ?? '').replace(/[^0-9A-Za-z]/g, '').slice(-6).toUpperCase();

  const mono = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-mono-sm)',
    letterSpacing: 'var(--tracking-mono)',
    color: 'var(--text-muted)',
  } as const;

  return (
    <main style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: '72px 24px 64px', textAlign: 'center' }}>
      <div style={{ width: 44, height: 6, background: 'var(--accent)', borderRadius: 2, margin: '0 auto 32px' }} />
      <div
        style={{
          fontFamily: 'var(--font-text)',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-label)',
          letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 18,
        }}
      >
        Estudio de capacidades legales
      </div>
      <h1
        style={{
          margin: '0 auto',
          maxWidth: '20ch',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-h2)',
          lineHeight: 'var(--lh-heading)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--text-primary)',
        }}
      >
        Hemos registrado sus respuestas.
      </h1>
      <p style={{ margin: '20px auto 0', maxWidth: '42ch', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)' }}>
        Gracias por su tiempo. Sus respuestas quedan guardadas de forma anónima y contribuyen a un estudio sobre el acceso a la justicia en México.
      </p>
      {folio ? <p style={{ margin: '28px auto 0', ...mono }}>registro anónimo · núm. {folio}</p> : null}
    </main>
  );
}
