

import api from "./interceptor";
import * as config from "./../config/config";
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";
import { formatDate } from "../utils/Helpers";

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
  // Convertir les objets dayjs en Date avant d'appeler formatDate
  let finalStartDate, finalEndDate;

if (startDate && endDate) {
  console.log("📅 Raw startDate:", startDate);
  console.log("📅 startDate.toDate():", startDate.toDate());
  finalStartDate = formatDate(startDate.toDate());
  finalEndDate = formatDate(endDate.toDate());
  console.log("📅 finalStartDate:", finalStartDate);
  console.log("📅 finalEndDate:", finalEndDate);
} else {
  // Utiliser les valeurs par défaut (90 jours)
  finalStartDate = formatDate(threeMonthsAgo);
  finalEndDate = formatDate(today);
  console.log("📅 Using defaults:", finalStartDate, "to", finalEndDate);
}

  // ── QUERY PARAMS ──
  const params = new URLSearchParams();

  params.append("date_start", finalStartDate);
  params.append("date_end", finalEndDate);

  // ── URL FINALE ──
  const url = `${config.REACT_APP_ENDPOINT_ALL_ADVERTISERS}?${params.toString()}`;
  console.log("🔗 API URL:", url);

  const response = await api.get(url, {
    timeout: 120000,
  });

  return response.data;
}


export async function get_advertisers_detail(adv_id) {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => { setTimeout(() => resolve(mockDataDetail), 300); });
  }
  const response = await api.get(config.REACT_APP_ENDPOINT_ADVERTISER_DETAIL + adv_id, { timeout: 120000 });
  return response.data;
}

export async function get_segment_name(database_id, segment_id) {
  if (!database_id || !segment_id) return null;
  const response = await api.get(
    `${config.REACT_APP_ENDPOINT_ALL_SEGMENT}?database_id=${database_id}&segment_id=${segment_id}`,
    { timeout: 120000 }
  );
  const data = response.data;
  if (Array.isArray(data) && data.length > 0) return data[0].segment_name;
  return data?.segment_name ?? null;
}

/**
 * Récupère le nom d'un annonceur depuis son ID
 * Utilise REACT_APP_ENDPOINT_ALL_ADVERTISERS avec cache interne
 *
 * @param {string|number} adv_id
 * @returns {Promise<string>} advertiser_name, ou String(adv_id) en fallback
 */
export async function get_advertiser_name(adv_id) {
  if (!adv_id) return String(adv_id ?? "");

  // Réutilise le cache mappingCache sous la clé "all_advertisers"
  let list = mappingCache["all_advertisers"];

  if (!list) {
    try {
      const response = await api.get(config.REACT_APP_ENDPOINT_ALL_ADVERTISERS, { timeout: 120000 });
      list = Array.isArray(response.data) ? response.data : [response.data];
      mappingCache["all_advertisers"] = list;
    } catch (error) {
      console.error("get_advertiser_name: fetch error", error);
      return String(adv_id);
    }
  }

  const found = list.find((a) => String(a.advertiser_id) === String(adv_id));
  return found?.advertiser_name || String(adv_id);
}

// ─── Cache global des mappings ────────────────────────────────────────────────
const mappingCache = {};

export async function getMappingData(endpoint, cacheKey) {
  if (mappingCache[cacheKey]) {
    console.log(`✅ Using cached ${cacheKey}`);
    return mappingCache[cacheKey];
  }
  try {
    console.log(`🔄 Fetching ${cacheKey} from API...`);
    const response = await api.get(config.REACT_APP_ENDPOINT_ALL_MAPPING + endpoint, { timeout: 120000 });
    const data = Array.isArray(response.data) ? response.data : [response.data];
    mappingCache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Erreur lors du fetch de ${cacheKey}:`, error);
    return [];
  }
}

export function getMappingValue(cacheKey, id, idKey, nameKey) {
  const data = mappingCache[cacheKey] || [];
  const item = data.find(d => d[idKey] === id);
  return item ? item[nameKey] : `ID: ${id}`;
}

export function getFullMapping(cacheKey) {
  return mappingCache[cacheKey] || [];
}

export function clearMappingCache(cacheKey = null) {
  if (cacheKey) {
    delete mappingCache[cacheKey];
  } else {
    Object.keys(mappingCache).forEach(key => delete mappingCache[key]);
  }
}