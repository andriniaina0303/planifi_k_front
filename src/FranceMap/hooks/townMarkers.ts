
// Coordonnées géographiques [longitude, latitude] des villes cibles
// Format react-simple-maps : [longitude, latitude]

export interface TownMarker {
  code: string;       // Code INSEE de la commune
  nom: string;        // Nom de la ville
  coordinates: [number, number]; // [longitude, latitude]
  domTom?: boolean;   // Indique si la ville est en DOM-TOM
}

export const TOWN_MARKERS: TownMarker[] = [
  // --- France Métropolitaine ---
  { code: "75056", nom: "Paris",            coordinates: [2.3488,   48.8534] },
  { code: "69123", nom: "Lyon",             coordinates: [4.8357,   45.7640] },
  { code: "13055", nom: "Marseille",        coordinates: [5.3698,   43.2965] },
  { code: "31555", nom: "Toulouse",         coordinates: [1.4442,   43.6047] },
  { code: "06088", nom: "Nice",             coordinates: [7.2620,   43.7102] },
  { code: "59350", nom: "Lille",            coordinates: [3.0573,   50.6292] },
  { code: "33063", nom: "Bordeaux",         coordinates: [-0.5792,  44.8378] },
  { code: "44109", nom: "Nantes",           coordinates: [-1.5534,  47.2184] },
  { code: "67482", nom: "Strasbourg",       coordinates: [7.7521,   48.5734] },
  { code: "34172", nom: "Montpellier",      coordinates: [3.8767,   43.6119] },
  { code: "35238", nom: "Rennes",           coordinates: [-1.6778,  48.1173] },
  { code: "38185", nom: "Grenoble",         coordinates: [5.7245,   45.1885] },
  { code: "51454", nom: "Reims",            coordinates: [4.0317,   49.2628] },
  { code: "42218", nom: "Saint-Étienne",    coordinates: [4.3901,   45.4397] },
  { code: "83137", nom: "Toulon",           coordinates: [5.9282,   43.1258] },
  { code: "49007", nom: "Angers",           coordinates: [-0.5560,  47.4736] },
  { code: "21231", nom: "Dijon",            coordinates: [5.0415,   47.3220] },
  { code: "76351", nom: "Le Havre",         coordinates: [0.1079,   49.4938] },
  { code: "63113", nom: "Clermont-Ferrand", coordinates: [3.0863,   45.7797] },
  { code: "29019", nom: "Brest",            coordinates: [-4.4860,  48.3904] },

  //Corse
  { code: "2A004", nom: "Ajaccio", coordinates: [8.73864, 41.91923] },
  { code: "2B007", nom: "Bastia", coordinates: [9.4500, 42.7000] },


  // --- Guadeloupe (971) ---
  { code: "97101", nom: "Les Abymes",       coordinates: [-61.5061, 16.2638], domTom: true },
  { code: "97103", nom: "Baie-Mahault",     coordinates: [-61.5866, 16.2697], domTom: true },
  { code: "97113", nom: "Le Gosier",        coordinates: [-61.4970, 16.2011], domTom: true },

  // --- Martinique (972) ---
  { code: "97209", nom: "Fort-de-France",   coordinates: [-61.0589, 14.6037], domTom: true },
  { code: "97213", nom: "Le Lamentin",      coordinates: [-60.9989, 14.6122], domTom: true },
  { code: "97229", nom: "Schœlcher",        coordinates: [-61.0878, 14.6161], domTom: true },

  // --- Guyane (973) ---
  { code: "97302", nom: "Cayenne",          coordinates: [-52.3262, 4.9372],  domTom: true },
  { code: "97311", nom: "Saint-Laurent-du-Maroni", coordinates: [-54.0347, 5.4979], domTom: true },
  { code: "97304", nom: "Kourou",           coordinates: [-52.6454, 5.1550],  domTom: true },

  // --- La Réunion (974) ---
  { code: "97411", nom: "Saint-Denis",      coordinates: [55.4578, -20.8823], domTom: true },
  { code: "97416", nom: "Saint-Pierre",     coordinates: [55.4789, -21.3393], domTom: true },
  { code: "97415", nom: "Saint-Paul",       coordinates: [55.2682, -21.0067], domTom: true },

  // --- Mayotte (976) ---
  { code: "97611", nom: "Mamoudzou",        coordinates: [45.2290, -12.7806], domTom: true },
  { code: "97610", nom: "Koungou",          coordinates: [45.2103, -12.7330], domTom: true },
  { code: "97608", nom: "Dzaoudzi",         coordinates: [45.2713, -12.7878], domTom: true },
];

