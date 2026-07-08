-- Migración inicial — App de Encuesta de Capacidades Legales (SPEC §3).
-- Ejecutar en el proyecto de Supabase (SQL editor o `supabase db push`).
--
-- Seguridad (SPEC §2): RLS habilitado en todas las tablas SIN políticas => deny-all para
-- los roles `anon` y `authenticated`. El `service_role` (usado solo desde las API routes
-- del servidor de Next.js) ignora RLS. El navegador NUNCA habla directo con Supabase.

create extension if not exists pgcrypto; -- gen_random_uuid()

create table instituciones (
  id serial primary key,
  slug text unique not null,      -- va en la URL
  nombre text not null,
  activa boolean default true
);

-- Seed (nombres placeholder; el usuario los sustituirá — ver DECISIONES.md D8).
-- Considerar slugs no adivinables (p. ej. 'inst-a-x7k2') antes de repartir los links.
insert into instituciones (slug, nombre) values
  ('inst-a', 'Institución A'),
  ('inst-b', 'Institución B'),
  ('inst-c', 'Institución C');

create table respuestas (
  id uuid primary key default gen_random_uuid(),
  institucion_id int references instituciones(id) not null,
  creada_en timestamptz default now(),

  -- consentimiento
  acepto_aviso boolean not null,

  -- cohorte de la materia de Derecho
  cohorte text not null check (cohorte in ('curso_primavera_2026','cursara_otono_2026')),

  -- demografía
  edad int check (edad between 12 and 99),
  genero text,
  se_considera_indigena text,        -- 'si' | 'no' | 'prefiero_no_responder'
  se_considera_afro text,            -- 'si' | 'no' | 'prefiero_no_responder'
  nivel_educativo_padre text,
  nivel_educativo_madre text,

  -- respuestas item por item (enteros 0-3 según codificación de captura, SIN invertir)
  items jsonb not null,              -- {"eaj": [..6], "eal": [..4], "clg": [..6], "iaj": [..9], "dpj": [..6]}

  -- puntuaciones calculadas en el servidor al insertar
  eaj_bruta int, eaj_rasch numeric,
  eal_bruta int, eal_rasch numeric,
  clg_bruta int, clg_rasch numeric,
  iaj_bruta int, iaj_rasch numeric,
  dpj_bruta int, dpj_rasch numeric,

  -- metadatos
  duracion_segundos int,
  user_agent text
);

-- Índices para las consultas del dashboard (resumen por institución y por día).
create index respuestas_institucion_id_idx on respuestas (institucion_id);
create index respuestas_creada_en_idx on respuestas (creada_en);

alter table instituciones enable row level security;
alter table respuestas enable row level security;
-- sin políticas => deny-all para anon/authenticated; el service role accede igual
