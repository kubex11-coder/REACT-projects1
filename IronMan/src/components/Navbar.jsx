import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useScore } from "../plans/PlansContext";
import WeeklyKmChart from "./WeeklyKmChart";
import WeightChart from "./WeightChart";
import ScoreChart from "./ScoreChart";
import { scoreTier } from "./scoreTier";
import "./navbar.css";

const RING_RADIUS = 23;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  // Na stránce sekce se skóre počítá jen z jejího plánu.
  const { answered, percent } = useScore(
    ["run", "swim", "fitko", "food"].find((id) => pathname.startsWith(`/${id}`))
  );
  const tier = scoreTier(percent, answered);
  const navigate = useNavigate();
  // Graf v liště mají RUN (kilometry), FOOD (ranní váha) a hlavní stránka (skóre sekcí).
  const chart = pathname === "/"
    ? { id: "home", label: "Graf skóre", title: "Graf skóre plnění", Chart: ScoreChart }
    : pathname.startsWith("/run")
    ? { id: "run", label: "Graf km", title: "Graf kilometráže", Chart: WeeklyKmChart, planId: "run" }
    : pathname.startsWith("/food")
    ? { id: "food", label: "Graf váhy", title: "Graf váhy", Chart: WeightChart, planId: "food" }
    : null;
  const chartId = chart?.id;
  const [chartOpen, setChartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  // Popup začíná pod spodním okrajem lišty; výšku zjistíme při otevření.
  const [popupTop, setPopupTop] = useState(0);

  useEffect(() => {
    if (!chartOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setChartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chartOpen]);

  // Při přechodu na jinou stránku se okno grafu zavře.
  useEffect(() => {
    setChartOpen(false);
  }, [chartId]);

  // Hamburger menu (jen na mobilu): zavře se Escapem, klepnutím mimo i změnou stránky.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e) => {
      if (!headerRef.current?.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header ref={headerRef} className={`navbar${user ? " navbar--auth" : ""}`}>
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          KUBE<span>X</span>
        </Link>
        {user && chart && (
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
            {chart.label} <span aria-hidden="true">▾</span>
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
          <Link to="/quotes" className="navbar__login">
            Citáty
          </Link>
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
      {user && (
        <>
          <button
            type="button"
            className="navbar__burger"
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setChartOpen(false);
              setMenuOpen((o) => !o);
            }}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          {menuOpen && (
            <nav className="navbar__menu">
              <Link to="/" className="navbar__menu-item navbar__menu-logo">
                KUBE<span>X</span>
              </Link>
              <Link to="/quotes" className="navbar__menu-item">
                Citáty
              </Link>
              <button
                type="button"
                className="navbar__menu-item"
                onClick={handleLogout}
              >
                Odhlásit se
              </button>
            </nav>
          )}
        </>
      )}
      {chartOpen &&
        chart &&
        createPortal(
        <div
          className="navbar__modal"
          style={{ top: popupTop }}
          onClick={() => setChartOpen(false)}
        >
          <div
            className="navbar__popup"
            role="dialog"
            aria-label={chart.title}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="navbar__popup-head">
              <h2>{chart.label}</h2>
              <button
                type="button"
                className="navbar__popup-close"
                aria-label="Zavřít"
                onClick={() => setChartOpen(false)}
              >
                ×
              </button>
            </div>
            <chart.Chart planId={chart.planId} />
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

export default Navbar;
