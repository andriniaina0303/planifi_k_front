/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN.JSX - Page de connexion
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Forme de connexion simple avec validation :
 * - Email et mot de passe
 * - Toggle pour afficher/masquer le mot de passe
 * - Gestion d'erreurs basique
 * 
 * Note: À connecter avec un vrai système d'authentification (JWT, OAuth, etc.)
 * Credentials temporaires : user@example.com / 123456
 */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Composant Page de Connexion
 * 
 * @component
 * @returns {JSX.Element} Formulaire de connexion centré
 */
export default function LoginPage() {
  // État pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);
  
  // Champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Messages d'erreur
  const [error, setError] = useState("");

  /**
   * Gère la soumission du formulaire
   * Valide les champs et compare avec les credentials temporaires
   * 
   * @param {Event} e - Événement du formulaire
   */
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validation : les deux champs doivent être remplis
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    // Credentials temporaires (à remplacer par l'authentification backend)
    const correctEmail = "user@example.com";
    const correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {
      alert("Connexion réussie !");
      // Réinitialiser les champs après connexion réussie
      setEmail("");
      setPassword("");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#6c757d" }} // Gris Bootstrap équivalent gray.500
    >
      {/* Carte de connexion centrée */}
      <div className="card shadow" style={{ width: "100%", maxWidth: 400, borderRadius: "1rem" }}>
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
              />
              {/* Bouton pour afficher/masquer le mot de passe */}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Case "Souviens-moi" */}
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            {/* Affichage des erreurs */}
            {error && (
              <div className="text-danger text-center mb-3 small">
                {error}
              </div>
            )}

            {/* Bouton de connexion */}
            <button type="submit" className="btn btn-success w-100">
              Se connecter
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
