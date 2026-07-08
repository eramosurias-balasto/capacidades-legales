# CLAUDE.md — App de Encuesta de Capacidades Legales

Guía de trabajo para este repositorio. La fuente de verdad es
[`SPEC-app-encuesta-railway.md`](SPEC-app-encuesta-railway.md). Ante cualquier duda,
gana el SPEC; este archivo lo resume, no lo reemplaza.

## Qué es

Aplicación web (Next.js 14+, App Router, TypeScript) que aplica la **encuesta de
capacidades legales adaptada a México (Pleasence y Balmer, 2018)** a estudiantes de
educación media superior de tres instituciones. La encuesta es anónima, en español y
optimizada para celular. Guarda resultados en **Supabase (Postgres)** y expone un
**dashboard protegido con contraseña** con análisis en tiempo real y exportación de CSV.

- Un link por institución: `/encuesta/[slug]` identifica la procedencia. Además hay un
  cuarto link `/encuesta/general` para público adulto: `instituciones.tipo` (`escolar` |
  `general`) ramifica el flujo, la validación y la separación en el dashboard. La muestra
  general es de conveniencia y se analiza SIEMPRE por separado (ver DECISIONES.md D10/D11).
- Cinco escalas psicométricas: **EAJ** (6 ítems), **EAL** (4), **CLG** (6), **IAJ** (9),
  **DPJ** (6).
- La calibración Rasch con datos mexicanos NO ocurre en la app: se hace offline en R con
  el paquete [easyRasch](https://github.com/pgmj/easyRasch) sobre el CSV que exporta el
  dashboard. La app solo aplica las tablas de conversión oficiales de P&B 2018.
- Despliegue: Railway (un solo servicio Next.js) + Supabase.

## Reglas críticas (no negociables)

1. **Los textos de los ítems son un instrumento validado: NO se modifican ni una letra.**
   No parafrasear, no "mejorar" la redacción, no corregir ortografía, acentos ni el
   tratamiento usted/tú. Se copian carácter por carácter desde la sección 5 del SPEC a
   `lib/instrumento.ts`. Criterio de aceptación explícito: coincidencia carácter por
   carácter. Esto incluye las inconsistencias conocidas (p. ej. CLG ítem 3 "hablar
   contigo" dentro de un bloque en "usted") — se implementan tal cual.

2. **Toda escritura y lectura a Supabase pasa por el servidor.** Solo las API routes de
   Next.js hablan con Supabase, usando `SUPABASE_SERVICE_ROLE_KEY`. El navegador NUNCA se
   conecta directo a Supabase. La `service_role_key` jamás se expone al cliente ni se
   prefija con `NEXT_PUBLIC_`. RLS habilitado en todas las tablas con *deny-all* para
   `anon` y `authenticated`.

3. **Sin datos identificables del alumno.** No se recolecta nombre, correo, teléfono, IP
   ni ningún identificador personal. Anti-duplicados solo con `localStorage` (flag por
   slug); sin cookies de tracking ni IP.

4. **La puntuación se calcula en el servidor** (`/api/submit`), nunca en el cliente. Se
   guarda el crudo de captura (índice 0–3 de la opción elegida, SIN invertir) en `items`;
   las inversiones y reglas especiales de la sección 6 se aplican solo al puntuar. Guardar
   el crudo permite recalibrar Rasch después.

5. **El dashboard y los exports están protegidos** por contraseña (`DASHBOARD_PASSWORD`)
   con cookie httpOnly firmada. `/api/results`, `/api/export` y `/api/export-rasch`
   exigen esa cookie.

## Puntos delicados de puntuación (sección 6)

- **CLG:** puntaje = 3 − índice (muy seguro=3 … nada seguro=0).
- **IAJ:** ítems 1,4,6,7,8 = índice; ítems 2,3,9 invertidos (3 − índice); **ítem 5 regla
  especial**: tot. de acuerdo=2, may. de acuerdo=1, may. en desacuerdo=0, tot. en
  desacuerdo=0 (categoría colapsada; máx. del ítem = 2). Bruta 0–26.
- **DPJ:** ítems 1,2,4,5 invertidos (3 − índice); ítems 3 y 6 = índice. Bruta 0–18.
- Las tablas `RASCH` se copian como constantes; índice del arreglo = puntuación bruta.
- Tests obligatorios: todo 0, todo 3 y un mixto por escala, cubriendo IAJ ítem 5 y
  DPJ 3/6.

## Orden de fases (sección 10 del SPEC)

1. **Scaffold** Next.js + Tailwind + estructura de carpetas; `lib/instrumento.ts` (textos
   exactos) y `lib/scoring.ts` + tests.
2. **Migración SQL** de Supabase (`supabase/migrations/`) y cliente de servidor.
3. **Flujo de encuesta** completo con validación y `/api/submit`.
4. **Dashboard:** login, resumen, puntuaciones, nivel ítem, exports (`/api/export` y
   `/api/export-rasch`).
5. **Carpeta `analisis-r/`** con la plantilla Quarto de easyRasch y su README (sección 7 bis).
6. **QA:** correr tests de scoring, probar el flujo en móvil (viewport 375px), enviar 3–5
   respuestas de prueba y verificar que dashboard y CSV cuadren a mano.

## Stack / convenciones

- Next.js 14+ App Router, TypeScript, Tailwind CSS. Diseño sobrio, barra de progreso.
- **Encuesta pública (rediseño RU.L):** rutas `/encuesta` y `/gracias` bajo el grupo
  `app/(publico)/` con su propio design system (tokens en `styles/ru/`, primitivas en
  `components/encuesta/ds.tsx`). El dashboard NO comparte esos estilos. Ver DECISIONES.md D12.
- Gráficas: Recharts. Sin servicios externos de analytics.
- Variables de entorno: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DASHBOARD_PASSWORD`,
  `SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`.
- Escalas (orden canónico): `eaj`, `eal`, `clg`, `iaj`, `dpj`.

## Decisiones del autor (ambigüedades del SPEC resueltas)

Registradas en [`DECISIONES.md`](DECISIONES.md). Consultar antes de introducir variantes.
