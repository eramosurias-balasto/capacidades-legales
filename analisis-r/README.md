# analisis-r — Calibración Rasch con datos mexicanos (easyRasch)

Análisis Rasch **fuera de la app**, en R, sobre los CSV que exporta el dashboard
(`/api/export-rasch?escala=<escala>`). Produce el insumo del anexo metodológico de la
tesina: la calibración con datos mexicanos, comparable con las tablas de Pleasence & Balmer
(2018). La app **no** recalibra nada; solo aplica las tablas oficiales P&B.

- `analisis_rasch.qmd` — plantilla Quarto parametrizada por escala.
- `datos_prueba/eal_sintetico.csv` — 200 filas sintéticas con el formato EXACTO de
  `/api/export-rasch?escala=eal`, para probar la plantilla sin datos reales.
- `easyRasch-main/` — código fuente del paquete easyRasch v0.5.1.1 (GPL ≥ 3), incluido para
  poder cargarlo con `pkgload::load_all()` sin instalarlo (ver §1.1). El sitio renderizado
  (`docs/`) se excluye del repositorio por peso; no hace falta para el análisis.

Modelo: **crédito parcial (PCM)**, estimado por **máxima verosimilitud condicional (CML)** vía
`eRm` — el default del paquete. Nombres de función verificados contra la referencia oficial
v0.5.1.1 (<https://pgmj.github.io/easyRasch/reference/>); flujo canónico según la vignette
(<https://pgmj.github.io/raschrvignette/RaschRvign.html>).

## 1. Requisitos e instalación

1. **R ≥ 4.1** y **RStudio** (<https://posit.co/download/rstudio-desktop/>).
2. **Quarto** (<https://quarto.org/docs/get-started/>) — RStudio reciente ya lo incluye.
3. Paquetes de R. En la consola de RStudio:

   ```r
   install.packages("pak")
   install.packages("tidyverse")
   pak::pkg_install("pgmj/easyRasch")   # instala easyRasch y sus dependencias
                                        # (eRm, mirt, iarm, psychotools, ggplot2, …)
   ```

   Si `pak` falla en tu red, alternativa con remotes:

   ```r
   install.packages(c("tidyverse", "remotes"))
   remotes::install_github("pgmj/easyRasch", dependencies = TRUE)
   ```

   Verifica: `library(easyRasch)` no debe dar error.

### 1.1. Vía alternativa: cargar easyRasch desde la fuente (`load_all`)

En algunas máquinas la **instalación** de easyRasch falla en el paso de *lazy loading*
(`R CMD INSTALL` termina en error o silenciosamente), aunque el paquete es correcto. Para
esos casos la plantilla **ya viene configurada** para cargar easyRasch desde su código fuente
en `easyRasch-main/` con `pkgload`, sin instalarlo:

```r
install.packages("pkgload")   # una sola vez
# (la plantilla llama internamente a:)
pkgload::load_all("easyRasch-main", quiet = TRUE)
```

**Importante:** `load_all()` carga easyRasch, pero **sus dependencias sí deben estar
instaladas** (eRm, mirt, iarm, psych, psychotree, psychotools, tidyverse, brms, catR,
Bayesrel, furrr, doParallel, …). La forma más simple de instalarlas todas es correr el
`pak::pkg_install("pgmj/easyRasch")` de arriba: aunque el *build* final de easyRasch falle,
`pak` ya habrá instalado el árbol de dependencias; entonces la plantilla lo carga con
`load_all()` desde la fuente.

Si en cambio tienes easyRasch instalado y funcionando, abre `analisis_rasch.qmd` y sustituye
la línea `pkgload::load_all(...)` por `library(easyRasch)` (ambas son válidas).

### 1.2. Parche local para Windows 11 ARM (ejecución 100% secuencial)

En **Windows 11 ARM con R x64 emulado**, las funciones de easyRasch que paralelizan crashean
incluso con `cpu = 1`: `doParallel` abre un *worker* PSOCK (un subproceso) que muere bajo la
emulación (código `-1073741569`); además, como el paquete se carga con `pkgload::load_all()`
(no instalado), sus funciones **no se propagan** a ese subproceso.

Por eso el código fuente vendido en `easyRasch-main/` lleva un **parche local mínimo**: en las
tres funciones que la plantilla ejecuta en paralelo se cambió

```r
registerDoParallel(cores = cpu)
```

por

```r
# PATCH LOCAL (Windows ARM): con cpu==1, backend secuencial en el proceso principal.
if (cpu == 1) foreach::registerDoSEQ() else registerDoParallel(cores = cpu)
```

Así, con `cpu == 1` el bucle `%dopar%` corre **en el proceso principal** (donde sí existen las
funciones y objetos), sin abrir *workers*. **Con `cpu > 1` el comportamiento original se
conserva** intacto (paralelismo con `registerDoParallel`).

Archivos y funciones parchadas (buscar el comentario `# PATCH LOCAL (Windows ARM)`):

| Archivo | Función |
|---|---|
| `easyRasch-main/R/easyRasch.R` | `RIgetfit()` |
| `easyRasch-main/R/local_dependence.R` | `RIgetResidCor()` |
| `easyRasch-main/R/reliabilityRMU.R` | `RIreliability()` (rama `boot = TRUE`) |

No se tocó nada más del paquete. Las demás funciones con `%dopar%` (p. ej. `RIbootRestscore`,
`RIbootPCA`) no las usa la plantilla; y cualquier `%dopar%` sin backend propio hereda el
secuencial ya registrado. Si actualizas easyRasch a una versión nueva, vuelve a aplicar el
parche (o corre con `cpu > 1` en una máquina no emulada).

## 2. Cómo correr la plantilla (por escala)

La plantilla recibe dos parámetros: `escala` (`eaj|eal|clg|iaj|dpj`) y `csv_path` (el CSV de
esa escala). Cada escala se corre por separado (una tiene 4 ítems, otra 9, etc.).

**Desde la terminal (Quarto CLI):**

```bash
cd analisis-r
quarto render analisis_rasch.qmd -P escala:eal -P csv_path:datos_prueba/eal_sintetico.csv
```

Genera `analisis_rasch.html` en la carpeta. Para otra escala con datos reales, descarga su
CSV desde la pestaña **Exportar** del dashboard y pásalo:

```bash
quarto render analisis_rasch.qmd -P escala:iaj -P csv_path:~/Descargas/rasch_iaj_2026-08-01.csv
```

**Desde R (equivalente):**

```r
quarto::quarto_render(
  "analisis_rasch.qmd",
  execute_params = list(escala = "eal", csv_path = "datos_prueba/eal_sintetico.csv")
)
```

> Sugerencia: para el análisis definitivo sube `-P sim_iter:400` (o más). Las simulaciones
> de cortes (`RIgetfit`, `RIgetResidCor`) pueden tardar algunos minutos.
>
> **Paralelismo (`-P cpu:…`).** Por defecto `params$cpu = 1` (ejecución en un solo núcleo),
> porque en **Windows 11 ARM con R x64 emulado** los subprocesos paralelos crashean
> (código `-1073741569`). Si tu máquina soporta paralelismo, acelera con `-P cpu:4` (o los
> núcleos que tengas). Solo afecta a `RIgetfit`, `RIgetResidCor` y `RIreliability(boot=TRUE)`.

## 3. Orden sugerido de lectura del reporte

1. **a. Datos** — confirma N, número de ítems y que `RIcheckdata()` no marque problemas.
2. **b. Descriptivos** — efectos piso/techo y categorías poco usadas.
3. **c. Ajuste** — ítems con infit/outfit fuera de los cortes simulados.
4. **d. Dimensionalidad / dependencia local** — un solo rasgo y pares de ítems correlacionados.
5. **e. Categorías** — umbrales ordenados (ojo con **IAJ q5**, categoría colapsada).
6. **f. Targeting / fiabilidad** — dónde mide bien la escala y con qué precisión.
7. **g. DIF** — sesgo entre grupos (requiere n suficiente; ver la advertencia en esa sección).
8. **h. Conversión bruta→medida** — la tabla `RIscoreSE()`, el producto central para la tesina.

## 4. Prueba paso a paso (con el CSV sintético)

Para verificar que todo funciona **sin datos reales**:

1. Abre **RStudio** y, con `Session → Set Working Directory → Choose Directory…`, selecciona
   la carpeta `analisis-r/` (o `setwd("ruta/al/repo/analisis-r")`).
2. Instala los paquetes de la sección 1 (una sola vez).
3. Comprueba que existe el CSV de prueba:

   ```r
   readr::read_csv("datos_prueba/eal_sintetico.csv", show_col_types = FALSE) |> head()
   # columnas: dif_tipo, dif_cohorte, dif_genero, dif_institucion, dif_edad, q1..q4
   ```

4. Renderiza la plantilla para EAL:

   ```r
   quarto::quarto_render(
     "analisis_rasch.qmd",
     execute_params = list(escala = "eal", csv_path = "datos_prueba/eal_sintetico.csv")
   )
   ```

   (O en terminal: `quarto render analisis_rasch.qmd -P escala:eal -P csv_path:datos_prueba/eal_sintetico.csv`.)
5. Abre el `analisis_rasch.html` resultante. Deberías ver las secciones a–h con tablas y
   gráficas. Con datos sintéticos los valores no son interpretables sustantivamente; lo que
   se prueba es que **el flujo corre de principio a fin sin errores**.
6. Si una función se queja por tamaño de muestra (típico en la sección g, DIF, con grupos
   chicos), es esperado con datos de prueba; en el análisis real usa el CSV exportado con
   suficientes respuestas.

### Alternativa: simular datos con el propio easyRasch

En lugar del CSV sintético incluido, puedes generar respuestas politómicas con el simulador
del paquete y probar la plantilla con ellas:

```r
library(easyRasch)
# 4 ítems tipo EAL, 4 categorías (0-3), 200 personas:
set.seed(1)
sim <- SimPartialScore(
  deltaslist = list(c(-1, 0, 1), c(-1, 0, 1), c(-1, 0, 1), c(-1, 0, 1)),
  thetavec   = rnorm(200)
) |> as.data.frame()
names(sim) <- paste0("q", seq_len(ncol(sim)))
# Agrega columnas dif_* de relleno para reproducir el formato de export-rasch:
sim$dif_tipo <- "escolar"; sim$dif_cohorte <- "curso_primavera_2026"
sim$dif_genero <- "mujer"; sim$dif_institucion <- "inst-a"; sim$dif_edad <- 16L
readr::write_csv(sim, "datos_prueba/eal_simulado_pkg.csv")
```

Verifica la firma exacta de `SimPartialScore()` en la referencia oficial
(<https://pgmj.github.io/easyRasch/reference/>), pues sus argumentos pueden variar entre
versiones.

## Notas

- El formato de `/api/export-rasch` es: columnas `dif_tipo, dif_cohorte, dif_genero,
  dif_institucion, dif_edad` seguidas de `q1…qN` con el **puntaje por ítem ya recodificado**
  (inversiones de la §6 aplicadas, mínimo 0). La plantilla separa ítems de `dif_*`.
- Los textos de los ítems que arman `itemlabels` están embebidos en la plantilla, copiados
  literalmente de `lib/instrumento.ts` (instrumento validado, intocable).
- Cita `easyRasch` y los paquetes subyacentes con `citation("easyRasch")`, `citation("eRm")`, etc.
