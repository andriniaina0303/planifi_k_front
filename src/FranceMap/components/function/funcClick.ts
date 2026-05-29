// Nouveau type pour clickData

type ClickStats = {
  clickers: number,       // ← ajoute ça
  taux_clickers:number,
  taux_openers:number,
  taux_unsubs:number,
}


// Mapping des départements vers leurs régions
const DEPARTMENT_TO_REGION: Record<string, string> = {
  // Île-de-France
  "75": "Île-de-France", "77": "Île-de-France", "78": "Île-de-France",
  "91": "Île-de-France", "92": "Île-de-France", "93": "Île-de-France",
  "94": "Île-de-France", "95": "Île-de-France",
  
  // Auvergne-Rhône-Alpes
  "01": "Auvergne-Rhône-Alpes", "03": "Auvergne-Rhône-Alpes", "07": "Auvergne-Rhône-Alpes",
  "15": "Auvergne-Rhône-Alpes", "26": "Auvergne-Rhône-Alpes", "38": "Auvergne-Rhône-Alpes",
  "42": "Auvergne-Rhône-Alpes", "43": "Auvergne-Rhône-Alpes", "63": "Auvergne-Rhône-Alpes",
  "69": "Auvergne-Rhône-Alpes", "73": "Auvergne-Rhône-Alpes", "74": "Auvergne-Rhône-Alpes",
  
  // Bourgogne-Franche-Comté
  "21": "Bourgogne-Franche-Comté", "25": "Bourgogne-Franche-Comté", "39": "Bourgogne-Franche-Comté",
  "58": "Bourgogne-Franche-Comté", "70": "Bourgogne-Franche-Comté", "71": "Bourgogne-Franche-Comté",
  "89": "Bourgogne-Franche-Comté", "90": "Bourgogne-Franche-Comté",
  
  // Bretagne
  "22": "Bretagne", "29": "Bretagne", "35": "Bretagne", "56": "Bretagne",
  
  // Centre-Val de Loire
  "18": "Centre-Val de Loire", "28": "Centre-Val de Loire", "36": "Centre-Val de Loire",
  "37": "Centre-Val de Loire", "41": "Centre-Val de Loire", "45": "Centre-Val de Loire",
  
  // Corse
  "2A": "Corse", "2B": "Corse",
  
  // Grand Est
  "08": "Grand Est", "10": "Grand Est", "51": "Grand Est", "52": "Grand Est",
  "54": "Grand Est", "55": "Grand Est", "57": "Grand Est", "67": "Grand Est",
  "68": "Grand Est", "88": "Grand Est",
  
  // Hauts-de-France
  "02": "Hauts-de-France", "59": "Hauts-de-France", "60": "Hauts-de-France",
  "62": "Hauts-de-France", "80": "Hauts-de-France",
  
  // Normandie
  "14": "Normandie", "27": "Normandie", "50": "Normandie",
  "61": "Normandie", "76": "Normandie",
  
  // Nouvelle-Aquitaine
  "16": "Nouvelle-Aquitaine", "17": "Nouvelle-Aquitaine", "19": "Nouvelle-Aquitaine",
  "23": "Nouvelle-Aquitaine", "24": "Nouvelle-Aquitaine", "33": "Nouvelle-Aquitaine",
  "40": "Nouvelle-Aquitaine", "47": "Nouvelle-Aquitaine", "64": "Nouvelle-Aquitaine",
  "79": "Nouvelle-Aquitaine", "86": "Nouvelle-Aquitaine", "87": "Nouvelle-Aquitaine",
  
  // Occitanie
  "09": "Occitanie", "11": "Occitanie", "12": "Occitanie", "30": "Occitanie",
  "31": "Occitanie", "32": "Occitanie", "34": "Occitanie", "46": "Occitanie",
  "48": "Occitanie", "65": "Occitanie", "66": "Occitanie", "81": "Occitanie", "82": "Occitanie",
  
  // Pays de la Loire
  "44": "Pays de la Loire", "49": "Pays de la Loire", "53": "Pays de la Loire",
  "72": "Pays de la Loire", "85": "Pays de la Loire",
  
  // Provence-Alpes-Côte d'Azur
  "04": "Provence-Alpes-Côte d'Azur", "05": "Provence-Alpes-Côte d'Azur", "06": "Provence-Alpes-Côte d'Azur",
  "13": "Provence-Alpes-Côte d'Azur", "83": "Provence-Alpes-Côte d'Azur", "84": "Provence-Alpes-Côte d'Azur",
  
  // DOM-TOM
  "971": "Guadeloupe", "972": "Martinique", "973": "Guyane",
  "974": "La Réunion", "976": "Mayotte"
};

