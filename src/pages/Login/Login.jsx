

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN.JSX - Page de connexion
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Formulaire de connexion connecté à l'API réelle :
 * POST https://pl1.kontikimedia.com:9000/auth/login
 * Le token JWT reçu est stocké dans le localStorage.
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/interceptor"; // Instance Axios avec intercepteurs pour gérer les tokens et les erreurs"
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Composant Page de Connexion
 *
 * @component
 * @returns {JSX.Element} Formulaire de connexion centré
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Page à afficher après connexion (si l'utilisateur a été redirigé depuis une route protégée)
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Soumet les identifiants à l'API et stocke le token JWT
   *
   * @param {Event} e - Événement du formulaire
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      // Le token peut être dans response.data.token ou response.data.access_token selon le backend
      const  { access_token, refresh_token } = response.data;
        

      if (!access_token) {
        setError("Réponse inattendue du serveur. Contactez l'administrateur.");
        return;
      }

      // Stocker le token pour les futures requêtes (intercepteur le lira automatiquement)
      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }

      // Rediriger vers la page demandée initialement, ou l'accueil
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 400) {
          setError("Email ou mot de passe incorrect");
        } else if (status === 404) {
          setError("Compte introuvable");
        } else {
          setError(`Erreur serveur (${status}). Réessayez plus tard.`);
        }
      } else {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#6c757d" }}
    >
      {/* Carte de connexion centrée */}
      <div
        className="card shadow"
        style={{ width: "100%", maxWidth: 400, borderRadius: "1rem" }}
      >
        <div className="card-body p-4">
          {/* Titre de l'application */}
          <h3 className="text-center mb-4 text-dark">Planifik</h3>

          <form onSubmit={handleLogin}>
            {/* Champ Email */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control bg-light"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Champ Mot de passe avec toggle de visibilité */}
            <div className="mb-3 input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control bg-light"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Case "Souviens-moi" */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            {/* Affichage des erreurs */}
            {error && (
              <div className="text-danger text-center mb-3 small">{error}</div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Lien mot de passe oublié */}
          <div className="text-center mt-3 small text-muted">
            Mot de passe oublié ?
          </div>
        </div>
      </div>
    </div>
  );
}