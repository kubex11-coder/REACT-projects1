// Rozložení plánu: měsíce -> týdny -> bloky (dny). Výchozí rozložení se sestaví
// z plánu v kódu; jakmile ho uživatel na stránce změní (přidá, přesune, smaže),
// uloží se celé do databáze a od té chvíle platí ono.
//
// { months: [{ id, name, weeks: [{ id, title, volume, blocks: [{ id, date, text }] }] }] }
//
// id výchozích bloků a týdnů je jejich původní datum (RRRR-MM-DD), takže dřívější
// záznamy (poznámky, Ano/Ne, úpravy) zůstávají navázané.

// Posun od pondělí týdne: Út, St, Čt, Pá, Ne (pondělky a soboty se nezobrazují).
const BLOCK_OFFSETS = [1, 2, 3, 4, 6];

const MONTH_NAMES = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

export function toKey(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

// Převede uložené datum RRRR-MM-DD na Date; prázdnou či neplatnou hodnotu vrátí jako null.
export function parseIso(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function newId() {
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function seedLayout(startDate, weeks) {
  const start = parseIso(startDate);
  const months = [];

  weeks.forEach((week, w) => {
    const monday = addDays(start, w * 7);
    const monthId = toKey(monday).slice(0, 7);
    let month = months[months.length - 1];
    if (!month || month.id !== monthId) {
      month = {
        id: monthId,
        name: `${MONTH_NAMES[monday.getMonth()]} ${monday.getFullYear()}`,
        weeks: [],
      };
      months.push(month);
    }
    month.weeks.push({
      id: toKey(monday),
      title: week.title,
      volume: week.volume,
      blocks: BLOCK_OFFSETS.map((offset) => {
        const key = toKey(addDays(monday, offset));
        return { id: key, date: key, text: week.days[offset] };
      }),
    });
  });

  return { months };
}

// Uložené rozložení (JSON) má přednost; jinak se použije výchozí z kódu.
export function resolveLayout(def, layoutJson) {
  try {
    const parsed = JSON.parse(layoutJson);
    if (Array.isArray(parsed?.months)) return parsed;
  } catch {
    // chybějící nebo poškozená hodnota -> výchozí rozložení
  }
  return def ? seedLayout(def.startDate, def.weeks) : { months: [] };
}

export function blockIds(layout) {
  const ids = new Set();
  layout.months.forEach((m) =>
    m.weeks.forEach((w) => w.blocks.forEach((b) => ids.add(b.id)))
  );
  return ids;
}

export function createBlock(date) {
  return { id: newId(), date: date ? toKey(date) : "", text: "Nový trénink" };
}

// Nový týden o 5 blocích (Út, St, Čt, Pá, Ne) v týdnu po lastDate (je-li známé).
export function createWeek(lastDate) {
  const monday = lastDate
    ? addDays(lastDate, (8 - lastDate.getDay()) % 7 || 7)
    : null;
  return {
    id: newId(),
    title: "Nový týden",
    volume: "0 km",
    blocks: BLOCK_OFFSETS.map((offset) =>
      createBlock(monday && addDays(monday, offset))
    ),
  };
}

const mapWeeks = (layout, fn) => ({
  ...layout,
  months: layout.months.map((m) => ({ ...m, weeks: m.weeks.map(fn) })),
});

export function addBlockToWeek(layout, weekId, block) {
  return mapWeeks(layout, (w) =>
    w.id === weekId ? { ...w, blocks: [...w.blocks, block] } : w
  );
}

export function removeBlock(layout, blockId) {
  return mapWeeks(layout, (w) => ({
    ...w,
    blocks: w.blocks.filter((b) => b.id !== blockId),
  }));
}

// target: { weekId } (na konec týdne) nebo { relativeToId, after } (vedle jiného bloku).
export function moveBlock(layout, blockId, target) {
  if (target.relativeToId === blockId) return layout;
  let moving = null;
  layout.months.forEach((m) =>
    m.weeks.forEach((w) =>
      w.blocks.forEach((b) => {
        if (b.id === blockId) moving = b;
      })
    )
  );
  if (!moving) return layout;

  return mapWeeks(removeBlock(layout, blockId), (w) => {
    if (target.weekId === w.id) return { ...w, blocks: [...w.blocks, moving] };
    const i = w.blocks.findIndex((b) => b.id === target.relativeToId);
    if (i === -1) return w;
    const at = target.after ? i + 1 : i;
    return {
      ...w,
      blocks: [...w.blocks.slice(0, at), moving, ...w.blocks.slice(at)],
    };
  });
}

export function addWeekAfter(layout, afterWeekId, week) {
  return {
    ...layout,
    months: layout.months.map((m) => {
      const i = m.weeks.findIndex((w) => w.id === afterWeekId);
      if (i === -1) return m;
      return {
        ...m,
        weeks: [...m.weeks.slice(0, i + 1), week, ...m.weeks.slice(i + 1)],
      };
    }),
  };
}

export function addWeekToMonth(layout, monthId, week) {
  return {
    ...layout,
    months: layout.months.map((m) =>
      m.id === monthId ? { ...m, weeks: [...m.weeks, week] } : m
    ),
  };
}

export function removeWeek(layout, weekId) {
  return {
    ...layout,
    months: layout.months.map((m) => ({
      ...m,
      weeks: m.weeks.filter((w) => w.id !== weekId),
    })),
  };
}

// target: { monthId } (na konec měsíce) nebo { relativeToId, after } (vedle jiného týdne).
export function moveWeek(layout, weekId, target) {
  if (target.relativeToId === weekId) return layout;
  let moving = null;
  layout.months.forEach((m) =>
    m.weeks.forEach((w) => {
      if (w.id === weekId) moving = w;
    })
  );
  if (!moving) return layout;

  const without = removeWeek(layout, weekId);
  return {
    ...without,
    months: without.months.map((m) => {
      if (target.monthId === m.id) return { ...m, weeks: [...m.weeks, moving] };
      const i = m.weeks.findIndex((w) => w.id === target.relativeToId);
      if (i === -1) return m;
      const at = target.after ? i + 1 : i;
      return {
        ...m,
        weeks: [...m.weeks.slice(0, at), moving, ...m.weeks.slice(at)],
      };
    }),
  };
}
