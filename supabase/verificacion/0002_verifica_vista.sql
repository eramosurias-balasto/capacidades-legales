-- Verificación de respuestas_por_item.puntaje_recodificado contra lib/scoring.ts (§6).
-- Correr TAL CUAL en el SQL Editor de Supabase (con 0001 y 0002 ya aplicadas).
-- Inserta 3 respuestas sintéticas, compara la vista contra los valores esperados
-- (generados desde lib/scoring.ts) y hace ROLLBACK: NO deja datos.
--
-- Éxito  => "OK: la vista coincide con lib/scoring.ts (93 renglones, 3 casos)".
-- Fallo  => la transacción aborta con "FALLO: ... renglones no coinciden".

begin;

-- 1) Respuestas sintéticas (marcadas en user_agent para identificarlas).
insert into respuestas (institucion_id, acepto_aviso, cohorte, items, user_agent) values
  ((select id from instituciones order by id limit 1), true, 'curso_primavera_2026', '{"eaj":[0,0,0,0,0,0],"eal":[0,0,0,0],"clg":[0,0,0,0,0,0],"iaj":[0,0,0,0,0,0,0,0,0],"dpj":[0,0,0,0,0,0]}'::jsonb, 'VERIF_A'),
  ((select id from instituciones order by id limit 1), true, 'curso_primavera_2026', '{"eaj":[3,3,3,3,3,3],"eal":[3,3,3,3],"clg":[3,3,3,3,3,3],"iaj":[3,3,3,3,3,3,3,3,3],"dpj":[3,3,3,3,3,3]}'::jsonb, 'VERIF_B'),
  ((select id from instituciones order by id limit 1), true, 'curso_primavera_2026', '{"eaj":[0,1,2,3,0,1],"eal":[3,2,1,0],"clg":[0,1,2,3,0,1],"iaj":[0,1,2,3,0,1,2,3,0],"dpj":[0,3,3,0,3,0]}'::jsonb, 'VERIF_C');

