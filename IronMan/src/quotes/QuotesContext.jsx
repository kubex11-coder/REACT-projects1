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

// Citát se uloží, jen když je hodnocení vyšší než tato hodnota.
export const SAVE_ABOVE = 5;

const QuotesContext = createContext(null);

// Uložené citáty: [{ text, author, rating, created_at }] seřazené od nejvyššího hodnocení.
export function QuotesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [quotes, setQuotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoaded(false);
    if (!userId) {
      setQuotes([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      const { data, error: loadError } = await supabase
        .from("quotes")
        .select("text, author, rating, created_at");
      if (cancelled) return;
      if (loadError) setError(`Načtení citátů se nezdařilo: ${loadError.message}`);
      else setQuotes(data);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Dotazy Supabase se odešlou až při await.
  const rate = useCallback(async ({ text, author }, rating) => {
    if (rating > SAVE_ABOVE) {
      const row = { text, author: author ?? null, rating };
      setQuotes((prev) =>
        prev.some((q) => q.text === text)
          ? prev.map((q) => (q.text === text ? { ...q, rating } : q))
          : [...prev, { ...row, created_at: new Date().toISOString() }]
      );
      const { error: saveError } = await supabase
        .from("quotes")
        .upsert(row, { onConflict: "text" });
      setError(saveError ? `Uložení citátu se nezdařilo: ${saveError.message}` : null);
    } else {
      // Hodnocení do 5 se neukládá; už uložený citát se odebere.
      setQuotes((prev) => prev.filter((q) => q.text !== text));
      const { error: delError } = await supabase.from("quotes").delete().eq("text", text);
      setError(delError ? `Odebrání citátu se nezdařilo: ${delError.message}` : null);
    }
  }, []);

  const remove = useCallback((text) => rate({ text }, 0), [rate]);

  const sorted = useMemo(
    () =>
      [...quotes].sort(
        (a, b) =>
          b.rating - a.rating ||
          String(b.created_at).localeCompare(String(a.created_at))
      ),
    [quotes]
  );

  const value = useMemo(
    () => ({ quotes: sorted, loaded, error, rate, remove }),
    [sorted, loaded, error, rate, remove]
  );

  return <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>;
}

export function useQuotes() {
  return useContext(QuotesContext);
}
