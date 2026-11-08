import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useScore } from "../plans/PlansContext";
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`navbar${user ? " navbar--auth" : ""}`}>
      <Link to="/" className="navbar__logo">
        KUBE<span>X</span>
      </Link>
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
    </header>
  );
}

export default Navbar;