// récupérer les marqueurs pour une région DOM-TOM spécifique
// Basé sur le préfixe du code INSEE
export const getTownMarkersForRegion = (regionCode: string): TownMarker[] => {
  return TOWN_MARKERS.filter(town => town.code.startsWith(regionCode));
};

// récupérer uniquement les villes métropolitaines
export const getMetropolitanTownMarkers = (): TownMarker[] => {
  return TOWN_MARKERS.filter(town => !town.domTom);
};


// Données de clics simulées par ville (appel API backend)
// Format : { codeINSEE: nombreDeClics }
export const TOWN_CLICK_DATA: Record<string, number> = {
  "75056": 1240,  // Paris
  "69123": 580,   // Lyon
  "13055": 430,   // Marseille
  "31555": 310,   // Toulouse
  "06088": 280,   // Nice
  "59350": 195,   // Lille
  "33063": 175,   // Bordeaux
  "44109": 160,   // Nantes
  "67482": 140,   // Strasbourg
  "34172": 130,   // Montpellier
  "97209": 95,    // Fort-de-France
  "97101": 85,    // Les Abymes
  "97411": 75,    // Saint-Denis (La Réunion)
  "97302": 60,    // Cayenne
};

// Fonction pour récupérer les clics d'une ville
//  fetch(`/api/clicks/town/${townCode}`)
export const getClicksForTown = (townCode: string): number => {
  return TOWN_CLICK_DATA[townCode] || 0;
};


