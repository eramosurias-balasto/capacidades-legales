# DECISIONES.md — Ambigüedades del SPEC resueltas por el autor

Este documento fija las decisiones metodológicas/de diseño que el SPEC deja abiertas o
implícitas, para que la implementación sea determinista y auditable. Fecha: 2026-07-08.

## D1 — Instrucción de la escala DPJ (texto literal reconstruido)

El SPEC (§5.5) no da la instrucción DPJ literal: dice "misma introducción que IAJ,
terminando en 'Pensando en cuestiones como estas, ¿en qué medida está de acuerdo o en
desacuerdo con las siguientes afirmaciones?'". Como rige la regla de "ni una letra", fijo
el string exacto a usar en `lib/instrumento.ts` (cuerpo de IAJ §5.4 con la última oración
sustituida):

> Ahora, algunas preguntas sobre su impresión general y su experiencia con el sistema de
> justicia. No nos interesa el sistema de justicia penal. Nos interesa el sistema de
> justicia que se ocupa de cuestiones como el despido injustificado por parte de su
> empleador, las lesiones sufridas como consecuencia de la negligencia de otra persona,
> las disputas económicas en el marco de un divorcio o el despojo de su vivienda.
> Pensando en cuestiones como estas, ¿en qué medida está de acuerdo o en desacuerdo con
> las siguientes afirmaciones?

## D2 — Ítems casi idénticos entre/dentro de escalas: se conservan

El instrumento reutiliza reactivos a propósito. NO se deduplican ni se "arreglan":
- IAJ ítem 2 ≈ DPJ ítem 1 (menos recursos → peor resultado).
- IAJ ítem 3 = DPJ ítem 2 (verbatim).
- DPJ ítem 3 ≈ DPJ ítem 6 (trato justo de las partes).
Cada uno vive en su escala y se puntúa según la regla de esa escala (§6). Es
característica del instrumento validado, no un error.

## D3 — IAJ ítem 5: categoría colapsada, se implementa tal cual

Recodificación: tot. de acuerdo=2, may. de acuerdo=1, may. en desacuerdo=0, tot. en
desacuerdo=0. Consecuencias asumidas:
- El ítem tiene máximo 2 (no 3); la bruta IAJ llega a 26 y la tabla `RASCH.iaj` tiene
  27 valores (índices 0–26). Consistente.
- En el CSV de `/api/export-rasch`, la columna `q5` de IAJ tendrá categorías {0,1,2}
  mientras el resto {0,1,2,3}. Cumple "mínimo = 0". El análisis PCM en R debe tratarlo
  así; se documentará en `analisis-r/`. No se altera la app.

Nota: el colapso de categorías del ítem 5 de IAJ es una **decisión de puntuación de P&B**
(cómo se calcula la bruta), no una limitación de captura. La **captura cruda 0–3 se
conserva** en `items` y se exporta en el CSV maestro (`/api/export`), de modo que la
calibración mexicana pueda analizar el funcionamiento de las 4 categorías originales del
ítem sin la pérdida que impone el colapso.

## D4 — Cohorte: solo dos opciones (sin "Otra situación")

Se mantiene únicamente `curso_primavera_2026` y `cursara_otono_2026` (coincide con el
`check` de la tabla `respuestas`). No se agrega tercera opción por ahora (§11 lo deja a
decisión del autor). Si se agrega después: actualizar el `check`, el catálogo de
validación y la UI; no afecta scoring ni tablas Rasch.

## D5 — Catálogos canónicos de demografía (valores almacenados)

Se guardan valores canónicos `snake_case` y se validan en el servidor. Etiqueta visible → valor:
- **genero:** Mujer→`mujer`, Hombre→`hombre`, Otro→`otro`, Prefiero no responder→`prefiero_no_responder`.
- **se_considera_indigena / se_considera_afro:** Sí→`si`, No→`no`, Prefiero no responder→`prefiero_no_responder`.
- **nivel_educativo_padre / _madre:** Sin estudios→`sin_estudios`, Primaria→`primaria`,
  Secundaria→`secundaria`, Preparatoria o bachillerato→`preparatoria`, Licenciatura→`licenciatura`,
  Posgrado→`posgrado`, No lo sé→`no_lo_se`.

## D6 — Exportación DIF (`/api/export-rasch`)

- `dif_institucion` = **slug** de la institución (estable, no-PII; §11 sugiere slugs no
  adivinables). No se exporta el nombre en este CSV.
- `dif_edad` = edad cruda (entero). easyRasch necesita agrupación categórica para DIF; el
  agrupamiento (p. ej. corte por mediana) se hace en la plantilla R, no en la app.
- `dif_cohorte`, `dif_genero` = valores canónicos de D5/D4.
- Nota para el análisis R: celdas chicas en `dif_genero` (`otro`,
  `prefiero_no_responder`) pueden impedir DIF estable; la plantilla R las colapsa/omite.
  La app exporta el dato completo.

## D7 — Anti-duplicados solo con localStorage (tradeoff aceptado)

Se acepta que borrar localStorage o usar modo incógnito permite reenviar. Es el precio de
NO recolectar IP/cookies de tracking ni PII (regla crítica 3). No se añade fingerprinting.

## D8 — Slugs de institución placeholder

Se mantiene el seed `inst-a/b/c` del SPEC. Los slugs definitivos (idealmente no
adivinables, p. ej. `inst-a-x7k2`) los sustituye el usuario en la migración/seed; no
bloquea el desarrollo.

## D9 — Tratamiento usted/tú

Se implementa el texto tal cual (mezcla usted/tú del instrumento). Decisión metodológica
del autor ya tomada en §11 del SPEC; el código no la "corrige".
