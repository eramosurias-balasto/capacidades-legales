import { describe, it, expect } from 'vitest';
import { validarSubmit } from './submit-validation';

// Ítems válidos base (longitudes correctas, valores 0–3).
const itemsOk = {
  eaj: [0, 1, 2, 3, 0, 1],
  eal: [0, 1, 2, 3],
  clg: [0, 1, 2, 3, 0, 1],
  iaj: [0, 1, 2, 3, 0, 1, 2, 3, 0],
  dpj: [0, 1, 2, 3, 0, 1],
};

// Base demográfica común válida.
const demoComun = {
  acepto_aviso: true,
  edad: 17,
  genero: 'mujer',
  se_considera_indigena: 'no',
  se_considera_afro: 'prefiero_no_responder',
  nivel_educativo_padre: 'licenciatura',
  nivel_educativo_madre: 'no_lo_se',
  items: itemsOk,
};

function escolar(extra: Record<string, unknown> = {}) {
  return { ...demoComun, cohorte: 'curso_primavera_2026', ...extra };
}
function general(extra: Record<string, unknown> = {}) {
  return {
    ...demoComun,
    cohorte: 'general_si_curso',
    nivel_educativo_propio: 'licenciatura',
    ocupacion: 'Abogada',
    curso_derecho_detalle: 'Derecho mercantil, en la universidad, 2015',
    ...extra,
  };
}

describe('escolar', () => {
  it('acepta un payload escolar válido y normaliza campos general a null', () => {
    const r = validarSubmit(escolar(), 'escolar');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.limpio.cohorte).toBe('curso_primavera_2026');
      expect(r.limpio.nivel_educativo_propio).toBeNull();
      expect(r.limpio.ocupacion).toBeNull();
      expect(r.limpio.curso_derecho_detalle).toBeNull();
    }
  });

  it('rechaza cohorte general en institución escolar', () => {
    const r = validarSubmit(escolar({ cohorte: 'general_si_curso' }), 'escolar');
    expect(r.ok).toBe(false);
  });

  it('rechaza campos exclusivos de general en flujo escolar', () => {
    expect(validarSubmit(escolar({ ocupacion: 'Estudiante' }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ nivel_educativo_propio: 'primaria' }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ curso_derecho_detalle: 'algo' }), 'escolar').ok).toBe(false);
  });
});

describe('general', () => {
  it('acepta un payload general válido (cursó Derecho)', () => {
    const r = validarSubmit(general(), 'general');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.limpio.cohorte).toBe('general_si_curso');
      expect(r.limpio.nivel_educativo_propio).toBe('licenciatura');
      expect(r.limpio.ocupacion).toBe('Abogada');
      expect(r.limpio.curso_derecho_detalle).toContain('Derecho mercantil');
    }
  });

  it('acepta general_no_curso sin detalle y lo deja null', () => {
    const r = validarSubmit(
      general({ cohorte: 'general_no_curso', curso_derecho_detalle: undefined }),
      'general',
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.limpio.curso_derecho_detalle).toBeNull();
  });

  it('rechaza cohorte escolar en institución general', () => {
    expect(validarSubmit(general({ cohorte: 'curso_primavera_2026' }), 'general').ok).toBe(false);
  });

  it('exige nivel_educativo_propio y rechaza "no_lo_se"', () => {
    expect(validarSubmit(general({ nivel_educativo_propio: undefined }), 'general').ok).toBe(false);
    expect(validarSubmit(general({ nivel_educativo_propio: 'no_lo_se' }), 'general').ok).toBe(false);
  });

  it('exige ocupacion no vacía y respeta el máximo de 120', () => {
    expect(validarSubmit(general({ ocupacion: '   ' }), 'general').ok).toBe(false);
    expect(validarSubmit(general({ ocupacion: 'a'.repeat(121) }), 'general').ok).toBe(false);
    expect(validarSubmit(general({ ocupacion: 'a'.repeat(120) }), 'general').ok).toBe(true);
  });

  it('exige curso_derecho_detalle si cursó Derecho y respeta el máximo de 200', () => {
    expect(validarSubmit(general({ curso_derecho_detalle: undefined }), 'general').ok).toBe(false);
    expect(validarSubmit(general({ curso_derecho_detalle: 'x'.repeat(201) }), 'general').ok).toBe(false);
    expect(validarSubmit(general({ curso_derecho_detalle: 'x'.repeat(200) }), 'general').ok).toBe(true);
  });

  it('rechaza detalle cuando NO cursó Derecho', () => {
    const r = validarSubmit(
      general({ cohorte: 'general_no_curso', curso_derecho_detalle: 'no debería' }),
      'general',
    );
    expect(r.ok).toBe(false);
  });
});

describe('validaciones comunes a ambos tipos', () => {
  it('rechaza sin consentimiento', () => {
    expect(validarSubmit(escolar({ acepto_aviso: false }), 'escolar').ok).toBe(false);
  });
  it('rechaza edad fuera de rango', () => {
    expect(validarSubmit(escolar({ edad: 11 }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ edad: 100 }), 'escolar').ok).toBe(false);
    expect(validarSubmit(general({ edad: 40 }), 'general').ok).toBe(true);
  });
  it('rechaza demografía fuera de catálogo', () => {
    expect(validarSubmit(escolar({ genero: 'x' }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ se_considera_indigena: 'quizas' }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ nivel_educativo_madre: 'doctorado' }), 'escolar').ok).toBe(false);
  });
  it('rechaza items con longitud o valores inválidos', () => {
    expect(validarSubmit(escolar({ items: { ...itemsOk, iaj: [0, 1, 2] } }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ items: { ...itemsOk, eaj: [0, 1, 2, 3, 0, 4] } }), 'escolar').ok).toBe(false);
    expect(validarSubmit(escolar({ items: { ...itemsOk, eaj: [0, 1, 2, 3, 0, 1.5] } }), 'escolar').ok).toBe(false);
  });
});
