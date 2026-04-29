/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KPICARDADVERTISER.JSX - Carte KPI pour les annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Composant de carte affichant une métrique clé (KPI) :
 * - Sends (envois)
 * - Open (ouvertures)
 * - Click (clics)
 * - Unsub (désabonnements)
 * - CTR (taux de clic)
 * 
 * Chaque carte affiche une icône, un label, et la valeur formatée.
 */

import React from "react";
import { Card, Col } from "antd";
import {
  MailOutlined,
  EyeOutlined,
  LinkOutlined,
  StopOutlined,
} from "@ant-design/icons";

/**
 * Retourne l'icône appropriée en fonction du label du KPI
 * 
 * @param {string} label - Nom du KPI (case-insensitive)
 * @param {string} color - Couleur à appliquer à l'icône
 * @returns {JSX.Element|null} Composant icône ou null si label non reconnu
 */
const getIcon = (label, color) => {
  const style = { marginRight: 6, color, fontSize: 25 };
  switch (label.toLowerCase()) {
    case "sends":
      return <MailOutlined style={style} />;
    case "open":
      return <EyeOutlined style={style} />;
    case "click":
    case "ctr":
      return <LinkOutlined style={style} />;
    case "unsub":
      return <StopOutlined style={style} />;
    default:
      return null;
  }
};

/**
 * Composant KpiCardAdvertiser
 * Affiche une métrique clé dans une carte avec icône et valeur
 * 
 * @component
 * @param {Object} props
 * @param {string} props.label - Nom du KPI (ex: "Sends", "Open", "Click")
 * @param {string|number} props.value - Valeur à afficher
 * @param {string} props.color - Couleur pour l'icône et la barre de haut
 * @returns {JSX.Element} Carte KPI responsive
 * @example
 * <KpiCardAdvertiser 
 *   label="Sends" 
 *   value={5242} 
 *   color="#1890ff"
 * />
 */
const KpiCardAdvertiser = ({ label, value, color }) => {
  const Icon = getIcon(label, color);

  return (
    <Col xs={24} sm={12} md={8} lg={4}>
      <Card
        style={{
          borderRadius: 10,
          background: "#1e1e2f",
          border: "none",
          position: "relative",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
        bodyStyle={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Barre de couleur en haut de la carte */}
        <div
          style={{
            height: 3,
            width: "100%",
            backgroundColor: color,
            borderRadius: "4px 4px 0 0",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        
        {/* Section gauche : Icône et label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 12,
            color: "#aaa",
          }}
        >
          {Icon}
          <span>{label}</span>
        </div>
        
        {/* Section droite : Valeur */}
        <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
          {value}
        </div>
      </Card>
    </Col>
  );
};

export default KpiCardAdvertiser;