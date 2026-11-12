-- Migración 0006 — Clasificación de instituciones (sostenimiento × sistema) y renombre del
-- placeholder "Institución Privada" a la primera prepa privada real.
-- La base ya tiene aplicadas 0001–0005. Aditivo y seguro (ALTER ADD COLUMN + UPDATE de filas).
--
-- Cada escuela ya se distingue por su `slug`/`nombre`. Se agregan dos ejes de clasificación
-- para el análisis (no afectan el flujo de la encuesta, la validación ni el scoring):
--   sostenimiento : 'publica' | 'privada'
--   sistema       : 'unam' | 'sep'   (autoridad a la que la escuela pertenece —ENP—
--                                     o a la que está incorporada —privadas con clave UNAM o RVOE SEP)
-- Resultado: ENP = publica·unam · MCCEMS = publica·sep · Antonio Caso = privada·unam.
-- 'general' (público adulto) NO es una escuela: queda en NULL/NULL.
-- Ambas columnas son NULLABLE; el CHECK admite NULL. El catálogo se valida en la capa de app.

-- 1) Columnas de clasificación.
alter table instituciones
  add column sostenimiento text check (sostenimiento in ('publica', 'privada')),
  add column sistema       text check (sistema in ('unam', 'sep'));

-- 2) Renombre del placeholder a la primera prepa privada real (reutiliza el slug enc-2pit26;
--    ver DECISIONES.md D18). El slug NO cambia, así que el link ya repartido sigue válido.
update instituciones
  set nombre = 'Preparatoria Maestro Antonio Caso'
  where slug = 'enc-2pit26';

-- 3) Backfill de la clasificación de las instituciones escolares.
update instituciones set sostenimiento = 'privada', sistema = 'unam' where slug = 'enc-2pit26'; -- Antonio Caso (incorporada a la UNAM)
update instituciones set sostenimiento = 'publica', sistema = 'unam' where slug = 'enc-9cxazi'; -- Escuela Nacional Preparatoria (UNAM)
update instituciones set sostenimiento = 'publica', sistema = 'sep'  where slug = 'enc-eekk8z'; -- Institución MCCEMS (SEP)
-- 'general' permanece en NULL/NULL (no es escuela).
