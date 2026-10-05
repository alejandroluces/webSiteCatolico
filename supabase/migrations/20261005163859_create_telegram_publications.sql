-- Server-only persistent publication state. No subscriber personal data.
create table public.telegram_publications (
  chat_id text not null,
  date date not null,
  status text not null default 'sending' check (status in ('sending', 'failed', 'uncertain', 'sent')),
  messages jsonb not null check (jsonb_typeof(messages) = 'array' and jsonb_array_length(messages) > 0),
  next_index integer not null default 0,
  message_ids jsonb not null default '[]'::jsonb check (jsonb_typeof(message_ids) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (chat_id, date),
  check (next_index >= 0 and next_index <= jsonb_array_length(messages)),
  check (jsonb_array_length(message_ids) = next_index),
  check (status <> 'sent' or next_index = jsonb_array_length(messages))
);

alter table public.telegram_publications enable row level security;
revoke all on public.telegram_publications from public, anon, authenticated;
grant select, insert, update on public.telegram_publications to service_role;
comment on table public.telegram_publications is
  'Telegram channel delivery ledger. Ambiguous sends require manual review before resuming.';
