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

// Indexováno podle Date.getDay() (0 = neděle).
const DAY_NAMES = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

function formatDate(date) {
  return `${date.getDate()}. ${date.getMonth() + 1}.`;
}

function Day({
  block,
  date,
  entry,
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
    onChange({ text: draft.text.trim(), note: draft.note.trim() || null });
    // Prázdné nebo výchozí datum smaže úpravu a vrátí výchozí hodnotu.
    onDateChange(draft.date && draft.date !== block.date ? draft.date : null);
    setEditing(false);
  };

  // Zaškrtnutí aktivní volby ji zruší; Ano a Ne se vzájemně vylučují.
  const toggleStatus = (value) =>
    onChange({ status: entry.status === value ? null : value });

  return (
    <div
      className={`day${entry.status ? ` day--${entry.status}` : ""}${
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
          <p className="day__text">{text || "—"}</p>
        )}
      </div>

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
          <span className="day__label">Splněno</span>
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
    </div>
  );
}

function TrainingPlan({ planId, startDate, weeks }) {
  const [stored, updateDay] = usePlan(planId);
  const [meta, updateMeta] = usePlanMeta(planId);
  const loaded = usePlansLoaded();
  const nextBlockRef = useRef(null);
  const scrolledRef = useRef(false);
  const [drag, setDrag] = useState(null); // { kind: "block" | "week", id }
  const [over, setOver] = useState(null); // aktuální cíl přetahování
  const todayKey = toKey(new Date());

  const layout = useMemo(
    () => resolveLayout({ startDate, weeks }, meta.layout),
    [startDate, weeks, meta.layout]
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

  // Následující trénink = první blok bez zaškrtnutého Ano/Ne (jsou-li všechny
  // vyplněné, tak poslední). Při načtení stránky se vycentruje; při práci s
  // plánem se už nescrolluje.
  const allBlocks = layout.months.flatMap((m) => m.weeks.flatMap((w) => w.blocks));
  const nextBlock =
    allBlocks.find((b) => !stored[b.id]?.status) || allBlocks[allBlocks.length - 1];
  const nextBlockId = nextBlock?.id;

  useEffect(() => {
    if (!loaded || scrolledRef.current) return;
    scrolledRef.current = true;
    nextBlockRef.current?.scrollIntoView({ block: "center" });
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
                    <span className="week__volume">
                      Objem:{" "}
                      <EditableText
                        placeholder="—"
                        {...metaField(`week:${week.id}:volume`, week.volume)}
                      />
                    </span>
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
                    saveLayout(addWeekAfter(layout, week.id, createWeek(lastDate)))
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
                saveLayout(addWeekToMonth(layout, month.id, createWeek(null)))
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
