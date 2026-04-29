/**
 * ═══════════════════════════════════════════════════════════════════════════
 * APP.JSX - Composant racine avec routage
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Définit la structure globale de l'application avec React Router :
 * - Route /login : Page de connexion
 * - Route / : Page d'accueil avec sous-routes
 *   - /reporting/advertisers : Liste des annonceurs
 *   - /reporting/advertisers/:advertiser_id : Détails d'un annonceur
 *   - /reporting/database : Gestion des bases de données
 *   - /counting : Module de comptage
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages principales
import Home from "./pages/Home/Home";
import Advertisers from "./pages/Reporting/Advertisers";
import AdvertiserDetail from "./pages/Reporting/AdvertiserDetail";
import Database from "./pages/Reporting/Databases";
import Counting from "./pages/Counting/Counting";
import LoginPage from "./pages/Login/Login";

/**
 * Composant racine de l'application
 * Configure toutes les routes et leur hiérarchie
 * 
 * @component
 * @returns {JSX.Element} Router avec toutes les pages
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route de connexion - accessible sans authentification */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route principale - toutes les pages protégées sont sous Home */}
        <Route path="/" element={<Home />}>
          {/* Page d'accueil */}
          <Route index element={<h2>Bienvenue sur Planifik 🚀</h2>} />

          {/* ================= MODULE REPORTING ================= */}
          {/* Affiche la liste de tous les annonceurs */}
          <Route path="reporting/advertisers" element={<Advertisers />} />
          
          {/* Affiche les détails spécifiques d'un annonceur */}
          {/* :advertiser_id est un paramètre dynamique extrait de l'URL */}
          <Route path="reporting/advertisers/:advertiser_id" element={<AdvertiserDetail />} />
          
          {/* Gestion des bases de données */}
          <Route path="reporting/database" element={<Database />} />

          {/* ================= MODULE COUNTING ================= */}
          <Route path="counting" element={<Counting />}>
            {/* Sous-route pour les tâches de comptage */}
            <Route path="tasks" element={<Counting />} />
          </Route>
        </Route>
      </Routes>                                                                                                                                                                       
    </BrowserRouter>
  );
}