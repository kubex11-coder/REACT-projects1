import SectionPage from "../section/SectionPage";
import { SAVE_ABOVE, useQuotes } from "../../quotes/QuotesContext";
import "./quotespage.css";

// Hodnocení, která nabízí změna u uloženého citátu (od 6 výš; nižší se neukládá, citát se místo toho odebere).
const RATINGS = Array.from({ length: 10 - SAVE_ABOVE }, (_, i) => SAVE_ABOVE + 1 + i);

function QuotesPage() {
  const { quotes, loaded, error, rate, remove } = useQuotes();

  return (
    <SectionPage title="CITÁTY">
      {error && <p className="quotes__error">{error}</p>}
      {loaded && quotes.length === 0 && (
        <p className="quotes__empty">
          Zatím tu nic není. Citáty s hodnocením nad {SAVE_ABOVE} z denního okna se ukládají sem.
        </p>
      )}
      <ul className="quotes">
        {quotes.map((quote) => (
          <li key={quote.text} className="quote">
            <blockquote className="quote__text">„{quote.text}“</blockquote>
            {quote.author && <p className="quote__author">— {quote.author}</p>}
            <div className="quote__actions">
              <label className="quote__rating">
                Moje hodnocení
                <select
                  value={quote.rating}
                  onChange={(e) => rate(quote, Number(e.target.value))}
                >
                  {RATINGS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="quote__remove" onClick={() => remove(quote.text)}>
                Odebrat
              </button>
            </div>
          </li>
        ))}
      </ul>
    </SectionPage>
  );
}

export default QuotesPage;
