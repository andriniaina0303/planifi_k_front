/**
 * Utilitaires pour gérer les couleurs de la heatmap basée sur les températures
 */

/**
 * Convertit une température en couleur selon un gradient
 * Bleu (froid) -> Cyan -> Vert -> Jaune -> Orange -> Rouge (chaud)
 */
export const getTemperatureColor = (
  temp: number | undefined,
  minTemp: number,
  maxTemp: number
): string => {
  // Si pas de température, retourner gris
  if (temp === undefined || isNaN(temp)) {
    return "#e0e0e0";
  }

  // Normaliser la température entre 0 et 1
  const normalized = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));

  let r: number, g: number, b: number;

  if (normalized < 0.2) {
    // Bleu foncé -> Bleu clair (températures très froides)
    const t = normalized / 0.2;
    r = Math.round(30 + (100 - 30) * t);
    g = Math.round(80 + (180 - 80) * t);
    b = Math.round(220 + (255 - 220) * t);
  } else if (normalized < 0.4) {
    // Bleu clair -> Cyan/Turquoise (températures froides)
    const t = (normalized - 0.2) / 0.2;
    r = Math.round(100 + (50 - 100) * t);
    g = Math.round(180 + (220 - 180) * t);
    b = Math.round(255 + (200 - 255) * t);
  } else if (normalized < 0.6) {
    // Cyan -> Vert/Jaune-vert (températures moyennes)
    const t = (normalized - 0.4) / 0.2;
    r = Math.round(50 + (180 - 50) * t);
    g = Math.round(220 + (230 - 220) * t);
    b = Math.round(200 + (50 - 200) * t);
  } else if (normalized < 0.8) {
    // Jaune-vert -> Orange (températures chaudes)
    const t = (normalized - 0.6) / 0.2;
    r = Math.round(180 + (255 - 180) * t);
    g = Math.round(230 + (140 - 230) * t);
    b = Math.round(50 + (0 - 50) * t);
  } else {
    // Orange -> Rouge foncé (températures très chaudes)
    const t = (normalized - 0.8) / 0.2;
    r = 255;
    g = Math.round(140 + (0 - 140) * t);
    b = 0;
  }

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Calcule la température moyenne d'une région basée sur ses départements
 */
export const calculateRegionTemperature = (
  regionName: string,
  departmentToRegion: Record<string, string>,
  temperatures: Record<string, number>
): number | undefined => {
  let totalTemp = 0;
  let count = 0;

  // Trouver tous les départements de cette région
  Object.entries(departmentToRegion).forEach(([deptCode, region]) => {
    if (region === regionName && temperatures[deptCode] !== undefined) {
      totalTemp += temperatures[deptCode];
      count++;
    }
  });

  return count > 0 ? totalTemp / count : undefined;
};

/**
 * Calcule les températures min et max pour l'échelle de la heatmap
 */
export const getTemperatureRange = (
  temperatures: Record<string, number>
): { min: number; max: number } => {
  const values = Object.values(temperatures).filter((v) => !isNaN(v));

  if (values.length === 0) {
    return { min: -10, max: 40 }; // Valeurs par défaut
  }

  return {
    min: Math.floor(Math.min(...values)),
    max: Math.ceil(Math.max(...values)),
  };
};

/**
 * Génère un gradient CSS pour la légende
 */
export const generateLegendGradient = (minTemp: number, maxTemp: number): string => {
  const steps = 10;
  const gradientStops: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const temp = minTemp + (i / steps) * (maxTemp - minTemp);
    const color = getTemperatureColor(temp, minTemp, maxTemp);
    const percentage = (i / steps) * 100;
    gradientStops.push(`${color} ${percentage}%`);
  }

  return `linear-gradient(to top, ${gradientStops.join(", ")})`;
};