// Liste étendue pour la recherche (plus de villes que les marqueurs sur la carte)
export const ALL_TOWNS_LIST: TownMarker[] = [
  // Toutes les villes de TOWN_MARKERS +
  // Villes supplémentaires métropolitaines
  { code: "75056", nom: "Paris",              coordinates: [2.3488,   48.8534] },
  { code: "69123", nom: "Lyon",               coordinates: [4.8357,   45.7640] },
  { code: "13055", nom: "Marseille",          coordinates: [5.3698,   43.2965] },
  { code: "31555", nom: "Toulouse",           coordinates: [1.4442,   43.6047] },
  { code: "06088", nom: "Nice",               coordinates: [7.2620,   43.7102] },
  { code: "59350", nom: "Lille",              coordinates: [3.0573,   50.6292] },
  { code: "33063", nom: "Bordeaux",           coordinates: [-0.5792,  44.8378] },
  { code: "44109", nom: "Nantes",             coordinates: [-1.5534,  47.2184] },
  { code: "67482", nom: "Strasbourg",         coordinates: [7.7521,   48.5734] },
  { code: "34172", nom: "Montpellier",        coordinates: [3.8767,   43.6119] },
  { code: "35238", nom: "Rennes",             coordinates: [-1.6778,  48.1173] },
  { code: "38185", nom: "Grenoble",           coordinates: [5.7245,   45.1885] },
  { code: "51454", nom: "Reims",              coordinates: [4.0317,   49.2628] },
  { code: "42218", nom: "Saint-Étienne",      coordinates: [4.3901,   45.4397] },
  { code: "83137", nom: "Toulon",             coordinates: [5.9282,   43.1258] },
  { code: "49007", nom: "Angers",             coordinates: [-0.5560,  47.4736] },
  { code: "21231", nom: "Dijon",              coordinates: [5.0415,   47.3220] },
  { code: "76351", nom: "Le Havre",           coordinates: [0.1079,   49.4938] },
  { code: "63113", nom: "Clermont-Ferrand",   coordinates: [3.0863,   45.7797] },
  { code: "29019", nom: "Brest",              coordinates: [-4.4860,  48.3904] },
  { code: "2A004", nom: "Ajaccio",            coordinates: [8.73864,  41.91923] },
  { code: "2B007", nom: "Bastia",             coordinates: [9.4500,   42.7000] },
  // Villes supplémentaires
  { code: "80021", nom: "Amiens",             coordinates: [2.2957,   49.8942] },
  { code: "14118", nom: "Caen",               coordinates: [-0.3583,  49.1829] },
  { code: "57463", nom: "Metz",               coordinates: [6.1757,   49.1193] },
  { code: "54395", nom: "Nancy",              coordinates: [6.1844,   48.6921] },
  { code: "25056", nom: "Besançon",           coordinates: [6.0227,   47.2380] },
  { code: "68224", nom: "Mulhouse",           coordinates: [7.3389,   47.7508] },
  { code: "45234", nom: "Orléans",            coordinates: [1.9039,   47.9029] },
  { code: "37261", nom: "Tours",              coordinates: [0.6848,   47.3941] },
  { code: "86194", nom: "Poitiers",           coordinates: [0.3404,   46.5802] },
  { code: "87085", nom: "Limoges",            coordinates: [1.2611,   45.8315] },
  { code: "64445", nom: "Pau",                coordinates: [-0.3701,  43.2951] },
  { code: "34057", nom: "Béziers",            coordinates: [3.2150,   43.3443] },
  { code: "11069", nom: "Carcassonne",        coordinates: [2.3536,   43.2130] },
  { code: "30189", nom: "Nîmes",              coordinates: [4.3600,   43.8367] },
  { code: "84007", nom: "Avignon",            coordinates: [4.8055,   43.9493] },
  { code: "13004", nom: "Aix-en-Provence",    coordinates: [5.4474,   43.5297] },
  { code: "06029", nom: "Cannes",             coordinates: [7.0122,   43.5528] },
  { code: "06027", nom: "Antibes",            coordinates: [7.1253,   43.5804] },
  { code: "74010", nom: "Annecy",             coordinates: [6.1294,   45.8993] },
  { code: "73065", nom: "Chambéry",           coordinates: [5.9167,   45.5646] },
  { code: "01053", nom: "Bourg-en-Bresse",    coordinates: [5.2286,   46.2050] },
  { code: "29232", nom: "Quimper",            coordinates: [-4.1000,  47.9973] },
  { code: "56260", nom: "Vannes",             coordinates: [-2.7604,  47.6587] },
  { code: "22278", nom: "Saint-Brieuc",       coordinates: [-2.7653,  48.5143] },
  { code: "53130", nom: "Laval",              coordinates: [-0.7668,  48.0748] },
  { code: "72181", nom: "Le Mans",            coordinates: [0.1996,   48.0061] },
  { code: "85191", nom: "La Roche-sur-Yon",   coordinates: [-1.4260,  46.6707] },
  { code: "17300", nom: "La Rochelle",        coordinates: [-1.1520,  46.1603] },
  { code: "16015", nom: "Angoulême",          coordinates: [0.1560,   45.6498] },
  { code: "40192", nom: "Mont-de-Marsan",     coordinates: [-0.5000,  43.8900] },
  { code: "47091", nom: "Agen",               coordinates: [0.6210,   44.2009] },
  { code: "32013", nom: "Auch",               coordinates: [0.5860,   43.6461] },
  { code: "12202", nom: "Rodez",              coordinates: [2.5749,   44.3518] },
  { code: "46042", nom: "Cahors",             coordinates: [1.4384,   44.4481] },
  { code: "82121", nom: "Montauban",          coordinates: [1.3528,   44.0170] },
  { code: "09122", nom: "Foix",               coordinates: [1.6053,   42.9635] },
  { code: "65440", nom: "Tarbes",             coordinates: [0.0781,   43.2328] },
  { code: "66136", nom: "Perpignan",          coordinates: [2.8954,   42.6887] },
  { code: "81004", nom: "Albi",               coordinates: [2.1489,   43.9265] },
  { code: "48095", nom: "Mende",              coordinates: [3.5001,   44.5196] },
  { code: "05061", nom: "Gap",                coordinates: [6.0825,   44.5596] },
  { code: "04070", nom: "Digne-les-Bains",    coordinates: [6.2360,   44.0919] },
  { code: "2A247", nom: "Sartène",            coordinates: [8.9756,   41.6242] },
  { code: "10387", nom: "Troyes",             coordinates: [4.0754,   48.2974] },
  { code: "89024", nom: "Auxerre",            coordinates: [3.5674,   47.7980] },
  { code: "58194", nom: "Nevers",             coordinates: [3.1572,   46.9899] },
  { code: "71270", nom: "Mâcon",              coordinates: [4.8277,   46.3065] },
  { code: "39300", nom: "Lons-le-Saunier",    coordinates: [5.5542,   46.6745] },
  { code: "70550", nom: "Vesoul",             coordinates: [6.1536,   47.6228] },
  { code: "90010", nom: "Belfort",            coordinates: [6.8634,   47.6382] },
  { code: "08105", nom: "Charleville-Mézières", coordinates: [4.7161, 49.7698] },
  { code: "52121", nom: "Chaumont",           coordinates: [5.1386,   48.1116] },
  { code: "55029", nom: "Bar-le-Duc",         coordinates: [5.1597,   48.7731] },
  { code: "88160", nom: "Épinal",             coordinates: [6.4500,   48.1800] },
  { code: "02408", nom: "Laon",               coordinates: [3.6239,   49.5640] },
  { code: "60057", nom: "Beauvais",           coordinates: [2.0833,   49.4167] },
  { code: "62041", nom: "Arras",              coordinates: [2.7752,   50.2919] },
  { code: "27229", nom: "Évreux",             coordinates: [1.1503,   49.0238] },
  { code: "50502", nom: "Saint-Lô",           coordinates: [-1.0908,  49.1148] },
  { code: "61001", nom: "Alençon",            coordinates: [0.0826,   48.4332] },
  { code: "76540", nom: "Rouen",              coordinates: [1.0993,   49.4432] },
  // DOM-TOM supplémentaires
  { code: "97101", nom: "Les Abymes",         coordinates: [-61.5061, 16.2638], domTom: true },
  { code: "97103", nom: "Baie-Mahault",       coordinates: [-61.5866, 16.2697], domTom: true },
  { code: "97113", nom: "Le Gosier",          coordinates: [-61.4970, 16.2011], domTom: true },
  { code: "97105", nom: "Capesterre-Belle-Eau", coordinates: [-61.5630, 15.9170], domTom: true },
  { code: "97209", nom: "Fort-de-France",     coordinates: [-61.0589, 14.6037], domTom: true },
  { code: "97213", nom: "Le Lamentin",        coordinates: [-60.9989, 14.6122], domTom: true },
  { code: "97229", nom: "Schoelcher",         coordinates: [-61.0878, 14.6161], domTom: true },
  { code: "97225", nom: "Le Robert",          coordinates: [-60.9300, 14.7100], domTom: true },
  { code: "97302", nom: "Cayenne",            coordinates: [-52.3262, 4.9372],  domTom: true },
  { code: "97311", nom: "Saint-Laurent-du-Maroni", coordinates: [-54.0347, 5.4979], domTom: true },
  { code: "97304", nom: "Kourou",             coordinates: [-52.6454, 5.1550],  domTom: true },
  { code: "97307", nom: "Matoury",            coordinates: [-52.3279, 4.8563],  domTom: true },
  { code: "97411", nom: "Saint-Denis",        coordinates: [55.4578, -20.8823], domTom: true },
  { code: "97416", nom: "Saint-Pierre",       coordinates: [55.4789, -21.3393], domTom: true },
  { code: "97415", nom: "Saint-Paul",         coordinates: [55.2682, -21.0067], domTom: true },
  { code: "97408", nom: "Le Tampon",          coordinates: [55.5300, -21.2667], domTom: true },
  { code: "97419", nom: "Sainte-Suzanne",     coordinates: [55.6050, -20.9030], domTom: true },
  { code: "97611", nom: "Mamoudzou",          coordinates: [45.2290, -12.7806], domTom: true },
  { code: "97610", nom: "Koungou",            coordinates: [45.2103, -12.7330], domTom: true },
  { code: "97608", nom: "Dzaoudzi",           coordinates: [45.2713, -12.7878], domTom: true },
  { code: "97617", nom: "Bandraboua",         coordinates: [45.1280, -12.7070], domTom: true },
];

//recherche dans la liste de villes
export const searchTowns = (query: string): TownMarker[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_TOWNS_LIST.filter(
    t => t.nom.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
  ).slice(0, 10);
};