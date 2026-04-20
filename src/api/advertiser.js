

import api from "./interceptor";
import * as config from "./../config/config";

// 👇 IMPORT MOCK
import mockData from "../temp/all_advertiser.json";
import mockDataDetail from "../temp/adv_detail.json";


const USE_MOCK = false; // 🔥 switch ici

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