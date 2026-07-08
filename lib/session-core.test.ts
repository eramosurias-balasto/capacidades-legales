import { describe, it, expect } from 'vitest';
import { crearValorSesion, valorSesionValido, passwordCorrecta, DURACION_SESION_SEG } from './session-core';

const SECRET = 'secreto-de-prueba-largo-1234567890';

describe('sesión: firma y verificación', () => {
  it('un valor recién creado es válido', () => {
    const v = crearValorSesion(SECRET);
    expect(valorSesionValido(SECRET, v)).toBe(true);
  });

  it('rechaza con secreto distinto', () => {
    const v = crearValorSesion(SECRET);
    expect(valorSesionValido('otro-secreto', v)).toBe(false);
  });

  it('rechaza firma manipulada', () => {
    const v = crearValorSesion(SECRET);
    const [payload] = v.split('.');
    expect(valorSesionValido(SECRET, `${payload}.firmafalsa`)).toBe(false);
  });

  it('rechaza payload manipulado (misma firma vieja)', () => {
    const v = crearValorSesion(SECRET);
    const sig = v.split('.')[1];
    const futuro = Math.floor(Date.now() / 1000) + 99999;
    expect(valorSesionValido(SECRET, `${futuro}.${sig}`)).toBe(false);
  });

  it('rechaza una sesión expirada', () => {
    const hace9h = Date.now() - (DURACION_SESION_SEG + 60) * 1000;
    const v = crearValorSesion(SECRET, hace9h);
    expect(valorSesionValido(SECRET, v)).toBe(false);
  });

  it('rechaza vacío / malformado', () => {
    expect(valorSesionValido(SECRET, undefined)).toBe(false);
    expect(valorSesionValido(SECRET, '')).toBe(false);
    expect(valorSesionValido(SECRET, 'sinpunto')).toBe(false);
  });
});

describe('contraseña', () => {
  it('acepta la correcta y rechaza la incorrecta', () => {
    expect(passwordCorrecta('hunter2', 'hunter2')).toBe(true);
    expect(passwordCorrecta('hunter2', 'Hunter2')).toBe(false);
    expect(passwordCorrecta('hunter2', 'hunter')).toBe(false);
    expect(passwordCorrecta('hunter2', '')).toBe(false);
    expect(passwordCorrecta('hunter2', 123)).toBe(false);
  });
});
