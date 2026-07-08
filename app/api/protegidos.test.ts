import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('@/lib/session', () => ({ sesionActiva: vi.fn() }));
vi.mock('@/lib/supabase-server', () => ({
  getRespuestas: vi.fn(async () => []),
  getInstituciones: vi.fn(async () => []),
}));

import { sesionActiva } from '@/lib/session';
import { GET as resultsGET } from './results/route';
import { GET as exportGET } from './export/route';
import { GET as raschGET } from './export-rasch/route';

const auth = (v: boolean) => (sesionActiva as Mock).mockReturnValue(v);
const raschReq = (qs = '?escala=eaj') => new Request('http://localhost/api/export-rasch' + qs);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('endpoints protegidos: 401 sin cookie', () => {
  it('/api/results → 401', async () => {
    auth(false);
    expect((await resultsGET()).status).toBe(401);
  });
  it('/api/export → 401', async () => {
    auth(false);
    expect((await exportGET()).status).toBe(401);
  });
  it('/api/export-rasch → 401', async () => {
    auth(false);
    expect((await raschGET(raschReq())).status).toBe(401);
  });
});

describe('endpoints protegidos: con sesión válida', () => {
  it('/api/results → 200 con estructura agregada', async () => {
    auth(true);
    const res = await resultsGET();
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.totalN).toBe(0);
    expect(j.porTipo).toEqual({ escolar: 0, general: 0 });
  });

  it('/api/export → 200 text/csv', async () => {
    auth(true);
    const res = await exportGET();
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
  });

  it('/api/export-rasch → 200 con escala válida, 400 con inválida', async () => {
    auth(true);
    expect((await raschGET(raschReq('?escala=eaj'))).status).toBe(200);
    expect((await raschGET(raschReq('?escala=zzz'))).status).toBe(400);
    expect((await raschGET(raschReq(''))).status).toBe(400);
  });
});
