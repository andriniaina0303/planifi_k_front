import api from "./interceptor";
import * as config from "./../config/config";
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";


const USE_MOCK = true; // 🔥 switch ici

const CACHE_DATBASE_KEY = "all_databases";

const CACHE_TTL = 1000 * 60 * 60; // 1 heure

export async function get_all_databases(forceRefresh = false) {
  try {
      if (USE_MOCK) {
    console.log("⚡ Using MOCK data");
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 300);
    });
  }
    const cached = localStorage.getItem(CACHE_DATBASE_KEY);
    if (!forceRefresh && cached) {
      const { data, timestamp } = JSON.parse(cached);
      // ✅ cache encore valide
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
    // ❌ sinon on fetch
    const response = await api.get(
      config.REACT_APP_ENDPOINT_ALL_DATABASES,
      { timeout: 120000 }
    );
    const data = response.data;
    // 💾 on met en cache
    localStorage.setItem(
      CACHE_DATBASE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    return data;
  } catch (error) {
    console.error("Erreur get_all_databases:", error);
    // 🔁 fallback : retourner le cache même expiré si dispo
    const cached = localStorage.getItem(CACHE_DATBASE_KEY);
    if (cached) {
      return JSON.parse(cached).data;
    }
    throw error;
  }
}

export async function get_all_SEGMENT() {
  try {
    const response = await api.get(
      config.REACT_APP_ENDPOINT_ALL_DATABASES,
      { timeout: 120000 }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error)
  }
}