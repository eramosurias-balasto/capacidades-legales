// Ruta "/" (SPEC §2): página neutra. La encuesta solo existe con un link de institución.

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold">Encuesta no disponible</h1>
      <p className="text-slate-600">
        Esta encuesta solo puede responderse con el enlace proporcionado por tu institución
        educativa.
      </p>
    </main>
  );
}