-- 2) Valores esperados (caso, escala, num_item, valor_crudo, puntaje) desde lib/scoring.ts.
create temp table esperado_recode (caso text, escala text, num_item int, valor_crudo int, puntaje int) on commit drop;
insert into esperado_recode values
  ('VERIF_A', 'eaj', 1, 0, 0),
  ('VERIF_A', 'eaj', 2, 0, 0),
  ('VERIF_A', 'eaj', 3, 0, 0),
  ('VERIF_A', 'eaj', 4, 0, 0),
  ('VERIF_A', 'eaj', 5, 0, 0),
  ('VERIF_A', 'eaj', 6, 0, 0),
  ('VERIF_A', 'eal', 1, 0, 0),
  ('VERIF_A', 'eal', 2, 0, 0),
  ('VERIF_A', 'eal', 3, 0, 0),
  ('VERIF_A', 'eal', 4, 0, 0),
  ('VERIF_A', 'clg', 1, 0, 3),
  ('VERIF_A', 'clg', 2, 0, 3),
  ('VERIF_A', 'clg', 3, 0, 3),
  ('VERIF_A', 'clg', 4, 0, 3),
  ('VERIF_A', 'clg', 5, 0, 3),
  ('VERIF_A', 'clg', 6, 0, 3),
  ('VERIF_A', 'iaj', 1, 0, 0),
  ('VERIF_A', 'iaj', 2, 0, 3),
  ('VERIF_A', 'iaj', 3, 0, 3),
  ('VERIF_A', 'iaj', 4, 0, 0),
  ('VERIF_A', 'iaj', 5, 0, 2),
  ('VERIF_A', 'iaj', 6, 0, 0),
  ('VERIF_A', 'iaj', 7, 0, 0),
  ('VERIF_A', 'iaj', 8, 0, 0),
  ('VERIF_A', 'iaj', 9, 0, 3),
  ('VERIF_A', 'dpj', 1, 0, 3),
  ('VERIF_A', 'dpj', 2, 0, 3),
  ('VERIF_A', 'dpj', 3, 0, 0),
  ('VERIF_A', 'dpj', 4, 0, 3),
  ('VERIF_A', 'dpj', 5, 0, 3),
  ('VERIF_A', 'dpj', 6, 0, 0),
  ('VERIF_B', 'eaj', 1, 3, 3),
  ('VERIF_B', 'eaj', 2, 3, 3),
  ('VERIF_B', 'eaj', 3, 3, 3),
  ('VERIF_B', 'eaj', 4, 3, 3),
  ('VERIF_B', 'eaj', 5, 3, 3),
  ('VERIF_B', 'eaj', 6, 3, 3),
  ('VERIF_B', 'eal', 1, 3, 3),
  ('VERIF_B', 'eal', 2, 3, 3),
  ('VERIF_B', 'eal', 3, 3, 3),
  ('VERIF_B', 'eal', 4, 3, 3),
  ('VERIF_B', 'clg', 1, 3, 0),
  ('VERIF_B', 'clg', 2, 3, 0),
  ('VERIF_B', 'clg', 3, 3, 0),
  ('VERIF_B', 'clg', 4, 3, 0),
  ('VERIF_B', 'clg', 5, 3, 0),
  ('VERIF_B', 'clg', 6, 3, 0),
  ('VERIF_B', 'iaj', 1, 3, 3),
  ('VERIF_B', 'iaj', 2, 3, 0),
  ('VERIF_B', 'iaj', 3, 3, 0),
  ('VERIF_B', 'iaj', 4, 3, 3),
  ('VERIF_B', 'iaj', 5, 3, 0),
  ('VERIF_B', 'iaj', 6, 3, 3),
  ('VERIF_B', 'iaj', 7, 3, 3),
  ('VERIF_B', 'iaj', 8, 3, 3),
  ('VERIF_B', 'iaj', 9, 3, 0),
  ('VERIF_B', 'dpj', 1, 3, 0),
  ('VERIF_B', 'dpj', 2, 3, 0),
  ('VERIF_B', 'dpj', 3, 3, 3),
  ('VERIF_B', 'dpj', 4, 3, 0),
  ('VERIF_B', 'dpj', 5, 3, 0),
  ('VERIF_B', 'dpj', 6, 3, 3),
  ('VERIF_C', 'eaj', 1, 0, 0),
  ('VERIF_C', 'eaj', 2, 1, 1),
  ('VERIF_C', 'eaj', 3, 2, 2),
  ('VERIF_C', 'eaj', 4, 3, 3),
  ('VERIF_C', 'eaj', 5, 0, 0),
  ('VERIF_C', 'eaj', 6, 1, 1),
  ('VERIF_C', 'eal', 1, 3, 3),
  ('VERIF_C', 'eal', 2, 2, 2),
  ('VERIF_C', 'eal', 3, 1, 1),
  ('VERIF_C', 'eal', 4, 0, 0),
  ('VERIF_C', 'clg', 1, 0, 3),
  ('VERIF_C', 'clg', 2, 1, 2),
  ('VERIF_C', 'clg', 3, 2, 1),
  ('VERIF_C', 'clg', 4, 3, 0),
  ('VERIF_C', 'clg', 5, 0, 3),
  ('VERIF_C', 'clg', 6, 1, 2),
  ('VERIF_C', 'iaj', 1, 0, 0),
  ('VERIF_C', 'iaj', 2, 1, 2),
  ('VERIF_C', 'iaj', 3, 2, 1),
  ('VERIF_C', 'iaj', 4, 3, 3),
  ('VERIF_C', 'iaj', 5, 0, 2),
  ('VERIF_C', 'iaj', 6, 1, 1),
  ('VERIF_C', 'iaj', 7, 2, 2),
  ('VERIF_C', 'iaj', 8, 3, 3),
  ('VERIF_C', 'iaj', 9, 0, 3),
  ('VERIF_C', 'dpj', 1, 0, 3),
  ('VERIF_C', 'dpj', 2, 3, 0),
  ('VERIF_C', 'dpj', 3, 3, 3),
  ('VERIF_C', 'dpj', 4, 0, 3),
  ('VERIF_C', 'dpj', 5, 3, 0),
  ('VERIF_C', 'dpj', 6, 0, 0);

-- 3) Comparación vista vs. esperado.
do $$
declare
  n_esperado   int;
  n_vista      int;
  n_mismatch   int;
begin
  select count(*) into n_esperado from esperado_recode;

  select count(*) into n_vista
  from respuestas_por_item v
  join respuestas r on r.id = v.respuesta_id
  where r.user_agent in ('VERIF_A', 'VERIF_B', 'VERIF_C');

  if n_vista <> n_esperado then
    raise exception 'FALLO: la vista devolvió % renglones, se esperaban %', n_vista, n_esperado;
  end if;

  select count(*) into n_mismatch
  from respuestas_por_item v
  join respuestas r on r.id = v.respuesta_id
  join esperado_recode e
    on e.caso = r.user_agent and e.escala = v.escala and e.num_item = v.num_item
  where r.user_agent in ('VERIF_A', 'VERIF_B', 'VERIF_C')
    and (v.puntaje_recodificado is distinct from e.puntaje
         or v.valor_crudo is distinct from e.valor_crudo
         or v.etiqueta is null);

  if n_mismatch > 0 then
    raise exception 'FALLO: % renglones no coinciden con lib/scoring.ts', n_mismatch;
  end if;

  raise notice 'OK: la vista coincide con lib/scoring.ts (% renglones, 3 casos)', n_esperado;
end $$;

rollback; -- no persistir datos sintéticos
