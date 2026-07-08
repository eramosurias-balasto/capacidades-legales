'use client';

import { useState } from 'react';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setOcupado(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      setError(res.status === 401 ? 'Contraseña incorrecta.' : 'No se pudo iniciar sesión.');
    } catch {
      setError('Problema de conexión.');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <form onSubmit={entrar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-slate-900">Dashboard</h1>
        <p className="mb-4 text-sm text-slate-500">Acceso restringido. Ingresa la contraseña.</p>
        {error ? <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoFocus
          className="mb-3 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-slate-800 focus:outline-none"
        />
        <button
          type="submit"
          disabled={ocupado || !password}
          className="w-full rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {ocupado ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
