-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Přidá poznámku a stav Ano/Ne a převede dosavadní "done" na status.
-- Jde bezpečně spustit i opakovaně.

alter table plan_entries add column if not exists note text;
alter table plan_entries add column if not exists status text
  check (status in ('yes', 'no'));

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'plan_entries'
      and column_name = 'done'
  ) then
    update plan_entries set status = 'yes' where done;
    alter table plan_entries drop column done;
  end if;
end $$;
