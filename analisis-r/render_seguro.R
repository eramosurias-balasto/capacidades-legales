# render_seguro.R — flujo de render 100% en la sesión de R (sin subprocesos).
#
# Pensado para Windows 11 ARM con R x64 EMULADO, donde cualquier subproceso paralelo o de
# render (knitr/quarto lanzados como proceso hijo) crashea (-1073741569). Estrategia:
#   1) knitr::knit() ejecuta el .qmd EN la sesión actual (sin proceso hijo) -> produce un .md
#      con todo ya calculado.
#   2) quarto::quarto_render() sobre ese .md corre SOLO pandoc (motor markdown, sin R),
#      así no relanza R en un subproceso.
#
# Uso (desde la carpeta analisis-r/):
#   source("render_seguro.R")
#   render_rasch("eal", "datos_prueba/eal_sintetico.csv")                 # prueba rápida
#   render_rasch("iaj", "~/Descargas/rasch_iaj_2026-08-01.csv", sim_iter = 400)
#
# Devuelve (invisible) las rutas de los archivos generados: analisis_rasch_<escala>.md/.html

render_rasch <- function(escala, csv_path, sim_iter = 400, cpu = 1) {
  # --- Validaciones previas ---
  escalas_validas <- c("eaj", "eal", "clg", "iaj", "dpj")
  if (!escala %in% escalas_validas) {
    stop("escala inválida: '", escala, "'. Debe ser una de: ", paste(escalas_validas, collapse = ", "))
  }
  if (!file.exists("analisis_rasch.qmd")) {
    stop("No se encuentra 'analisis_rasch.qmd'. Ejecuta esta función desde la carpeta analisis-r/ ",
         "(Session -> Set Working Directory -> To Source File Location, o setwd(...)).")
  }
  if (!file.exists(csv_path)) {
    stop("No existe el CSV: '", csv_path, "'. Verifica la ruta (relativa a la carpeta analisis-r/).")
  }

  md_out   <- sprintf("analisis_rasch_%s.md", escala)
  html_out <- sprintf("analisis_rasch_%s.html", escala)

  # Parámetros del reporte. knitr::knit() NO procesa el bloque `params:` del YAML (eso es de
  # Quarto/rmarkdown), así que definimos `params` en el entorno donde se ejecutan los chunks.
  params <- list(escala = escala, csv_path = csv_path, sim_iter = sim_iter, cpu = cpu)

  # mc.cores gobierna las llamadas internas con default cpu=4 (p. ej. RIitemfit ->
  # RIestThetasCATr) gracias al parche local; con cpu=1 todo corre secuencial (ver README §1.2).
  options(mc.cores = cpu)

  # Silenciar warnings/messages en el .md (equivalente al `execute: warning/message: false`
  # del YAML, que solo aplica bajo Quarto, no bajo knitr directo).
  knitr::opts_chunk$set(warning = FALSE, message = FALSE)

  # --- Paso 1: knit EN la sesión (sin subprocesos) ---
  message("[1/2] knitr::knit -> ", md_out, "  (escala=", escala, ", sim_iter=", sim_iter, ", cpu=", cpu, ")")
  knitr::knit("analisis_rasch.qmd", output = md_out, envir = environment(), quiet = TRUE)

  # --- Paso 2: pandoc-only sobre el .md (sin motor R) ---
  message("[2/2] quarto::quarto_render -> ", html_out, "  (solo pandoc)")
  quarto::quarto_render(md_out)

  message("Listo: ", md_out, " y ", html_out)
  invisible(list(md = md_out, html = html_out))
}

# Ejemplo para renderizar las cinco escalas desde sus CSV (descomenta y ajusta rutas):
# render_todas <- function(dir_csv = "datos_prueba", sim_iter = 400, cpu = 1) {
#   for (e in c("eaj", "eal", "clg", "iaj", "dpj")) {
#     render_rasch(e, file.path(dir_csv, paste0("rasch_", e, ".csv")), sim_iter = sim_iter, cpu = cpu)
#   }
# }
