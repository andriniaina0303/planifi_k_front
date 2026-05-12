

import api from "./interceptor";
import * as config from "./../config/config";

import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";

const USE_MOCK = false;


export async function get_liste_advertisers({ date_start = null, date_end = null } = {}) {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 300);
    });
  }

    // Construction des query params — on n'envoie que les valeurs renseignées
  const params = {};
  if (date_start) params.date_start = date_start;
  if (date_end)   params.date_end   = date_end;
 
  const response = await api.get(config.REACT_APP_ENDPOINT_ALL_ADVERTISERS, {
    timeout: 120000,
    params,
  });
  return response.data;
}

// export async function get_liste_advertisers() {
//   if (USE_MOCK) {
//     console.log("⚡ Using MOCK data");
//     return new Promise((resolve) => { setTimeout(() => resolve(mockData), 300); });
//   }
//   const response = await api.get(config.REACT_APP_ENDPOINT_ALL_ADVERTISERS, { timeout: 120000 });
//   return response.data;
// }

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