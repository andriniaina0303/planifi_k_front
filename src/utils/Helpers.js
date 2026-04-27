// ── Helpers ──────────────────────────────────────────────────────────────────
/* 
 * Utilitaires de formatage pour afficher les données avec le bon style.
 * fmt() : Formate les nombres avec séparateurs (ex: 1000 → "1 000")
 * pct() : Convertit un nombre en pourcentage formaté (ex: 10 → "10.00%")
 * usd() : Formate les montants en euros/dollars (ex: 15.567 → "15.57")
 */
const fmt = (v) => Number(v ?? 0).toLocaleString("fr-FR");
const pct = (v) => `${Number(v ?? 0).toFixed(2)}%`;
const usd = (v) => `${Number(v ?? 0).toFixed(2)}`;

export { fmt, pct, usd };