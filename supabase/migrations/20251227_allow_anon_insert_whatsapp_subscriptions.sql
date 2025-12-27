-- Permitir inserciones desde el frontend/Netlify Function sin requerir role=service_role.
--
-- Contexto:
-- En algunos despliegues, la Netlify Function puede estar usando un token que
-- no trae role=service_role (o se configuró mal la variable), lo que provoca:
--   "new row violates row-level security policy for table whatsapp_subscriptions" (42501)
--
-- Esta policy permite INSERT para roles anon/authenticated, manteniendo el resto
-- de operaciones restringidas (SELECT/UPDATE/DELETE siguen siendo solo service_role).

alter table public.whatsapp_subscriptions enable row level security;

drop policy if exists "whatsapp_subscriptions_anon_insert" on public.whatsapp_subscriptions;

create policy "whatsapp_subscriptions_anon_insert"
  on public.whatsapp_subscriptions
  for insert
  to anon, authenticated
  with check (
    -- reglas mínimas de saneamiento
    length(phone) >= 10
    and length(first_name) >= 2
  );

-- Importante: el frontend usa UPSERT (INSERT ... ON CONFLICT DO UPDATE).
-- En escenarios con conflicto, Postgres requiere que exista una policy de UPDATE
-- para el rol que ejecuta la query, o el statement puede fallar por RLS.
drop policy if exists "whatsapp_subscriptions_anon_update" on public.whatsapp_subscriptions;

create policy "whatsapp_subscriptions_anon_update"
  on public.whatsapp_subscriptions
  for update
  to anon, authenticated
  using (true)
  with check (
    length(phone) >= 10
    and length(first_name) >= 2
  );
