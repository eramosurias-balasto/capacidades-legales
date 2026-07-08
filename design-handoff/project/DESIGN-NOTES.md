# Encuesta de Capacidades Legales — Notas de diseño

Prototipo: `Encuesta Capacidades Legales.dc.html`
Design system: **RU.L Final Design System** (única fuente de verdad visual).
Adaptación de tono: de "socio de despacho" a **investigador serio**, conservando toda la
disciplina visual (blanco frío, tinta #0A0A0A, acento cobalto #2440CE, Switzer + IBM Plex
Mono, hairlines, radios contenidos, motion que dibuja y asienta, cero emoji, cero signos
de exclamación, registro de usted).

---

## (a) Decisiones tomadas y componentes propuestos

### Estructura del prototipo
- **Un solo flujo navegable** (tal como pidió): una máquina de estados en el cliente que
  avanza pantalla por pantalla. Orden: portada → cohorte → demografía → intro de escala →
  4 ítems Likert (EAL) → gracias. Al final, "Volver al inicio" reinicia el recorrido.
- **Mobile-first** con columna centrada de `max-width: 600px`; en móvil ocupa el ancho
  completo con `padding: 24px`. Página en blanco puro (el sistema pide grounds blancos para
  páginas; el gris `--paper-50` queda reservado para insets, campos y opciones sin marcar).

### Progreso (el "mecanismo visible")
- Elegí, de las opciones que dio, la **hairline que se carga de 0 a 100**. Es una barra de
  3px pegada bajo el masthead: pista en `--paper-100`, relleno en `--accent`, que **se
  dibuja** en cada avance con `transition: width var(--dur-slow) var(--ease-out)`
  (400ms, curva de desaceleración Apple). Es el único momento de motion con significado;
  respeta `prefers-reduced-motion` (se desactiva la transición).
- Conteo en mono a la derecha del masthead: **"Sección 4 de 8"** (modelo por sección, como
  pidió). Mapa de secciones: 1 consentimiento · 2 cohorte · 3 demografía · 4–8 las cinco
  escalas. La portada y la pantalla de gracias no muestran chrome de progreso.
- Nota: en el recorrido caminable, la escala de muestra (EAL) se presenta en el lugar de la
  **Sección 4** para que la barra suba de forma continua. En el instrumento completo la EAL
  es la 2.ª escala (Sección 5); ver guía de implementación.

### Portada (la pantalla más importante)
- Gancho construido con **una pregunta precisa**, sin fragmentos punchy ni "¡Participa!":
  *"¿Qué tan capaz se siente de enfrentar un problema legal serio por su cuenta?"*, apoyada
  en una afirmación verificable sobre problemas cotidianos (despido, deuda, despojo).
- Barra cobalto pesada (`--rule-heavy` 6px) coronando la vista — "una por vista".
- "5–7 minutos" y **"anónimo"** como `Badge` (el de anonimato en tono cobalto para
  destacarlo). Enlace a **aviso de privacidad** como placeholder externo (`#aviso`, no
  navega). CTA único: `Button` `primary` `pill` — el único uso de `pill` en todo el flujo
  (reservado al CTA héroe).

### Cohorte — ambas variantes visibles para comparar
- Como pidió, se pueden ver las dos variantes en la misma pantalla mediante un **control de
  revisión** (marcado con borde punteado y etiqueta "vista de revisión" en mono, para que
  quede claro que **no es parte de la encuesta**): alterna *escolar* / *general*.
- Ambas variantes son **sí / no + campo condicional** (según su indicación sobre la materia
  de Derecho). La variante general pregunta "¿Alguna vez ha cursado una clase de Derecho?";
  la escolar la adapta a "materia o taller en la escuela". Al elegir "Sí" se revela un
  `Input` opcional con `rul-fade`.

### Demografía
- `Input` del sistema para campos de texto; **edad con `mono`** (como pidió). Género como
  chips derivados de tokens. Escolaridad y entidad como `Input`. Intro de una frase que
  subraya el anonimato. Se mantiene mínimo y sin datos identificables.

### Escala Likert (EAL, como muestra)
- **Pantalla de intro propia** con la instrucción **intocable** de la EAL, el nombre de la
  escala como `Badge` cobalto, y microcopy propio sobre cómo responder.
- **Un ítem por pantalla.** Opciones como **botones de ancho completo** (touch target 56px,
  ≥48px), con **estado seleccionado inequívoco en cobalto** (fondo `--accent`, texto blanco,
  punto relleno). Se avanza con **"Continuar"** (deshabilitado hasta elegir) — respeta el
  microcopy "puede cambiar su respuesta antes de avanzar" — más "Atrás" en `ghost`. El
  último ítem cambia el CTA a "Terminar".

