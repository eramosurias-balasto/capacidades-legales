import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// La página decide entre dashboard y login según la sesión. Mockeamos ambas vistas y la
// sesión para probar el gating sin cargar recharts ni server-only.
vi.mock('@/lib/session', () => ({ sesionActiva: vi.fn() }));
vi.mock('@/components/dashboard/Dashboard', () => ({ Dashboard: () => React.createElement('div', null, 'DASH-VIEW') }));
vi.mock('@/components/dashboard/LoginForm', () => ({ LoginForm: () => React.createElement('div', null, 'LOGIN-VIEW') }));

import DashboardPage from './page';
import { sesionActiva } from '@/lib/session';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/dashboard (Inicio detrás del login)', () => {
  it('autenticado renderiza el dashboard (que arranca en Inicio)', () => {
    (sesionActiva as Mock).mockReturnValue(true);
    const html = renderToStaticMarkup(DashboardPage());
    expect(html).toContain('DASH-VIEW');
    expect(html).not.toContain('LOGIN-VIEW');
  });

  it('sin cookie muestra el login, no el dashboard', () => {
    (sesionActiva as Mock).mockReturnValue(false);
    const html = renderToStaticMarkup(DashboardPage());
    expect(html).toContain('LOGIN-VIEW');
    expect(html).not.toContain('DASH-VIEW');
  });
});
