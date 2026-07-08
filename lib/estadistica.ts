// Estadística descriptiva mínima para el dashboard. Funciones puras y testeables.

/** Media aritmética. Devuelve 0 si el arreglo está vacío. */
export function media(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Mediana. Devuelve 0 si el arreglo está vacío. */
export function mediana(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

/** Desviación estándar muestral (n − 1). Devuelve 0 si hay menos de 2 datos. */
export function desviacion(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = media(xs);
  const varianza = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(varianza);
}

/** Redondea a `d` decimales (para presentación; el cálculo se hace sin redondear). */
export function redondear(x: number, d = 1): number {
  const f = 10 ** d;
  return Math.round(x * f) / f;
}
