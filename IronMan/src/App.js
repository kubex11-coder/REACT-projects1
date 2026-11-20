import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { PlansProvider } from "./plans/PlansContext";
import DbErrorBanner from "./plans/DbErrorBanner";
import Navbar from "./components/Navbar";
import Homepage from "./pages/home/Homepage";
import Login from "./pages/login/Login";
import RunPage from "./pages/run/RunPage";
import SwimPage from "./pages/swim/SwimPage";
import FitkoPage from "./pages/fitko/FitkoPage";
import FoodPage from "./pages/food/FoodPage";
import QuotesPage from "./pages/quotes/QuotesPage";
import { QuotesProvider } from "./quotes/QuotesContext";
import DailyQuote from "./quotes/DailyQuote";
import "./App.css";

// Podstránky vyžadují přihlášení přes Supabase.
const PROTECT_SECTIONS = true;

const sections = [
  { path: "/run", element: <RunPage /> },
  { path: "/swim", element: <SwimPage /> },
  { path: "/fitko", element: <FitkoPage /> },
  { path: "/food", element: <FoodPage /> },
  { path: "/quotes", element: <QuotesPage /> },
];

function App() {
  return (
    <AuthProvider>
      <PlansProvider>
      <QuotesProvider>
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
          <DailyQuote />
        </div>
      </BrowserRouter>
      </QuotesProvider>
      </PlansProvider>
    </AuthProvider>
  );
}

export default App;
