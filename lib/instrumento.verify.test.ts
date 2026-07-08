import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ESCALAS, ORDEN_ESCALAS, NUM_ITEMS, EscalaId } from './instrumento';

// Guarda automática del criterio "carácter por carácter": revalida cada texto de
// lib/instrumento.ts contra SPEC-app-encuesta-railway.md §5. Si alguien edita un ítem,
// este test falla. La instrucción de DPJ es la excepción documentada (DECISIONES.md D1):
// el SPEC no la da literal, así que se compara contra la reconstrucción verificada.

const SPEC = readFileSync(join(process.cwd(), 'SPEC-app-encuesta-railway.md'), 'utf8');

const BOUNDS: Record<EscalaId, [string, string]> = {
  eaj: ['### 5.1', '### 5.2'],
  eal: ['### 5.2', '### 5.3'],
  clg: ['### 5.3', '### 5.4'],
  iaj: ['### 5.4', '### 5.5'],
  dpj: ['### 5.5', '## 6.'],
};

function seccion(id: EscalaId): string {
  const [a, b] = BOUNDS[id];
  return SPEC.slice(SPEC.indexOf(a), SPEC.indexOf(b));
}

function itemsDelSpec(id: EscalaId): string[] {
  const items: string[] = [];
  for (const line of seccion(id).split(/\r?\n/)) {
    const m = line.match(/^(\d+)\.\s+(.*\S)\s*$/);
    if (m) items.push(m[2]);
  }
  return items;
}

function instruccionDelSpec(id: EscalaId): string | null {
  const m = seccion(id).match(/\*Instrucci[oó]n:\*\s*"(.*)"\s*$/m);
  return m ? m[1] : null;
}

describe('lib/instrumento.ts coincide carácter por carácter con el SPEC §5', () => {
  for (const id of ORDEN_ESCALAS) {
    describe(id, () => {
      it('número de ítems', () => {
        expect(ESCALAS[id].items).toHaveLength(NUM_ITEMS[id]);
        expect(itemsDelSpec(id)).toHaveLength(NUM_ITEMS[id]);
      });

      it('textos de los ítems idénticos al SPEC', () => {
        expect(ESCALAS[id].items).toEqual(itemsDelSpec(id));
      });

      it('instrucción idéntica al SPEC', () => {
        if (id === 'dpj') {
          // DECISIONES.md D1: reconstruida (el SPEC no la da literal). Al menos debe
          // terminar con la oración final que el SPEC sí especifica.
          expect(ESCALAS.dpj.instruccion).toMatch(
            /Pensando en cuestiones como estas, ¿en qué medida está de acuerdo o en desacuerdo con las siguientes afirmaciones\?$/,
          );
        } else {
          expect(ESCALAS[id].instruccion).toBe(instruccionDelSpec(id));
        }
      });

      it('cuatro categorías de respuesta', () => {
        expect(ESCALAS[id].categorias).toHaveLength(4);
      });
    });
  }
});
