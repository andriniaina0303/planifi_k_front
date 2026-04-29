/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UTILS.JSX - Utilitaires de décodage de texte
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Fonctions pour corriger les problèmes d'encodage de caractères :
 * - Fixe les caractères UTF-8 mal encodés (mojibake)
 * - Décode les chaînes Base64
 * - Gère les erreurs de conversion gracieusement
 */

/**
 * Corrige les caractères mal encodés (mojibake)
 * Convertit les séquences d'octets mal interprétées en caractères corrects
 * 
 * @param {string} text - Texte avec encodage incorrect
 * @returns {string} Texte avec caractères corrigés (ou texte d'origine en cas d'erreur)
 */
function fixMojibake(text) {
  try {
    return text
      // Caractères accentués mal encodés
      .replace(/Ã©/g, "é")
      .replace(/Ã¨/g, "è")
      .replace(/Ã /g, "à")
      .replace(/Ã¢/g, "â")
      .replace(/Ã´/g, "ô")
      .replace(/Ã¹/g, "ù")
      // Symboles spéciaux
      .replace(/â‚¬/g, "€")
      .replace(/â€œ/g, "\"")
      .replace(/â€/g, "\"")
      // Emojis mal encodés
      .replace(/ðŸ([\s\S]{2})/g, (m) => {
        try {
          return decodeURIComponent(escape(m));
        } catch {
          return "📢";
        }
      });
  } catch {
    // En cas d'erreur, retourner le texte original
    return text;
  }
}



/**
 * Décode une chaîne Base64 en UTF-8
 * Gère les erreurs et retourne un message d'erreur lisible
 * 
 * @param {string} str - Chaîne encodée en Base64
 * @returns {string} Texte décodé ou "Error decode" en cas d'erreur
 * @example
 * const b64 = "Qm9uam91ciDDoCB2b3Vz"; // "Bonjour à vous" encodé
 * decodeBase64(b64); // "Bonjour à vous"
 */
export function decodeBase64(str) {
  try {
    // Validation d'entrée
    if (!str || typeof str !== "string") return "Error decode";

    // 1. Décode la chaîne Base64 en chaîne binaire
    const binary = atob(str);

    // 2. Convertit la chaîne binaire en tableau d'octets UTF-8
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    // 3. Décode le tableau d'octets en chaîne UTF-8
    const text = new TextDecoder("utf-8").decode(bytes);

    // 4. Corrige les caractères mal encodés
    return fixMojibake(text);
  } catch {
    // Retourne un message d'erreur en cas d'échec du décodage
    return "Error decode";
  }
}
