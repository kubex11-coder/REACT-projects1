import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaCheck,
  FaGripVertical,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUndo,
} from "react-icons/fa";
import { usePlan, usePlanMeta, usePlansLoaded } from "../plans/PlansContext";
import {
  addBlockToWeek,
  addDays,
  addWeekAfter,
  addWeekToMonth,
  createBlock,
  createWeek,
  getCheatResults,
  moveBlock,
  moveWeek,
  parseIso,
  removeBlock,
  removeWeek,
  resolveLayout,
  toKey,
} from "../plans/planLayout";
import EditableText from "./EditableText";
import "./trainingplan.css";

const NO_METRICS = [];

// Indexováno podle Date.getDay() (0 = neděle).
const DAY_NAMES = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

function formatDate(date) {
  return `${date.getDate()}. ${date.getMonth() + 1}.`;
}

function formatKm(total) {
  return `${Math.round(total * 100) / 100} km`.replace(".", ",");
}

// Čas se ukládá v minutách; od hodiny se zobrazuje jako "1 h 30 min".
function formatMinutes(total) {
  const min = Math.round(total);
  return min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`;
}

const formatTotal = (total, unit) =>
  unit === "min" ? formatMinutes(total) : formatKm(total);

// Kilometry jsou v databázi číslo; v poli se zobrazují s čárkou a zadat jde čárka i tečka.
function KmInput({ value, onSave, label, unit }) {
  const shown = value == null ? "" : String(value).replace(".", ",");
  const [draft, setDraft] = useState(shown);
  useEffect(() => setDraft(shown), [shown]);

  const commit = () => {
    const clean = draft.trim();
    if (!clean) {
      if (value != null) onSave(null);
      return;
    }
    const n = parseFloat(clean.replace(",", "."));
    // Neplatná hodnota se vrátí na uloženou.
    if (!Number.isFinite(n) || n < 0) setDraft(shown);
    else if (n !== value) onSave(n);
  };

  return (
    <div className="day__section day__section--km">
      <span className="day__label">{label}</span>
      <label className="day__km">
        <input
          type="text"
          inputMode="decimal"
          className="day__km-input"
          placeholder="0"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
        {unit}
      </label>
    </div>
  );
}

// Rozdíl přijatých a spálených kcal; deficit (záporný) je zelený, přebytek (kladný) červený.
function KcalDiff({ entry }) {
  const { kcal_in: eaten, kcal_out: burned } = entry;
  const diff =
    eaten == null || burned == null ? null : Math.round((eaten - burned) * 100) / 100;
  const tone = diff == null || diff === 0 ? "" : diff < 0 ? " day__diff--good" : " day__diff--bad";

  return (
    <div className="day__section day__section--row">
      <span className="day__label">Rozdíl</span>
      <span className={`day__diff${tone}`}>
        {diff == null
          ? "—"
          : `${diff > 0 ? "+" : ""}${String(diff).replace(".", ",")} kcal`}
      </span>
    </div>
  );
}

function Day({
  block,
  date,
  entry,
  km,
  kmLabel,
  trackUnit,
  smallText,
  showText,
  metrics,
  showDiff,
  statusLabel,
  cheatday,
  cheatResult,
  compact,
  onKmChange,
  isToday,
  onChange,
  onDateChange,
  onDelete,
  dnd,
  scrollRef,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ text: "", note: "", date: "" });

  const text = entry.text ?? block.text;
  const note = entry.note ?? "";
  const isEdited = entry.text !== undefined && entry.text !== block.text;

  const startEdit = () => {
    setDraft({ text, note, date: date ? toKey(date) : "" });
    setEditing(true);
  };

  const save = () => {
    onChange({
      ...(showText && { text: draft.text.trim() }),
      note: draft.note.trim() || null,
    });
    // Prázdné nebo výchozí datum smaže úpravu a vrátí výchozí hodnotu.
    onDateChange(draft.date && draft.date !== block.date ? draft.date : null);
    setEditing(false);
  };

  // Zaškrtnutí aktivní volby ji zruší; Ano a Ne se vzájemně vylučují.
  const toggleStatus = (value) =>
    onChange({ status: entry.status === value ? null : value });

  return (
    <div
      className={`day${
        cheatResult
          ? ` day--${cheatResult === "ok" ? "yes" : "no"}`
          : entry.status
          ? ` day--${entry.status}`
          : ""
      }${compact ? " day--compact" : ""}${
        isToday ? " day--today" : ""
      }${dnd.dragging ? " is-dragging" : ""}${
        dnd.dropSide ? ` day--drop-${dnd.dropSide}` : ""
      }`}
      ref={scrollRef}
      draggable={!editing}
      onDragStart={dnd.onDragStart}
      onDragOver={dnd.onDragOver}
      onDrop={dnd.onDrop}
      onDragEnd={dnd.onDragEnd}
    >
      <div className="day__head">
        <FaGripVertical className="day__grip" />
        <span className="day__name">{date ? DAY_NAMES[date.getDay()] : ""}</span>
        {editing ? (
          <input
            type="date"
            className="day__date-input"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          />
        ) : (
          <span className="day__date">{date ? formatDate(date) : "Bez data"}</span>
        )}
        {!editing && (
          <span className="day__tools">
            {isEdited && (
              <button
                type="button"
                className="day__icon"
                title="Vrátit původní popis"
                onClick={() => onChange({ text: null })}
              >
                <FaUndo />
              </button>
            )}
            <button
              type="button"
              className="day__icon"
              title="Upravit"
              onClick={startEdit}
            >
              <FaPen />
            </button>
            <button
              type="button"
              className="day__icon day__icon--danger"
              title="Smazat blok"
              onClick={onDelete}
            >
              <FaTrash />
            </button>
          </span>
        )}
      </div>

      {showText && (
        <div className="day__section">
          <span className="day__label">Popis tréninku</span>
          {editing ? (
            <textarea
              className="day__input"
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              rows={3}
              autoFocus
            />
          ) : (
            <p className={`day__text${smallText ? " day__text--small" : ""}`}>
              {text || "—"}
            </p>
          )}
        </div>
      )}

      <div className="day__section">
        <span className="day__label">Poznámka</span>
        {editing ? (
          <textarea
            className="day__input"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            rows={3}
          />
        ) : (
          <p className="day__text day__text--note">{note || "—"}</p>
        )}
      </div>

      {!editing && onKmChange && (
        <KmInput value={km} onSave={onKmChange} label={kmLabel} unit={trackUnit} />
      )}

      {!editing &&
        metrics.map(({ field, label, unit }) => (
          <KmInput
            key={field}
            value={entry[field]}
            onSave={(v) => onChange({ [field]: v })}
            label={label}
            unit={unit}
          />
        ))}

      {!editing && showDiff && <KcalDiff entry={entry} />}

      {editing ? (
        <div className="day__actions">
          <button type="button" className="day__btn day__btn--primary" onClick={save}>
            Uložit
          </button>
          <button type="button" className="day__btn" onClick={() => setEditing(false)}>
            Zrušit
          </button>
        </div>
      ) : (
        <div className="day__section day__section--status">
          <span className="day__label">{statusLabel}</span>
          <div className="day__choices">
            <label className="day__choice day__choice--yes">
              <input
                type="checkbox"
                className="day__choice-input"
                checked={entry.status === "yes"}
                onChange={() => toggleStatus("yes")}
              />
              <span className="day__choice-box">
                <FaCheck /> Ano
              </span>
            </label>
            <label className="day__choice day__choice--no">
              <input
                type="checkbox"
                className="day__choice-input"
                checked={entry.status === "no"}
                onChange={() => toggleStatus("no")}
              />
              <span className="day__choice-box">
                <FaTimes /> Ne
              </span>
            </label>
          </div>
        </div>
      )}

      {!editing && cheatday && (
        <button
          type="button"
          className={`day__cheat${entry.cheat ? " day__cheat--on" : ""}`}
          aria-pressed={!!entry.cheat}
          onClick={() => onChange({ cheat: entry.cheat ? null : true })}
        >
          Cheatday
        </button>
      )}
    </div>
  );
}

function TrainingPlan({
  planId,
  startDate,
  weeks,
  blockOffsets,
  newWeekVolume,
  newWeekTemplate,
  trackKm = false,
  kmLabel = "Naběhnuto",
  // Jednotka sledované hodnoty: "km" nebo "min"; ukládá se do sloupce km tabulky plan_entries.
  trackUnit = "km",
  showVolume = true,
  // Popis tréninku v bloku; u FOOD se nepoužívá.
  showText = true,
  // Další číselná pole bloku: [{ field, label, unit }]; field je sloupec v plan_entries.
  metrics = NO_METRICS,
  // Pod poli zobrazí rozdíl kcal_in - kcal_out.
  showKcalDiff = false,
  // Nadpis u zaškrtávátek Ano/Ne.
  statusLabel = "Splněno",
  // Tlačítko Cheatday: první v týdnu = 100 %, každé další 0 % (viz cheatResults).
  cheatday = false,
  // Nižší karty bloků: popisky a hodnoty vedle sebe, menší mezery.
  compact = false,
  smallText = false,
}) {
  const [stored, updateDay] = usePlan(planId);
  const [meta, updateMeta] = usePlanMeta(planId);
  const loaded = usePlansLoaded();
  const nextBlockRef = useRef(null);
  const scrolledRef = useRef(false);
  const [drag, setDrag] = useState(null); // { kind: "block" | "week", id }
  const [over, setOver] = useState(null); // aktuální cíl přetahování
  const todayKey = toKey(new Date());

  const layout = useMemo(
    () => resolveLayout({ startDate, weeks, blockOffsets }, meta.layout),
    [startDate, weeks, blockOffsets, meta.layout]
  );
  const cheatResults = useMemo(
    () => (cheatday ? getCheatResults(layout, stored) : {}),
    [cheatday, layout, stored]
  );
  const saveLayout = (next) => updateMeta("layout", JSON.stringify(next));

  // Pomocník pro upravitelnou hodnotu uloženou v meta pod klíčem.
  const metaField = (key, original) => ({
    value: meta[key] ?? original,
    original,
    onSave: (v) => updateMeta(key, v === original ? null : v),
    onReset: () => updateMeta(key, null),
  });

  const blockDate = (block) =>
    parseIso(meta[`date:${block.id}`]) || parseIso(block.date);

  const sumKm = (blocks) =>
    blocks.reduce((sum, block) => sum + (stored[block.id]?.km ?? 0), 0);

  const endDrag = () => {
    setDrag(null);
    setOver(null);
  };

  // Stav přetahování se nastavuje až po dragstartu, aby prohlížeč stihl vytvořit náhled.
  const startDrag = (kind, id) => setTimeout(() => setDrag({ kind, id }), 0);

  const isAfter = (e, axis) => {
    const r = e.currentTarget.getBoundingClientRect();
    return axis === "x"
      ? e.clientX > r.left + r.width / 2
      : e.clientY > r.top + r.height / 2;
  };

  const blockDnd = (block) => ({
    dragging: drag?.kind === "block" && drag.id === block.id,
    dropSide:
      over?.kind === "block" && over.id === block.id
        ? over.after
          ? "after"
          : "before"
        : null,
    onDragStart: (e) => {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", block.id);
      startDrag("block", block.id);
    },
    onDragOver: (e) => {
      if (drag?.kind !== "block" || drag.id === block.id) return;
      e.preventDefault();
      e.stopPropagation();
      const after = isAfter(e, "x");
      setOver((p) =>
        p?.kind === "block" && p.id === block.id && p.after === after
          ? p
          : { kind: "block", id: block.id, after }
      );
    },
    onDrop: (e) => {
      if (drag?.kind !== "block" || drag.id === block.id) return;
      e.preventDefault();
      e.stopPropagation();
      saveLayout(
        moveBlock(layout, drag.id, {
          relativeToId: block.id,
          after: isAfter(e, "x"),
        })
      );
      endDrag();
    },
    onDragEnd: endDrag,
  });

  // Týden je cílem pro přetažení týdne (před/za) i bloku (na konec týdne).
  const weekDrop = (week) => ({
    onDragOver: (e) => {
      if (!drag) return;
      e.preventDefault();
      e.stopPropagation();
      if (drag.kind === "week") {
        if (drag.id === week.id) return;
        const after = isAfter(e, "y");
        setOver((p) =>
          p?.kind === "week" && p.id === week.id && p.after === after
            ? p
            : { kind: "week", id: week.id, after }
        );
      } else {
        setOver((p) =>
          p?.kind === "weekEnd" && p.id === week.id
            ? p
            : { kind: "weekEnd", id: week.id }
        );
      }
    },
    onDrop: (e) => {
      if (!drag) return;
      e.preventDefault();
      e.stopPropagation();
      if (drag.kind === "week") {
        if (drag.id !== week.id) {
          saveLayout(
            moveWeek(layout, drag.id, {
              relativeToId: week.id,
              after: isAfter(e, "y"),
            })
          );
        }
      } else {
        saveLayout(moveBlock(layout, drag.id, { weekId: week.id }));
      }
      endDrag();
    },
  });

  // Prázdný měsíc přijme přetažený týden.
  const monthDrop = (month) => ({
    onDragOver: (e) => {
      if (drag?.kind !== "week" || month.weeks.length > 0) return;
      e.preventDefault();
      setOver((p) =>
        p?.kind === "month" && p.id === month.id ? p : { kind: "month", id: month.id }
      );
    },
    onDrop: (e) => {
      if (drag?.kind !== "week" || month.weeks.length > 0) return;
      e.preventDefault();
      saveLayout(moveWeek(layout, drag.id, { monthId: month.id }));
      endDrag();
    },
  });

  const confirmDelete = (message, action) => {
    if (window.confirm(message)) action();
  };

  // Následující trénink = první blok bez zaškrtnutého Ano/Ne nebo Cheatday (jsou-li všechny
  // vyplněné, tak poslední). Při načtení stránky se vycentruje; při práci s
  // plánem se už nescrolluje.
  const allBlocks = layout.months.flatMap((m) => m.weeks.flatMap((w) => w.blocks));
  const nextBlock =
    allBlocks.find((b) => !stored[b.id]?.status && !(cheatday && stored[b.id]?.cheat)) ||
    allBlocks[allBlocks.length - 1];
  const nextBlockId = nextBlock?.id;

  useEffect(() => {
    if (!loaded || scrolledRef.current) return;
    scrolledRef.current = true;
    const el = nextBlockRef.current;
    if (!el) return;
    // Vycentruje blok v části obrazovky pod navigací a přilepenou hlavičkou týdne
    // (na mobilu); na mobilu ho ještě posune o 55 px výš.
    const shift = window.matchMedia("(max-width: 700px)").matches ? 55 : 0;
    const nav = document.querySelector(".navbar");
    const head = el.closest(".week")?.querySelector(".week__head");
    let top = nav ? nav.getBoundingClientRect().bottom : 0;
    if (head && getComputedStyle(head).position === "sticky") {
      top += head.getBoundingClientRect().height;
    }
    const rect = el.getBoundingClientRect();
    const visibleCenter = top + (window.innerHeight - top) / 2;
    window.scrollBy(0, rect.top + rect.height / 2 - visibleCenter + shift);
  }, [loaded]);

  return (
    <div className="plan">
      {layout.months.map((month) => (
        <section
          key={month.id}
          className={`month${
            over?.kind === "month" && over.id === month.id ? " month--drop" : ""
          }`}
          {...monthDrop(month)}
        >
          <header className="month__head">
            <h2 className="month__title">
              <EditableText {...metaField(`month:${month.id}:title`, month.name)} />
            </h2>
            <EditableText
              className="month__desc"
              placeholder="Přidat popis měsíce"
              {...metaField(`month:${month.id}:desc`, "")}
            />
            {trackKm && (
              <span className="month__km">
                Měsíc:{" "}
                {formatTotal(sumKm(month.weeks.flatMap((w) => w.blocks)), trackUnit)}
              </span>
            )}
          </header>

          {month.weeks.map((week) => {
            const blocks = week.blocks.map((block) => ({
              block,
              date: blockDate(block),
            }));
            const dated = blocks.filter(({ date }) => date);
            const lastDate = dated.length ? dated[dated.length - 1].date : null;
            // Výchozí rozmezí týdne vychází z (případně upravených) dat bloků.
            const defaultRange = dated.length
              ? `${formatDate(dated[0].date)}–${formatDate(lastDate)}`
              : "";
            const dropSide =
              over?.kind === "week" && over.id === week.id
                ? over.after
                  ? "after"
                  : "before"
                : null;

            return (
              <div key={week.id} className="week-wrap">
                <div
                  className={`week${dropSide ? ` week--drop-${dropSide}` : ""}${
                    over?.kind === "weekEnd" && over.id === week.id
                      ? " week--drop-end"
                      : ""
                  }${
                    drag?.kind === "week" && drag.id === week.id
                      ? " is-dragging"
                      : ""
                  }`}
                  {...weekDrop(week)}
                >
                  <header className="week__head">
                    <h3 className="week__title">
                      <span
                        className="week__grip"
                        title="Přesunout týden"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", week.id);
                          e.dataTransfer.setDragImage(
                            e.currentTarget.closest(".week"),
                            16,
                            16
                          );
                          startDrag("week", week.id);
                        }}
                        onDragEnd={endDrag}
                      >
                        <FaGripVertical />
                      </span>
                      <EditableText
                        className="week__dates"
                        placeholder="Datum týdne"
                        {...metaField(`week:${week.id}:dates`, defaultRange)}
                      />{" "}
                      –{" "}
                      <EditableText
                        placeholder="Popis týdne"
                        {...metaField(`week:${week.id}:title`, week.title)}
                      />
                    </h3>
                    {showVolume && (
                      <span className="week__volume">
                        Objem:{" "}
                        <EditableText
                          placeholder="—"
                          {...metaField(`week:${week.id}:volume`, week.volume)}
                        />
                      </span>
                    )}
                    {trackKm && (
                      <span className="week__km">
                        {kmLabel}: {formatTotal(sumKm(week.blocks), trackUnit)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="day__icon day__icon--danger"
                      title="Smazat týden"
                      onClick={() =>
                        confirmDelete("Smazat celý týden včetně všech jeho bloků?", () =>
                          saveLayout(removeWeek(layout, week.id))
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </header>

                  <div className="week__days">
                    {blocks.map(({ block, date }) => (
                      <Day
                        key={block.id}
                        block={block}
                        date={date}
                        entry={stored[block.id] || {}}
                        km={stored[block.id]?.km}
                        kmLabel={kmLabel}
                        trackUnit={trackUnit}
                        smallText={smallText}
                        showText={showText}
                        metrics={metrics}
                        showDiff={showKcalDiff}
                        statusLabel={statusLabel}
                        cheatday={cheatday}
                        compact={compact}
                        cheatResult={cheatResults[block.id]}
                        onKmChange={
                          trackKm ? (v) => updateDay(block.id, { km: v }) : null
                        }
                        isToday={!!date && toKey(date) === todayKey}
                        onChange={(patch) => updateDay(block.id, patch)}
                        onDateChange={(iso) => updateMeta(`date:${block.id}`, iso)}
                        onDelete={() =>
                          confirmDelete("Smazat tento blok?", () =>
                            saveLayout(removeBlock(layout, block.id))
                          )
                        }
                        dnd={blockDnd(block)}
                        scrollRef={block.id === nextBlockId ? nextBlockRef : null}
                      />
                    ))}
                    <button
                      type="button"
                      className="add add--block"
                      onClick={() =>
                        saveLayout(
                          addBlockToWeek(
                            layout,
                            week.id,
                            createBlock(lastDate && addDays(lastDate, 1))
                          )
                        )
                      }
                    >
                      <FaPlus /> Přidat blok
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="add add--week"
                  onClick={() =>
                    saveLayout(addWeekAfter(layout, week.id, createWeek(lastDate, blockOffsets, newWeekVolume, newWeekTemplate)))
                  }
                >
                  <FaPlus /> Přidat týden
                </button>
              </div>
            );
          })}

          {month.weeks.length === 0 && (
            <button
              type="button"
              className="add add--week"
              onClick={() =>
                saveLayout(addWeekToMonth(layout, month.id, createWeek(null, blockOffsets, newWeekVolume, newWeekTemplate)))
              }
            >
              <FaPlus /> Přidat týden
            </button>
          )}
        </section>
      ))}
    </div>
  );
}

export default TrainingPlan;
