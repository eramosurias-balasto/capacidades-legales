import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('@/lib/session', () => ({
  passwordCorrecta: vi.fn(),
  crearValorSesion: vi.fn(() => 'token-firmado'),
}));

import { POST } from './route';
import { passwordCorrecta } from '@/lib/session';
import { COOKIE_SESION } from '@/lib/session-core';

function req(body: unknown) {
  return new Request('http://localhost/api/dashboard/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/dashboard/login', () => {
  it('200 y setea cookie de sesión con contraseña correcta', async () => {
    (passwordCorrecta as Mock).mockReturnValue(true);
    const res = await POST(req({ password: 'buena' }));
    expect(res.status).toBe(200);
    const cookie = res.cookies.get(COOKIE_SESION);
    expect(cookie?.value).toBe('token-firmado');
    expect(cookie?.httpOnly).toBe(true);
  });

  it('401 con contraseña incorrecta y sin cookie', async () => {
    (passwordCorrecta as Mock).mockReturnValue(false);
    const res = await POST(req({ password: 'mala' }));
    expect(res.status).toBe(401);
    expect(res.cookies.get(COOKIE_SESION)).toBeUndefined();
  });
});
