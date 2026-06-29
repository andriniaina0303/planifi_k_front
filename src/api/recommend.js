import  api from "./interceptor";
import * as config from "../config/config"

export const getAllRecommendation = async (filterBy,country) => {
  if (!(filterBy || country)){
    console.error("Fields missing on call request.")
    return []
  }
  try{
      const params = new URLSearchParams();
      if (filterBy !== null){
        params.append("sort_by",filterBy)
      }
      if (country && country!==null){
      params.append("country",country)
    }
      const urlRec = `${config.REACT_APP_ENDPOINT_SEASONAL_RECOMMEND}?${params.toString()}`
      console.log("URL fetcher: ",urlRec)
      const response = await api.get(urlRec,{timeout:120000});
      console.log("Contenu de Recommandation : ",response.data)
      return response.data
    }
  catch(error){
    console.log("Error raised on fetching of recommendation.")
    console.log(`Error : ${error}`)
  }
};