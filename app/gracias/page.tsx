export const metadata = { title: 'Gracias' };

export default function Gracias() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">¡Gracias por participar!</h1>
      <p className="text-slate-600">
        Tu respuesta se registró correctamente. Tu participación anónima es muy valiosa para esta
        investigación.
      </p>
      <p className="text-sm text-slate-400">Ya puedes cerrar esta ventana.</p>
    </main>
  );
}
