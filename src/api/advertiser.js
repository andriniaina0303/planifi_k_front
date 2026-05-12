
import api from "./interceptor";
import * as config from "./../config/config";

// 👇 IMPORT MOCK - pour développement sans backend
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";
import { formatDate } from "../utils/Helpers";

/**
 * 🔥 SWITCH MODE DÉVELOPPEMENT
 * true = Utilise les données mockées (fichiers JSON statiques)
 * false = Utilise les appels API réels au backend
 */
const USE_MOCK = false;

/**
 * Récupère la liste complète de tous les annonceurs
 * 
 * @async
 * @returns {Promise<Array>} Liste d'annonceurs avec leurs métriques globales
 * @description
 *   - En mode MOCK : retourne les données du fichier all_advertiser.json
 *   - En mode PROD : appel GET /reporting/all_advertisers avec timeout 120s
 */
export async function get_liste_advertisers(startDate = null, endDate = null) {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 300);
    });
  }

  // ── DATE DU JOUR ──
  const today = new Date();

  // ── AUJOURD'HUI - 3 MOIS ──
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  // ── VALEURS PAR DÉFAUT ──
  const finalStartDate = startDate || formatDate(threeMonthsAgo);
  const finalEndDate = endDate || formatDate(today);

  // ── QUERY PARAMS ──
  const params = new URLSearchParams();

  params.append("start_date", finalStartDate);
  params.append("end_date", finalEndDate);

  // ── URL FINALE ──
  const url = `${config.REACT_APP_ENDPOINT_ALL_ADVERTISERS}?${params.toString()}`;

  const response = await api.get(url, {
    timeout: 120000,
  });

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

export async function get_segment_name(database_id, segment_id) {
  if (!database_id || !segment_id) {
    return null;
  }

  const response = await api.get(
    `${config.REACT_APP_ENDPOINT_ALL_SEGMENT}?database_id=${database_id}&segment_id=${segment_id}`,
    { timeout: 120000 }
  );

  const data = response.data;

  // Si c'est un array, retourne le premier élément
  if (Array.isArray(data) && data.length > 0) {
    return data[0].segment_name;
  }
  
  // Sinon si c'est un objet, retourne segment_name
  return data?.segment_name ?? null;
}


/**
 * Cache global pour stocker les mappings
 * Structure: { "tags": {...}, "agences": {...}, "databases": {...} }
 */
const mappingCache = {};

/**
 * Récupère et cache les données COMPLÈTES d'une API
 * Retourne l'array brut pour que tu fasses ton mapping toi-même
 * 
 * @param {string} endpoint - URL de l'API
 * @param {string} cacheKey - Clé unique pour le cache
 * @returns {Promise<Array>} Array des objets bruts de l'API
 */
export async function getMappingData(endpoint, cacheKey) {
  // Si déjà en cache, retourner immédiatement
  if (mappingCache[cacheKey]) {
    console.log(`✅ Using cached ${cacheKey}`);
    return mappingCache[cacheKey];
  }

  try {
    console.log(`🔄 Fetching ${cacheKey} from API...`);
    
    const response = await api.get( config.REACT_APP_ENDPOINT_ALL_MAPPING+endpoint, { timeout: 120000 });
    const data = Array.isArray(response.data) ? response.data : [response.data];

    // Stocker le array COMPLET en cache
    mappingCache[cacheKey] = data;
    console.log(`✨ Cached ${cacheKey}:`, data);

    return data;
  } catch (error) {
    console.error(`Erreur lors du fetch de ${cacheKey}:`, error);
    return [];
  }
}

/**
 * Récupère une valeur du mapping
 * @param {string} cacheKey - Clé du cache
 * @param {number|string} id - L'ID à chercher
 * @param {string} idKey - Clé de l'ID (ex: "tag_id")
 * @param {string} nameKey - Clé du nom (ex: "tag_name")
 * @returns {string} Le nom ou "ID: {id}"
 */
export function getMappingValue(cacheKey, id, idKey, nameKey) {
  const data = mappingCache[cacheKey] || [];
  const item = data.find(d => d[idKey] === id);
  return item ? item[nameKey] : `ID: ${id}`;
}

/**
 * Récupère toutes les données en cache
 */
export function getFullMapping(cacheKey) {
  return mappingCache[cacheKey] || [];
}

/**
 * Efface le cache (utile pour rafraîchir les données)
 * 
 * @param {string} cacheKey - Clé à effacer, ou null pour tout effacer
 */
export function clearMappingCache(cacheKey = null) {
  if (cacheKey) {
    delete mappingCache[cacheKey];
    console.log(`🗑️ Cleared cache for ${cacheKey}`);
  } else {
    Object.keys(mappingCache).forEach(key => delete mappingCache[key]);
    console.log(`🗑️ Cleared all mapping caches`);
  }
}