import { tokens } from "./Tokens";
import { TeamOutlined, HeartOutlined, GlobalOutlined } from "@ant-design/icons";

export const buildRecommendations = (backendData) => {
  // 1. On extrait l'objet principal, avec une sécurité s'il est absent
  const recommendations = backendData?.recommendation_segments;
  if (!recommendations) return [];

  // 2. Configuration des libellés et styles par dimension (inchangé)
  const dimLabels = {
    age_range: {
      label: "Tranche d'âge",
      icon: <TeamOutlined />,
      color: tokens.primary,
    },
    gender: {
      label: "Civilité / Genre",
      icon: <HeartOutlined />,
      color: tokens.pink,
    },
    isp: {
      label: "ISP / FAI",
      icon: <GlobalOutlined />,
      color: tokens.cyan,
    },
  };

  const results = [];

  // 3. On boucle sur chaque dimension renvoyée par le backend (age_range, gender, isp)
  Object.entries(recommendations).forEach(([dimKey, dimData]) => {
    const meta = dimLabels[dimKey];
    if (!meta) return; // Sécurité si une nouvelle dimension inconnue arrive du backend

    // On prépare une fonction interne pour adapter les clés du backend aux clés attendues par ton UI
    const formatSegment = (item) => {
      if (!item) return null;
      return {
        segment: item.value, // "value" devient "segment" pour ton UI
        sends: item.sends,
        openers: item.openers,
        clickers: item.clickers,
        unsubs: item.unsubs,
        openRate: item.taux_openers, // Taux déjà calculés par le backend
        ctr: item.taux_clickers,
        unsubRate: item.taux_unsubs,
        taux_cto: item.taux_cto
      };
    };

    // Le backend trie déjà par pertinence, on prend donc le premier élément [0]
    const bestSegment = dimData.privilegier?.[0];
    const worstSegment = dimData.eviter?.[0];

    // On calcule le nombre total de segments reçus pour cette dimension
    const totalSegments = (dimData.privilegier?.length || 0) + (dimData.eviter?.length || 0);

    if (totalSegments === 0) return;

    // 4. On pousse l'objet final calqué sur l'ancienne structure
    results.push({
      dimKey,
      ...meta,
      totalSegments,
      // On associe les bons segments aux variables lues par tes cartes/listes
      bestCtr: formatSegment(bestSegment),
      bestOpen: formatSegment(bestSegment), 
      bestUnsub: formatSegment(bestSegment),
      worstCtr: formatSegment(worstSegment),
      biggestVol: formatSegment(bestSegment), // Optionnel: tu peux trier tes tableaux si besoin de plus de précision
    });
  });

  return results;
};