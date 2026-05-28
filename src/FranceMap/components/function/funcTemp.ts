// ====== FONCTIONS UTILITAIRES POUR LA HEATMAP ======

const getTemperatureColor = (temp: number | undefined, minTemp: number, maxTemp: number): string => {
  if (temp === undefined || isNaN(temp)) return "#e0e0e0";
  const normalized = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
  let r: number, g: number, b: number;

  if (normalized < 0.2) {
    const t = normalized / 0.2;
    r = Math.round(30 + (100 - 30) * t);
    g = Math.round(80 + (180 - 80) * t);
    b = Math.round(220 + (255 - 220) * t);
  } else if (normalized < 0.4) {
    const t = (normalized - 0.2) / 0.2;
    r = Math.round(100 + (50 - 100) * t);
    g = Math.round(180 + (220 - 180) * t);
    b = Math.round(255 + (200 - 255) * t);
  } else if (normalized < 0.6) {
    const t = (normalized - 0.4) / 0.2;
    r = Math.round(50 + (180 - 50) * t);
    g = Math.round(220 + (230 - 220) * t);
    b = Math.round(200 + (50 - 200) * t);
  } else if (normalized < 0.8) {
    const t = (normalized - 0.6) / 0.2;
    r = Math.round(180 + (255 - 180) * t);
    g = Math.round(230 + (140 - 230) * t);
    b = Math.round(50 + (0 - 50) * t);
  } else {
    const t = (normalized - 0.8) / 0.2;
    r = 255;
    g = Math.round(140 + (0 - 140) * t);
    b = 0;
  }
  return `rgb(${r}, ${g}, ${b})`;
};



const calculateRegionTemperature = (
  regionName: string,
  departmentToRegion: Record<string, string>,
  temperatures: Record<string, number>
): number | undefined => {
  let totalTemp = 0;
  let count = 0;
  Object.entries(departmentToRegion).forEach(([deptCode, region]) => {
    if (region === regionName && temperatures[deptCode] !== undefined) {
      totalTemp += temperatures[deptCode];
      count++;
    }
  });
  return count > 0 ? totalTemp / count : undefined;
};

const getTemperatureRange = (temperatures: Record<string, number>): { min: number; max: number } => {
  const values = Object.values(temperatures).filter((v) => !isNaN(v));
  if (values.length === 0) return { min: -10, max: 40 };
  return { min: Math.floor(Math.min(...values)), max: Math.ceil(Math.max(...values)) };
};

const generateLegendGradient = (minTemp: number, maxTemp: number): string => {
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

export { getTemperatureColor, calculateRegionTemperature, getTemperatureRange, generateLegendGradient };