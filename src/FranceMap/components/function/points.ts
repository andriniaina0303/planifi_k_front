import { departementToRegion } from '../listeDepartements';
import  * as turf  from "@turf/turf";

export function getRandomPointInPolygon(polygon: any) {
  const bbox = turf.bbox(polygon);

  while (true) {
    const point = turf.randomPoint(1, { bbox }).features[0];
    if (turf.booleanPointInPolygon(point, polygon)) {
      return point.geometry.coordinates as [number,number]; // [lon, lat]
    }
  }
}


// Dans votre fichier de fonctions ou dans FranceMap.tsx

// Fonction pour obtenir le centre (ou un point aléatoire) d'une région
// en calculant la moyenne des points de tous ses départements
export function getRegionPoint(
  regionName: string, 
  geographies: any[], 
  selectedDepartement: string[]
): [number, number] | null {
  // Récupérer les codes des départements de cette région qui ont des points
  const deptsWithPoints = getDepartementsByRegion(regionName)
    .filter(dept => selectedDepartement.includes(dept));
  
  if (deptsWithPoints.length === 0) return null;
  
  // Trouver les géographies correspondantes
  const deptGeographies = geographies.filter(geo => 
    deptsWithPoints.includes(geo.properties.code)
  );
  
  if (deptGeographies.length === 0) return null;
  
  // Calculer le centroïde moyen de tous les départements avec points
  let totalLon = 0;
  let totalLat = 0;
  let count = 0;
  
  deptGeographies.forEach(geo => {
    const point = getRandomPointInPolygon(geo);
    if (point) {
      totalLon += point[0];
      totalLat += point[1];
      count++;
    }
  });
  
  if (count === 0) return null;
  
  return [totalLon / count, totalLat / count];
}

// Fonction utilitaire pour obtenir tous les départements d'une région
export function getDepartementsByRegion(regionName: string): string[] {
  return Object.entries(departementToRegion)
    .filter(([_, region]) => region === regionName)
    .map(([dept, _]) => dept);
}

// Fonction pour compter les points dans une région
export function countPointsInRegion(regionName: string, selectedDepartements: string[]): number {
  const deptsInRegion = getDepartementsByRegion(regionName);
  return deptsInRegion.filter(dept => selectedDepartements.includes(dept)).length;
}



// Fonction pour ajuster un point s'il est trop proche des bords du polygone
export const adjustPointIfNearEdge = (point: [number, number], geo: any, margin: number = 0.4): [number, number] => {
  // Récupérer les coordonnées du polygone
  const coordinates = geo.geometry.coordinates;
  
  // Calculer les limites (bbox) du polygone
  let minLon = Infinity, maxLon = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  
  const processCoordinates = (coords: any) => {
    if (Array.isArray(coords[0])) {
      coords.forEach(processCoordinates);
    } else {
      const [lon, lat] = coords;
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  };
  
  processCoordinates(coordinates);
  
  // Vérifier si le point est trop proche des bords et ajuster
  let [lon, lat] = point;
  
  // Calculer la taille du polygone
  const width = maxLon - minLon;
  const height = maxLat - minLat;
  
  // Appliquer une marge proportionnelle (ex: 10% de la taille)
  const marginLon = width * margin;
  const marginLat = height * margin;
  
  // Ajuster si trop proche des bords
  if (lon - minLon < marginLon) lon = minLon + marginLon;
  if (maxLon - lon < marginLon) lon = maxLon - marginLon;
  if (lat - minLat < marginLat) lat = minLat + marginLat;
  if (maxLat - lat < marginLat) lat = maxLat - marginLat;
  
  return [lon, lat];
};