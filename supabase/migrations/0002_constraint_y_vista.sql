-- Migración 0002 — CHECK sobre respuestas.items + vista de inspección respuestas_por_item.
-- La base ya tiene aplicada 0001. Todo aquí es aditivo y seguro para una base migrada.
--
-- Verificación del recode de la vista contra lib/scoring.ts:
--   * supabase/verificacion/0002_verifica_vista.sql (correr en el SQL Editor; hace rollback).
--   * lib/vista.recode.test.ts (ata las reglas SQL a lib/scoring.ts en CI).

-- ============================================================================
-- 1. CHECK CONSTRAINT sobre respuestas.items (defensa en profundidad en la BD).
--    Longitudes exactas por escala + todos los elementos enteros en 0..3.
-- ============================================================================

-- Estructura: cada clave es un arreglo con la longitud esperada.
alter table respuestas
  add constraint respuestas_items_longitudes check (
    jsonb_typeof(items->'eaj') = 'array' and jsonb_array_length(items->'eaj') = 6 and
    jsonb_typeof(items->'eal') = 'array' and jsonb_array_length(items->'eal') = 4 and
    jsonb_typeof(items->'clg') = 'array' and jsonb_array_length(items->'clg') = 6 and
    jsonb_typeof(items->'iaj') = 'array' and jsonb_array_length(items->'iaj') = 9 and
    jsonb_typeof(items->'dpj') = 'array' and jsonb_array_length(items->'dpj') = 6
  );

-- Valores: no debe existir ningún elemento que no sea un entero entre 0 y 3.
-- El predicado marca como inválido todo elemento no numérico, fuera de rango o no entero
-- (@.floor() != @). Si NO existe ninguno inválido en las cinco escalas, el CHECK pasa.
alter table respuestas
  add constraint respuestas_items_valores check (
    not jsonb_path_exists(items, '$.eaj[*] ? (@.type() != "number" || @ < 0 || @ > 3 || @.floor() != @)') and
    not jsonb_path_exists(items, '$.eal[*] ? (@.type() != "number" || @ < 0 || @ > 3 || @.floor() != @)') and
    not jsonb_path_exists(items, '$.clg[*] ? (@.type() != "number" || @ < 0 || @ > 3 || @.floor() != @)') and
    not jsonb_path_exists(items, '$.iaj[*] ? (@.type() != "number" || @ < 0 || @ > 3 || @.floor() != @)') and
    not jsonb_path_exists(items, '$.dpj[*] ? (@.type() != "number" || @ < 0 || @ > 3 || @.floor() != @)')
  );

-- ============================================================================
-- 2. VISTA respuestas_por_item — formato largo, un renglón por ítem respondido.
--    SOLO para inspección en Supabase. Dashboard y exports siguen leyendo de
--    `respuestas`. security_invoker=true: la vista respeta RLS del rol que consulta
--    (deny-all para anon/authenticated; solo service_role/postgres ven datos).
--
--    Las etiquetas y el recode replican lib/instrumento.ts (categorías) y §6 del SPEC
--    (recodeItem de lib/scoring.ts). Ver lib/vista.recode.test.ts.
-- ============================================================================

create or replace view respuestas_por_item
  with (security_invoker = true) as
select
  r.id            as respuesta_id,
  r.institucion_id,
  r.cohorte,
  r.creada_en,
  e.escala,
  e.num_item,                      -- 1-based
  e.valor_crudo,                   -- 0..3, tal como se capturó (sin invertir)
  case
    when e.escala in ('eaj', 'eal') then
      case e.valor_crudo
        when 0 then 'nada cierto'
        when 1 then 'casi nada cierto'
        when 2 then 'moderadamente cierto'
        when 3 then 'totalmente cierto'
      end
    when e.escala = 'clg' then
      case e.valor_crudo
        when 0 then 'muy seguro'
        when 1 then 'bastante seguro'
        when 2 then 'no muy seguro'
        when 3 then 'nada seguro'
      end
    when e.escala in ('iaj', 'dpj') then
      case e.valor_crudo
        when 0 then 'totalmente de acuerdo'
        when 1 then 'mayoritariamente de acuerdo'
        when 2 then 'mayoritariamente en desacuerdo'
        when 3 then 'totalmente en desacuerdo'
      end
  end             as etiqueta,
  case
    -- EAJ / EAL: captura directa.
    when e.escala in ('eaj', 'eal') then e.valor_crudo
    -- CLG: puntaje = 3 - índice.
    when e.escala = 'clg' then 3 - e.valor_crudo
    -- IAJ: 1,4,6,7,8 directos; 2,3,9 invertidos; 5 regla especial (colapsa desacuerdos).
    when e.escala = 'iaj' then
      case
        when e.num_item in (1, 4, 6, 7, 8) then e.valor_crudo
        when e.num_item in (2, 3, 9) then 3 - e.valor_crudo
        when e.num_item = 5 then
          case e.valor_crudo when 0 then 2 when 1 then 1 when 2 then 0 when 3 then 0 end
      end
    -- DPJ: 1,2,4,5 invertidos; 3,6 directos.
    when e.escala = 'dpj' then
      case
        when e.num_item in (1, 2, 4, 5) then 3 - e.valor_crudo
        when e.num_item in (3, 6) then e.valor_crudo
      end
  end             as puntaje_recodificado
from respuestas r
cross join lateral (
  select 'eaj'::text as escala, ord::int as num_item, val::int as valor_crudo
    from jsonb_array_elements_text(r.items->'eaj') with ordinality as t(val, ord)
  union all
  select 'eal', ord::int, val::int
    from jsonb_array_elements_text(r.items->'eal') with ordinality as t(val, ord)
  union all
  select 'clg', ord::int, val::int
    from jsonb_array_elements_text(r.items->'clg') with ordinality as t(val, ord)
  union all
  select 'iaj', ord::int, val::int
    from jsonb_array_elements_text(r.items->'iaj') with ordinality as t(val, ord)
  union all
  select 'dpj', ord::int, val::int
    from jsonb_array_elements_text(r.items->'dpj') with ordinality as t(val, ord)
) e;
