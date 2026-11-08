import { useDbError } from "./PlansContext";
import "./dberrorbanner.css";

// Lišta dole, která ukáže chybu při načítání nebo ukládání do databáze.
function DbErrorBanner() {
  const [error, dismiss] = useDbError();
  if (!error) return null;

  return (
    <div className="db-error" role="alert">
      <span>{error}</span>
      <button type="button" onClick={dismiss}>
        Zavřít
      </button>
    </div>
  );
}

export default DbErrorBanner;
