import { tokens } from "../../../utils/Tokens";
import {MailOutlined,EyeOutlined,LinkOutlined,FallOutlined} from "@ant-design/icons";
import { fmt } from "../../../utils/Helpers";
import { Typography } from "antd";
const { Text } = Typography;

// ── FunnelViz ────────────────────────────────────────────────────────────────
/* 
 * Visualisation en entonnoir (funnel) montrant la progression : Sends → Openers → Clickers.
 * Affiche pour chaque étape le taux de drop entre les niveaux.
 * Aide à identifier les goulets d'étranglement dans le parcours utilisateur.
 */
export const FunnelViz = ({ g }) => {
  const steps = [
    {
      label: "Sends",
      value: g.sends || 0,
      color: tokens.primary,
      icon: <MailOutlined />,
    },
    {
      label: "Openers",
      value: g.openers || 0,
      color: tokens.success,
      icon: <EyeOutlined />,
    },
    {
      label: "Clickers",
      value: g.clickers || 0,
      color: tokens.warning,
      icon: <LinkOutlined />,
    },
  ];
  const maxVal = steps[0].value || 1;

  return (
    <div style={{ padding: "8px 0" }}>
      {steps.map((step, i) => {
        const widthPct = Math.max((step.value / maxVal) * 100, 12);
        const dropRate =
          i > 0
            ? ((1 - step.value / (steps[i - 1].value || 1)) * 100).toFixed(1)
            : null;
        return (
          <div
            key={step.label}
            style={{ marginBottom: i < steps.length - 1 ? 6 : 0 }}
          >
            {dropRate && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: tokens.danger,
                  fontWeight: 600,
                  marginBottom: 3,
                }}
              >
                <FallOutlined /> -{dropRate}%
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${step.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: step.color,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 28,
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${step.color}22, ${step.color}08)`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 8,
                      width: `${widthPct}%`,
                      background: `linear-gradient(90deg, ${step.color}, ${step.color}cc)`,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 6,
                      transition: "width 0.8s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(step.value)}
                    </span>
                  </div>
                </div>
              </div>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  minWidth: 50,
                  textAlign: "right",
                }}
              >
                {step.label}
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};