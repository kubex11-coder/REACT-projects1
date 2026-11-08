import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { PlansProvider } from "./plans/PlansContext";
import DbErrorBanner from "./plans/DbErrorBanner";
import Navbar from "./components/Navbar";
import Homepage from "./pages/home/Homepage";
import Login from "./pages/login/Login";
import RunPage from "./pages/run/RunPage";
import SectionPage from "./pages/section/SectionPage";
import "./App.css";

// Podstránky vyžadují přihlášení přes Supabase.
const PROTECT_SECTIONS = true;

const sections = [
  { path: "/run", element: <RunPage /> },
  { path: "/swim", element: <SectionPage title="SWIM" /> },
  { path: "/fitko", element: <SectionPage title="FITKO" /> },
];

function App() {
  return (
    <AuthProvider>
      <PlansProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            {sections.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  PROTECT_SECTIONS ? (
                    <ProtectedRoute>{element}</ProtectedRoute>
                  ) : (
                    element
                  )
                }
              />
            ))}
          </Routes>
          <DbErrorBanner />
        </div>
      </BrowserRouter>
      </PlansProvider>
    </AuthProvider>
  );
}

export default App;
