import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const correctEmail = "user@example.com";
    const correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {
      alert("Connexion réussie !");
      setEmail("");
      setPassword("");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#6c757d" }} // équivalent gray.500
    >
      <div className="card shadow" style={{ width: "100%", maxWidth: 400, borderRadius: "1rem" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 text-dark">Planifik</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control bg-light"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3 input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control bg-light"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            {error && (
              <div className="text-danger text-center mb-3 small">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-success w-100">
              Se connecter
            </button>
          </form>

          <div className="text-center mt-3 small text-muted">
            Mot de passe oublié ?
          </div>
        </div>
      </div>
    </div>
  );
}
