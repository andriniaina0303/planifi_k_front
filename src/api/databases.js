import api from "./interceptor";
import * as config from "./../config/config";
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";
import { formatDate } from "../utils/Helpers";

/**
 * 🔥 SWITCH MODE DÉVELOPPEMENT
 * true = Utilise les données mockées (fichiers JSON statiques)
 * false = Utilise les appels API réels au backend
 */
const USE_MOCK = false;

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
export async function get_all_databases(startDate = null, endDate = null) {
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
  const url = `${config.REACT_APP_ENDPOINT_ALL_DATABASES}?${params.toString()}`;
  console.log("🔗 API URL:", url);

  const response = await api.get(url, {
    timeout: 120000,
  });

  return response.data;
}


export async function get_databases_detail(database_id) {
  if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => { setTimeout(() => resolve(mockDataDetail), 300); });
  }
  const response = await api.get(config.REACT_APP_ENDPOINT_DATABASE_DETAIL + database_id, { timeout: 120000 });
  return response.data;
}

// export async function get_segment_name(database_id, segment_id) {
//   if (!database_id || !segment_id) return null;
//   const response = await api.get(
//     `${config.REACT_APP_ENDPOINT_ALL_SEGMENT}?database_id=${database_id}&segment_id=${segment_id}`,
//     { timeout: 120000 }
//   );
//   const data = response.data;
//   if (Array.isArray(data) && data.length > 0) return data[0].segment_name;
//   return data?.segment_name ?? null;
// }


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
