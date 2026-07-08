import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Inicio } from './Inicio';
import { TABS, TAB_DEFAULT } from './tabs';

// Renderiza SOLO Inicio (sin recharts): rápido y sin depender de /api/results.
const html = renderToStaticMarkup(createElement(Inicio));

describe('Dashboard: pestaña Inicio', () => {
  it('Inicio es la primera pestaña y la vista por defecto', () => {
    expect(TABS[0].id).toBe('inicio');
    expect(TAB_DEFAULT).toBe('inicio');
  });

  it('renderiza el copy del autor (verbatim)', () => {
    expect(html).toContain('Capacidades legales en México — tablero del estudio');
    expect(html).toContain('capacidades legales internas');
    expect(html).toContain('Sobre el autor');
    expect(html).toContain('Ernesto Ramos Urías');
  });

  it('links externos abren en pestaña nueva con rel noopener', () => {
    expect(html).toContain('href="https://github.com/pgmj/easyRasch"');
    expect(html).toContain('research.thelegaleducationfoundation.org');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('link interno a la encuesta general y correo como mailto', () => {
    expect(html).toContain('/encuesta/general');
    expect(html).toContain('href="mailto:eramosurias@gmail.com"');
  });
});
