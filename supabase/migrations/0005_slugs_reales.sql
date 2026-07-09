-- Migración 0005 — Slugs no adivinables y nombres reales de las 3 instituciones escolares.
-- La base ya tiene aplicadas 0001–0004. Aditivo/seguro (solo UPDATE de filas existentes).
--
-- Los slugs nuevos tienen la parte aleatoria `enc-XXXXXX` (sin caracteres ambiguos) para que
-- no se pueda adivinar el link de otra institución. 'general' NO cambia (slug ni nombre).
-- El anti-duplicados de localStorage usa el slug como clave, así que basta con estos UPDATE;
-- no hay slugs escolares hardcodeados en el código de la app.

update instituciones set slug = 'enc-2pit26', nombre = 'Institución Privada'            where slug = 'inst-a';
update instituciones set slug = 'enc-9cxazi', nombre = 'Escuela Nacional Preparatoria'  where slug = 'inst-b';
update instituciones set slug = 'enc-eekk8z', nombre = 'Institución MCCEMS'              where slug = 'inst-c';
