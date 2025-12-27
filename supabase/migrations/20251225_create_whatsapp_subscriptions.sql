-- Tabla para suscriptores que desean recibir el Evangelio del día por WhatsApp
create extension if not exists pgcrypto;

create table if not exists public.whatsapp_subscriptions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  phone text not null,
  email text,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  unsubscribed_at timestamp with time zone,
  last_sent_date date,
  source text not null default 'website',
  timezone text not null default 'America/Santiago'
);

-- Evitar duplicados por teléfono
create unique index if not exists whatsapp_subscriptions_phone_uq
  on public.whatsapp_subscriptions (phone);

create index if not exists whatsapp_subscriptions_active_idx
  on public.whatsapp_subscriptions (is_active);

-- RLS: solo el backend (service_role) debe leer/escribir
alter table public.whatsapp_subscriptions enable row level security;

drop policy if exists "whatsapp_subscriptions_service_role_all" on public.whatsapp_subscriptions;
create policy "whatsapp_subscriptions_service_role_all"
  on public.whatsapp_subscriptions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

alter table public.whatsapp_subscriptions force row level security;
