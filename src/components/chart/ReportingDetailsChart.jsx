import { Card, Col, Row } from "antd";
import { RiseOutlined, DollarOutlined } from "@ant-design/icons";
import { Chart, registerables } from "chart.js";
import { useRef, useEffect } from "react";
import { tokens } from "../../utils/Tokens";
Chart.register(...registerables);




// ── SmartChart ────────────────────────────────────────────────────────────────

export const SmartChart = ({
  type,
  labels,
  datasets,
  height = 240,
  options: extraOpts = {},
}) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const depsKey = JSON.stringify({ labels, datasets });

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const isDoughnut = type === "doughnut" || type === "pie";

    chartRef.current = new Chart(ref.current, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: datasets.length > 1 || isDoughnut,
            position: isDoughnut ? "right" : "bottom",
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              borderRadius: 4,
              useBorderRadius: true,
              font: { size: 11, family: "'Inter', sans-serif", weight: "500" },
              padding: 12,
              color: "#6b7280",
            },
          },
          tooltip: {
            yAlign: "top",
            backgroundColor: "rgba(17, 19, 39, 0.9)",
            titleFont: {
              size: 12,
              family: "'Inter', sans-serif",
              weight: "600",
            },
            bodyFont: { size: 11, family: "'Inter', sans-serif" },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            boxPadding: 10,
          },
        },
        scales: !isDoughnut
          ? {
              x: {
                grid: { display: false },
                ticks: {
                  font: { size: 10, family: "'Inter', sans-serif" },
                  color: "#9ca3af",
                  maxRotation: 45,
                },
                border: { display: false },
              },
              y: {
                // beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.04)", drawBorder: false },
                ticks: {
                  font: { size: 10, family: "'Inter', sans-serif" },
                  color: "#9ca3af",
                  padding: 8,
                },
                border: { display: false },
              },
            }
          : undefined,
        ...extraOpts,
      },
    });
    return () => chartRef.current?.destroy();
  }, [depsKey, type]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <canvas ref={ref} />
    </div>
  );
};


// ── EngagementByBaseChart ─────────────────────────────────────────────────────

/**
 * Affiche le taux d'engagement (Open %, CTR %, Unsub %) par base sous forme de
 * graphique en ligne.
 *
 * @param {object[]} bases  - Tableau des bases de l'advertiser
 * @param {object}   dbMap  - Map { database_id → basename }
 */
export const EngagementByBaseChart = ({ key_value, label_value, idKey, nameKey, dataMapped,styles}) => (
  <Card
    size="small"
    style={styles.card}
    title={
      <span style={styles.sectionTitle}>
        <RiseOutlined style={{ color: tokens.success }} /> Taux d'engagement par {label_value}
      </span>
    }
  >
    <SmartChart
      type="line"
      labels={key_value.map((b) => dataMapped[b[idKey]] || `DB #${b[nameKey]}`)}
      height={200}
      datasets={[
        {
          label: "Open %",
          data: key_value.map((b) => b.taux_openers),
          borderColor: tokens.success,
          backgroundColor: `${tokens.success}22`,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "CTR %",
          data: key_value.map((b) => b.taux_clickers),
          borderColor: tokens.warning,
          backgroundColor: `${tokens.warning}22`,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Unsub %",
          data: key_value.map((b) => b.taux_unsubs),
          borderColor: tokens.danger,
          backgroundColor: `${tokens.danger}22`,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
        },
      ]}
    />
  </Card>
);

// ── RevenueByBaseChart ────────────────────────────────────────────────────────

/**
 * Affiche le CA et l'eCPM par base sous forme de graphique en barres.
 *
 * @param {object[]} bases  - Tableau des bases de l'advertiser
 * @param {object}   dbMap  - Map { database_id → basename }
 */
export const RevenueByBaseChart = ({ key_value, label_value, idKey, nameKey, dataMapped,styles }) => (
  <Card
    size="small"
    style={styles.card}
    title={
      <span style={styles.sectionTitle}>
        <DollarOutlined style={{ color: tokens.pink }} /> Revenue par {label_value}
      </span>
    }
  >
    <SmartChart
      type="bar"
      labels={key_value.map((b) => dataMapped[b[idKey]] || `DB #${b[nameKey]}`)}
      height={200}
      datasets={[
        {
          label: "CA",
          data: key_value.map((b) => b.ca || 0),
          backgroundColor: `${tokens.pink}66`,
          borderColor: tokens.pink,
          borderWidth: 1.5,
          borderRadius: 5,
        },
        {
          label: "eCPM",
          data: key_value.map((b) => b.ecpm || 0),
          backgroundColor: `${tokens.purple}66`,
          borderColor: tokens.purple,
          borderWidth: 1.5,
          borderRadius: 5,
        },
      ]}
    />
  </Card>
);

// ── ReportingDetailCharts (wrapper regroupant les deux) ──────────────────────

/**
 * Composant combiné exposant les deux charts côte à côte dans une Row Ant Design.
 *
 * @param {object[]} bases  - Tableau des bases de l'advertiser
 * @param {object}   dbMap  - Map { database_id → basename }
 */
const ReportingDetailCharts = ({ key_value,label_value, idKey, nameKey, dataMapped, styles }) =>
{  
 return(
  <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
    <Col xs={24} lg={12}>
      <EngagementByBaseChart key_value={key_value} label_value={label_value} idKey = {idKey} nameKey = {nameKey} dataMapped={dataMapped} styles={styles} tokens={tokens} SmartChart={SmartChart} />
    </Col>
    <Col xs={24} lg={12}>
      <RevenueByBaseChart key_value={key_value} label_value={label_value} idKey = {idKey} nameKey = {nameKey} dataMapped={dataMapped} styles={styles} tokens={tokens} SmartChart={SmartChart}/>
    </Col>
  </Row>
);
}
export default ReportingDetailCharts;