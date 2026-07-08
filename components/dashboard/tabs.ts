// Definición de pestañas del dashboard, aislada de recharts para poder testearse sin
// arrastrar el bundle de gráficas.

export type TabId = 'inicio' | 'resumen' | 'puntuaciones' | 'nivel-item' | 'demografia' | 'exportar';

export const TABS: { id: TabId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'resumen', label: 'Resumen' },
  { id: 'puntuaciones', label: 'Puntuaciones' },
  { id: 'nivel-item', label: 'Nivel ítem' },
  { id: 'demografia', label: 'Demografía' },
  { id: 'exportar', label: 'Exportar' },
];

/** Vista por defecto al entrar: la primera pestaña (Inicio). */
export const TAB_DEFAULT: TabId = TABS[0].id;