### Gracias
- Sobria y cálida a la RU.L: afirmación que un investigador firmaría, sin celebración.
  Barra cobalto, folio anónimo en mono (`registro anónimo · núm. [núm.]`) que evoca el motivo
  de folios del sistema. Una sola acción (`outline`).

### Componentes propuestos (no existen en el sistema; derivados de tokens)
1. **`ChoiceOption`** — botón de opción de ancho completo para Likert y para sí/no. Base:
   `--paper-50` + hairline `--border-default` + `--radius-sm`; seleccionado: fondo
   `--accent`, texto `--text-onaccent`, punto blanco. `min-height` 56px (Likert) / 44px
   (sí/no). Transiciones `--dur`/`--ease`.
2. **`Chip`** (radio) — versión compacta para género/opciones cortas (mismo lenguaje visual,
   `min-height` 40px, en fila que envuelve).
3. **`ProgressHairline`** — pista `--paper-100` + relleno `--accent` que se dibuja con
   `--dur-slow`/`--ease-out`; respeta `prefers-reduced-motion`.
4. **`SectionMeta`** — etiqueta mono "Sección X de N" en el masthead.
5. **`ReviewVariantToggle`** — control de revisión (fuera del instrumento), borde punteado.

Componentes del sistema usados sin modificar: **Button, Input, Badge**. **EmptyState** quedó
disponible pero la pantalla de gracias se compuso a mano para incluir el folio en mono; puede
sustituirse por `EmptyState` si prefiere (ver guía). **ScoreDial NO aparece** (objeto insignia
de otra marca; la encuesta no muestra puntuaciones al encuestado).

---

## (b) Copy nuevo (para su visto bueno)

> Todo lo de abajo es copy **nuevo**, escrito en la voz del sistema. Los ítems, instrucciones
> de escala y categorías de respuesta **no** están aquí porque son intocables (se toman
> literales de `lib/instrumento.ts`).

**Masthead:** `encuesta · capacidades legales`

**Portada**
- Eyebrow: `Estudio académico · tesina de Derecho`
- Título: `¿Qué tan capaz se siente de enfrentar un problema legal serio por su cuenta?`
- Entrada: `Un despido injusto, una deuda que no reconoce, el despojo de una vivienda. Este estudio mide qué tan preparadas se sienten las personas para afrontar problemas legales como estos, y dónde el acceso a la justicia se queda corto.`
- Badges: `5–7 minutos` · `anónimo`
- Consentimiento: `Al continuar acepta el aviso de privacidad de este estudio. Sus respuestas son anónimas: no pedimos su nombre ni datos que permitan identificarle.`
- Enlace: `Leer el aviso de privacidad` (texto "aviso de privacidad")
- CTA: `Acepto y quiero continuar`
- Pie: `participación voluntaria · puede detenerse en cualquier momento`

**Cohorte**
- Eyebrow: `Contacto previo con el Derecho`
- Pregunta (escolar): `¿Ha cursado alguna materia o taller de Derecho en la escuela?`
- Ayuda (escolar): `Cuenta cualquier materia, taller o actividad escolar dedicada al Derecho o a los derechos.`
- Pregunta (general): `¿Alguna vez ha cursado una clase de Derecho?`
- Ayuda (general): `Cuenta cualquier curso, taller o formación sobre Derecho, dentro o fuera de la escuela.`
- Opciones: `Sí` / `No`
- Campo condicional (escolar): label `¿Cuál materia o taller?` · placeholder `Formación cívica y ética, taller de derechos…`
- Campo condicional (general): label `¿En qué contexto?` · placeholder `Preparatoria, un diplomado, el trabajo…`
- CTA: `Continuar`

**Demografía**
- Eyebrow: `Sobre usted`
- Título: `Unos datos generales`
- Entrada: `Sirven para describir a quienes participan. No permiten identificarle.`
- Campos: `Edad` (mono) · `Género` (mujer / hombre / otro / prefiero no decirlo) · `Grado escolar` o `Máximo nivel de estudios` (según variante) · `Entidad federativa`
- CTA: `Continuar`

**Intro de escala (EAL)**
- Badge: `Ansiedad legal` · meta: `4 afirmaciones`
- Título: `Antes de empezar esta sección`
- (Debajo, la **instrucción intocable** de la EAL.)
- Microcopy: `Verá una afirmación por pantalla. Elija en cada una la opción que mejor le describa; puede cambiar su respuesta antes de avanzar.`
- CTA: `Empezar la sección`

**Ítem Likert**
- Eyebrow: `Ansiedad legal` · meta mono: `Ítem 1 de 4`
- (El **ítem intocable** y las **categorías intocables** como opciones.)
- CTA: `Continuar` (último ítem: `Terminar`) · secundario: `Atrás`

