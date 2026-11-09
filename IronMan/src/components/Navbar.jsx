import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useScore } from "../plans/PlansContext";
import WeeklyKmChart from "./WeeklyKmChart";
import "./navbar.css";

const RING_RADIUS = 23;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// Bez jediné odpovědi šedá; 80–100 % zelená, 50–79 % oranžová, pod 50 % červená.
function scoreTier(percent, answered) {
  if (answered === 0) return "none";
  if (percent >= 80) return "good";
  if (percent >= 50) return "mid";
  return "bad";
}

function Navbar() {
  const { user, logout } = useAuth();
  const { yes, no, percent } = useScore();
  const tier = scoreTier(percent, yes + no);
  const navigate = useNavigate();
  const onRun = useLocation().pathname.startsWith("/run");
  const [chartOpen, setChartOpen] = useState(false);
  const headerRef = useRef(null);
  // Popup začíná pod spodním okrajem lišty; výšku zjistíme při otevření.
  const [popupTop, setPopupTop] = useState(0);

  useEffect(() => {
    if (!chartOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setChartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chartOpen]);

  // Mimo stránku RUN se graf nezobrazuje.
  useEffect(() => {
    if (!onRun) setChartOpen(false);
  }, [onRun]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header ref={headerRef} className={`navbar${user ? " navbar--auth" : ""}`}>
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          KUBE<span>X</span>
        </Link>
        {user && onRun && (
          <button
            type="button"
            className={`navbar__chart-btn${chartOpen ? " navbar__chart-btn--open" : ""}`}
            aria-expanded={chartOpen}
            onClick={() => {
              // Na mobilu je okno o 25 px níž pod lištou.
              const gap = window.matchMedia("(max-width: 700px)").matches ? 25 : 0;
              setPopupTop(headerRef.current.getBoundingClientRect().bottom + gap);
              setChartOpen((o) => !o);
            }}
          >
            Graf km <span aria-hidden="true">▾</span>
          </button>
        )}
      </div>
      {user ? (
        <div className={`navbar__score navbar__score--${tier}`}>
          {tier === "bad" && (
            <span className="navbar__alert" aria-hidden="true">
              !!!
            </span>
          )}
          <div className="navbar__ring">
            <svg viewBox="0 0 52 52" aria-hidden="true">
              <circle className="navbar__ring-bg" cx="26" cy="26" r={RING_RADIUS} />
              <circle
                className="navbar__ring-fill"
                cx="26"
                cy="26"
                r={RING_RADIUS}
                strokeDasharray={`${(percent / 100) * RING_LENGTH} ${RING_LENGTH}`}
              />
            </svg>
            <span className="navbar__score-value">
              <span>
                {percent}
                <small>%</small>
              </span>
            </span>
          </div>
          <span className="navbar__score-label">Skóre plnění</span>
          {tier === "bad" && (
            <span className="navbar__alert" aria-hidden="true">
              !!!
            </span>
          )}
        </div>
      ) : null}
      {user ? (
        <div className="navbar__user">
          <span className="navbar__email">{user.email}</span>
          <button type="button" className="navbar__login" onClick={handleLogout}>
            Odhlásit se
          </button>
        </div>
      ) : (
        <Link to="/login" className="navbar__login">
          Přihlásit se
        </Link>
      )}
      {chartOpen &&
        createPortal(
        <div
          className="navbar__modal"
          style={{ top: popupTop }}
          onClick={() => setChartOpen(false)}
        >
          <div
            className="navbar__popup"
            role="dialog"
            aria-label="Graf kilometráže"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="navbar__popup-head">
              <h2>Graf km</h2>
              <button
                type="button"
                className="navbar__popup-close"
                aria-label="Zavřít"
                onClick={() => setChartOpen(false)}
              >
                ×
              </button>
            </div>
            <WeeklyKmChart planId="run" />
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

export default Navbar;
