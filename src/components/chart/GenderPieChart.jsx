/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENDERPIECHARTS.JSX - Pie chart distribution par genre
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Affiche la répartition des contacts par genre (F/M/O)
 * Utilise Recharts pour le rendu
 */

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Palette de couleurs pour chaque genre
const COLORS = ["#0088FE", "#FF8042", "#00C49F"]; // Bleu (F), Orange (M), Vert (O)

/**
 * Composant GenderPieChart
 * Affiche un pie chart (donut) de la distribution par genre
 * 
 * @param {Object} props
 * @param {Object} props.apiData - Réponse API contenant les statistiques par genre
 * @param {boolean} props.apiData.status - "success" ou "error"
 * @param {Object} props.apiData.data - Données avec by_gender et total_contacts
 */
const GenderPieChart = ({ apiData }) => {
  // Validation : retourner null si pas de données
  if (!apiData || apiData.status !== "success") return null;

  // Transformation des données pour Recharts
  // Format: [{name: "F", value: 1200}, {name: "M", value: 800}, ...]
  const data = Object.entries(apiData.data.by_gender).map(([gender, stats]) => ({
    name: gender,
    value: stats.total,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}  // Rayon externe
            innerRadius={30}  // Crée l'effet donut
            fill="#8884d8"
            // Label affiche le pourcentage
            label={(entry) => `${entry.name}: ${((entry.value / apiData.data.total_contacts) * 100).toFixed(1)}%`}
          >
            {/* Couleur pour chaque section */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          {/* Tooltip au survol */}
          <Tooltip
            formatter={(value) => [
              value,
              `Contacts`,
            ]}
          />
          
          {/* Légende */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderPieChart;