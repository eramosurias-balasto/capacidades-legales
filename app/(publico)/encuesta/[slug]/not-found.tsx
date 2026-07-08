export default function NoEncontrada() {
  return (
    <main style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
      <div style={{ width: 44, height: 6, background: 'var(--accent)', borderRadius: 2, margin: '0 auto 28px' }} />
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
        Encuesta no disponible
      </h1>
      <p style={{ margin: '18px auto 0', maxWidth: '44ch', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)' }}>
        El enlace no corresponde a ninguna encuesta activa. Verifique que sea el enlace exacto que le compartió su institución.
      </p>
    </main>
  );
}
