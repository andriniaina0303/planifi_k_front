import { pct } from "../../../utils/Helpers"; 
const { Text } = Typography;
import { Typography } from "antd";

// ── RateBar ──────────────────────────────────────────────────────────────────
/* 
 * Composant visuel pour afficher un taux/pourcentage sous forme de barre graduée.
 * Affiche le label, la valeur en %, et une barre remplie proportionnellement.
 * max : valeur maximum pour le calcul du pourcentage (par défaut 100).
 */
export const RateBar = ({ label, value, color, max = 100 }) => (
  <div style={{ marginBottom: 10 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 3,
      }}
    >
      <Text style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 11, fontWeight: 700, color }}>{pct(value)}</Text>
    </div>
    <div
      style={{
        height: 6,
        borderRadius: 3,
        background: "#f3f4f6",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 3,
          width: `${Math.min((Number(value || 0) / max) * 100, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  </div>
);