const regions = [
  {
    name: "France Métropolitaine",
    scale: 1500,    
    center: [2.8, 44.5] as [number, number],
    width: 600,     
    height: 550,     
    filter: (code: string) => !['971', '972', '973', '974', '976'].includes(code)
  },
  {
    name: "Guadeloupe",
    scale: 1500,
    center: [-61.55, 16.25] as [number, number],
    width: 50,
    height: 50,
    filter: (code: string) => code === '971' || code === '01'
  },
  {
    name: "Martinique",
    scale: 1500,
    center: [-61.0, 14.65] as [number, number],
    width: 40,
    height: 40,
    filter: (code: string) => code === '972' || code === '02'
  },
  {
    name: "Guyane",
    scale: 250,
    center: [-53.0, 4.0] as [number, number],
    width: 50,
    height: 50,
    filter: (code: string) => code === '973' || code === '03'
  },
  {
    name: "La Réunion",
    scale: 1200,
    center: [55.5, -21.1] as [number, number],
    width: 40,
    height: 40,
    filter: (code: string) => code === '974' || code === '04'
  },
  {
    name: "Mayotte",
    scale: 3500,
    center: [45.15, -12.8] as [number, number],
    width: 50,
    height: 60,
    filter: (code: string) => code === '976' || code === '06'
  }
];

// Données de clics simulées (à remplacer par les vraies données)
// const clickData: Record<string, number> = {
//   "75": 250,  // Paris
//   "92": 300,  // Hauts-de-Seine
//   "93": 150,  // Seine-Saint-Denis
//   "94": 180,  // Val-de-Marne
//   "973": 120, // Guyane 
//   "69": 400,  // Rhône   
//   "13": 350,  // Bouches-du-Rhône
//   "33": 280,  // Gironde
// };

export const DataClicks = (global: any): Record<string, number> => {
  const analyseDep: Record<string, ClickStats> = global.analyse_dep;

  return Object.fromEntries(
    Object.entries(analyseDep).map(([code, data]) => [
      code,
      data.clickers    ])
  );
};





// Fonction pour obtenir les clics d'un département
const getClicksForDepartment = (clickData:Record<string, number>, deptCode: string): number => {
  return clickData[deptCode] || 0;
};


// Fonction pour parcourir un tableau d'objet et retourner le nbr de clicks et les cles pour chaque region
const getClicksByRegion = (TclicksRegion: Record<string, number>): number[] => {
  return Object.values(TclicksRegion).filter(val => val > 0);
}

// Fonction pour parcourir un tableau d'objet et retourner le nbr de clicks et les cles pour chaque region
const getLabelsByRegion = (TclicksRegion: Record<string, number>): string[] => {
  return Object.keys(TclicksRegion).filter(reg=> TclicksRegion[reg] > 0);
}


// Fonction pour obtenir les clics totaux d'une région
// const getClicksForRegion = (regionName: string): number => {
//   return Object.entries(DEPARTMENT_TO_REGION).reduce(
//     (sum, [deptCode, region]) =>
//       region === regionName
//         ? sum + getClicksForDepartment(deptCode)
//         : sum,
//     0
//   );
// };

export { getClicksForDepartment, getClicksByRegion, getLabelsByRegion, DEPARTMENT_TO_REGION, regions };