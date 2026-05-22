import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/interceptor";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      navigate("/reporting/advertisers");
    } catch {
      setError("Identifiants incorrects ou erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── PAGE BACKGROUND ── */
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'DM Sans', sans-serif;
          background: #1a2235;
          background-image:
            radial-gradient(ellipse 60% 50% at 15% 40%, rgba(59,130,246,0.12) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 85% 70%, rgba(34,197,94,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 50% 5%,  rgba(99,102,241,0.07) 0%, transparent 60%);
        }

        /* ── CARD ── */
        .login-card {
          display: flex;
          width: 100%;
          max-width: 860px;
          height: 540px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.09),
            0 32px 64px rgba(0,0,0,0.38),
            0 8px 24px rgba(0,0,0,0.22);
          animation: cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ══════════════════════════════
           LEFT PANEL — BRANDED (no image)
        ══════════════════════════════ */
        .left-panel {
          position: relative;
          flex: 1.1;
          overflow: hidden;
          border-radius: 24px 0 0 24px;
          background: linear-gradient(145deg, #1e3a5f 0%, #163347 40%, #1a4535 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.4rem 2.4rem 2.2rem;
        }

        /* Geometric decorative shapes */
        .left-panel::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 65%);
          pointer-events: none;
        }
        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -40px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Floating decorative dots grid */
        .dots-grid {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          opacity: 0.5;
        }

        /* Floating accent ring */
        .accent-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          pointer-events: none;
        }
        .accent-ring-2 {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 460px; height: 460px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.03);
          pointer-events: none;
        }

        /* Logo row at top */
        .left-logo-row {
          display: flex;
          align-items: center;
          gap: 11px;
          position: relative;
          z-index: 1;
        }
        .left-logo-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #3b82f6 0%, #22c55e 100%);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 24px rgba(34,197,94,0.35), 0 4px 10px rgba(0,0,0,0.25);
          flex-shrink: 0;
        }
        .left-logo-name {
          
          font-size: 28px; font-weight: 800;
          color: #fff;
          letter-spacing: -0.4px;
        }
        .left-logo-name span { color: #4ade80; }

        /* Center content */
        .left-center {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1.2rem;
        }

        /* Big icon illustration */
        .center-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(34,197,94,0.25) 100%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 0 0 8px rgba(34,197,94,0.06);
          backdrop-filter: blur(8px);
        }

        .left-headline {
      
          font-size: 22px; font-weight: 800;
          color: #fff;
          line-height: 1.25;
          letter-spacing: -0.4px;
        }
        .left-headline span {
          background: linear-gradient(to right, #60a5fa, #4ade80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 230px;
        }

        /* Feature badges */
        .left-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          max-width: 220px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: rgba(255,255,255,0.55);
        }
        .feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-blue  { background: #60a5fa; box-shadow: 0 0 6px rgba(96,165,250,0.6); }
        .dot-green { background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.6); }
        .dot-amber { background: #fbbf24; box-shadow: 0 0 6px rgba(251,191,36,0.6); }

        /* Pills at bottom */
        .left-pills {
          display: flex; gap: 7px;
          position: relative; z-index: 1;
        }
        .pill {
          font-size: 10px; font-weight: 600;
          padding: 4px 13px; border-radius: 20px;
          border: 1px solid;
          backdrop-filter: blur(10px);
        }
        .pill-blue  { color: #93c5fd; border-color: rgba(147,197,253,0.3); background: rgba(59,130,246,0.10); }
        .pill-green { color: #86efac; border-color: rgba(134,239,172,0.3); background: rgba(34,197,94,0.10); }
        .pill-amber { color: #fcd34d; border-color: rgba(252,211,77,0.3);  background: rgba(251,191,36,0.08); }

        /* ══════════════════════════════
           RIGHT PANEL — FORM
        ══════════════════════════════ */
        .right-panel {
          flex: 1;
          background: #243044;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2.8rem;
          position: relative;
        }
        .right-panel::before {
          content: '';
          position: absolute;
          bottom: -60px; right: -60px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 65%);
          pointer-events: none;
        }

        .form-inner {
          width: 100%;
          max-width: 300px;
          position: relative;
          z-index: 1;
        }

        .form-header { margin-bottom: 1.6rem; }
        .form-greeting {
          font-family: 'Syne', sans-serif;
          font-size: 25px; font-weight: 700;
          color: #e8edf5;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-bottom: 5px;
        }
        .form-sub {
          font-size: 12.5px;
          color: #6b82a0;
          line-height: 1.5;
        }

        .form-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0.10), rgba(255,255,255,0.04), transparent);
          margin: 1.4rem 0;
        }

        /* ── FIELDS ── */
        .field-group { margin-bottom: 0.9rem; }
        .field-label {
          font-size: 10.5px; font-weight: 600;
          color: #7a90ad;
          text-transform: uppercase; letter-spacing: 0.9px;
          margin-bottom: 7px; display: block;
        }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #4a607a;
          transition: color 0.25s;
          pointer-events: none;
          display: flex;
        }
        .field-wrap.focused .field-icon { color: #22c55e; }
        .field-input {
          width: 100%; height: 44px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          color: #dde4ee;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          padding: 0 14px 0 40px;
          outline: none;
          transition: all 0.22s ease;
        }
        .field-input::placeholder { color: #3d5270; }
        .field-input:focus {
          border-color: rgba(34,197,94,0.40);
          background: rgba(34,197,94,0.05);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.09);
        }

        /* ── ERROR ── */
        .form-error {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #fca5a5;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.20);
          border-radius: 8px;
          padding: 9px 12px;
          margin-bottom: 0.9rem;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          25%{transform:translateX(-5px)}
          75%{transform:translateX(5px)}
        }

        /* ── EXTRAS ── */
        .form-extras {
          display: flex; align-items: center;
          justify-content: space-between;
          margin: 0.85rem 0 1.3rem;
        }
        .remember-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 11.5px; color: #5e7a96;
          cursor: pointer; user-select: none;
        }
        .remember-box {
          width: 15px; height: 15px; border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .remember-box.checked { background: #22c55e; border-color: #22c55e; }
        .forgot-link {
          font-size: 11.5px; font-weight: 500;
          color: #60a5fa; cursor: pointer;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #93c5fd; }

        /* ── SUBMIT ── */
        .btn-submit {
          width: 100%; height: 46px;
          border-radius: 11px; border: none;
          background: linear-gradient(125deg, #2563eb 0%, #16a34a 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.3px;
          box-shadow: 0 4px 18px rgba(34,197,94,0.20), 0 1px 0 rgba(255,255,255,0.08) inset;
          transition: all 0.22s ease;
          position: relative; overflow: hidden;
        }
        .btn-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.07), transparent);
          pointer-events: none;
        }
        .btn-submit:hover { box-shadow: 0 6px 24px rgba(34,197,94,0.30); transform: translateY(-1px); }
        .btn-submit:active { transform: translateY(0) scale(0.988); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-footer {
          text-align: center;
          margin-top: 1.6rem;
          font-size: 12.5px; color: #4a607a;
        }
        .register-link {
          color: #60a5fa; font-weight: 600;
          cursor: pointer; transition: color 0.2s;
        }
        .register-link:hover { color: #93c5fd; }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .login-root { padding: 1rem; align-items: flex-start; padding-top: 3rem; }
          .login-card { flex-direction: column; height: auto; max-width: 420px; }
          .left-panel { border-radius: 20px 20px 0 0; flex: none; height: 240px; }
          .right-panel { border-radius: 0 0 20px 20px; padding: 2rem 1.8rem; }
          .form-inner { max-width: 100%; }
          .left-center { gap: 0.8rem; }
          .left-headline { font-size: 18px; }
          .left-features { display: none; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* ── LEFT: BRANDED PANEL ── */}
          <div className="left-panel">
            <div className="dots-grid" />
            <div className="accent-ring" />
            <div className="accent-ring-2" />

            {/* Logo top */}
            <div className="left-logo-row">
              <div className="left-logo-icon">
                <svg width="22" height="19" viewBox="0 0 40 34" fill="none">
                  <rect x="0"  y="18" width="9" height="16" rx="2" fill="#fff" />
                  <rect x="12" y="10" width="9" height="24" rx="2" fill="#fff" />
                  <rect x="24" y="2"  width="9" height="32" rx="2" fill="#fff" opacity="0.85" />
                </svg>
              </div>
              <div className="left-logo-name">Planifi<span>K</span></div>
            </div>

            {/* Center content */}
            <div className="left-center">
              <div className="center-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5">
                  <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
                </svg>
              </div>

              <div className="left-headline">
                Gérez vos projets<br />
                avec <span>intelligence</span>
              </div>

              <p className="left-desc">
                Suivi, analyse et planification automatiques de vos campagnes d'emailing.
              </p>

              <div className="left-features">
                <div className="feature-item">
                  <div className="feature-dot dot-green" />
                  Tableaux de bord en temps réel
                </div>
                <div className="feature-item">
                  <div className="feature-dot dot-blue" />
                  Analyse détaillée des campagnes
                </div>
                <div className="feature-item">
                  <div className="feature-dot dot-amber" />
                  Gestion avancée des campagnes
                </div>
              </div>
            </div>

           
          </div>

          {/* ── RIGHT: FORM ── */}
          <div className="right-panel">
            <div className="form-inner">

              <div className="form-header">
                <div className="form-greeting">Bon retour 👋</div>
                <div className="form-sub">Accédez à votre espace PlanifiK</div>
              </div>

              <div className="form-divider" />

              {error && (
                <div className="form-error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="field-group">
                  <label className="field-label">Email</label>
                  <div className={`field-wrap${focusedField === "email" ? " focused" : ""}`}>
                    <span className="field-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="nom@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Mot de passe</label>
                  <div className={`field-wrap${focusedField === "password" ? " focused" : ""}`}>
                    <span className="field-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="form-extras">
                  <label className="remember-label" onClick={() => setRemember(!remember)}>
                    <div className={`remember-box${remember ? " checked" : ""}`}>
                      {remember && (
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2">
                          <polyline points="2,6 5,9 10,3"/>
                        </svg>
                      )}
                    </div>
                    Se souvenir de moi
                  </label>
                  {/* <span className="forgot-link">Oublié ?</span> */}
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner" />Connexion…</>
                    : "Se connecter →"
                  }
                </button>
              </form>

          
            </div>
          </div>

        </div>
      </div>
    </>
  );
}