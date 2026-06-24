import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Tag, Tooltip } from "antd";
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
      <Tooltip
        title={`eCPM: ${item.ecpm ?? "-"}`}
      >
        <span style={{ fontSize: 13, fontWeight: item.rank <= 3 ? 600 : 400, color: "#333" }}>
          {item[nameKey]?.trim() ?? "—"}
        </span>
      </Tooltip>
    </div>
    
  </div>
);

// ─── Paire de cards (mois en cours + mois prochain) ──────────────────────────s
const MonthPair = ({ currentMonth, nextMonth, nameKey, title }) => {
  const [showAll, setShowAll] = useState({ current: false, next: false });

  const renderList = (monthData, key) => {
    const list = monthData?.data || [];
    const displayed = showAll[key] ? list : list.slice(0, 5);
    return (
      <>
        {displayed.map((item, i) => (
          <ItemRow key={item.database_id ?? item.advertiser_id ?? item.tag_id ?? i} item={item} nameKey={nameKey} />
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
    <div style={{ minWidth: "100%", padding: "0 4px", boxSizing: "border-box" }}>
      {/* Titre de section */}
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#555",
        marginBottom: 10,
        paddingLeft: 4,
        borderLeft: "3px solid #1890ff",
        paddingLeft: 8,
      }}>
        {title}
      </div>

      <Row gutter={12}>
        {/* Mois en cours */}
        <Col span={12}>
          <Card
            size="small"
            title={
              <span>
                <TrophyOutlined style={{ color: "#FFD700", marginRight: 6 }} />
                <strong>{MONTH_NAMES[currentMonth?.month]} {currentMonth?.year}</strong>
                <Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>Mois en cours</Tag>
              </span>
            }
            style={{ borderRadius: 10 }}
            bodyStyle={{ padding: "10px 12px" }}
          >
            {renderList(currentMonth, "current")}
          </Card>
        </Col>

        {/* Mois prochain */}
        <Col span={12}>
          <Card
            size="small"
            title={
              <span>
                <RiseOutlined style={{ color: "#52c41a", marginRight: 6 }} />
                <strong>{MONTH_NAMES[nextMonth?.month]}</strong>
                <Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>Mois prochain</Tag>
              </span>
            }
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

// ─── Composant principal ──────────────────────────────────────────────────────
const RecommendationPanel = ({ databases, advertisers, tags }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef(null);

  const slides = [
    {
      key: "databases",
      title: "Recommandation des databases par eCPM",
      nameKey: "database_name",
      data: databases,
    },
    {
      key: "advertisers",
      title: "Recommandation des advertisers par eCPM",
      nameKey: "adv_name",
      data: advertisers,
    },
    {
      key: "tags",
      title: "Recommandation des tags par eCPM",
      nameKey: "tag_name",
      data: tags,
    },
  ].filter((s) => s.data);

  // Auto-slide toutes les 6 secondes
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  useEffect(() => {
    if (slides.length > 1) startTimer();
    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const goTo = (idx) => {
    setActiveSlide(idx);
    clearInterval(intervalRef.current);
    startTimer(); // repart depuis 0 après clic manuel
  };

  if (!slides.length) return null;

  const current = slides[activeSlide];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {/* ── Onglets / indicateurs ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => goTo(i)}
            style={{
              padding: "4px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontWeight: i === activeSlide ? 700 : 400,
              fontSize: 12,
              background: i === activeSlide ? "#1890ff" : "#f0f0f0",
              color: i === activeSlide ? "#fff" : "#555",
              transition: "all 0.25s",
            }}
          >
            {s.key === "databases" ? "🗄️ Databases" : s.key === "advertisers" ? "📢 Advertisers" : "🏷️ Tags"}
          </button>
        ))}

        {/* Barre de progression */}
        {/* <div style={{ flex: 1, height: 3, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
          <div
            key={activeSlide} // reset l'animation à chaque changement
            style={{
              height: "100%",
              background: "#1890ff",
              borderRadius: 4,
              animation: "progress 6s linear forwards",
            }}
          />
        </div> */}
      </div>

      {/* ── Contenu animé ── */}
      <div
        key={activeSlide}
        style={{ animation: "fadeSlide 0.4s ease" }}
      >
        <MonthPair
          currentMonth={current.data?.current_month}
          nextMonth={current.data?.next_month}
          nameKey={current.nameKey}s
          title={current.title}
        />
      </div>

      {/* ── Styles CSS keyframes ── */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}
      </style>
    </div>
  );
};

export default RecommendationPanel;