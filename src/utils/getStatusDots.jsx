import React from "react";

export const StatusDot = ({ resultEmoji }) => {
  // Mapping pour transformer l'émoji brute du serveur en une belle pastille moderne
  const colorMap = {
    "🟢": { bg: "linear-gradient(135deg, #a8ff78, #78ffd6)", border: "#52c41a" },
    "🟡": { bg: "linear-gradient(135deg, #f6d365, #fda085)", border: "#fa8c16" },
    "🔴": { bg: "linear-gradient(135deg, #ff0844, #ffb199)", border: "#f5222d" },
  };

  const current = colorMap[resultEmoji];

  // Si le mois n'a pas de données (pas d'émoji), on n'affiche rien ou un point gris neutre
  if (!current) {
    return <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8e8e8", display: "inline-block" }} />;
  }

  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: current.bg,
        boxShadow: "0 2px 4px rgba(0,0,0,0.15), inset 0 -2px 3px rgba(0,0,0,0.2)",
        display: "inline-block",
      }}
    />
  );
};

