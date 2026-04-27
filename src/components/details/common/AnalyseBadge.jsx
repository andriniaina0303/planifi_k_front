import { Tooltip, Tag } from "antd";
import { Typography } from "antd";
const { Text } = Typography;



// ── AnalyseBadges ────────────────────────────────────────────────────────────
/* 
* Rend les analyses sous forme de badges colorés avec infobulle.
* Utilisé pour afficher rapidement les problèmes/insights détectés.
* La couleur est déterminée par les emojis du texte d'analyse.
*/
export const AnalyseBadges = ({ analyses, compact = false }) => {
  
  /* 
   * Détermine la couleur d'un tag en fonction des emojis présents dans le texte.
   * Permet de visualiser rapidement le statut des analyses (success, warning, error).
   */
  const tagColor = (txt) => {
    if (!txt) return "default";
    if (txt.includes("🟢") || txt.includes("✅")) return "success";
    if (txt.includes("🟡") || txt.includes("🔶") || txt.includes("😐"))
      return "warning";
    if (txt.includes("🔴") || txt.includes("🚨")) return "error";
    if (txt.includes("⚠️")) return "warning";
    if (txt.includes("🔥")) return "purple";
    if (txt.includes("👍")) return "processing";
    return "default";
  };
  if (!analyses || Object.keys(analyses).length === 0)
    return (
  <Text type="secondary" style={{ fontSize: 11 }}>
        Aucune analyse
      </Text>
    );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {Object.entries(analyses).map(([k, v]) => (
        <Tooltip key={k} title={k}>
          <Tag
            color={tagColor(v)}
            style={{
              fontSize: compact ? 10 : 11,
              margin: 0,
              borderRadius: 6,
              fontWeight: 500,
              padding: compact ? "0 6px" : "2px 8px",
              lineHeight: compact ? "18px" : "22px",
              maxWidth: compact ? 150 : 220,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {v}
          </Tag>
        </Tooltip>
      ))}
    </div>
  );
};