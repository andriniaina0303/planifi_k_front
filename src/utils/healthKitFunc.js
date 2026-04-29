import { pct } from "./Helpers";
import { tokens } from "./Tokens";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * HEALTH KIT FUNCTIONS - Calcul du score et indicateur de santé
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Évalue la qualité/santé d'une campagne d'annonceur basée sur :
 * - Open Rate (taux d'ouverture) : 35 pts max
 * - Click-Through Rate (CTR) : 35 pts max  
 * - Unsubscribe Rate (taux de désinscription) : 30 pts max
 * Score total : 0-100
 */

/**
 * Calcule le score de santé global d'une campagne
 * 
 * @param {Object} g - Globales de la campagne
 * @param {number} g.taux_openers - Taux d'ouverture en %
 * @param {number} g.taux_clickers - Taux de clic en %
 * @param {number} g.taux_unsubs - Taux de désinscription en %
 * @returns {number} Score entre 0 et 100
 * @description
 *   Scoring :
 *   - Open Rate > 15% = 35pts, > 10% = 25pts, > 5% = 15pts, ≤ 5% = 5pts
 *   - CTR > 3% = 35pts, > 1.5% = 25pts, > 0.5% = 15pts, ≤ 0.5% = 5pts
 *   - Unsub < 0.1% = 30pts, < 0.3% = 20pts, < 0.5% = 10pts, ≥ 0.5% = 0pts
 */
export const getHealthScore = (g) => {
  const openRate = Number(g.taux_openers || 0);
  const ctr = Number(g.taux_clickers || 0);
  const unsubRate = Number(g.taux_unsubs || 0);
  let score = 0;

  // Open Rate (35 pts max)
  if (openRate > 15) score += 35;
  else if (openRate > 10) score += 25;
  else if (openRate > 5) score += 15;
  else score += 5;

  // CTR (35 pts max)
  if (ctr > 3) score += 35;
  else if (ctr > 1.5) score += 25;
  else if (ctr > 0.5) score += 15;
  else score += 5;

  // Unsub inverse (30 pts max) - moins de désins = mieux
  if (unsubRate < 0.1) score += 30;
  else if (unsubRate < 0.3) score += 20;
  else if (unsubRate < 0.5) score += 10;
  else score += 0;

  return Math.min(100, score);
};

/**
 * Retourne la couleur correspondant au score de santé
 * 
 * @param {number} score - Score entre 0 et 100
 * @returns {string} Couleur hex
 * @description
 *   >= 75 = Vert (excellent)
 *   >= 50 = Orange (bon)
 *   >= 25 = Orange foncé (standard)
 *   < 25 = Rouge (à surveiller)
 */
export const getHealthColor = (score) => {
  if (score >= 75) return tokens.success;   // Vert
  if (score >= 50) return tokens.warning;   // Jaune/Orange
  if (score >= 25) return tokens.orange;    // Orange foncé
  return tokens.danger;                     // Rouge
};

/**
 * Retourne le label textuel correspondant au score de santé
 * 
 * @param {number} score - Score entre 0 et 100
 * @returns {string} Label ("Excellent", "Bon", "Standard", "À surveiller")
 */
export const getHealthLabel = (score) => {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Bon";
  if (score >= 25) return "Standard";
  return "À surveiller";
};

/**
 * Détail complet du scoring de santé avec points par critère
 * 
 * @param {Object} g - Globales de la campagne
 * @returns {Array<Object>} Tableau avec détails de chaque critère
 * @description
 *   Chaque critère contient :
 *   - label: nom du critère
 *   - value: valeur formatée
 *   - points: points attribués
 *   - max: points possibles pour ce critère
 *   - thresholds: seuils de scoring
 *   - color: couleur de visualisation
 * 
 *   Utile pour afficher un breakdown détaillé du score
 */
export const getHealthDetails = (g) => {
  const openRate = Number(g.taux_openers || 0);
  const ctr = Number(g.taux_clickers || 0);
  const unsubRate = Number(g.taux_unsubs || 0);

  // Calculer les points pour chaque métrique
  const openPts =
    openRate > 15 ? 35 : openRate > 10 ? 25 : openRate > 5 ? 15 : 5;
  const ctrPts = ctr > 3 ? 35 : ctr > 1.5 ? 25 : ctr > 0.5 ? 15 : 5;
  const unsubPts =
    unsubRate < 0.1 ? 30 : unsubRate < 0.3 ? 20 : unsubRate < 0.5 ? 10 : 0;

  return [
    {
      label: "Open Rate",
      value: pct(openRate),
      points: openPts,
      max: 35,
      thresholds: "> 15% = 35pts · > 10% = 25pts · > 5% = 15pts · ≤ 5% = 5pts",
      color:
        openPts >= 25
          ? tokens.success
          : openPts >= 15
            ? tokens.warning
            : tokens.danger,
    },
    {
      label: "Click Rate (CTR)",
      value: pct(ctr),
      points: ctrPts,
      max: 35,
      thresholds:
        "> 3% = 35pts · > 1.5% = 25pts · > 0.5% = 15pts · ≤ 0.5% = 5pts",
      color:
        ctrPts >= 25
          ? tokens.success
          : ctrPts >= 15
            ? tokens.warning
            : tokens.danger,
    },
    {
      label: "Unsub Rate (inversé)",
      value: pct(unsubRate),
      points: unsubPts,
      max: 30,
      thresholds:
        "< 0.1% = 30pts · < 0.3% = 20pts · < 0.5% = 10pts · ≥ 0.5% = 0pts",
      color:
        unsubPts >= 20
          ? tokens.success
          : unsubPts >= 10
            ? tokens.warning
            : tokens.danger,
    },
  ];
};
