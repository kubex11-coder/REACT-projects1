-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Před spuštěním nahraď OWNER_EMAIL e-mailem svého účtu.
-- Tabulka pro upravitelné popisy týdnů, objemy km a měsíce. Jde spustit opakovaně.

create table if not exists plan_meta (
  plan_id text not null,
  key     text not null,           -- např. week:2026-11-09:title, month:2026-11:desc
  value   text not null,
  primary key (plan_id, key)
);

alter table plan_meta enable row level security;

drop policy if exists "owner only" on plan_meta;
create policy "owner only"
  on plan_meta
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'jakubdvorak91@seznam.cz')
  with check ((auth.jwt() ->> 'email') = 'jakubdvorak91@seznam.cz');
