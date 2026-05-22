
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
// Pages principales
import Home from "./pages/Home/Home";
import Advertisers from "./pages/Reporting/Advertisers/Advertisers";
import AdvertiserDetail from "./pages/Reporting/Advertisers/AdvertiserDetail";
import Databases from "./pages/Reporting/Databases/Databases";
import DatabaseDetail from "./pages/Reporting/Databases/DatabaseDetails";
import { FranceMap } from "./pages/Reporting/FranceMap/FranceMap";
import Counting from "./pages/Counting/Counting";
import LoginPage from "./pages/Login/Login";
import { resetInactivityTimer } from "./api/interceptor";

// Événements considérés comme une "activité" utilisateur
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

/**
 * Hook qui écoute les événements d'activité et reset le timer.
 * Actif uniquement quand l'utilisateur est connecté (token présent).
 */
function useInactivityWatcher() {
  useEffect(() => {
    // Démarre le timer dès le chargement si l'utilisateur est déjà connecté
    resetInactivityTimer();

    // Handler partagé pour tous les événements d'activité
    const handleActivity = () => resetInactivityTimer();

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, []);
}



/**
 * Garde de route : redirige vers /login si aucun token n'est présent.
 * Mémorise la page demandée pour y revenir après connexion.
 *
 * @param {{ children: JSX.Element }} props
 * @returns {JSX.Element}
 */


function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Redirige vers /login en passant la page d'origine dans l'état
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Composant racine de l'application
 *
 * @component
 * @returns {JSX.Element} Router avec toutes les pages
 */
export default function App() {
    // Active la surveillance d'inactivité pour toute l'application
  useInactivityWatcher();
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Route publique ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Routes protégées ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          Page d'accueil
          <Route index element={<h2>Bienvenue sur Planifik 🚀</h2>} />

          {/* ── MODULE REPORTING ── */}
          <Route path="reporting/advertisers" element={<Advertisers />} />
          
          {/* Affiche les détails spécifiques d'un annonceur */}
          {/* :advertiser_id est un paramètre dynamique extrait de l'URL */}
          <Route path="reporting/advertisers/:advertiser_id" element={<AdvertiserDetail />} />
          
          {/* Gestion des bases de données */}
          <Route path="reporting/database" element={<Databases />} />

          {/* Affiche les détails spécifiques d'un Database */}
          {/* :advertiser_id est un paramètre dynamique extrait de l'URL */}
          <Route path="reporting/database/:database_id" element={<DatabaseDetail />} />

          <Route path= "reporting/FranceMap" element={<FranceMap/>}/>
          {/* ── MODULE COUNTING ── */}
          <Route path="counting" element={<Counting />}>
            <Route path="tasks" element={<Counting />} />
          </Route>
        </Route>

        {/* Fallback : toute URL inconnue → accueil (protégé) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}