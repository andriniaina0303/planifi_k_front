// Fonction pour déterminer la couleur en fonction du nombre de personnes
export function getColorByPersonCount(count: number): string {
  if (count === 0) return ""; // Gris si aucune personne
  if (count >= 1 && count <= 200) return "#DC2626"; // rouge (1-200)
  if (count >= 201 && count <= 500) return "#f59e0b"; // jaune (201-500)
  if (count >= 501) return "#10b981"; // vert (501+)
  return ""; // Gris par défaut
}

// Fonction pour obtenir le label du range
export function getPersonCountLabel(count: number): string {
  if (count === 0) return "Aucune personne";
  if (count >= 1 && count <= 200) return "1-200 personnes";
  if (count >= 201 && count <= 500) return "201-500 personnes";
  if (count >= 501) return "501+ personnes";
  return "Non défini";
}

// Fonction pour obtenir le style du badge
export function getBadgeStyle(count: number): string {
  if (count === 0) return "bg-gray-200 text-gray-700";
  if (count >= 1 && count <= 200) return "bg-yellow-200 text-yellow-800";
  if (count >= 201 && count <= 500) return "bg-blue-200 text-blue-800";
  if (count >= 501) return "bg-red-200 text-red-800";
  return "bg-gray-200 text-gray-700";
}
