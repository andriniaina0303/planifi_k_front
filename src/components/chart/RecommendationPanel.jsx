// src/components/chart/RecommendationPanel.jsx
import React, { useState } from "react";
import { Card, Row, Col, Tag, Tooltip, Badge } from "antd";
import { TrophyOutlined, RiseOutlined } from "@ant-design/icons";

const MONTH_NAMES = [
  "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const getRankColor = (rank) => {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return "#e8f4fd";
};

const getRankBg = (rank) => {
  if (rank === 1) return "#fffbe6";
  if (rank === 2) return "#f5f5f5";
  if (rank === 3) return "#fff7f0";
  return "#fff";
};

const DatabaseRow = ({ item }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 12px",
      marginBottom: 6,
      borderRadius: 8,
      background: getRankBg(item.rank),
      border: `1px solid ${item.rank <= 3 ? getRankColor(item.rank) : "#f0f0f0"}`,
      transition: "box-shadow 0.2s",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          minWidth: 28,
          height: 28,
          borderRadius: "50%",
          background: getRankColor(item.rank),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 12,
          color: item.rank <= 3 ? "#333" : "#888",
        }}
      >
        {item.rank}
      </span>
      <Tooltip title={`Sends: ${item.sends?.toLocaleString()} | Open rate: ${item.open_rate}% | Click rate: ${item.click_rate}%`}>
        <span style={{ fontSize: 13, fontWeight: item.rank <= 3 ? 600 : 400, color: "#333" }}>
          {item.database_name?.trim()}
        </span>
      </Tooltip>
    </div>
   
  </div>
);

const RecommendationPanel = ({ data }) => {
  const [showAll, setShowAll] = useState({ current: false, next: false });

  if (!data) return null;

  const { current_month, next_month } = data;

  const renderList = (monthData, key) => {
    const list = monthData?.data || [];
    const displayed = showAll[key] ? list : list.slice(0, 5);

    return (
      <>
        {displayed.map((item) => (
          <DatabaseRow key={item.database_id} item={item} />
        ))}
        {list.length > 5 && (
          <div
            style={{ textAlign: "center", marginTop: 8, cursor: "pointer", color: "#1890ff", fontSize: 12 }}
            onClick={() => setShowAll((prev) => ({ ...prev, [key]: !prev[key] }))}
          >
            {showAll[key] ? "▲ Voir moins" : `▼ Voir les ${list.length - 5} autres`}
          </div>
        )}
      </>
    );
  };

  return (
    <Row gutter={12} style={{ marginTop: 16 }}>
      {/* Mois en cours */}
      <Col span={12}>
       
        <Card
          size="small"
          title={
            <span>
              <TrophyOutlined style={{ color: "#FFD700", marginRight: 6 }} />
               <strong>{MONTH_NAMES[current_month?.month]} {current_month?.year}</strong>
              <Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>Mois en cours</Tag>
            </span>
          }
          style={{ borderRadius: 10 }}
          bodyStyle={{ padding: "10px 12px" }}
        >
          {renderList(current_month, "current")}
        </Card>
      </Col>

      {/* Mois prochain */}
      <Col span={12}>
        <Card
          size="small"
          title={
            <span>
              <RiseOutlined style={{ color: "#52c41a", marginRight: 6 }} />
              <strong>{MONTH_NAMES[next_month?.month]}</strong>
              <Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>Mois prochain</Tag>
            </span>
          }
          style={{ borderRadius: 10 }}
          bodyStyle={{ padding: "10px 12px" }}
        >
          {renderList(next_month, "next")}
        </Card>
      </Col>
    </Row>
  );
};

export default RecommendationPanel;