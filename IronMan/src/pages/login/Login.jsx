import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./login.css";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (await login(email.trim(), password)) {
      navigate(from, { replace: true });
    } else {
      setError("Přihlášení se nezdařilo. Zkontroluj e-mail a heslo.");
    }
  };

  return (
    <main className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Přihlášení</h1>
        <label className="login__label">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="login__label">
          Heslo
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="login__error">{error}</p>}
        <button type="submit" className="login__submit">
          Přihlásit se
        </button>
      </form>
    </main>
  );
}

export default Login;
