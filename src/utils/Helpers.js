/**
 * ──────────────────────────────────────────────────────────────────────────
 * HELPERS - Fonctions utilitaires de formatage
 * ──────────────────────────────────────────────────────────────────────────
 * Ces fonctions formatent les nombres pour les afficher lisiblement
 * Utilisées partout dans l'appli (KPIs, tableaux, graphiques, etc.)
 */

/**
 * Formate un nombre avec séparateurs français (ex: 1234567 → "1 234 567")
 * @param {number} v - Valeur à formater
 * @returns {string} Nombre formaté à la locale française
 */
const fmt = (v) => Number(v ?? 0).toLocaleString("fr-FR");

/**
 * Convertit un nombre décimal en pourcentage formaté (ex: 10.567 → "10.57%")
 * @param {number} v - Valeur en décimal (0-100)
 * @returns {string} Pourcentage avec 2 décimales et symbole %
 */
const pct = (v) => `${Number(v ?? 0).toFixed(2)}%`;

/**
 * Formate un montant en euros/dollars avec 2 décimales (ex: 15.567 → "15.57")
 * @param {number} v - Montant à formater
 * @returns {string} Montant avec 2 décimales (sans symbole devise)
 */
const usd = (v) => `${Number(v ?? 0).toFixed(2)}`;

export { fmt, pct, usd, formatDate };

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
}