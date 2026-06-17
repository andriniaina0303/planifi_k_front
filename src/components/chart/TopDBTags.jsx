/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TOPDBSTAGS.JSX - Graphique top bases de données par tags (Classé par Score)
 * ═══════════════════════════════════════════════════════════════════════════
 * * Affiche les 10 meilleures bases de données classées par Score décroissant
 * issues du filtrage par tags.
 */

import { useMemo, useEffect, useRef } from "react";
import { Card } from "antd";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Palette de couleurs (nuances de violet/bleu)
const COLORS = ["#722ed1", "#9254de", "#b37feb", "#531dab", "#8b5cf6"];

/**
 * Composant TopDbsTags
 * * @param {Object} props
 * @param {Array} props.data - Tableau d'objets contenant les DB reçues du backend (avec le champ score)
 */
const TopDbsTags = ({ data = [], tagNames = [] }) => {
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
        score: item.score ?? 0, // 👈 Récupération du nouveau champ score
        tauxClick: item.taux_clickers ?? 0,
        sends: item.sends ?? 0,
        clickers: item.clickers ?? 0,
        tagId : item.tag_id ?? null,
      }))
      // Optionnel : on filtre pour éviter d'afficher les DB avec un score de 0
      .filter((db) => db.score > 0)
      // 👑 Tri par le champ SCORE (du plus grand au plus petit)
      .sort((a, b) => b.score - a.score)
      // On garde uniquement les 10 premières DB
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
      ctx.textAlign = "center";

      dataset.data.forEach((bar, i) => {
        const value = chart.data.datasets[0].data[i] ?? 0;
        // On affiche la valeur brute du score (arrondie à 1 décimale ou entière selon ton besoin)
        ctx.fillText(value.toLocaleString(), bar.x, bar.y - 4);
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
            data: topDbs.map((db) => db.score), // 👈 Le graphique utilise le score pour la hauteur des barres
            backgroundColor: topDbs.map((_, i) => COLORS[i % COLORS.length]),
            borderRadius: 6,
            borderSkipped: false,
            categoryPercentage: 0.6,
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 25,
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
                    // 1. Récupérer l'index de la barre survolée
                    const index = items[0].dataIndex;
                    // 2. Trouver les infos de la DB correspondante
                    const dbInfo = topDbs[index];
                    // 3. Récupérer le nom du tag depuis le dictionnaire (ou tableau) passé en props
                    const tagName = tagNames[dbInfo.tagId] || `Tag #${dbInfo.tagId}`;
                    
                    return tagName; // 👑 Sera affiché en gros titre dans le tooltip
                },
                label: (item) => {
                const dbInfo = topDbs[item.dataIndex];
                return [
                  `🎯 Score : ${item.raw}`, // Affiche le score dans le tooltip
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
              font: { size: 10 },
              color: "#555",
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            display: false, // Toujours masqué car la valeur du score est écrite au-dessus de chaque barre
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
    >
      <div style={{ width: "100%", minWidth: 330, height: 280 }}>
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
};

export default TopDbsTags;