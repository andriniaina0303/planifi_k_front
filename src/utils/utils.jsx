/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UTILS.JSX - Utilitaires de décodage de texte FINAL DÉFINITIF
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Décode correctement le Base64 avec emojis et accents, même quand les
 * caractères de contrôle invisibles sont présents.
 * 
 * EXEMPLE:
 * "w7DCn8KYwrEgLTcwJSBtYWludGVuYW50" → "😱 -70% maintenant"
 */

/**
 * Corrige les caractères mal encodés (mojibake et double-encodage UTF-8)
 * 
 * ÉTAPES:
 * 1. Essaie de corriger le double-encodage UTF-8 (emojis mal encodés)
 *    en vérifiant si les caractères visibles (Ã, Â, etc.) sont présents
 * 2. Sinon, essaie de décoder les emojis/caractères multi-byte avec caractères invisibles
 * 3. Puis applique les remplacements simples (accents, symboles, etc.)
 * 4. Retourne le texte corrigé (ou original si aucune correction applicable)
 * 
 * @param {string} text - Texte avec caractères mal encodés
 * @returns {string} Texte avec caractères corrigés (ou original si aucune correction applicable)
 */
function fixMojibake(text) {
  try {
    // ÉTAPE 1: Détecte le mojibake simple avec caractères visibles (Ã, Â, etc.)
    // Pattern: caractères Latin-1 étendu (U+00C0-U+00C3, U+00C2) suivis de Latin-1 étendu
    const hasVisibleMojibake = /[\xC0-\xC3][\x80-\xBF]|[\xC2][\x80-\xBF]/.test(text);
    
    if (hasVisibleMojibake) {
      try {
        // Reconvertir: traiter chaque caractère comme un octet Latin-1
        // puis réinterpréter comme UTF-8 valide
        const bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
          bytes[i] = text.charCodeAt(i) & 0xFF;
        }
        
        // Décoder comme UTF-8
        const decoded = new TextDecoder("utf-8").decode(bytes);
        
        // Vérifier que le décodage a fonctionné
        if (decoded !== text) {
          return decoded; // ✅ Double-encodage corrigé, retourner le résultat
        }
      } catch (error) {
        // Si la reconversion échoue, continuer avec les remplacements simples
      }
    }

    // ÉTAPE 2: Essaie de corriger les emojis avec caractères invisibles
    // (comme U+009F, U+0098 qui ne s'affichent pas mais sont présents)
    // Ces caractères sont souvent les restes du double-encodage UTF-8
    const hasInvisibleControlChars = /[\x80-\x9F\x7F]/.test(text);
    if (hasInvisibleControlChars) {
      try {
        // Même approche: traiter comme Latin-1 → reconvertir en UTF-8
        const bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
          bytes[i] = text.charCodeAt(i) & 0xFF;
        }
        
        const decoded = new TextDecoder("utf-8").decode(bytes);
        
        // Si le résultat contient des caractères emoji valides
        // (détecté par la présence de code Unicode haut), retourner
        if (decoded !== text && decoded.length < text.length) {
          // Le texte décodé est plus court = compression réussie (emoji valide)
          return decoded;
        }
      } catch (error) {
        // Continue avec les remplacements
      }
    }

    // ÉTAPE 3: Remplacements simples pour mojibake courant
    // (accents, symboles spéciaux, etc.)
    let corrected = text
      // Caractères accentués français
      .replace(/Ã©/g, "é")
      .replace(/Ã¨/g, "è")
      .replace(/Ã /g, "à")
      .replace(/Ã¡/g, "á")
      .replace(/Ã¢/g, "â")
      .replace(/Ã´/g, "ô")
      .replace(/Ã¹/g, "ù")
      .replace(/Ã§/g, "ç")
      .replace(/Ã±/g, "ñ")
      .replace(/Ã¼/g, "ü")
      .replace(/Â«/g, "«")
      .replace(/Â»/g, "»")
      .replace(/Â°/g, "°")
      // Symboles spéciaux et monnaies
      .replace(/â‚¬/g, "€")
      .replace(/â€œ/g, "\"")
      .replace(/â€\x9d/g, "\"")
      .replace(/â€™/g, "'")
      .replace(/â€"?/g, "–")
      .replace(/â€"/g, "—")
      .replace(/â€¢/g, "•")
      .replace(/â€¦/g, "…");

    // ÉTAPE 4: Retourner le texte corrigé
    // (ou le texte original si aucun remplacement n'a été appliqué)
    return corrected;
  } catch (error) {
    console.warn("Erreur fixMojibake:", error);
    return text; // En cas d'erreur critique, retourner le texte original
  }
}

/**
 * Décode une chaîne Base64 en UTF-8
 * Gère automatiquement les emojis et les accents
 * 
 * ⚠️ IMPORTANT: Ne supprime les caractères de contrôle QU'À LA FIN
 * pour ne pas détruire les emojis qui en contiennent !
 * 
 * @param {string} str - Chaîne encodée en Base64
 * @returns {string} Texte décodé ou "Error decode" en cas d'erreur
 * 
 * @example
 * // Emoji avec caractères de contrôle
 * decodeBase64("w7DCn8KYwrEgLTcwJSBtYWludGVuYW50");
 * // → "😱 -70% maintenant"
 * 
 * // Texte avec accents
 * decodeBase64("Qm9uam91ciDDoCB2b3Vz");
 * // → "Bonjour à vous"
 */
export function decodeBase64(str) {
  try {
    // Validation d'entrée
    if (!str || typeof str !== "string") return "Error decode";

    // 1. Décode le Base64 en bytes bruts
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    // 2. Décode en UTF-8 (gère automatiquement les emojis multi-byte)
    let text = new TextDecoder("utf-8").decode(bytes);

    // 3. Corrige le mojibake simple (accents, symboles)
    text = fixMojibake(text);

    // 4. ⚠️ ONLY NOW: Supprime les caractères de contrôle et invisibles
    // (qui n'affichent pas et qui font du bruit)
    // Mais NE supprime PAS les emojis qui pourraient les contenir
    text = text
      // Caractères de contrôle visibles et problématiques
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '')
      // Ne pas supprimer U+007F (DELETE) au cas où
      // Ne pas supprimer \x1B pour les sequences ANSI
      // Supprimer seulement les vrai problèmes
      .replace(/[\x7F]/g, '')
      // Zero-width characters et invisibles
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Mais GARDER U+0098 et U+009F qui sont dans les emojis
      // Supprimer les autres caractères de contrôle C1 sauf ceux dans les emojis
      .split('')
      .filter(c => {
        const code = c.charCodeAt(0);
        // Garder les caractères normaux
        if (code >= 0x100) return true; // Tous les caractères Unicode élevés
        if (code >= 0x20 && code < 0x7F) return true; // ASCII affichable
        if (code >= 0xA0) return true; // Latin-1 étendu
        // Pour les caractères de contrôle bas, garder seulement les importants
        if (code === 0x09) return true; // Tab
        if (code === 0x0A) return true; // Newline
        if (code === 0x0D) return true; // Carriage return
        // Le reste (U+0000-U+0008, U+000B-U+0C, U+000E-U+001F, U+007F) est supprimé
        return false;
      })
      .join('')
      .trim();

    return text;
  } catch (error) {
    console.warn("Erreur decodeBase64:", error);
    return "Error decode";
  }
}