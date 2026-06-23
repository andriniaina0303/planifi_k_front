import {Button,Popover, Progress} from "antd";
import { useRef, useEffect } from "react";
import { Chart } from "chart.js";
import {
    ArrowLeftOutlined,
    DatabaseOutlined,
    FireOutlined,
    MailOutlined,
    QuestionCircleOutlined,
    BarChartOutlined,
    TableOutlined,
    NotificationFilled 
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { HealthExplainer } from "../healthComponents/HealthKit";
import { tokens } from "../../utils/Tokens";

export const HeadersDetails = ({labelKey,open,setOpen,styles,data,totalBrands,health,navigate,getHealthLabel}) => {
    const location = useLocation();
    // console.log("State in HeadersDetails:", location.state);
    const record = location.state?.record;
    console.log("Contenu de record: ", record )
    // console.log(`${labelKey} in HeadersDetails:`, record);
    const fmt = (v) => Number(v ?? 0).toLocaleString("fr-FR");

    // Conditionner lés clés a utiliser en fonction du labelKey 
    const key_value = labelKey === "database" ? "advertisers" : "bases";
// ── SmartChart ────────────────────────────────────────────────────────────────

const SmartChart = ({
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
            backgroundColor: "rgba(17,24,39,0.9)",
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
            boxPadding: 4,
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

    return (
        <div
        style={{
            ...styles.headerCard,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
        }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
            }}
            ghost
            />
            <div>
            <div
                style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -0.5,
                }}
            >
                {record[`${labelKey}_name`]}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                {[
                {
                    icon: labelKey === "advertiser" ? <DatabaseOutlined /> : <NotificationFilled/> ,
                    text: `${data[key_value]?.length || 0} ${key_value}`,
                },
                {
                    icon: <MailOutlined />,
                    text: `${fmt(data?.globales?.sends)} sends`,
                },
                { icon: <FireOutlined />, text: `${totalBrands} brands` },
                ].map(({ icon, text }) => (
                <span
                    key={text}
                    style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    }}
                >
                    {icon} {text}
                </span>
                ))}
            </div>
            </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
                style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                }}
            >
                <Progress
                type="circle"
                percent={health}
                width={36}
                strokeWidth={8}
                strokeColor="#fff"
                trailColor="rgba(255,255,255,0.2)"
                format={() => (
                    <span
                    style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}
                    >
                    {health}
                    </span>
                )}
                />
                <div>
                <div
                    style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                  }}
                >
                    Health Score
                </div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>
                    {getHealthLabel(health)}
                </div>
                </div>
                <Popover
                  open={open === "header"}
                  onOpenChange={(v) =>
                    setOpen(v ? "header" : null)
                  }
                content={<HealthExplainer g={data.globales} tokens={tokens} />}
                title={null}
                trigger="click"
                placement="bottom"
                // overlayStyle={{ maxWidth: 400 }}
                // getPopupContainer={() => document.div}//Corrige le problème de z-index de la page 
                >
                  <QuestionCircleOutlined
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  />
                </Popover>
            </div>

            {/* <Segmented
            value={viewMode}
            onChange={setViewMode}
            style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10 }}
            options={[
                {
                label: (
                    <span
                    style={{
                        color: viewMode === "chart" ? tokens.primary : "#fff",
                        padding: "2px 6px",
                    }}
                    >
                    <BarChartOutlined /> Charts
                    </span>
                ),
                value: "chart",
                },
                {
                label: (
                    <span
                    style={{
                        color: viewMode === "table" ? tokens.primary : "#fff",
                        padding: "2px 6px",
                    }}
                    >
                    <TableOutlined /> Tables
                    </span>
                ),
                value: "table",
                },
            ]}
            /> */}
        </div>
        </div>
    );
}