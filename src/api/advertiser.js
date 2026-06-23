

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
export async function get_liste_advertisers(startDate = null, endDate = null, country = null) {
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
if(country){
  console.log("Filtre par country initialisé...")
  console.log("Country séléctionné : ",country)
}
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
    if (country && country != null) {
    params.append("country", country)
  }

  // ── URL FINALE ──
  const url = `${config.REACT_APP_ENDPOINT_ALL_ADVERTISERS}?${params.toString()}`;
  // const url = config.REACT_APP_ENDPOINT_ALL_ADVERTISERS;
  console.log("🔗 API URL:", url);

  const response = await api.get(url, {
    timeout: 120000,
  });

  return response.data;
}


export async function get_advertisers_detail(
  adv_id,
  tag_id,
  date_start,
  date_end,
  include_o_age,
  include_o_gender,
  include_o_isp
) {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => { setTimeout(() => resolve(mockDataDetail), 300); });
  }
  if (!tag_id || !date_start || !date_end){
    console.log("PathParams missing!!!")
    return null;
  }
  const params = new URLSearchParams({
    tag_id,
    date_start,
    date_end,
    include_o_age,
    include_o_gender,
    include_o_isp
  })
  const url = `${config.REACT_APP_ENDPOINT_ADVERTISER_DETAIL}${adv_id}?${params.toString()}`
  console.log("URL fetcher: ", url)
  const response = await api.get(url, { timeout: 120000 });
  return response.data;
}

export async function get_segment_name(database_id, segment_id) {
  if (!database_id) return null;

  const params = new URLSearchParams({
    database_id,
  });

  if (segment_id) {
    params.append("id_segment", segment_id);
  }

  const response = await api.get(
    `${config.REACT_APP_ENDPOINT_ALL_SEGMENT}?${params.toString()}`,
    { timeout: 120000 }
  );

  const data = response.data;
  const isvalid = Array.isArray(data) && data.length > 0
  if(isvalid && !segment_id)
  {   
    return data || null;
  }
  else if (isvalid) {
    return data[0].segment_name;
  }

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

export async function getTopAdvByTags (startDate, endDate) {
  if(!(startDate||endDate)){
        console.log("Mandatory fields missing, please check all fields.")
        return []
      }
  const date_start = startDate.format && startDate.format("YYYY-MM-DD")
  const date_end = endDate.format && endDate.format("YYYY-MM-DD")
  console.log("Date start : ", date_start)
  console.log("Date end  : ",date_end)
  const params = new URLSearchParams ({
    date_start,
    date_end,
  })
  const url = `${config.REACT_APP_ENDPOINT_ADV_BY_TAGS}?${params.toString()}`
  console.log("URL utiliser : ", url)
  try{
    const resp = await api.get(url,{timeout:120000})
  
    if (resp && resp!=null){
      return resp.data
    }
    else{
      console.warn("Tableau vide ou undefined retourner.")
      return []
    }
  }
  catch(error){
    console.log("Erreur lors du fetch des departements via tags: ",error)
  
  }
}