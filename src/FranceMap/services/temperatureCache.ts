
// Cache pour stocker les températures et éviter trop d'appels API

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes en millisecondes

interface CacheEntry {
  data: Record<string, number>;
  timestamp: number;
}

class TemperatureCache {
  private cache: CacheEntry | null = null;

  /**
   * Récupère les données du cache si elles sont encore valides
   * @returns Les données en cache ou null si expirées/inexistantes
   */
  get(): Record<string, number> | null {
    if (!this.cache) return null;
    
    const now = Date.now();
    const isExpired = now - this.cache.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      console.log("🕐 Cache expiré, rechargement nécessaire");
      this.cache = null;
      return null;
    }
    
    console.log("✅ Données récupérées depuis le cache");
    return this.cache.data;
  }

  /**
   * Sauvegarde les données dans le cache
   * @param data Les températures à mettre en cache
   */
  set(data: Record<string, number>): void {
    this.cache = {
      data,
      timestamp: Date.now()
    };
    console.log("💾 Données sauvegardées dans le cache");
  }

  /**
   * Efface le cache (utile pour forcer un rechargement)
   */
  clear(): void {
    this.cache = null;
    console.log("🗑️ Cache effacé");
  }
}

export const temperatureCache = new TemperatureCache();
