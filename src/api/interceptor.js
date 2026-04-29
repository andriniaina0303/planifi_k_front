import axios from "axios";

/**
 * Instance Axios personnalisée avec intercepteurs
 * Gère l'authentification (tokens JWT) et les erreurs HTTP
 * Tous les appels API passent par cette instance
 */
const api = axios.create({
  timeout: 30000,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
/**
 * Intercepteur de requête : ajoute automatiquement le token JWT à chaque requête
 * Récupère le token du localStorage et l'ajoute au header Authorization
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Si un token existe, l'ajouter à tous les headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
/**
 * Intercepteur de réponse : valide et traite les réponses du serveur
 * Gère l'authentification, les erreurs HTTP et les téléchargements de fichiers
 */
api.interceptors.response.use(
  (response) => {
    // 🔥 Ignore les fichiers (PDF, Excel, etc.) - retour direct sans vérification
    if (response.config.responseType === "blob") {
      return response;
    }

    // 🔥 Vérification de sécurité : si le backend envoie authenticated=false
    if (response.data && typeof response.data === "object") {
      // ⚠️ Ton backend semble envoyer "authenticated" comme indicateur
      if (response.data.authenticated === false) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return Promise.reject(new Error("Non authentifié"));
      }
    }

    return response;
  },

  (error) => {
    // 🔥 Ignore les erreurs liées aux downloads de fichiers
    if (error.config?.responseType === "blob") {
      return Promise.reject(error);
    }

    // =======================
    // GESTION ERREURS HTTP
    // =======================

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // 🔐 Token expiré, invalide ou absent
          console.error("Token expiré - redirection vers login");
          localStorage.removeItem("token");
          window.location.href = "/";
          break;

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