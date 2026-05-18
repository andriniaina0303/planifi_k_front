/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TOPTAGSECPM.JSX - Graphique top tags par eCPM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Affiche les 10 meilleurs tags classés par eCPM (valeur par 1000 envois)
 * Utilise Chart.js avec barres colorées et labels de valeur
 */

import { useMemo, useEffect, useRef } from "react";
import { Card } from "antd";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Palette de couleurs (nuances de violet)
const COLORS = ["#722ed1", "#9254de", "#b37feb", "#531dab", "#8b5cf6"];

/**
 * Composant TopTagsEcpm
 * Graphique en barres des meilleurs tags par eCPM
 * 
 * @param {Object} props
 * @param {Array} props.data - Données des annonceurs
 * @param {Array} props.listetags - Liste complète des tags
 */
const TopTagsEcpm = ({ data, tagMapping = [] }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  
  /**
   * Calcule le top 10 des tags par eCPM
  */
const topTags = useMemo(() => {
const tagsPerf = Object.entries(tagMapping).map(([id, name]) => {
  const tagId = Number(id);
  const items = data.filter((a) => Number(a.tag_id) === tagId);
  const ecpm = items.length > 0 ? items[0].globales.ecpm : 0;
    return {
      name: name.tag_name,
      eCPM: ecpm,
    };
  });
  
  return tagsPerf
    .filter((t) => t.eCPM > 0)
    .sort((a, b) => b.eCPM - a.eCPM)
    .slice(0, 10);
}, [data]);

  /**
   * Plugin Chart.js personnalisé pour afficher les valeurs au-dessus des barres
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

      // Afficher la valeur de chaque barre
      dataset.data.forEach((bar, i) => {
        const value = chart.data.datasets[0].data[i] ?? 0;
        ctx.fillText(value.toFixed(2), bar.x, bar.y - 4);
      });

      ctx.restore();
    },
  };


  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    // Configuration du graphique Chart.js
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        
        labels: topTags.map((t) => t.name),
        datasets: [
          {
            data: topTags.map((t) => t.eCPM),
            backgroundColor: topTags.map((_, i) => COLORS[i % COLORS.length]),
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
              title: (items) => items[0].label,
              label: (item) => `eCPM : ${item.raw}`,
            },
          },
          datalabels: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              color: "#555",
              maxRotation: 35,
              minRotation: 35,
            },
          },
          y: {
            display: false,
          },
        }
      },
      plugins: [valueLabelPlugin],
    });

    return () => chartRef.current?.destroy();
  }, [topTags]);
  return (
    <Card
      title="🏷️ Top 10 Tags par eCPM"
      size="medium"
      style={{width: "100%", height: "100%"}}
    >
      <div style={{width:330 , height: 280 }}>
        <canvas 
          ref={canvasRef} 
          style={{ width: "100%", height: "100%"}}
          />
      </div>
    </Card>
  );
};

export default TopTagsEcpm;