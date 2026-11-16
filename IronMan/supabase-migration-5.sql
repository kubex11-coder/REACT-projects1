-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Přidá do plan_entries sloupce pro sekci FOOD: ranní váha (kg), přijaté a spálené kcal.
-- Jde spustit opakovaně. RLS pravidlo "owner only" platí i pro nové sloupce.

alter table plan_entries
  add column if not exists weight numeric check (weight >= 0),
  add column if not exists kcal_in numeric check (kcal_in >= 0),
  add column if not exists kcal_out numeric check (kcal_out >= 0);
