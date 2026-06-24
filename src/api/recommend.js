import  api from "./interceptor";
import * as config from "../config/config"

export const getAllRecommendation = async (filterBy) => {
  
  try{
    if (filterBy){
      let urlRec = config.REACT_APP_ENDPOINT_SEASONAL_RECOMMEND
      if(filterBy!==null){
        const params = new URLSearchParams();
        params.append("sort_by",filterBy)

        urlRec = `${config.REACT_APP_ENDPOINT_SEASONAL_RECOMMEND}?${params.toString()}`
      }
      console.log("URL fetcher: ",urlRec)
      const response = await api.get(urlRec,{timeout:120000});
      return response.data
    }
    else{
      console.log("Endpoints not provided.")
      return null;
    }
  }
  catch(error){
    console.log("Error raised on fetching of recommendation.")
    console.log(`Error : ${error}`)
  }
};