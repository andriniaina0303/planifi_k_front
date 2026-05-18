

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/interceptor";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .planifik-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a2236;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Background decorative blobs */
  .planifik-root::before {
    content: '';
    position: absolute;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(221, 226, 238, 0.18) 0%, transparent 70%);
    top: -120px;
    left: -100px;
    pointer-events: none;
  }
  .planifik-root::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%);
    bottom: -80px;
    right: -60px;
    pointer-events: none;
  }

  .planifik-blob-yellow {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%);
    bottom: 60px;
    left: 40px;
    pointer-events: none;
  }

  /* Grid dots overlay */
  .planifik-grid {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  /* Card */
  .planifik-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    margin: 24px;
    background: #212d42;
    border-radius: 20px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06),
      0 24px 60px rgba(0,0,0,0.45),
      0 8px 24px rgba(37,99,235,0.12);
    padding: 40px 36px 36px;
    animation: cardIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Logo area */
  .planifik-logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    animation: fadeUp 0.5s 0.1s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .planifik-logo-icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
  }

  .planifik-brand {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 1.7rem;
    letter-spacing: -0.5px;
    line-height: 1;
    background: linear-gradient(120deg, #60a5fa 0%, #34d399 60%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Welcome text */
  .planifik-welcome {
    animation: fadeUp 0.5s 0.18s both;
    margin-bottom: 28px;
  }

  .planifik-welcome h2 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.18rem;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0 0 4px;
  }

  .planifik-welcome p {
    font-size: 0.85rem;
    color: #7a8fa8;
    margin: 0;
  }

  /* Divider */
  .planifik-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin-bottom: 24px;
    animation: fadeUp 0.5s 0.22s both;
  }

  /* Form fields */
  .planifik-field {
    margin-bottom: 16px;
    animation: fadeUp 0.5s 0.28s both;
  }
  .planifik-field + .planifik-field {
    animation-delay: 0.34s;
  }

  .planifik-label {
    display: block;
    font-size: 0.76rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #7a8fa8;
    margin-bottom: 7px;
  }

  .planifik-input-wrap {
    position: relative;
  }

  .planifik-input {
    width: 100%;
    padding: 11px 14px;
    background: #19263a;
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.93rem;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    box-sizing: border-box;
  }

  .planifik-input::placeholder {
    color: #3e5068;
  }

  .planifik-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
    background: #1c2e47;
  }

  .planifik-input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  /* Password toggle */
  .planifik-input-wrap .pwd-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #4b6280;
    font-size: 1rem;
    line-height: 1;
    transition: color 0.15s;
  }
  .planifik-input-wrap .pwd-toggle:hover {
    color: #93c5fd;
  }
  .planifik-input-wrap input[type="password"],
  .planifik-input-wrap input[type="text"] {
    padding-right: 40px;
  }

  /* Remember me */
  .planifik-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    animation: fadeUp 0.5s 0.40s both;
  }

  .planifik-checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.83rem;
    color: #7a8fa8;
    cursor: pointer;
    user-select: none;
  }

  .planifik-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #34d399;
    cursor: pointer;
  }

  .planifik-forgot {
    font-size: 0.81rem;
    color: #60a5fa;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    transition: color 0.15s;
  }
  .planifik-forgot:hover {
    color: #93c5fd;
    text-decoration: underline;
  }

  /* Error */
  .planifik-error {
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    padding: 9px 13px;
    color: #fca5a5;
    font-size: 0.82rem;
    text-align: center;
    margin-bottom: 16px;
    animation: shake 0.35s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    60%       { transform: translateX(6px); }
    80%       { transform: translateX(-3px); }
  }

  /* Submit button */
  .planifik-btn {
    width: 100%;
    padding: 13px;
    border-radius: 11px;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 0.96rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    animation: fadeUp 0.5s 0.46s both;
    position: relative;
    overflow: hidden;
    background: linear-gradient(120deg, #2563eb 0%, #059669 100%);
    color: #fff;
    box-shadow: 0 4px 20px rgba(37,99,235,0.30);
    letter-spacing: 0.01em;
  }

  .planifik-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, #1d4ed8 0%, #047857 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .planifik-btn:hover::before { opacity: 1; }
  .planifik-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(37,99,235,0.38); }
  .planifik-btn:active { transform: translateY(0); }
  .planifik-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .planifik-btn span { position: relative; z-index: 1; }

  .planifik-spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    position: relative;
    z-index: 1;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Accent stripe at card top */
  .planifik-stripe {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(90deg, #2563eb 0%, #10b981 50%, #f59e0b 100%);
  }
`;

// ─── Logo SVG inline ──────────────────────────────────────────────────────────
function PlanifiKLogo({ size = 46 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="planifik-logo-icon"
    >
      {/* Background circle */}
      <rect width="46" height="46" rx="12" fill="url(#lg-bg)" />

      {/* Calendar grid */}
      <rect x="9" y="13" width="28" height="22" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />

      {/* Header bar */}
      <rect x="9" y="13" width="28" height="7" rx="3" fill="url(#lg-header)" />
      <rect x="9" y="17" width="28" height="3" fill="url(#lg-header)" />

      {/* Calendar pegs */}
      <rect x="15" y="10" width="3" height="6" rx="1.5" fill="#fbbf24" />
      <rect x="28" y="10" width="3" height="6" rx="1.5" fill="#fbbf24" />

      {/* Grid cells - dots */}
      <circle cx="16" cy="26" r="1.4" fill="#60a5fa" />
      <circle cx="23" cy="26" r="1.4" fill="#60a5fa" />
      <circle cx="30" cy="26" r="1.4" fill="rgba(255,255,255,0.25)" />
      <circle cx="16" cy="31" r="1.4" fill="rgba(255,255,255,0.25)" />
      <circle cx="23" cy="31" r="1.4" fill="#34d399" />
      <circle cx="30" cy="31" r="1.4" fill="rgba(255,255,255,0.25)" />

      {/* Check on green dot */}
      <path d="M21.8 31l1 1 1.8-1.8" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0f2744" />
        </linearGradient>
        <linearGradient id="lg-header" x1="9" y1="13" x2="37" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Eye / EyeOff icons ───────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

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
      const { access_token, refresh_token } = response.data;

      if (!access_token) {
        setError("Réponse inattendue du serveur. Contactez l'administrateur.");
        return;
      }

      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }

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
    <>
      <style>{styles}</style>

      <div className="planifik-root">
        <div className="planifik-grid" />
        <div className="planifik-blob-yellow" />

        <div className="planifik-card">
          {/* Top color stripe */}
          <div className="planifik-stripe" />

          {/* Logo + Brand */}
          <div className="planifik-logo-wrap">
            <PlanifiKLogo size={46} />
            <span className="planifik-brand">PlanifiK</span>
          </div>

          {/* Welcome message */}
          <div className="planifik-welcome">
            <h2>Bienvenue 👋</h2>
            <p>Connectez-vous pour gérer vos plannings et tâches.</p>
          </div>

          <div className="planifik-divider" />

          {/* Form */}
          <form onSubmit={handleLogin} noValidate>

            {/* Email */}
            <div className="planifik-field">
              <label className="planifik-label" htmlFor="planifik-email">Email</label>
              <div className="planifik-input-wrap">
                <input
                  id="planifik-email"
                  type="email"
                  className="planifik-input"
                  placeholder="vous@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="planifik-field">
              <label className="planifik-label" htmlFor="planifik-password">Mot de passe</label>
              <div className="planifik-input-wrap">
                <input
                  id="planifik-password"
                  type={showPassword ? "text" : "password"}
                  className="planifik-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="planifik-row">
              <label className="planifik-checkbox-label">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="planifik-checkbox"
                />
                Se souvenir de moi
              </label>
              <button type="button" className="planifik-forgot">
                Mot de passe oublié ?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="planifik-error" role="alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="planifik-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="planifik-spinner" />
                  <span>Connexion en cours…</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}