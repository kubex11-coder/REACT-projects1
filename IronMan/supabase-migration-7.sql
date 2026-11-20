-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Vytvoří tabulku quotes (uložené citáty s hodnocením 6–10). Před spuštěním nahraď
-- OWNER_EMAIL svým e-mailem (stejně jako v supabase-setup.sql). Jde spustit opakovaně.

create table if not exists quotes (
  text       text primary key,
  author     text,
  rating     integer not null check (rating between 0 and 10),
  created_at timestamptz not null default now()
);

alter table quotes enable row level security;

drop policy if exists "owner only" on quotes;
create policy "owner only"
  on quotes
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'jakubdvorak91@seznam.cz')
  with check ((auth.jwt() ->> 'email') = 'jakubdvorak91@seznam.cz');
