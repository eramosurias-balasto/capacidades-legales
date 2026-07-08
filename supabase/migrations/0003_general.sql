-- Migración 0003 — Link "general" para público adulto, reciclando el esquema.
-- La base ya tiene aplicadas 0001 y 0002. Todo aquí es aditivo y seguro.
--
-- Contexto (DECISIONES.md D10): la muestra "general" es de conveniencia; se analiza SIEMPRE
-- por separado de la escolar y funciona como piloto del instrumento.

-- ============================================================================
-- 1. instituciones.tipo — distingue el flujo (escolar vs general).
-- ============================================================================
alter table instituciones
  add column tipo text not null default 'escolar'
  check (tipo in ('escolar', 'general'));

-- Cuarta "institución": el público general (un link más: /encuesta/general).
insert into instituciones (slug, nombre, tipo) values
  ('general', 'General', 'general');

-- ============================================================================
-- 2. respuestas.cohorte — SIGUE not null; se extiende el check a 4 valores.
--    escolar: curso_primavera_2026 | cursara_otono_2026
--    general: general_si_curso | general_no_curso
-- ============================================================================
alter table respuestas drop constraint respuestas_cohorte_check;
alter table respuestas
  add constraint respuestas_cohorte_check check (
    cohorte in (
      'curso_primavera_2026',
      'cursara_otono_2026',
      'general_si_curso',
      'general_no_curso'
    )
  );

-- ============================================================================
-- 3. respuestas — tres columnas nuevas (solo se llenan según el flujo/tipo;
--    la obligatoriedad condicional se valida en /api/submit).
-- ============================================================================
alter table respuestas
  add column nivel_educativo_propio text,  -- solo general (catálogo sin 'no_lo_se')
  add column ocupacion text,               -- solo general (texto libre, máx. 120)
  add column curso_derecho_detalle text;   -- solo si cohorte = 'general_si_curso' (máx. 200)

-- ============================================================================
-- 4. Vista respuestas_por_item: NO le afecta. Desdobla solo `items` (idéntico en
--    ambos flujos: mismas 5 escalas, mismos 31 ítems) y pasa `cohorte` tal cual,
--    que ahora admite 4 valores como texto. No requiere recrearse.
-- ============================================================================
