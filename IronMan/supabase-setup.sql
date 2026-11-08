-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Před spuštěním nahraď OWNER_EMAIL e-mailem svého účtu.

create table if not exists plan_entries (
  plan_id text not null,
  day     text not null,           -- datum ve tvaru 2026-11-09
  text    text,                    -- upravený popis tréninku (null = původní)
  note    text,                    -- poznámka
  status  text check (status in ('yes', 'no')),  -- splněno Ano / Ne (null = nevyplněno)
  primary key (plan_id, day)
);

alter table plan_entries enable row level security;

-- Číst i zapisovat smí jen majitel.
create policy "owner only"
  on plan_entries
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

-- Upravitelné popisy týdnů, objemy km a měsíce (viz také supabase-migration-3.sql).
create table if not exists plan_meta (
  plan_id text not null,
  key     text not null,
  value   text not null,
  primary key (plan_id, key)
);

alter table plan_meta enable row level security;

drop policy if exists "owner only" on plan_meta;
create policy "owner only"
  on plan_meta
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
