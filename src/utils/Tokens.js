/**
 * Design Tokens - Variables de style centralisées
 * Utilisées partout dans l'appli pour une cohérence visuelle
 * Modifier ici les couleurs/ombres affecte tout le projet
 */
export const tokens = {
  // Couleurs de base
  bg: "#f0f2f5",                                          // Fond de page grise clair
  cardBg: "#ffffff",                                      // Fond des cartes blanc
  cardRadius: 16,                                         // Border-radius des composants
  
  // Dégradés
  headerGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",  // Header violet → rose
  
  // Palette sémantique
  primary: "#4f46e5",                                     // Bleu : action principale
  success: "#10b981",                                     // Vert : succès/positif
  warning: "#f59e0b",                                     // Jaune/Orange : attention
  danger: "#ef4444",                                      // Rouge : erreur/critique
  info: "#3b82f6",                                        // Bleu clair : information
  
  // Couleurs supplémentaires pour variété
  purple: "#8b5cf6",                                      // Violet
  cyan: "#06b6d4",                                        // Cyan
  pink: "#ec4899",                                        // Rose
  orange: "#f97316",                                      // Orange
  
  // Ombres pour profondeur
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.03)",
  shadowLg: "0 10px 25px rgba(0,0,0,0.08)",
};