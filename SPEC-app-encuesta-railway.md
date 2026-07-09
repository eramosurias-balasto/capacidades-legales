# SPEC — App de Encuesta de Capacidades Legales (Railway + Supabase)

Instrucciones para Claude Code. Construir una aplicación web que aplique la encuesta de capacidades legales adaptada a México (Pleasence y Balmer, 2018) a estudiantes de educación media superior de tres instituciones, guarde resultados en Supabase y muestre un dashboard con análisis en tiempo real conforme al método de Rasch.

---

## 1. Objetivo y alcance

- Encuesta anónima en línea, en español, optimizada para celular (los alumnos la contestarán desde su teléfono).
- Tres links distintos, uno por institución educativa, que identifican la procedencia de cada respuesta.
- **Un cuarto link "general"** (`/encuesta/general`) para aplicar la MISMA encuesta a público adulto de conveniencia, reciclando el esquema. Las instituciones tienen `tipo` (`escolar` | `general`) que ramifica el flujo. La muestra general se analiza SIEMPRE por separado y funciona como piloto del instrumento (ver DECISIONES.md D10).
- Flujo: aviso de privacidad → preguntas iniciales (cohorte de la materia de Derecho) → demografía → 5 escalas psicométricas → pantalla de agradecimiento.
- Resultados en Supabase (Postgres).
- Dashboard protegido con contraseña que muestra resultados en tiempo real: puntuaciones brutas y convertidas a Rasch (tablas oficiales de P&B) y comparaciones por grupo.
- La calibración Rasch con datos mexicanos NO se hace en la app: se hace offline en R con el paquete easyRasch (https://github.com/pgmj/easyRasch), sobre el CSV que exporta el dashboard. La app debe garantizar exports con el formato que easyRasch espera (sección 7.5).
- NO recolectar nombre, correo ni ningún dato que identifique al alumno.

## 2. Stack y arquitectura

- **Next.js 14+ (App Router, TypeScript)** — una sola app desplegada como un servicio en Railway. Contiene encuesta, API y dashboard.
- **Supabase** — solo la base de datos Postgres. Todas las escrituras/lecturas pasan por API routes del servidor de Next.js usando `SUPABASE_SERVICE_ROLE_KEY`. El cliente del navegador NUNCA habla directo con Supabase.
- RLS habilitado en todas las tablas con política *deny-all* para `anon` y `authenticated` (el service role la ignora). Esto evita inserciones o lecturas directas si la URL del proyecto se filtra.
- Sin dependencias de autenticación: el dashboard usa una contraseña única en variable de entorno con cookie de sesión firmada.
- Estilo: Tailwind CSS. Diseño sobrio, limpio, sin distracciones. Barra de progreso visible.

### Estructura de rutas

| Ruta | Función |
|---|---|
| `/` | Redirige a página neutra "Encuesta no disponible sin link de institución" |
| `/encuesta/[slug]` | Encuesta para la institución con ese slug. El flujo se ramifica según `instituciones.tipo` (`escolar` / `general`). `general` es el slug del público adulto. |
| `/aviso-de-privacidad` | Aviso de privacidad (ruta pública, design system RU.L). Borrador pendiente de revisión del autor. |
| `/gracias` | Pantalla final |
| `/dashboard` | Dashboard (login por contraseña) |
| `/api/submit` | POST: recibe y valida una respuesta completa, calcula puntuaciones, inserta en Supabase |
| `/api/results` | GET (protegido): datos agregados para el dashboard |
| `/api/export` | GET (protegido): CSV completo, un renglón por respuesta |
| `/api/export-rasch?escala=eaj` | GET (protegido): CSV de solo ítems de una escala, formato easyRasch |

## 3. Modelo de datos (Supabase)

Esquema final (aplicado por migraciones: 0001 base + 0003 el link general). Los bloques
marcados `-- 0003` se agregaron en la migración `0003_general.sql`.

```sql
create table instituciones (
  id serial primary key,
  slug text unique not null,      -- va en la URL
  nombre text not null,
  activa boolean default true,
  tipo text not null default 'escolar' check (tipo in ('escolar','general'))  -- 0003
);

-- Seed (nombres placeholder; el usuario los sustituirá):
insert into instituciones (slug, nombre) values
  ('inst-a', 'Institución A'),
  ('inst-b', 'Institución B'),
  ('inst-c', 'Institución C');
insert into instituciones (slug, nombre, tipo) values  -- 0003
  ('general', 'General', 'general');

create table respuestas (
  id uuid primary key default gen_random_uuid(),
  institucion_id int references instituciones(id) not null,
  creada_en timestamptz default now(),

  -- consentimiento
  acepto_aviso boolean not null,

  -- cohorte de la materia de Derecho (4 valores desde 0003)
  cohorte text not null check (cohorte in (
    'curso_primavera_2026','cursara_otono_2026',   -- escolar
    'general_si_curso','general_no_curso')),        -- 0003: general

  -- demografía
  edad int check (edad between 12 and 99),
  genero text,
  se_considera_indigena text,        -- 'si' | 'no' | 'prefiero_no_responder'
  se_considera_afro text,            -- 'si' | 'no' | 'prefiero_no_responder'
  nivel_educativo_padre text,
  nivel_educativo_madre text,

  -- entidad federativa (0004; obligatoria para todos): nombre oficial o 'Prefiero no responder'
  entidad text,

  -- solo flujo general (0003):
  nivel_educativo_propio text,       -- catálogo de niveles SIN 'no_lo_se'
  ocupacion text,                    -- texto libre, máx. 120
  curso_derecho_detalle text,        -- máx. 200; obligatorio si cohorte='general_si_curso'
  curso_derecho_anio int check (curso_derecho_anio between 1940 and 2026), -- 0004; obligatorio si general_si_curso

  -- respuestas item por item (enteros 0-3 según codificación de captura, SIN invertir)
  items jsonb not null,              -- {"eaj": [..6], "eal": [..4], "clg": [..6], "iaj": [..9], "dpj": [..6]}

  -- puntuaciones calculadas en el servidor al insertar
  eaj_bruta int, eaj_rasch numeric,
  eal_bruta int, eal_rasch numeric,
  clg_bruta int, clg_rasch numeric,
  iaj_bruta int, iaj_rasch numeric,
  dpj_bruta int, dpj_rasch numeric,

  -- metadatos
  duracion_segundos int,
  user_agent text
);

alter table instituciones enable row level security;
alter table respuestas enable row level security;
-- sin políticas => deny-all para anon/authenticated; el service role accede igual
```

En `items`, guardar el valor de captura crudo (índice de la opción elegida, 0–3 en el orden en que se muestran las opciones). Las inversiones se aplican solo al calcular puntuaciones (sección 6). Guardar el crudo permite recalibrar Rasch después.

## 4. Flujo de la encuesta (pantallas)

Una sección por pantalla, con botón "Siguiente". No permitir avanzar con ítems sin responder. Barra de progreso. Todo el texto de los ítems debe usarse EXACTAMENTE como aparece en la sección 5 — no parafrasear, no "mejorar" redacción: es un instrumento validado.

1. **Aviso de privacidad.** Texto breve: encuesta anónima, fines académicos (tesina de licenciatura), sin datos identificables. El enlace "aviso de privacidad" apunta a la página interna `/aviso-de-privacidad` (ruta pública, mismo design system; abre en pestaña nueva). Su contenido es un BORRADOR pendiente de revisión del autor. Botón único: **"Acepto y quiero continuar"**. Sin aceptar no hay encuesta.
2. **Materia de Derecho (pantalla condicional según `tipo`).**
   - **`escolar`:** "¿Cuál es tu situación respecto a la materia de Derecho en tu escuela?" Opciones (radio): (a) "La cursé en primavera 2026" → `curso_primavera_2026`; (b) "La voy a cursar en otoño 2026" → `cursara_otono_2026`.
   - **`general`:** "¿Alguna vez ha cursado una clase de Derecho?" (radio Sí / No) → `general_si_curso` | `general_no_curso`. Si **Sí**, se revelan DOS campos OBLIGATORIOS: (a) tipo de programa (texto libre, máx. 200) → `curso_derecho_detalle`; (b) año en que terminó su última clase de Derecho (entero 1940–2026, no futuro) → `curso_derecho_anio` (0004).
3. **Demografía.**
   - Edad: campo numérico (12–99).
   - Género: Mujer / Hombre / Otro / Prefiero no responder.
   - "¿Te consideras una persona indígena?": Sí / No / Prefiero no responder.
   - "¿Te consideras una persona afromexicana o afrodescendiente?": Sí / No / Prefiero no responder.
   - "…máximo nivel de estudios del padre" y "…de la madre" como **dropdown** (mismas opciones, se preguntan a TODOS): Sin estudios / Primaria / Secundaria / Preparatoria o bachillerato / Licenciatura / Posgrado / No lo sé.
   - **Entidad federativa** (dropdown, obligatoria para TODOS, 0004): las 32 entidades oficiales + "Prefiero no responder" → `entidad`.
   - **Solo `general`** (además de lo anterior): "Máximo nivel de estudios" propio como **dropdown** (mismo catálogo que padres pero SIN "No lo sé") → `nivel_educativo_propio`, obligatorio; y "¿Cuál es su ocupación?" (texto libre, máx. 120, obligatorio) → `ocupacion`.
   - Las 5 escalas psicométricas son IDÉNTICAS en ambos flujos.
   - **Presentación (RU.L Design System):** un ítem por pantalla con "Continuar"/"Atrás", progreso de 8 secciones con hairline animada (respeta `prefers-reduced-motion`), tokens cargados solo en las rutas públicas, registro **usted**. La pantalla de gracias muestra un folio anónimo (últimos 6 caracteres del uuid) en mono. Ver DECISIONES.md D12.
4. **Escala EAJ** (6 ítems), 5. **Escala EAL** (4 ítems), 6. **Escala CLG** (6 ítems), 7. **Escala IAJ** (9 ítems), 8. **Escala DPJ** (6 ítems) — cada una con su instrucción introductoria y sus categorías de respuesta (sección 5). Presentar los ítems como matriz Likert en desktop y como tarjetas apiladas en móvil.
9. **Envío y gracias.** Al enviar, POST a `/api/submit`. Registrar `duracion_segundos` (desde aceptar el aviso hasta enviar). Mostrar `/gracias`.

Anti-duplicados: bloquear reenvío con `localStorage` (flag por slug) y deshabilitar el botón tras el primer envío. No usar cookies de tracking ni IP.

## 5. Contenido exacto del instrumento

### 5.1 Escala de autoeficacia jurídica (EAJ) — 6 ítems

*Instrucción:* "Piense en general en problemas jurídicos importantes, como ser despedido injustamente por su empleador, sufrir lesiones como consecuencia de la negligencia de otra persona, verse envuelto en una disputa por dinero en el marco de un divorcio o enfrentarse al despojo de su vivienda. ¿En qué medida le describen las siguientes afirmaciones?"

1. Siempre consigo resolver problemas difíciles si me esfuerzo lo suficiente.
2. Si alguien se opone a mí, puedo encontrar los medios y las formas de conseguir lo que quiero.
3. Me resulta fácil mantenerme fiel a mis objetivos y alcanzarlos.
4. Puedo mantener la calma ante las dificultades porque confío en mi capacidad para afrontarlas.
5. Cuando me enfrento a un problema, suelo encontrar varias soluciones.
6. Soy bueno buscando información que ayude a resolver problemas.

*Categorías (en este orden):* nada cierto / casi nada cierto / moderadamente cierto / totalmente cierto.

### 5.2 Escala de ansiedad legal (EAL) — 4 ítems

*Instrucción:* "Ahora, piense en general en problemas legales importantes, como ser despedido injustamente por su empleador, sufrir lesiones como consecuencia de la negligencia de otra persona, verse envuelto en una disputa por dinero en el marco de un divorcio o enfrentarse al despojo de su vivienda. ¿En qué medida le describen las siguientes afirmaciones?"

1. Me da miedo hablar directamente con la gente para hacer valer mis derechos.
2. La preocupación por no expresarme con claridad puede impedirme actuar.
3. Evito hacer valer mis derechos porque no estoy seguro de que vaya a tener éxito.
4. No siempre consigo el mejor resultado para mí, porque intento evitar los conflictos.

*Categorías:* nada cierto / casi nada cierto / moderadamente cierto / totalmente cierto.

### 5.3 Escala de confianza jurídica general (CLG) — 6 ítems

*Instrucción:* "Si se encontrara ante un conflicto legal importante —como ser despedido injustamente por su empleador, sufrir lesiones como consecuencia de la negligencia de otra persona, verse envuelto en una disputa económica como parte de un divorcio o enfrentarse al despojo de su vivienda—, ¿qué grado de confianza tiene en que podría lograr un resultado justo y satisfactorio para usted en las siguientes situaciones?"

1. El desacuerdo es considerable y la tensión es alta.
2. La otra parte dice que "no descansará hasta que se haga justicia".
3. La otra parte se niega a hablar contigo salvo a través de su abogado.
4. Una notificación del tribunal le indica que debe rellenar ciertos formularios, incluyendo la exposición de su caso.
5. El asunto llega a los tribunales, un abogado representa a la otra parte y usted está solo.
6. El tribunal dicta una sentencia en su contra, que usted considera injusta. Le informan de que tiene derecho a apelar.

*Categorías (mostrar en este orden, como en el instrumento):* muy seguro / bastante seguro / no muy seguro / nada seguro.

### 5.4 Escala de inaccesibilidad a la justicia (IAJ) — 9 ítems

*Instrucción:* "Ahora, algunas preguntas sobre su impresión general y su experiencia con el sistema de justicia. No nos interesa el sistema de justicia penal. Nos interesa el sistema de justicia que se ocupa de cuestiones como el despido injustificado por parte de su empleador, las lesiones sufridas como consecuencia de la negligencia de otra persona, las disputas económicas en el marco de un divorcio o el despojo de su vivienda. Teniendo en cuenta cuestiones como estas, ¿en qué medida está de acuerdo o en desacuerdo con las siguientes afirmaciones?"

1. Cuestiones como estas suelen resolverse con rapidez y eficacia.
2. Las personas con menos recursos económicos suelen obtener un resultado peor.
3. En cuestiones como estas, la ley es como un juego en el que quienes son hábiles y tienen recursos tienen más probabilidades de conseguir lo que quieren.
4. Es fácil llevar cuestiones como estas a los tribunales si es necesario.
5. En cuestiones como estas, los abogados son demasiado caros para la mayoría de la gente.
6. El sistema judicial ofrece una buena relación calidad-precio.
7. En cuestiones como estas, personas como yo pueden permitirse la ayuda de un abogado.
8. Los abogados de los ricos no son mejores que los de los pobres.
9. Llevar un caso a los tribunales suele dar más problemas de lo que vale la pena.

*Categorías:* totalmente de acuerdo / mayoritariamente de acuerdo / mayoritariamente en desacuerdo / totalmente en desacuerdo.

### 5.5 Escala de desigualdad percibida de la justicia (DPJ) — 6 ítems

*Instrucción:* misma introducción que IAJ, terminando en "Pensando en cuestiones como estas, ¿en qué medida está de acuerdo o en desacuerdo con las siguientes afirmaciones?"

1. Las personas con menos dinero suelen obtener peores resultados.
2. En cuestiones como estas, la ley es como un juego en el que los más hábiles y con más recursos tienen más probabilidades de conseguir lo que quieren.
3. La ley siempre trata a ambas partes de forma justa, independientemente de su origen, género, etnia o religión.
4. Los jueces tienen sus propios intereses y agendas, al margen de la ley.
5. Las decisiones y acciones de los tribunales se ven influidas por la presión de la prensa y los políticos.
6. Los juzgados y tribunales siempre tratan a ambas partes de forma justa, independientemente de su origen, género, etnia o religión.

*Categorías:* totalmente de acuerdo / mayoritariamente de acuerdo / mayoritariamente en desacuerdo / totalmente en desacuerdo.

## 6. Puntuación (calcular en el servidor, en `/api/submit`)

Convención de captura: guardar en `items` el índice 0–3 de la opción elegida, en el orden en que la categoría aparece listada arriba. Sobre ese crudo aplicar:

- **EAJ:** nada cierto=0 … totalmente cierto=3. Bruta 0–18 (captura directa: índice = puntaje).
- **EAL:** igual que EAJ. Bruta 0–12. (El documento fuente dice "entre las seis preguntas" por errata; son 4 ítems, máximo 12.)
- **CLG:** muy seguro=3, bastante seguro=2, no muy seguro=1, nada seguro=0. Con el orden de captura de 5.3 (índice 0 = muy seguro): puntaje = 3 − índice. Bruta 0–18.
- **IAJ** (captura: totalmente de acuerdo=0, mayoritariamente de acuerdo=1, mayoritariamente en desacuerdo=2, totalmente en desacuerdo=3):
  - Ítems 1, 4, 6, 7, 8: puntaje = índice (acuerdo → 0).
  - Ítems 2, 3, 9: puntaje invertido = 3 − índice (acuerdo → 3).
  - Ítem 5 (regla especial): totalmente de acuerdo=2, mayoritariamente de acuerdo=1, mayoritariamente en desacuerdo=0, totalmente en desacuerdo=0.
  - Bruta 0–26. Mayor puntaje = mayor inaccesibilidad percibida.
- **DPJ** (misma captura que IAJ):
  - Ítems 1, 2, 4, 5: puntaje invertido = 3 − índice (acuerdo → 3).
  - Ítems 3 y 6: puntaje = índice (desacuerdo → 3).
  - Bruta 0–18. Mayor puntaje = mayor desigualdad percibida.

### Tablas de conversión Rasch (P&B 2018) — copiar como constantes

Índice del arreglo = puntuación bruta; valor = puntuación 0–100.

```ts
export const RASCH = {
  eaj: [0.0, 7.4, 13.2, 17.7, 21.7, 25.5, 29.1, 32.6, 36.2, 40.1, 44.6, 50.2, 57.7, 65.3, 71.2, 76.5, 82.3, 89.9, 100.0],
  eal: [0.0, 11.1, 19.8, 26.7, 32.8, 38.9, 45.2, 52.2, 60.3, 69.1, 78.1, 88.4, 100.0],
  clg: [0.0, 9.4, 17.0, 23.3, 28.9, 34.3, 38.4, 42.7, 47.0, 51.5, 56.5, 61.9, 67.2, 72.1, 76.7, 81.2, 86.1, 92.3, 100.0],
  iaj: [0.0, 9.3, 16.2, 21.2, 25.2, 28.7, 31.8, 34.6, 37.3, 39.9, 42.4, 44.8, 47.3, 49.7, 52.2, 54.6, 57.2, 59.9, 62.6, 65.5, 68.6, 71.8, 75.4, 79.5, 84.3, 91.0, 100.0],
  dpj: [0.0, 9.9, 17.5, 23.2, 28.2, 32.8, 37.4, 42.0, 46.6, 51.3, 55.7, 60.0, 64.2, 68.4, 72.8, 77.5, 83.0, 90.3, 100.0],
};
```

Validar en el servidor: longitudes exactas de cada arreglo de items, valores 0–3, cohorte y demografía dentro de catálogos, `acepto_aviso === true`, slug existente y activo. Rechazar con 400 si algo falla. Escribir tests unitarios de la puntuación (casos: todo 0, todo 3, y un caso mixto por escala verificado a mano, cubriendo las inversiones de IAJ ítem 5 y DPJ 3/6).

**Validación condicional por `tipo`** (implementada en `lib/submit-validation.ts`, con tests): los valores de `cohorte` escolares (`curso_primavera_2026`, `cursara_otono_2026`) solo se aceptan para instituciones `escolar` y los generales (`general_si_curso`, `general_no_curso`) solo para `general`. `entidad` es obligatoria para TODOS (dentro del catálogo de 32 entidades + "Prefiero no responder"). `nivel_educativo_propio` (catálogo sin "No lo sé") y `ocupacion` (máx. 120) son obligatorios solo en `general`. `curso_derecho_detalle` (máx. 200) y `curso_derecho_anio` (entero 1940–2026) son obligatorios solo si `cohorte='general_si_curso'`; en cualquier otro caso deben venir vacíos. La puntuación de las 5 escalas es idéntica en ambos flujos.

## 7. Dashboard (`/dashboard`)

Login: formulario de contraseña contra `DASHBOARD_PASSWORD`; si coincide, cookie httpOnly firmada (`iron-session` o JWT simple). Todo `/api/results`, `/api/export` y `/api/export-rasch` exige esa cookie.

**Separación escolar vs. general (regla dura):** el dashboard NUNCA agrega juntas las muestras `escolar` y `general` — son poblaciones distintas (la general es de conveniencia, ver DECISIONES.md D10). "General" aparece como una institución más en los filtros. Dentro de `general`, la comparación por cohorte es `general_si_curso` vs. `general_no_curso`; dentro de `escolar`, `curso_primavera_2026` vs. `cursara_otono_2026`.

Contenido (con auto-refresh cada 60 s o botón "Actualizar"):

1. **Resumen:** n total, n por institución (incluye "General"), n por cohorte, respuestas por día (gráfica de línea). Mostrar el desglose escolar/general por separado.
2. **Puntuaciones por escala:** para EAJ, EAL, CLG, IAJ, DPJ: media, mediana, DE de la puntuación Rasch P&B (0–100); histograma de distribución; comparación por cohorte (según el tipo, ver regla dura arriba) y por institución (barras con medias e intervalos), sin mezclar escolar con general. Etiquetar con prudencia: "diferencias observables", nunca lenguaje causal.
3. **Nivel ítem:** distribución de respuestas por ítem (barras apiladas), útil para detectar ítems problemáticos.
4. **Demografía:** tablas de frecuencia.
5. **Exportación** (dos formatos):
   - `/api/export`: CSV maestro, un renglón por respuesta con todos los campos, incluidos `tipo` (de la institución), `entidad`, `nivel_educativo_propio`, `ocupacion`, `curso_derecho_detalle` y `curso_derecho_anio`, items crudos, puntajes por ítem recodificados, brutas y Rasch P&B.
   - `/api/export-rasch?escala=<eaj|eal|clg|iaj|dpj>`: CSV por escala en el formato que espera el paquete easyRasch de R: un renglón por participante; primero las columnas de agrupación con prefijo `dif_` (`dif_tipo`, `dif_cohorte`, `dif_genero`, `dif_institucion`, `dif_edad`); después SOLO las columnas de ítems de esa escala, nombradas `q1…qN`, con el puntaje por ítem YA RECODIFICADO (inversiones de la sección 6 aplicadas; categoría mínima = 0). `dif_cohorte` ya trae los 4 valores; `dif_tipo` permite filtrar/separar escolar vs general en R. Botones de descarga en el dashboard para el maestro y para cada escala.

Gráficas: Recharts. No usar servicios externos de analytics.

## 7 bis. Análisis Rasch definitivo (fuera de la app, en R)

La calibración con datos mexicanos se hace en RStudio con easyRasch (https://github.com/pgmj/easyRasch), que envuelve eRm, mirt, TAM e iarm — el estándar citable. Modelo: crédito parcial (PCM) estimado por CML. Claude Code debe generar en el repo una carpeta `analisis-r/` con:

1. `analisis_rasch.qmd`: plantilla Quarto parametrizada por escala que (a) lee el CSV de `/api/export-rasch`, (b) separa el dataframe de ítems del de variables DIF (easyRasch exige que el dataframe de ítems contenga SOLO ítems), (c) construye `itemlabels` con los textos de la sección 5, y (d) corre el flujo estándar: descriptivos (`RItileplot`, `RIbarstack`), ajuste de ítems (`RIitemfit`), análisis de categorías de respuesta (`RIitemCats`, umbrales ordenados), targeting (`RItargeting`), confiabilidad (`RItif`), DIF por cohorte, género e institución (`RIdifTable`), y ubicaciones de ítems/personas. Comentarios en español explicando qué responde cada bloque.
2. `README.md`: cómo instalar R, RStudio, Quarto y easyRasch (`pak::pkg_install("pgmj/easyRasch")`), y cómo correr la plantilla por escala.

Nota metodológica: los nombres exactos de funciones deben verificarse contra la documentación vigente de easyRasch (https://pgmj.github.io/easyRasch/) al generar la plantilla; la lista anterior es orientativa. El reporte Quarto resultante es insumo directo del anexo metodológico de la tesina; citar easyRasch y los paquetes subyacentes con `citation('paquete')`.

## 8. Variables de entorno

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DASHBOARD_PASSWORD=
SESSION_SECRET=            # para firmar la cookie del dashboard
NEXT_PUBLIC_APP_URL=       # https://<app>.up.railway.app
```

## 9. Despliegue en Railway

1. Repo con la app Next.js; Railway lo detecta y construye con Nixpacks/Node (build `next build`, start `next start`).
2. Configurar variables de entorno en Railway.
3. En Supabase: correr el SQL de la sección 3 (migración en `supabase/migrations/`), verificar RLS activo.
4. Los tres links a repartir: `https://<app>.up.railway.app/encuesta/inst-a`, `/encuesta/inst-b`, `/encuesta/inst-c`.

## 10. Orden de trabajo sugerido para Claude Code

1. Scaffold Next.js + Tailwind + estructura de carpetas; constantes del instrumento (`lib/instrumento.ts` con textos exactos de la sección 5) y puntuación (`lib/scoring.ts` + tests).
2. Migración SQL de Supabase y cliente de servidor.
3. Flujo de encuesta completo con validación y `/api/submit`.
4. Dashboard: login, resumen, puntuaciones, nivel ítem, exports (`/api/export` y `/api/export-rasch`).
5. Carpeta `analisis-r/` con la plantilla Quarto de easyRasch y su README (sección 7 bis).
6. QA: correr tests de scoring, probar el flujo completo en móvil (viewport 375px), enviar 3–5 respuestas de prueba y verificar que el dashboard y el CSV cuadren a mano.

**Criterios de aceptación:** los textos de los ítems coinciden carácter por carácter con la sección 5; los tests de puntuación pasan (incluidas inversiones IAJ/DPJ y la regla especial del ítem 5 de IAJ); no se puede enviar con ítems vacíos; una respuesta enviada aparece en el dashboard sin redeploy; el CSV maestro reproduce las puntuaciones; el CSV de `/api/export-rasch` tiene solo columnas `dif_*` + `q1…qN` recodificadas con mínimo 0; `/encuesta/slug-inexistente` da 404.

## 11. Pendientes del usuario (no bloquear el desarrollo)

- ~~URL real del aviso de privacidad~~ → RESUELTO: página interna `/aviso-de-privacidad`
  con contenido BORRADOR; el autor entregará el texto definitivo para sustituirlo.
- ~~Nombres reales de las tres instituciones y slugs definitivos~~ → RESUELTO en migración
  0005: slugs no adivinables `enc-XXXXXX` y nombres reales (Institución Privada, Escuela
  Nacional Preparatoria, Institución MCCEMS). `general` sin cambios.
- **Consistencia usted/tú:** el instrumento mezcla tratamiento (p. ej., CLG ítem 3 "se niega a hablar contigo" en un bloque de "usted"; el resto usa "usted" aunque la población son adolescentes). Implementar tal cual está; el ajuste es decisión metodológica del autor, no del programador.
- Decidir si se agrega una opción de cohorte para alumnos que no encajen en las dos previstas (p. ej. "Otra situación"); por ahora solo hay dos.
