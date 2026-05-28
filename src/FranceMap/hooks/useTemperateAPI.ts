
// Hook pour charger les températures avec cache, batching et progression

import fetchTemperature from "../services/openApiMeteo";
import { Liste_Dep } from "./liste";
import { temperatureCache } from "../services/temperatureCache";

/**
 * Fonction utilitaire pour attendre un certain temps
 * @param ms Temps d'attente en millisecondes
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Traite un tableau d'items par batches pour éviter de surcharger l'API
 * @param items Les items à traiter
 * @param batchSize Nombre d'items par batch
 * @param delayMs Délai entre chaque batch
 * @param processor Fonction de traitement pour chaque item
 * @param onProgress Callback appelé après chaque batch avec le pourcentage
 * @returns Tableau des résultats
 */
async function processInBatches<T, R>(
  items: T[],
  batchSize: number,
  delayMs: number,
  processor: (item: T) => Promise<R>,
  onProgress?: (progress: number, message: string) => void
): Promise<R[]> {
  const results: R[] = [];
  const totalBatches = Math.ceil(items.length / batchSize);
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batchNumber = Math.floor(i / batchSize) + 1;
    const batch = items.slice(i, i + batchSize);
    
    console.log(`🔄 Traitement du batch ${batchNumber}/${totalBatches} (${batch.length} départements)...`);
    
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    );
    results.push(...batchResults);
    
    // Calculer et notifier la progression
    const progress = Math.round((results.length / items.length) * 100);
    const message = `Chargement des températures (${batchNumber}/${totalBatches})`;
    
    if (onProgress) {
      onProgress(progress, message);
    }
    
    // Attendre entre chaque batch (sauf pour le dernier)
    if (i + batchSize < items.length) {
      console.log(`⏳ Pause de ${delayMs}ms avant le prochain batch...`);
      await delay(delayMs);
    }
  }
  
  return results;
}

/**
 * Charge toutes les températures des départements français
 * Utilise un cache de 10 minutes pour éviter les appels répétés
 * @param onProgress Callback optionnel pour suivre la progression (progress: 0-100, message: string)
 * @returns Objet avec les températures par code département
 */
export default async function loadTemperatures(
  onProgress?: (progress: number, message: string) => void
): Promise<Record<string, number>> {
  // ✅ Vérifier le cache d'abord
  const cachedData = temperatureCache.get();
  if (cachedData) {
    console.log("📦 Utilisation des données de température en cache (pas d'appel API)");
    if (onProgress) {
      onProgress(100, "Données chargées depuis le cache");
    }
    return cachedData;
  }

  console.log("🌡️ Chargement des températures depuis l'API Open-Meteo...");
  console.log(`📊 Total de ${Liste_Dep.length} départements à traiter`);
  
  if (onProgress) {
    onProgress(0, "Initialisation du chargement...");
  }
  
  const result: Record<string, number> = {};

  try {
    const startTime = Date.now();
    
    // ✅ Traiter par batches de 10 départements avec 1 seconde entre chaque batch
    await processInBatches(
      Liste_Dep,
      10, // 10 requêtes par batch (60 requêtes/minute max pour Open-Meteo)
      1000, // 1 seconde entre chaque batch
      async (dep) => {
        try {
          const temp = await fetchTemperature(dep.coord[0], dep.coord[1]);
          result[dep.id] = temp;
        } catch (error) {
          console.error(`❌ Erreur pour le département ${dep.id}:`, error);
          result[dep.id] = 15; // Température par défaut en cas d'erreur
        }
      },
      onProgress // ✅ Passer le callback de progression
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    console.log(`✅ Températures chargées avec succès en ${duration} secondes`);
    console.log(`📊 ${Object.keys(result).length} départements traités`);

    if (onProgress) {
      onProgress(100, "Températures chargées avec succès");
    }

    // ✅ Sauvegarder en cache pour les prochains chargements
    temperatureCache.set(result);
    
  } catch (error) {
    console.error("❌ Erreur critique lors du chargement des températures:", error);
    if (onProgress) {
      onProgress(100, "Erreur lors du chargement");
    }
    // Retourner des données partielles plutôt que de planter
  }

  return result;
}
