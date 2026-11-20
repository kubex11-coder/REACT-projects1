import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { fetchRandomQuote } from "./quoteApi";
import { SAVE_ABOVE, useQuotes } from "./QuotesContext";
import "./dailyquote.css";

const SEEN_KEY = "ironman-quote-day";
// 0 je koš (citát se neuloží); uložit se dá od hodnocení 6.
const RATINGS = [0, 6, 7, 8, 9, 10];

// Dnešní datum v místním čase (YYYY-MM-DD).
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function getSeen() {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

// Při první návštěvě v daný den (po přihlášení) vyskočí okno s citátem a hodnocením 0–10.
function DailyQuote() {
  const { user } = useAuth();
  const userId = user?.id;
  const { rate } = useQuotes();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // Adresa s ?quote (např. localhost:3000/?quote) okno vynutí i když už dnes bylo.
    const forced = new URLSearchParams(window.location.search).has("quote");
    if (!userId || (!forced && getSeen() === today())) return undefined;
    let cancelled = false;
    fetchRandomQuote().then((fetched) => {
      if (cancelled || !fetched) return; // při selhání API se zkusí příště
      try {
        localStorage.setItem(SEEN_KEY, today());
      } catch {
        // bez localStorage se okno ukáže znovu
      }
      setQuote(fetched);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!quote) return undefined;
    const onKey = (e) => e.key === "Escape" && setQuote(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quote]);

  if (!quote) return null;

  const close = () => setQuote(null);
  // Ohodnocení okno rovnou zavře; uložení do databáze doběhne na pozadí.
  const choose = (value) => {
    rate(quote, value);
    close();
  };

  return createPortal(
    <div className="quote-modal" onClick={close}>
      <div
        className="quote-modal__card"
        role="dialog"
        aria-label="Citát dne"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="quote-modal__close" aria-label="Zavřít" onClick={close}>
          ×
        </button>
        <p className="quote-modal__label">Citát dne</p>
        <blockquote className="quote-modal__text">„{quote.text}“</blockquote>
        {quote.author && <p className="quote-modal__author">— {quote.author}</p>}
        <p className="quote-modal__ask">Jak se ti líbí?</p>
        <div className="quote-modal__ratings">
          {RATINGS.map((n) => (
            <button
              key={n}
              type="button"
              className="quote-modal__rating"
              aria-label={n === 0 ? "Zahodit" : undefined}
              onClick={() => choose(n)}
            >
              {n === 0 ? <FaTrash aria-hidden="true" /> : n}
            </button>
          ))}
        </div>
        <p className="quote-modal__hint">
          Citáty s hodnocením nad {SAVE_ABOVE} se uloží do sekce Citáty, koš citát zahodí.
        </p>
      </div>
    </div>,
    document.body
  );
}

export default DailyQuote;
