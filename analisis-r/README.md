# analisis-r — Calibración Rasch con datos mexicanos (easyRasch)

Análisis Rasch **fuera de la app**, en R, sobre los CSV que exporta el dashboard
(`/api/export-rasch?escala=<escala>`). Produce el insumo del anexo metodológico de la
tesina: la calibración con datos mexicanos, comparable con las tablas de Pleasence & Balmer
(2018). La app **no** recalibra nada; solo aplica las tablas oficiales P&B.

- `analisis_rasch.qmd` — plantilla Quarto parametrizada por escala.
- `datos_prueba/eal_sintetico.csv` — 200 filas sintéticas con el formato EXACTO de
  `/api/export-rasch?escala=eal`, para probar la plantilla sin datos reales.

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
> de cortes (`RIgetfit`, `RIgetResidCor`) usan varios núcleos (`cpu = 4` en la plantilla,
> ajústalo) y pueden tardar algunos minutos.

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