**Gracias**
- Eyebrow: `Estudio de capacidades legales`
- Título: `Hemos registrado sus respuestas.`
- Texto: `Gracias por su tiempo. Sus respuestas quedan guardadas de forma anónima y contribuyen a un estudio sobre el acceso a la justicia en México.`
- Folio: `registro anónimo · núm. [núm.]`
- Acción: `Volver al inicio`

---

## (c) Guía de implementación (portar a los componentes React del proyecto Next.js)

### 1. Tokens CSS a copiar
Copie tal cual los cuatro archivos de tokens del design system y enlácelos una sola vez
(en `app/layout.tsx` o un `globals.css` que los `@import`):

```
tokens/fonts.css        → @font-face de Switzer + @import IBM Plex Mono
tokens/colors.css       → variables --white, --ink-*, --accent*, --paper-*, --line-*, semánticas
tokens/typography.css   → --font-*, escala --text-*, --lh-*, --tracking-*
tokens/spacing.css      → --space-*, --rule-*, --radius-*, --shadow-*, motion --dur*/--ease*
styles.css              → punto de entrada que @importa lo anterior
```

Autor contra las **variables** (`var(--accent)`, `var(--space-5)`…), nunca contra valores
crudos. Ese es todo el "tema": no hay clases utilitarias adicionales.

### 2. Qué reemplaza a qué en `components/encuesta/`
El prototipo es un solo archivo con una máquina de estados; en Next conviene separarlo así:

| Prototipo (este archivo) | Componente React sugerido | Notas |
|---|---|---|
| Máquina de estados `screen` | `EncuestaFlow.tsx` (o hook `useEncuestaFlow`) | mismo orden de pantallas; el estado real vive aquí |
| `<section>` Portada | `PortadaConsentimiento.tsx` | usa `Button` (primary/pill), `Badge` |
| `<section>` Cohorte | `PreguntaCohorte.tsx` | prop `variant: 'escolar' \| 'general'`; el toggle de revisión **no se porta** (es solo del prototipo) |
| `<section>` Demografía | `Demografia.tsx` | `Input` (edad `mono`), chips de género |
| `<section>` Intro escala | `EscalaIntro.tsx` | recibe `escala` del instrumento; renderiza `escala.instruccion` |
| `<section>` Ítem Likert | `ItemLikert.tsx` | recibe `item` y `opciones`; ver componente propuesto abajo |
| `<section>` Gracias | `Gracias.tsx` | puede ser el `EmptyState` del sistema |
| Barra de progreso | `ProgressHairline.tsx` | `width` = `%` calculado; transición `--dur-slow`/`--ease-out` |
| `SectionMeta` (mono) | dentro del layout/masthead | `Sección {n} de {total}` |

Componentes del sistema a importar del paquete compilado (no reimplementar):
`Button`, `Input`, `Badge`, y opcionalmente `EmptyState`.

### 3. Componente propuesto a crear en el sistema: `ChoiceOption`
Es la única pieza de UI nueva que conviene formalizar. Firma sugerida:

```tsx
interface ChoiceOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  size?: 'lg' | 'sm';   // lg = Likert (56px), sm = sí/no (44px)
}
```

Estilos (todos con tokens): fondo `--paper-50` → `--accent` al seleccionar; texto
`--text-primary` → `--text-onaccent`; hairline `--border-default` → `--accent`; punto guía
14px (`--line-strong` sin marcar, blanco relleno al marcar); `border-radius: var(--radius-sm)`;
transiciones `--dur`/`--ease`. `min-height` 56px/44px para el touch target.

### 4. Fuente de datos del instrumento
Todo el texto intocable debe salir de `lib/instrumento.ts` (nunca hardcodeado en la UI):
las 5 escalas con `{ clave, nombre, instruccion, items[], opciones[] }`. `ItemLikert` y
`EscalaIntro` reciben esos datos por props. El orden de `opciones` es el orden de captura
(índice 0 → 3) — respételo para el scoring.

### 5. Progreso real (8 secciones)
`total = 8`. `sección`: 1 consentimiento · 2 cohorte · 3 demografía · 4 EAJ · 5 EAL ·
6 CLG · 7 IAJ · 8 DPJ. El relleno = `((secciónCompletadas) + (ítemActual+1)/ítemsDeLaEscala) / 8`.
En el prototipo la EAL se muestra como Sección 4 solo para la demo; en producción va como
Sección 5.

### 6. Accesibilidad / móvil
- Touch targets ≥48px (aquí 56/52/44px).
- Radios/opciones como `role="radiogroup"` + `role="radio"` con `aria-checked` al portar.
- `prefers-reduced-motion`: desactivar la transición de la hairline y los `rul-fade`.
- Campos de edad: `inputMode="numeric"`.
