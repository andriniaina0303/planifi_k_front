import  api from "./interceptor"; 

export const getRecommendDatabases = async () => {
  const response = await api.get("/reporting/recommend/databases");
  return response.data;
};