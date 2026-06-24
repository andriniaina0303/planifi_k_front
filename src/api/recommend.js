
import api from "./interceptor";

export const getRecommendDatabases = async () => {
  const response = await api.get("/reporting/recommend/databases");
  return response.data;
};

export const getRecommendAdvertisers = async () => {
  const response = await api.get("/reporting/recommend/advertisers");
  return response.data;
};

export const getRecommendTags = async () => {
  const response = await api.get("/reporting/recommend/tags");
  return response.data;
};