/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHARTSWITCHER.JSX - Composant graphiques switchables
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Affiche plusieurs graphiques (Chart.js) avec navigation :
 * - Top Sends (envois)
 * - Openers vs Clickers vs Unsubs
 * - Taux d'ouverture, clic, désab
 * 
 * Permet de passer d'un graphique à l'autre via les flèches
 */

import { useState, useEffect, useRef } from "react";
import { Card, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Chart, registerables, Ticks } from "chart.js";

Chart.register(...registerables);

const COLORS = [
  "#1890ff", "#faad14", "#52c41a", "#f5222d", "#722ed1",
  "#13c2c2", "#eb2f96", "#fa541c", "#a0d911", "#2f54eb",
];

/**
 * Composant ChartCanvas
 * Wrapper pour Canvas et Chart.js avec gestion du cycle de vie
 */
const ChartCanvas = ({ config, height = 220 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [config]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

/**
 * Composant ChartSwitcher
 * Affiche une sélection de graphiques navigable
 * 
 * @param {Object} props
 * @param {Array} props.data - Données des annonceurs
 */
const ChartSwitcher = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculs des top 10 par métrique
  const top5Sends = [...data]
    .sort((a, b) => b.globales.sends - a.globales.sends)
    .slice(0, 10);

  const top5CA = [...data]
    .sort((a, b) => b.globales.ca - a.globales.ca)
    .slice(0, 10);

  const top5eCPM = [...data]
    .sort((a, b) => b.globales.ecpm - a.globales.ecpm)
    .slice(0, 10);

  // Configuration commune pour les graphiques en barres
  const commonBarOptions = (isHorizontal = true) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isHorizontal ? "y" : "x",
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.06)" } },
      y: { grid: { display: false }, ticks:{autoSkip:false,padding:8}}
    },
  });

  const charts = [
    {
      
      label: "Top Sends",
      legendItems: [{ color: "#1890ff", label: "Sends" }],
      config: {
        type: "bar",
        data: {
          labels: top5Sends.map((a) => a.advertiser_name),
          datasets: [{ label: "Sends", data: top5Sends.map((a) => a.globales.sends), backgroundColor: "#1890ff", borderRadius: 4}],
        },
        options: commonBarOptions(),
      },
    },
    {
      label: "Openers vs Clickers vs Unsubs",
      legendItems: [
        { color: "#52c41a", label: "Openers" },
        { color: "#faad14", label: "Clickers" },
        { color: "#f5222d", label: "Unsubs" },
      ],
      config: {
        type: "bar",
        data: {
          labels: top5Sends.map((a) => a.advertiser_name),
          datasets: [
            { label: "Openers", data: top5Sends.map((a) => a.globales.openers), backgroundColor: "#52c41a", borderRadius: 4, stack: "a" },
            { label: "Clickers", data: top5Sends.map((a) => a.globales.clickers), backgroundColor: "#faad14", borderRadius: 4, stack: "a" },
            { label: "Unsubs", data: top5Sends.map((a) => a.globales.unsubs), backgroundColor: "#f5222d", borderRadius: 4, stack: "a" },
          ],
        },
        options: {
          ...commonBarOptions(),
          plugins: { legend: { display: false } },
        },
      },
    },
    {
      label: "Top CA",
      legendItems: [],
      config: {
        type: "bar",
        data: {
          labels: top5CA.map((a) => a.advertiser_name),
          datasets: [{
            data: top5CA.map((a) => a.globales.ca),
            backgroundColor: COLORS.slice(0, top5CA.length),
            borderWidth: 2,
            hoverOffset: 8,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%",
          plugins: { legend: { display: false } },
        },
      },
    },
    {
      label: "Top eCPM",
      legendItems: [{ color: "#722ed1", label: "eCPM" }],
      config: {
        type: "bar",
        data: {
          labels: top5eCPM.map((a) => a.advertiser_name),
          datasets: [{ label: "eCPM", data: top5eCPM.map((a) => a.globales.ecpm), backgroundColor: "#722ed1", borderRadius: 4 }],
        },
        options: commonBarOptions(),
      },
    },
  ];

  const pairs = [];
  for (let i = 0; i < charts.length; i += 2) pairs.push(charts.slice(i, i + 2));
  const totalPages = pairs.length;

  const nextChart = () => setActiveIndex((prev) => (prev + 1) % totalPages);
  const prevChart = () => setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const activePair = pairs[activeIndex];

  return (
    <Card
      style={{ borderRadius: 10, size: "medium"}}
      title={activePair.map((c) => c.label).join("&")}
      extra={
        <div style={{ display: "flex", gap: 4 }}>
          <Button size="small" icon={<LeftOutlined />} onClick={prevChart} />
          <Button size="small" icon={<RightOutlined />} onClick={nextChart} />
        </div>
      }
    >
      <div style={{ display: "flex", gap: 16 , height: 280}}>
        {activePair.map((chart, i) => (
          <div key={activeIndex * 2 + i} style={{ flex: 1, minWidth: 0 }}>
            {chart.legendItems.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginBottom: 8 }}>
                {chart.legendItems.map((item) => (
                  <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#555" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: "inline-block" }} />
                    {item.label}
                  </span>
                ))}
              </div>
            )}
            <ChartCanvas config={chart.config} height={220}  />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChartSwitcher;