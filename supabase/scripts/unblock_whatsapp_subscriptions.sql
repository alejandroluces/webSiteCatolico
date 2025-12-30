-- Habilitar suscripciones (deshacer bloqueo)
--
-- Esto vuelve a crear las policies RLS para permitir que anon/authenticated
-- puedan suscribirse.

alter table public.whatsapp_subscriptions enable row level security;

-- INSERT
drop policy if exists "whatsapp_subscriptions_anon_insert" on public.whatsapp_subscriptions;

create policy "whatsapp_subscriptions_anon_insert"
  on public.whatsapp_subscriptions
  for insert
  to anon, authenticated
  with check (
    length(phone) >= 10
    and length(first_name) >= 2
  );

-- UPDATE (necesario para flujos que actualizan por teléfono)
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

