-- Crear tabla de peticiones de oración
create table if not exists prayer_requests (
  id bigint generated always as identity primary key,
  name text,
  intention text not null,
  category text not null default 'general',
  is_anonymous boolean default false,
  prayers integer default 0,
  created_at timestamp with time zone default now()
);

-- Crear función RPC para incrementar contador de oraciones
create or replace function increment_prayer_count(request_id bigint)
returns void as $$
begin
  update prayer_requests
  set prayers = prayers + 1
  where id = request_id;
end;
$$ language plpgsql security definer;
