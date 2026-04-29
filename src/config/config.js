/**
 * Configuration centralisée des endpoints API
 * Point d'entrée principal pour toutes les requêtes backend
 * À modifier si le serveur change d'adresse ou de port
 */
const REACT_APP_ENDPOINT = "http://127.0.0.1:8000"

// ================= ENDPOINTS ADVERTISING =================
/** Récupère la liste complète de tous les annonceurs (advertisers) */
export const REACT_APP_ENDPOINT_ALL_ADVERTISERS = REACT_APP_ENDPOINT + '/reporting/all_advertisers'

/** Récupère les détails complets d'un annonceur spécifique par son ID */
export const REACT_APP_ENDPOINT_ADVERTISER_DETAIL = REACT_APP_ENDPOINT + '/reporting/advertiser/'

// ================= ENDPOINTS DATABASES & SEGMENTS =================
/** Récupère la liste complète des bases de données disponibles */
export const REACT_APP_ENDPOINT_ALL_DATABASES = REACT_APP_ENDPOINT + '/database'

/** Récupère les segments disponibles pour filtrer/segmenter les données */
export const REACT_APP_ENDPOINT_ALL_SEGMENT = REACT_APP_ENDPOINT + '/segment'