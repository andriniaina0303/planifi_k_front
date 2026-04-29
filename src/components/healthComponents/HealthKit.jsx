// ═══════════════════════════════════════════════════════════════
// healthKit.js - Reusable HealthScore utilities & components
// ═══════════════════════════════════════════════════════════════

import { Popover, Progress, Button, Tag, Divider, Typography} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {getHealthDetails,getHealthLabel,getHealthColor,getHealthScore} from "../../utils/healthKitFunc";
import { tokens } from "../../utils/Tokens";
 
// ═══════════════════════════════════════════════════════════════
// COMPONENTS (React)
// ════

const { Title, Text, Paragraph } = Typography;

// ── HealthGauge ──────────────────────────────────────────────────────────────

export const HealthExplainer = ({ g}) => {
  const details = getHealthDetails(g);
  const total = getHealthScore(g);

  return (
    <div   style={{
    width: 320,
    maxHeight: 350,
    overflowY: "auto",
    padding: 4,
  }}>
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 13 }}>
          🩺 Comment est calculé le Health Score ?
        </Text>
        <Paragraph
          style={{ fontSize: 11, color: "#6b7280", margin: "6px 0 0" }}
        >
          Score composite sur 100 points basé sur 3 métriques pondérées. Plus le
          score est haut, meilleure est la "santé" de la campagne.
        </Paragraph>
      </div>

      {details.map((d) => (
        <div
          key={d.label}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            marginBottom: 6,
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: 600 }}>{d.label}</Text>
            <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>
              {d.points}/{d.max} pts
            </span>
          </div>
          <Progress
            percent={(d.points / d.max) * 100}
            showInfo={false}
            strokeColor={d.color}
            trailColor="#e5e7eb"
            size="small"
            style={{ marginBottom: 4 }}
          />
          <Text style={{ fontSize: 9, color: "#9ca3af" }}>
            Actuel: {d.value} · Seuils: {d.thresholds}
          </Text>
        </div>
      ))}

      <Divider style={{ margin: "8px 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 10px",
          borderRadius: 8,
          background: `${getHealthColor(total,tokens)}12`,
        }}
      >
        <Text strong style={{ fontSize: 12 }}>
          Score total
        </Text>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: getHealthColor(total,tokens),
          }}
        >
          {total}/100 — {getHealthLabel(total)}
        </span>
      </div>

      <Divider style={{ margin: "10px 0 6px" }} />
      <div style={{ fontSize: 10, color: "#9ca3af" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span>
            <span style={{ color: tokens.success }}>●</span> 75-100 Excellent
          </span>
          <span>
            <span style={{ color: tokens.warning }}>●</span> 50-74 Bon
          </span>
          <span>
            <span style={{ color: tokens.orange }}>●</span> 25-49 Standard
          </span>
          <span>
            <span style={{ color: tokens.danger }}>●</span> 0-24 À surveiller
          </span>
        </div>
      </div>
    </div>
  );
};

export const HealthGauge = ({ open, setOpen, score, g, showExplainer = false}) => {
  const color = getHealthColor(score);
  const label = getHealthLabel(score);

  const gauge = (
    <div style={{ textAlign: "center" }}>
      <Progress
        type="dashboard"
        percent={score}
        strokeColor={{
          "0%": color,
          "100%": score >= 50 ? tokens.success : tokens.danger,
        }}
        trailColor="#f3f4f6"
        strokeWidth={8}
        width={80}
        format={() => (
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{score}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>
              {label}
            </div>
          </div>
        )}
      />
      {showExplainer && g && (
        <Popover
          open={open === "Diagnostic"}
          onOpenChange={(v) =>
            setOpen(v ? "Diagnostic" : null)
          }
          content={<HealthExplainer g={g} tokens={tokens}/>}
          title={null}
          trigger="click"
          placement="left"
        >
          <Button
            type="link"
            size="small"
            icon={<QuestionCircleOutlined />}
            style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}
          >
            Comment ça marche ?
          </Button>
        </Popover>
      )}
    </div>
  );

  return gauge;
};