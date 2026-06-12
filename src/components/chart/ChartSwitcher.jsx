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
import { LeftOutlined, RightOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
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
const ChartSwitcher = ({ data, keyFields="advertiser_name" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Etats pour gérer les divers chart 
  const [sendOffset, setSendOffset] = useState(0);
  const [caOffset, setCaOffset] = useState(0);
  const [ecpmOffset, setEcpmOffset] = useState(0);

  // Calculs des top 10 par métrique
  const top5Sends = [...data]
    .sort((a, b) => b.globales.sends - a.globales.sends)
    .slice(sendOffset, sendOffset + 10);


  const top5CA = [...data]
    .sort((a, b) => b.globales.ca - a.globales.ca)
    .slice(caOffset, caOffset + 10);


  const top5eCPM = [...data]
    .sort((a, b) => b.globales.ecpm - a.globales.ecpm)
    .slice(ecpmOffset, ecpmOffset + 10);

  // Configuration commune pour les graphiques en barres
  const commonBarOptions = (isHorizontal = true) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isHorizontal ? "y" : "x",
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.06)" } },
      y: { grid: { display: false }, ticks:{autoSkip:false,padding:0}}
    },
  });

  const charts = [
    {
      
      label: "Top Sends",
      showControls : true,
      onNext: () =>
        setSendOffset(v =>
          Math.min(v + 5, Math.max(0, data.length - 10))
        ),
      onPrev: () => setSendOffset(v => Math.max(0, v - 5)),
      legendItems: [{ color: "#1890ff", label: "Sends" }],
      config: {
        type: "bar",
        data: {
          labels: top5Sends.map((a) => a[keyFields]),
          datasets: [{ label: "Sends", data: top5Sends.map((a) => a.globales.sends), backgroundColor: "#1890ff", borderRadius: 4}],
        },
        options: commonBarOptions(),
      },
    },
    {
      label: "Openers vs Clickers vs Unsubs",
      showControls : false,
      legendItems: [
        { color: "#52c41a", label: "Openers" },
        { color: "#faad14", label: "Clickers" },
        { color: "#f5222d", label: "Unsubs" },
      ],
      config: {
        type: "bar",
        data: {
          labels: top5Sends.map((a) => a[keyFields]),
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
      showControls : true,
      onNext: () =>
        setCaOffset(v =>
          Math.min(v + 5, Math.max(0, data.length - 10))
        ),
      onPrev: () => setCaOffset(v => Math.max(0, v - 5)),
      legendItems: [],
      config: {
        type: "bar",
        data: {
          labels: top5CA.map((a) => a[keyFields]),
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
      showControls : true,
      onNext: () =>
        setEcpmOffset(v =>
          Math.min(v + 5, Math.max(0, data.length - 10))
        ),
      onPrev: () => setEcpmOffset(v => Math.max(0, v - 5)),
      legendItems: [{ color: "#722ed1", label: "eCPM" }],
      config: {
        type: "bar",
        data: {
          labels: top5eCPM.map((a) => a[keyFields]),
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 24,
                marginBottom: 8,
              }}
            >
              {/* Légende */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 12px",
                }}
              >
                {chart.legendItems.map((item) => (
                  <span
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "#555",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: item.color,
                        display: "inline-block",
                      }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>

              {/* Contrôles */}
              {chart.showControls && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    marginLeft: "auto",
                  }}
                >
                  <Button
                    size="small"
                    style={{
                      transform: "scale(0.7)",
                      transformOrigin: "right center",
                      padding: "0 4px",
                    }}
                    icon={<UpOutlined />}
                    onClick={chart.onPrev}
                  />

                  <Button
                    size="small"
                    style={{
                      transform: "scale(0.7)",
                      transformOrigin: "right center",
                      padding: "0 4px",
                    }}
                    icon={<DownOutlined />}
                    onClick={chart.onNext}
                  />
                </div>
              )}
            </div>
            <ChartCanvas config={chart.config} height={220}  />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChartSwitcher;