import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

// Mock del acceso a Supabase para probar el route handler sin red ni BD.
vi.mock('@/lib/supabase-server', () => ({
  getInstitucionActiva: vi.fn(),
  getSupabaseAdmin: vi.fn(),
}));

import { POST } from './route';
import { getInstitucionActiva, getSupabaseAdmin } from '@/lib/supabase-server';

const instEscolar = { id: 1, slug: 'inst-a', nombre: 'A', activa: true, tipo: 'escolar' as const };
const instGeneral = { id: 4, slug: 'general', nombre: 'General', activa: true, tipo: 'general' as const };

// Captura la fila insertada y devuelve un id simulado.
function mockInsertOk() {
  const single = vi.fn().mockResolvedValue({ data: { id: 'resp-1' }, error: null });
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn((_fila: unknown) => ({ select }));
  const from = vi.fn(() => ({ insert }));
  (getSupabaseAdmin as Mock).mockReturnValue({ from });
  return { insert };
}

function req(body: unknown) {
  return new Request('http://localhost/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'vitest' },
    body: JSON.stringify(body),
  });
}

const itemsCero = {
  eaj: [0, 0, 0, 0, 0, 0],
  eal: [0, 0, 0, 0],
  clg: [0, 0, 0, 0, 0, 0],
  iaj: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  dpj: [0, 0, 0, 0, 0, 0],
};

const payloadEscolar = {
  slug: 'inst-a',
  acepto_aviso: true,
  cohorte: 'curso_primavera_2026',
  edad: 17,
  genero: 'hombre',
  se_considera_indigena: 'no',
  se_considera_afro: 'no',
  nivel_educativo_padre: 'secundaria',
  nivel_educativo_madre: 'primaria',
  entidad: 'Jalisco',
  items: itemsCero,
  duracion_segundos: 120,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/submit', () => {
  it('404 si la institución no existe o está inactiva', async () => {
    (getInstitucionActiva as Mock).mockResolvedValue(null);
    const res = await POST(req({ ...payloadEscolar, slug: 'no-existe' }));
    expect(res.status).toBe(404);
  });

  it('400 si falta el slug', async () => {
    const { slug: _omit, ...sinSlug } = payloadEscolar;
    const res = await POST(req(sinSlug));
    expect(res.status).toBe(400);
  });

  it('400 si el cuerpo no es JSON', async () => {
    const bad = new Request('http://localhost/api/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{no-json',
    });
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });

  it('400 si la validación condicional falla (cohorte general en institución escolar)', async () => {
    (getInstitucionActiva as Mock).mockResolvedValue(instEscolar);
    const res = await POST(req({ ...payloadEscolar, cohorte: 'general_si_curso' }));
    expect(res.status).toBe(400);
  });

  it('201 y puntúa en el servidor para un payload escolar válido', async () => {
    (getInstitucionActiva as Mock).mockResolvedValue(instEscolar);
    const { insert } = mockInsertOk();

    const res = await POST(req(payloadEscolar));
    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({ id: 'resp-1' });

    const fila = insert.mock.calls[0][0] as Record<string, unknown>;
    // Puntuación calculada en el servidor (todo 0). CLG invertida => 18; IAJ 11; DPJ 12.
    expect(fila.eaj_bruta).toBe(0);
    expect(fila.clg_bruta).toBe(18);
    expect(fila.iaj_bruta).toBe(11);
    expect(fila.dpj_bruta).toBe(12);
    expect(fila.eaj_rasch).toBe(0);
    expect(fila.institucion_id).toBe(1);
    expect(fila.items).toEqual(itemsCero); // se guarda el crudo sin invertir
    expect(fila.user_agent).toBe('vitest');
    expect(fila.entidad).toBe('Jalisco');
    // Campos exclusivos de general quedan null en escolar.
    expect(fila.ocupacion).toBeNull();
    expect(fila.nivel_educativo_propio).toBeNull();
    expect(fila.curso_derecho_detalle).toBeNull();
    expect(fila.curso_derecho_anio).toBeNull();
  });

  it('201 para un payload general válido con campos propios', async () => {
    (getInstitucionActiva as Mock).mockResolvedValue(instGeneral);
    const { insert } = mockInsertOk();

    const res = await POST(
      req({
        slug: 'general',
        acepto_aviso: true,
        cohorte: 'general_si_curso',
        edad: 40,
        genero: 'mujer',
        se_considera_indigena: 'prefiero_no_responder',
        se_considera_afro: 'no',
        nivel_educativo_padre: 'no_lo_se',
        nivel_educativo_madre: 'licenciatura',
        entidad: 'Ciudad de México',
        nivel_educativo_propio: 'posgrado',
        ocupacion: 'Abogada',
        curso_derecho_detalle: 'Un diplomado en la universidad',
        curso_derecho_anio: 2010,
        items: itemsCero,
      }),
    );
    expect(res.status).toBe(201);
    const fila = insert.mock.calls[0][0] as Record<string, unknown>;
    expect(fila.institucion_id).toBe(4);
    expect(fila.entidad).toBe('Ciudad de México');
    expect(fila.nivel_educativo_propio).toBe('posgrado');
    expect(fila.ocupacion).toBe('Abogada');
    expect(fila.curso_derecho_detalle).toBe('Un diplomado en la universidad');
    expect(fila.curso_derecho_anio).toBe(2010);
  });

  it('500 si la inserción en Supabase falla', async () => {
    (getInstitucionActiva as Mock).mockResolvedValue(instEscolar);
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    (getSupabaseAdmin as Mock).mockReturnValue({ from: vi.fn(() => ({ insert })) });

    const res = await POST(req(payloadEscolar));
    expect(res.status).toBe(500);
  });
});
