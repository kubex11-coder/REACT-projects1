-- Spusť v Supabase: SQL Editor -> New query -> vlož -> Run.
-- Přidá sloupec km (naběhnuté kilometry) do plan_entries a přenese do něj
-- dosavadní hodnoty z plan_meta (klíče km:<id bloku>). Jde spustit opakovaně.
-- RLS pravidlo "owner only" na plan_entries platí i pro nový sloupec.

alter table plan_entries add column if not exists km numeric
  check (km >= 0);

-- Přenos dosavadních kilometrů; čárku v textu nahradí tečkou, neplatné hodnoty přeskočí.
insert into plan_entries (plan_id, day, km)
select plan_id,
       substring(key from 4) as day,
       replace(value, ',', '.')::numeric as km
from plan_meta
where key like 'km:%'
  and replace(value, ',', '.') ~ '^[0-9]+(\.[0-9]+)?$'
on conflict (plan_id, day) do update set km = excluded.km;

-- Až bude aplikace přepnutá na sloupec km a ověříš, že čísla sedí, smaž staré záznamy:
-- delete from plan_meta where key like 'km:%';
