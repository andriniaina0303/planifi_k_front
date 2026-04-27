import { pct } from "./Helpers";
import { tokens } from "./Tokens";


// ═══════════════════════════════════════════════════════════════
// UTILITIES (Pure Functions)
// ═




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

  // Unsub inverse (30 pts max)
  if (unsubRate < 0.1) score += 30;
  else if (unsubRate < 0.3) score += 20;
  else if (unsubRate < 0.5) score += 10;
  else score += 0;

  return Math.min(100, score);
};

export const getHealthColor = (score) => {
  if (score >= 75) return tokens.success;
  if (score >= 50) return tokens.warning;
  if (score >= 25) return tokens.orange;
  return tokens.danger;
};

export const getHealthLabel = (score) => {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Bon";
  if (score >= 25) return "Standard";
  return "À surveiller";
};



export const getHealthDetails = (g) => {
  const openRate = Number(g.taux_openers || 0);
  const ctr = Number(g.taux_clickers || 0);
  const unsubRate = Number(g.taux_unsubs || 0);

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
