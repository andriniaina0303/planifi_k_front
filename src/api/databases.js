import api from "./interceptor";
import * as config from "./../config/config";
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";

/**
 * 🔥 SWITCH MODE DÉVELOPPEMENT
 * true = Utilise les données mockées (fichiers JSON statiques)
 * false = Utilise les appels API réels au backend
 */
const USE_MOCK = true;

// ================= CACHE CONFIGURATION =================
/** Clé pour stocker les bases de données en cache localStorage */
const CACHE_DATBASE_KEY = "all_databases";

/** Durée de validité du cache : 1 heure (en millisecondes) */
const CACHE_TTL = 1000 * 60 * 60;

/**
 * Récupère la liste complète des bases de données avec gestion du cache
 * 
 * @async
 * @param {boolean} forceRefresh - Si true, ignore le cache et force un appel API
 * @returns {Promise<Array>} Liste des bases de données disponibles
 * @description
 *   1. Vérifie si mode MOCK est activé → retourne données mockées
 *   2. Vérifie le cache localStorage → retourne si valide
 *   3. Appel API GET /database si cache expiré
 *   4. Sauvegarde les données en cache avec timestamp
 *   5. En cas d'erreur : retourne le cache expiré (fallback)
 */
export async function get_all_databases(forceRefresh = false) {
  try {
      // Mode développement : données mockées
      if (USE_MOCK) {
        console.log("⚡ Using MOCK data");
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockData), 300);
        });
      }

      // Vérifier le cache locale
      const cached = localStorage.getItem(CACHE_DATBASE_KEY);
      if (!forceRefresh && cached) {
        const { data, timestamp } = JSON.parse(cached);
        
        // ✅ Cache encore valide (moins de 1h)
        if (Date.now() - timestamp < CACHE_TTL) {
          console.log("✅ Cache valide - données renvoyées du cache");
          return data;
        }
      }

      // ❌ Cache expiré ou vide → faire l'appel API
      console.log("📡 Appel API pour récupérer les bases de données");
      const response = await api.get(
        config.REACT_APP_ENDPOINT_ALL_DATABASES,
        { timeout: 120000 }
      );
      const data = response.data;

      // 💾 Sauvegarder en cache avec timestamp
      localStorage.setItem(
        CACHE_DATBASE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      return data;
  } catch (error) {
    console.error("❌ Erreur get_all_databases:", error);
    
    // 🔁 Fallback : retourner le cache même expiré si disponible
    const cached = localStorage.getItem(CACHE_DATBASE_KEY);
    if (cached) {
      console.warn("⚠️ Cache expiré retourné en fallback");
      return JSON.parse(cached).data;
    }
    
    throw error;
  }
}

/**
 * Récupère tous les segments disponibles pour filtrer les données
 * 
 * @async
 * @returns {Promise<Array>} Liste des segments disponibles
 * @description
 *   Appel GET /segment pour récupérer les critères de segmentation
 *   (genres, tranches d'âge, FAI, CSP, etc.)
 */
export async function get_all_SEGMENT() {
  try {
    console.log("📡 Appel API pour récupérer les segments");
    const response = await api.get(
      config.REACT_APP_ENDPOINT_ALL_DATABASES,
      { timeout: 120000 }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("❌ Erreur get_all_SEGMENT:", error);
  }
}