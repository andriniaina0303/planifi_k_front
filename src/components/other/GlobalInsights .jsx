/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBALINSIGHTS.JSX - Visualisation des insights globaux
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Affiche deux graphiques :
 * 1. Top 10 tags par eCPM (graphique en barres horizontal)
 * 2. Concentration CA Top 10 vs Autres (diagramme donut)
 */

import React, { useMemo } from "react";
import { Card, Row, Col } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/** Palette de couleurs pour les graphiques */
const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d"];

/**
 * Composant GlobalInsights
 * Affiche les insights globaux des annonceurs et tags
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.data - Données des annonceurs avec métriques
 * @param {Array} props.listetags - Liste de tous les tags disponibles
 * @returns {JSX.Element} Deux graphiques (eCPM et CA concentration)
 */
const GlobalInsights = ({ data, listetags }) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // CALCUL 1 : Top 10 Tags par eCPM
  // ═══════════════════════════════════════════════════════════════════════════
  const topTags = useMemo(() => {
    // Pour chaque tag, calculer l'eCPM (revenue par 1000 envois)
    const tagsPerf = listetags.map((tag) => {
      // Filtrer tous les annonceurs qui utilisent ce tag
      const items = data.filter((a) => a.tags_id === tag.id);

      // Sommer les envois et le chiffre d'affaires
      const sends = items.reduce((acc, a) => acc + a.globales.sends, 0);
      const ca = items.reduce((acc, a) => acc + a.globales.ca, 0);

      // eCPM = (Chiffre d'affaires / Envois) * 1000
      return {
        tag: tag.tag,
        eCPM: sends ? (ca / sends) * 1000 : 0,
      };
    });

    // Trier par eCPM décroissant et garder seulement les 10 premiers
    return tagsPerf
      .sort((a, b) => b.eCPM - a.eCPM)
      .slice(0, 10);
  }, [data, listetags]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCUL 2 : Concentration CA (Top 10 vs Autres)
  // ═══════════════════════════════════════════════════════════════════════════
  const caDistribution = useMemo(() => {
    // Trier tous les annonceurs par CA décroissant
    const sorted = [...data].sort((a, b) => b.globales.ca - a.globales.ca);

    // Les 10 premiers annonceurs
    const top10 = sorted.slice(0, 10);
    
    // Calculer CA totale et CA Top 10
    const totalCA = sorted.reduce((acc, a) => acc + a.globales.ca, 0);
    const top10CA = top10.reduce((acc, a) => acc + a.globales.ca, 0);

    // Retourner les données pour le diagramme
    return [
      { name: "Top 10", value: top10CA },
      { name: "Others", value: totalCA - top10CA },
    ];
  }, [data]);

  return (
    <Row gutter={12}>
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* GRAPHIQUE 1 : Top Tags par eCPM (Barres horizontales) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Col span={24}>
        <div style={{ height: 250 }}>
          <Card title="Top 10 Tags par eCPM" size="small" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTags} layout="vertical">
                {/* Axe X (horizontal) pour l'eCPM */}
                <XAxis type="number" />
                
                {/* Axe Y (vertical) pour le nom du tag */}
                <YAxis dataKey="tag" type="category" width={120} />
                
                {/* Tooltip au survol */}
                <Tooltip />
                
                {/* Barres représentant l'eCPM */}
                <Bar dataKey="eCPM" fill="#722ed1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Col>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* GRAPHIQUE 2 : Concentration CA (Diagramme Donut) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Col span={24}>
        <div style={{ height: 250 }}>
          <Card title="Concentration CA (Top 10 vs Others)" size="small" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Configuration du diagramme donut */}
                <Pie
                  data={caDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}     // Rayon intérieur (crée l'effet donut)
                  outerRadius={100}    // Rayon extérieur
                  label               // Affiche les labels
                >
                  {/* Colorer chaque section */}
                  {caDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                
                {/* Tooltip au survol */}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Col>
    </Row>
  );
};

export default GlobalInsights;