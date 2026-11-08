import { useState } from "react";
import { FaPen, FaUndo } from "react-icons/fa";

// Jednořádkový text s tužkou. value je aktuální hodnota, original výchozí z plánu.
// onSave dostane nový text; undo (šipka) se ukáže jen u upravené hodnoty.
function EditableText({ value, original, placeholder, onSave, onReset, className }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  const save = () => {
    onSave(draft.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <span className="edit">
        <input
          className="edit__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
        />
        <button type="button" className="day__btn day__btn--primary" onClick={save}>
          Uložit
        </button>
        <button type="button" className="day__btn" onClick={() => setEditing(false)}>
          Zrušit
        </button>
      </span>
    );
  }

  return (
    <span className="edit">
      <span className={`${className || ""}${value ? "" : " edit__placeholder"}`}>
        {value || placeholder}
      </span>
      {value !== original && (
        <button
          type="button"
          className="day__icon"
          title="Vrátit původní hodnotu"
          onClick={onReset}
        >
          <FaUndo />
        </button>
      )}
      <button type="button" className="day__icon" title="Upravit" onClick={startEdit}>
        <FaPen />
      </button>
    </span>
  );
}

export default EditableText;
