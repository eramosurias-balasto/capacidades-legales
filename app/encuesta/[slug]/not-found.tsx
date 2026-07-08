export default function NoEncontrada() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold">Encuesta no disponible</h1>
      <p className="text-slate-600">
        El enlace no corresponde a ninguna encuesta activa. Verifica que sea el link exacto que te
        compartió tu institución.
      </p>
    </main>
  );
}
