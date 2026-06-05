import {type ZoomPosition} from '../franceMap'



// Coordonnées centrales connues pour les petits départements
const SMALL_DEPT_ZOOM: Record<string, { coordinates: [number, number]; zoom: number }> = {
  "75": { coordinates: [2.347, 48.859], zoom: 8 },  // Paris
  "92": { coordinates: [2.253, 48.832], zoom: 8 },  // Hauts-de-Seine
  "93": { coordinates: [2.449, 48.909], zoom: 8 },  // Seine-Saint-Denis
  "94": { coordinates: [2.457, 48.777], zoom: 8 },  // Val-de-Marne
};


export function zoomToDepartment(
    code: string, 
    geographies: any[], 
    setPosition: React.Dispatch<React.SetStateAction<ZoomPosition>>) // <-- Changement ici) 
{
  // Cas spéciaux : petits départements parisiens
  if (SMALL_DEPT_ZOOM[code]) {
    setPosition(SMALL_DEPT_ZOOM[code]);
    return;
  }
  // Cas général : calculer le centroïde depuis la géographie
  const geo = geographies.find(g => g.properties.code === code);
  if (!geo) return;

  const coords = geo.geometry.coordinates;
  let allPoints: [number, number][] = [];

  const extractPoints = (rings: any) => {
    if (!rings) return;
    if (typeof rings[0] === 'number') {
      allPoints.push(rings as [number, number]);
    } else {
      rings.forEach((r: any) => extractPoints(r));
    }
  };
  extractPoints(coords);

  if (allPoints.length === 0) return;

  const lons = allPoints.map(p => p[0]);
  const lats = allPoints.map(p => p[1]);
  const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const spanLon = Math.max(...lons) - Math.min(...lons);
  const spanLat = Math.max(...lats) - Math.min(...lats);
  const span = Math.max(spanLon, spanLat);

  // Zoom inversement proportionnel à la taille du département
  const zoom = span < 0.5 ? 4 : span < 1 ? 3 : span < 2 ? 2 : 1.5;

  setPosition({ coordinates: [centerLon, centerLat], zoom });
}