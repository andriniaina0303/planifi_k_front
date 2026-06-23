/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TOPDBSTAGS.JSX - Graphique top bases de données par tags (Classé par Score)
 * ═══════════════════════════════════════════════════════════════════════════
 * Affiche les 10 meilleures bases de données classées par Score décroissant
 * issues du filtrage par tags. Incorporé avec son sélecteur de Tag dédié.
 */

import { useMemo, useEffect, useRef } from "react";
import { Card, Select } from "antd";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Palette de couleurs (nuances de violet/bleu)
const COLORS = ["#722ed1", "#9254de", "#b37feb", "#531dab", "#8b5cf6"];

/**
 * Composant TopDbsTags
 * @param {Object} props
 * @param {Array} props.data - Tableau d'objets contenant les DB reçues du backend
 * @param {Object} props.tagNames - Dictionnaire de mapping { id: name } pour les tags
 * @param {any} props.tagValue - Valeur actuelle du tag sélectionné (issu des filtres du parent)
 * @param {Function} props.onTagChange - Callback déclenché au changement du tag pour notifier le parent
 */
const TopDbsTags = ({ data = [], tagNames = {}, tagValue, onTagChange }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  /**
   * Extrait et trie le top 10 des DB selon le score reçu
   */
  const topDbs = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data 
      .map((item) => ({
        name: item.base_name || `DB #${item.database_id}`,
        score: item.score ?? 0,
        tauxClick: item.taux_clickers ?? 0,
        sends: item.sends ?? 0,
        clickers: item.clickers ?? 0,
        tagId: item.tag_id ?? null,
      }))
      .filter((db) => db.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [data]);

  /**
   * Plugin Chart.js personnalisé pour afficher le score au-dessus des barres
   */
  const valueLabelPlugin = {
  id: "valueLabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.getDatasetMeta(0);

    ctx.save();
    ctx.font = "600 11px sans-serif";
    ctx.fillStyle = "#722ed1";
    ctx.textAlign = "center"; // Alignement à gauche pour la rotation
    ctx.textBaseline = "middle";

    dataset.data.forEach((bar, i) => {
      const value = chart.data.datasets[0].data[i] ?? 0;
      
      ctx.save();
      // On déplace le repère au-dessus de la barre
      ctx.translate(bar.x, bar.y - 10);
      // 👑 On pivote le texte de -45 degrés (ou -90 pour une verticale stricte)
      ctx.rotate(-Math.PI / 4); 
      
      ctx.fillText(value.toLocaleString(), 0, 0);
      ctx.restore();
    });

    ctx.restore();
  },
};

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: topDbs.map((db) => db.name),
        datasets: [
          {
            label: "Score",
            data: topDbs.map((db) => db.score),
            backgroundColor: topDbs.map((_, i) => COLORS[i % COLORS.length]),
            borderRadius: 6,
            borderSkipped: false,
            categoryPercentage: 0.6,
            barPercentage: 0.75,
            maxBarThickness: 50, // 2. Évite que les bâtons deviennent géants et étalent le texte
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30, // Un peu plus de padding en haut de la zone de dessin
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e1e2f",
            borderColor: "#9254de",
            borderWidth: 1,
            titleColor: "#fff",
            bodyColor: "#b37feb",
            padding: 10,
            callbacks: {
              title: (items) => {
                const index = items[0].dataIndex;
                const dbInfo = topDbs[index];
                const tagName = tagNames[dbInfo.tagId] || `Tag #${dbInfo.tagId}`;
                return tagName;
              },
              label: (item) => {
                const dbInfo = topDbs[item.dataIndex];
                return [
                  `🎯 Score : ${item.raw}`,
                  `Taux de clics : ${dbInfo.tauxClick}%`,
                  `Envois : ${dbInfo.sends.toLocaleString()}`,
                  `Cliqueurs : ${dbInfo.clickers.toLocaleString()}`
                ];
              },
            },
          },
          datalabels: false,
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 13 },
              color: "#555",
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            // 3. ON REPASSE À TRUE MAIS EN MASQUANT UNIQUEMENT LE VISUEL
            display: true, 
            grid: { display: false },
            border: { display: false },
            ticks: { display: false }, // Cache les chiffres sur le côté gauche
            grace: "18%", // 👑 Offre 15% d'espace vide au-dessus de la barre la plus haute !
          },
        },
      },
      plugins: [valueLabelPlugin],
    });

    return () => chartRef.current?.destroy();
  }, [topDbs]);

  return (
    <Card
      title="📊 Top 10 des Bases par tags"
      size="medium"
      style={{ width: "100%", height: "100%" }}
      extra={
        <Select
          showSearch
          allowClear
          placeholder="Filtrer par tags"
          value={tagValue}
          onChange={onTagChange}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={Object.entries(tagNames || {}).map(([id, name]) => ({
            value: id,
            label: name,
          }))}
        />
      }
    >
      <div style={{ width: "100%", height: 280 }}>
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
};

export default TopDbsTags;