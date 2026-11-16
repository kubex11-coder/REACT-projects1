-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Přidá do plan_entries sloupec cheat (blok FOOD označený jako cheatday).
-- Jde spustit opakovaně. RLS pravidlo "owner only" platí i pro nový sloupec.

alter table plan_entries add column if not exists cheat boolean;
