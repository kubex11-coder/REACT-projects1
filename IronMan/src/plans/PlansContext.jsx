import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../supabase";
import { useAuth } from "../auth/AuthContext";
import { PLAN_DEFS } from "./planDefs";
import { blockIds, resolveLayout } from "./planLayout";

const FIELDS = ["text", "note", "status"];
// Plány, které mohly mít dřívější data v localStorage (před Supabase).
const LEGACY_PLANS = ["run"];
const EMPTY = {};

const PlansContext = createContext(null);

// Všechny záznamy plánů se načtou jednou a sdílí je stránky i navigace (skóre).
// V paměti: { planId: { "2026-11-09": { text, note, status } } }; null pole vynecháváme.
export function PlansProvider({ children }) {
  const { user } = useAuth();
  // Obnovení tokenu vytvoří nový objekt uživatele; data se mají načítat jen při změně účtu.
  const userId = user?.id;
  const [plans, setPlans] = useState({});
  // Upravené popisy týdnů, objemy a měsíce: { planId: { "week:2026-11-09:title": "..." } }
  const [meta, setMeta] = useState({});
  // Až po prvním načtení dat z databáze (úspěšném i neúspěšném) je co zobrazit.
  const [loaded, setLoaded] = useState(false);
  // Poslední chyba při práci s databází (zobrazí se v liště dole).
  const [dbError, setDbError] = useState(null);

  // Dotazy Supabase se odešlou až při await; bez něj by se zápis nikdy neprovedl.
  const save = useCallback(async (request) => {
    const { error } = await request;
    setDbError(error ? `Uložení se nezdařilo: ${error.message}` : null);
  }, []);

  useEffect(() => {
    setLoaded(false);
    if (!userId) {
      setPlans({});
      setMeta({});
      return;
    }
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("plan_entries")
        .select("plan_id, day, text, note, status");
      if (cancelled) return;
      if (error) {
        setDbError(`Načtení dat se nezdařilo: ${error.message}`);
        setLoaded(true);
        return;
      }

      // Chyba (např. tabulka ještě není vytvořená) nesmí shodit zbytek plánu.
      const { data: metaRows, error: metaError } = await supabase
        .from("plan_meta")
        .select("plan_id, key, value");
      if (cancelled) return;
      if (!metaError) {
        const loadedMeta = {};
        metaRows.forEach(({ plan_id, key, value }) => {
          if (!loadedMeta[plan_id]) loadedMeta[plan_id] = {};
          loadedMeta[plan_id][key] = value;
        });
        setMeta(loadedMeta);
      }

      const loaded = {};
      data.forEach((row) => {
        if (!loaded[row.plan_id]) loaded[row.plan_id] = {};
        const entry = {};
        FIELDS.forEach((field) => {
          if (row[field] !== null) entry[field] = row[field];
        });
        loaded[row.plan_id][row.day] = entry;
      });

      for (const planId of LEGACY_PLANS) {
        if (loaded[planId]) continue;
        const legacyKey = `ironman-plan-${planId}`;
        try {
          const legacy = JSON.parse(localStorage.getItem(legacyKey));
          if (!legacy || Object.keys(legacy).length === 0) continue;
          const rows = Object.entries(legacy).map(([day, entry]) => ({
            plan_id: planId,
            day,
            text: entry.text ?? null,
            note: null,
            status: entry.done ? "yes" : null,
          }));
          const { error: uploadError } = await supabase
            .from("plan_entries")
            .upsert(rows);
          if (uploadError) continue;
          loaded[planId] = {};
          rows.forEach(({ day, text, status }) => {
            loaded[planId][day] = {};
            if (text !== null) loaded[planId][day].text = text;
            if (status !== null) loaded[planId][day].status = status;
          });
          localStorage.removeItem(legacyKey);
        } catch {
          // poškozená lokální data ignorujeme
        }
      }

      if (!cancelled) {
        setPlans(loaded);
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // patch: { text, note, status }. Hodnota null pole vyprázdní
  // (u textu to znamená návrat k původnímu popisu z plánu).
  const updateEntry = useCallback((planId, day, patch) => {
    setPlans((prev) => {
      const next = { ...prev[planId]?.[day], ...patch };
      FIELDS.forEach((field) => {
        if (next[field] === null) delete next[field];
      });
      return { ...prev, [planId]: { ...prev[planId], [day]: next } };
    });
    return save(
      supabase
        .from("plan_entries")
        .upsert({ plan_id: planId, day, ...patch }, { onConflict: "plan_id,day" })
    );
  }, [save]);

  // value null smaže úpravu a vrátí se výchozí hodnota z plánu.
  const updateMeta = useCallback((planId, key, value) => {
    setMeta((prev) => {
      const plan = { ...prev[planId] };
      if (value === null) delete plan[key];
      else plan[key] = value;
      return { ...prev, [planId]: plan };
    });
    const table = supabase.from("plan_meta");
    return save(
      value === null
        ? table.delete().eq("plan_id", planId).eq("key", key)
        : table.upsert({ plan_id: planId, key, value }, { onConflict: "plan_id,key" })
    );
  }, [save]);

  const value = useMemo(
    () => ({ plans, updateEntry, meta, updateMeta, loaded, dbError, setDbError }),
    [plans, updateEntry, meta, updateMeta, loaded, dbError]
  );

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>;
}

export function usePlan(planId) {
  const { plans, updateEntry } = useContext(PlansContext);
  const update = useCallback(
    (day, patch) => updateEntry(planId, day, patch),
    [planId, updateEntry]
  );
  return [plans[planId] || EMPTY, update];
}

export function useDbError() {
  const { dbError, setDbError } = useContext(PlansContext);
  return [dbError, () => setDbError(null)];
}

export function usePlansLoaded() {
  return useContext(PlansContext).loaded;
}

export function usePlanMeta(planId) {
  const { meta, updateMeta } = useContext(PlansContext);
  const update = useCallback(
    (key, value) => updateMeta(planId, key, value),
    [planId, updateMeta]
  );
  return [meta[planId] || EMPTY, update];
}

// Skóre plnění: podíl dnů označených Ano ze všech dnů označených Ano nebo Ne (0–100 %).
// Počítají se jen bloky, které v plánu ještě jsou (smazané či odebrané se ignorují).
export function useScore() {
  const { plans, meta } = useContext(PlansContext);
  return useMemo(() => {
    let yes = 0;
    let no = 0;
    Object.entries(plans).forEach(([planId, plan]) => {
      const def = PLAN_DEFS[planId];
      const valid = def
        ? blockIds(resolveLayout(def, meta[planId]?.layout))
        : null;
      Object.entries(plan).forEach(([blockId, { status }]) => {
        if (valid && !valid.has(blockId)) return;
        if (status === "yes") yes += 1;
        if (status === "no") no += 1;
      });
    });
    const answered = yes + no;
    return { yes, no, percent: answered ? Math.round((yes / answered) * 100) : 0 };
  }, [plans, meta]);
}
