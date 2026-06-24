import  api from "./interceptor";
import * as config from "../config/config"

export const getAllRecommendation = async (endpoints) => {
  
  try{
    if (endpoints){
      const urlRec = `${config.REACT_APP_ENDPOINT_SEASONAL_RECOMMEND}+${endpoints}`
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