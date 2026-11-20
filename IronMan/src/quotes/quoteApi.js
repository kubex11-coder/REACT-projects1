// Zdroje citátů; oba povolují volání z prohlížeče (CORS) a nepotřebují klíč.
const SOURCES = [
  {
    // Motivační a obecné citáty, cca 1400 kusů.
    url: "https://dummyjson.com/quotes/random",
    parse: (d) => ({ text: d.quote, author: d.author }),
  },
  {
    // Stoické citáty (Marcus Aurelius, Seneca, Epiktétos...).
    url: "https://www.stoic-quotes.com/api/quote",
    parse: (d) => ({ text: d.text, author: d.author }),
  },
];

async function fetchFrom({ url, parse }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const quote = parse(await res.json());
    if (!quote.text) throw new Error("Prázdný citát");
    return { text: quote.text.trim(), author: quote.author?.trim() || null };
  } finally {
    clearTimeout(timer);
  }
}

// Zdroje jsou anglicky; překlad do češtiny zajišťuje MyMemory (zdarma, bez klíče, s denním limitem).
async function translateToCzech(text) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const url = `https://api.mymemory.translated.net/get?langpair=en|cs&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const translated = data.responseData?.translatedText;
    // Po vyčerpání limitu vrací služba místo překladu varování.
    if (data.responseStatus !== 200 || !translated || /MYMEMORY/i.test(translated)) {
      throw new Error("Překlad se nezdařil");
    }
    return translated.replace(/ /g, " ").trim();
  } finally {
    clearTimeout(timer);
  }
}

// Náhodný citát z náhodně zvoleného zdroje; když ten selže, zkusí se druhý. Při selhání obou vrátí null.
// Citát se přeloží do češtiny; když překlad selže, zůstane původní anglický text.
export async function fetchRandomQuote() {
  const order = Math.random() < 0.5 ? SOURCES : [...SOURCES].reverse();
  for (const source of order) {
    try {
      const quote = await fetchFrom(source);
      try {
        return { ...quote, text: await translateToCzech(quote.text) };
      } catch {
        return quote;
      }
    } catch {
      // zkusíme další zdroj
    }
  }
  return null;
}
