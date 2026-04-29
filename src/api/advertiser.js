
import api from "./interceptor";
import * as config from "./../config/config";

// 👇 IMPORT MOCK - pour développement sans backend
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";

/**
 * 🔥 SWITCH MODE DÉVELOPPEMENT
 * true = Utilise les données mockées (fichiers JSON statiques)
 * false = Utilise les appels API réels au backend
 */
const USE_MOCK = true;

/**
 * Récupère la liste complète de tous les annonceurs
 * 
 * @async
 * @returns {Promise<Array>} Liste d'annonceurs avec leurs métriques globales
 * @description
 *   - En mode MOCK : retourne les données du fichier all_advertiser.json
 *   - En mode PROD : appel GET /reporting/all_advertisers avec timeout 120s
 */
export async function get_liste_advertisers() {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 300);
    });
  }
  const response = await api.get(
    config.REACT_APP_ENDPOINT_ALL_ADVERTISERS,
    { timeout: 120000 }
  );
  return response.data;
}

/**
 * Récupère les détails complets d'un annonceur spécifique
 * 
 * @async
 * @param {number|string} adv_id - ID unique de l'annonceur
 * @returns {Promise<Object>} Détails complets incluant globales, bases, dimensions
 * @description
 *   - En mode MOCK : retourne les données du fichier adv_detail.json
 *   - En mode PROD : appel GET /reporting/advertiser/{adv_id} avec timeout 120s
 *   - Contient : métriques globales, bases associées, taux d'ouverture/clic, etc.
 */
export async function get_advertisers_detail(adv_id) {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDataDetail), 300);
    });
  }
  const response = await api.get(
    config.REACT_APP_ENDPOINT_ADVERTISER_DETAIL + adv_id,
    { timeout: 120000 }
  );
  return response.data;
}