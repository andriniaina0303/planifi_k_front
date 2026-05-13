
import axios from "axios";

/**
 * Instance Axios personnalisée avec intercepteurs
 * Gère l'authentification (tokens JWT) et les erreurs HTTP
 * Tous les appels API passent par cette instance
 */


// =======================
// AUTO-LOGOUT (2 heures d'inactivité)
// =======================
const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
let inactivityTimer = null;

/**
 * Déconnecte l'utilisateur et redirige vers /login
 */
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  clearTimeout(inactivityTimer);
  window.location.href = "/login";
}

/**
 * Réinitialise le timer d'inactivité.
 * À appeler à chaque action utilisateur (souris, clavier, requête API).
 */
export function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  // Ne démarre le timer que si l'utilisateur est connecté
  if (localStorage.getItem("access_token")) {
    inactivityTimer = setTimeout(() => {
      console.warn("Session expirée après 2 heures d'inactivité");
      logout();
    }, INACTIVITY_LIMIT);
  }
}


const api = axios.create({
  baseURL: "https://pl1.kontikimedia.com:9000",
  timeout: 30000,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
/**
 * Intercepteur de requête : ajoute automatiquement le token JWT à chaque requête
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Chaque appel API compte comme une activité
    resetInactivityTimer();
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// REFRESH TOKEN LOGIC
// =======================
// Flag pour éviter plusieurs refresh simultanés
let isRefreshing = false;

// File d'attente des requêtes en attente du nouveau token
let failedQueue = [];

/**
 * Résout ou rejette toutes les requêtes en attente
 * après qu'un refresh ait réussi ou échoué
 */
function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}


// =======================
// RESPONSE INTERCEPTOR
// =======================
/**
 * Intercepteur de réponse : valide et traite les réponses du serveur
 */
api.interceptors.response.use(
  (response) => {
    // Ignore les fichiers (PDF, Excel, etc.)
    if (response.config.responseType === "blob") {
      return response;
    }

    // Vérification : si le backend envoie authenticated=false
    if (response.data && typeof response.data === "object") {
      if (response.data.authenticated === false) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Non authentifié"));
      }
    }

    return response;
  },

  async (error) => {
    if (error.config?.responseType === "blob") return Promise.reject(error);

    const originalRequest = error.config;

    // ==============================
    // CAS 401 → tentative de refresh
    // ==============================
    if (error.response?.status === 401 && !originalRequest._retry) {
      // _retry = flag pour éviter une boucle infinie
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      // Pas de refresh token → logout direct
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      // Un refresh est déjà en cours → mettre la requête en file d'attente
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Appel direct axios (pas `api`) pour éviter de passer par l'intercepteur
        const response = await axios.post(
          "https://pl1.kontikimedia.com:9000/auth/refresh",
          { refresh_token: refreshToken }
        );

        const newAccessToken = response.data.access_token;

        // Sauvegarder le nouveau access_token
        localStorage.setItem("access_token", newAccessToken);

        // Si le backend retourne aussi un nouveau refresh_token, le mettre à jour
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }

        // Relancer toutes les requêtes en attente avec le nouveau token
        processQueue(null, newAccessToken);

        // Relancer la requête originale
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Le refresh a échoué (refresh_token expiré) → logout
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Autres erreurs HTTP
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 403:
          console.error("Accès refusé - permissions insuffisantes");
          break;
        case 404:
          console.error("Ressource introuvable sur le serveur");
          break;
        case 500:
          console.error("Erreur serveur (500)");
          break;
        default:
          console.error("Erreur HTTP :", status);
      }
    } else if (error.request) {
      console.error("Pas de réponse du serveur - vérifier la connexion");
    } else {
      console.error("Erreur Axios :", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;