import React, { useState } from "react";
import { Card, Row, Col, Tag, Tooltip, List } from "antd";
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

const ItemRow = ({ item, nameKey }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    marginBottom: 6,
    borderRadius: 8,
    background: getRankBg(item.rank),
    border: `1px solid ${item.rank <= 3 ? getRankColor(item.rank) : "#f0f0f0"}`,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        minWidth: 28, height: 28, borderRadius: "50%",
        background: getRankColor(item.rank),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: "bold", fontSize: 12,
        color: item.rank <= 3 ? "#333" : "#888",
      }}>
        {item.rank}
      </span>
      <Tooltip title={` eCPM: ${item.ecpm ?? "-"}`}>
        <span style={{ fontSize: 13, fontWeight: item.rank <= 3 ? 600 : 400, color: "#333" }}>
          {item[nameKey]?.trim() ?? "—"}
        </span>
      </Tooltip>
    </div>
   
  </div>
);

const MonthPair = ({ currentMonth, nextMonth, nameKey, title }) => {
  const [showAll, setShowAll] = useState({ current: false, next: false });

  const renderList = (monthData, key) => {
    const list = monthData?.data || [];
    const displayed = showAll[key] ? list : list.slice(0, 5);
    return (
      <List
        rowKey="tag_id"
        dataSource={list}
        pagination={{
          size: "small",
          align:"center",
          hideOnSinglePage: true,
          pageSize : 5
        }}
        renderItem={(item) => 
          <ItemRow  item={item} nameKey={nameKey} />
        }
      />
    );
  };

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 10, borderLeft: "3px solid #1890ff", paddingLeft: 8 }}>
        {title}
      </div>
      <Row gutter={12}>
        <Col span={12}>
          <Card
            size="small"
            title={<span><TrophyOutlined style={{ color: "#FFD700", marginRight: 6 }} /><strong>{MONTH_NAMES[currentMonth?.month]} {currentMonth?.year}</strong><Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>Mois en cours</Tag></span>}
            style={{ borderRadius: 10 }}
            bodyStyle={{ padding: "10px 12px" }}
          >
            {renderList(currentMonth, "current")}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            title={<span><RiseOutlined style={{ color: "#52c41a", marginRight: 6 }} /><strong>{MONTH_NAMES[nextMonth?.month]}</strong><Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>Mois prochain</Tag></span>}
            style={{ borderRadius: 10 }}
            bodyStyle={{ padding: "10px 12px" }}
          >
            {renderList(nextMonth, "next")}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const RecommendationPanel = ({ tags }) => {

  const sections = 
    { key: "tags", label: "🏷️ Tags", title: "Recommandation des tags par eCPM", nameKey: "tag_name", data: tags }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #f0f0f0",
      padding: "16px 20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}>

      {/* Contenu de l'onglet actif */}
      <MonthPair
        key={tags?.length}
        currentMonth={sections.data?.current_month}
        nextMonth={sections.data?.next_month}
        nameKey={sections.nameKey}
        title={sections.title}
      />
    </div>
  );
};

export default RecommendationPanel;