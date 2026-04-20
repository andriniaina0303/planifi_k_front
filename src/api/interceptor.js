import axios from "axios";

// Instance Axios
const api = axios.create({
  timeout: 30000,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
api.interceptors.response.use(
  (response) => {
    // 🔥 IMPORTANT : ignorer les fichiers (PDF, Excel, etc.)
    if (response.config.responseType === "blob") {
      return response;
    }

    // 🔥 Sécurité : vérifier structure JSON
    if (response.data && typeof response.data === "object") {
      // ⚠️ ton backend semble envoyer "authenticated"
      if (response.data.authenticated === false) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return Promise.reject(new Error("Non authentifié"));
      }
    }

    return response;
  },

  (error) => {
    // 🔥 IMPORTANT : ignorer les erreurs liées aux downloads
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
          // 🔐 Token expiré ou invalide
          localStorage.removeItem("token");
          window.location.href = "/";
          break;

        case 403:
          console.error("Accès refusé");
          break;

        case 404:
          console.error("Ressource introuvable");
          break;

        case 500:
          console.error("Erreur serveur");
          break;

        default:
          console.error("Erreur HTTP :", status);
      }
    } else if (error.request) {
      console.error("Pas de réponse du serveur");
    } else {
      console.error("Erreur Axios :", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;