-- Migración 0004 — Rediseño de la encuesta: dos columnas nuevas en respuestas.
-- La base ya tiene aplicadas 0001–0003. Aditivo y seguro.
--
--   entidad             : entidad federativa (obligatoria para TODOS los flujos).
--   curso_derecho_anio  : año en que terminó su última clase de Derecho; solo aplica al
--                         flujo general cuando cohorte = 'general_si_curso'. Entero,
--                         1940–2026 (no futuro). La obligatoriedad condicional se valida
--                         en /api/submit (lib/submit-validation.ts).

alter table respuestas
  add column entidad text,
  add column curso_derecho_anio int check (curso_derecho_anio between 1940 and 2026);
