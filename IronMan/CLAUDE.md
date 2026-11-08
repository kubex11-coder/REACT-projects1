# IronMan (KUBEX)

Osobní tréninkový plán: React (Create React App) + Supabase. Sekce RUN (`/run`) je hotová, SWIM a FITKO jsou zatím prázdné `SectionPage`. Komunikace s uživatelem česky.

## Příkazy

- `npm start` – dev server
- `CI=true npm run build` – ověření sestavení (v CI režimu jsou warningy chyby)

## Struktura

- `src/pages/` – stránky (`home`, `login`, `run`, `section`); `run/runPlan.js` je jen výchozí seed plánu
- `src/components/TrainingPlan.jsx` – sdílený kalendář (měsíce → týdny → bloky), drag and drop, editace
- `src/plans/PlansContext.jsx` – načítání a ukládání do Supabase (`plan_entries`, `plan_meta`)
- `src/plans/planLayout.js` – čisté funkce pro layout (přidání, přesun, smazání bloků a týdnů)
- `src/auth/` – přihlášení a `ProtectedRoute`
- `supabase-*.sql` – jen záznam již provedených migrací

## Pravidla a pasti

- Backend je Supabase, klíče v `.env` (v `.gitignore`, nikdy necommitovat). Jeden majitelský účet, RLS „owner only“ podle e-mailu.
- Dotazy supabase-js se odešlou až při `await`; zápisy musí jít přes `save()` v `PlansContext`, jinak se tiše neprovedou.
- Layout plánu se po první změně ukládá celý do `plan_meta` (klíč `layout`). Další úpravy bloků jsou v `plan_meta` pod klíči `date:<id>`, `week:<id>:...`, `month:<id>:...`.
- Drag and drop je nativní HTML5 (na dotyku nefunguje).
- Kilometry (`trackKm` na `TrainingPlan`) jsou jen u RUN; kilometry jsou ve sloupci `km` tabulky `plan_entries` (migrace 4), součty za týden a měsíc se počítají za běhu.
- Texty v UI a komentáře v kódu jsou česky; styl komentářů držet stejný jako okolí.
