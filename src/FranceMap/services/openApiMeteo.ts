
// Appel API pour récupérer la température avec gestion du rate limiting

/**
 * Récupère la température pour des coordonnées GPS données
 * @param lat Latitude
 * @param lon Longitude
 * @param retries Nombre de tentatives en cas d'échec (par défaut 3)
 * @returns La température en °C
 */
export default async function fetchTemperature(
  lat: number, 
  lon: number,
  retries = 3
): Promise<number> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&elevation=200&current_weather=true&models=meteofrance_seamless&timezone=Europe/Paris`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      
      // ✅ Gérer spécifiquement le code 429 (Too Many Requests)
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : (attempt + 1) * 2000;
        
        console.warn(`⚠️ Rate limit atteint pour lat:${lat}, lon:${lon}. Nouvelle tentative dans ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue; // Réessayer
      }

      // Vérifier si la réponse est OK
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Vérifier que les données sont valides
      if (!data.current_weather || data.current_weather.temperature === undefined) {
        throw new Error("Données de température manquantes");
      }

      return data.current_weather.temperature;
      
    } catch (error) {
      // Si c'est la dernière tentative, logger l'erreur
      if (attempt === retries - 1) {
        console.error(`❌ Échec définitif pour lat:${lat}, lon:${lon}`, error);
        return 15; // Température par défaut en cas d'échec total
      }
      
      // Attendre avant de réessayer (backoff exponentiel)
      const waitTime = (attempt + 1) * 1000;
      console.warn(`⚠️ Tentative ${attempt + 1}/${retries} échouée. Nouvelle tentative dans ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // Fallback au cas où (ne devrait jamais arriver)
  return 15;
}
