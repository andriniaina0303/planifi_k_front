import React, { useState, useEffect, useMemo } from "react";
import { Card, Tag, Tooltip, Pagination, Select, Spin, Empty, Collapse } from "antd";
import {
  TrophyOutlined,
  RiseOutlined,
  TagsOutlined,
  ShopOutlined,
  DatabaseOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;

// ─── Couleurs de rang ────────────────────────────────────────────────────────
const getRankColor = (rank) => {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return "#e0e7ef";
};
const getRankBg = (rank) => {
  if (rank === 1) return "#fffbe6";
  if (rank === 2) return "#f5f5f5";
  if (rank === 3) return "#fff7f0";
  return "#fff";
};

// ─── Badge de rang ───────────────────────────────────────────────────────────
const RankBadge = ({ rank }) => (
  <span style={{
    minWidth: 26, height: 26, borderRadius: "50%",
    background: getRankColor(rank),
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", fontSize: 11,
    color: rank <= 3 ? "#333" : "#888",
    flexShrink: 0,
  }}>
    {rank}
  </span>
);

// ─── Métriques en ligne ──────────────────────────────────────────────────────
const MetricPill = ({ label, value, color = "#555" }) => (
  <span style={{
    fontSize: 11, padding: "2px 8px", borderRadius: 10,
    background: "#f5f7fa", color,
    border: "1px solid #e8eaed",
    whiteSpace: "nowrap",
  }}>
    <span style={{ color: "#999", marginRight: 3 }}>{label}</span>
    <strong>{value}</strong>
  </span>
);

// ─── Ligne Database ──────────────────────────────────────────────────────────
const DatabaseRow = ({ db }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    padding: "7px 12px", marginBottom: 5, borderRadius: 8,
    background: getRankBg(db.rank),
    border: `1px solid ${db.rank <= 3 ? getRankColor(db.rank) : "#f0f0f0"}`,
  }}>
    <RankBadge rank={db.rank} />
    <span style={{ fontSize: 12, fontWeight: db.rank <= 3 ? 600 : 400, color: "#333", minWidth: 140 }}>
      <DatabaseOutlined style={{ color: "#8c8c8c", marginRight: 5 }} />
      {db.database_name}
    </span>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <MetricPill label="CA" value={`${db.total_ca?.toLocaleString("fr-FR")} €`} color="#389e0d" />
      <MetricPill label="eCPM" value={`${db.ecpm}`} color="#1890ff" />
      <MetricPill label="Clickers" value={db.clickers?.toLocaleString("fr-FR")} color="#722ed1" />
    </div>
  </div>
);

// ─── Ligne Advertiser + collapse databases ───────────────────────────────────
const AdvertiserRow = ({ adv }) => {
  const [open, setOpen] = useState(false);
  const bases = (adv.bases || []).slice(0, 10);

  return (
    <div style={{ marginBottom: 6 }}>
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          padding: "8px 12px", borderRadius: 8, cursor: "pointer",
          background: getRankBg(adv.rank),
          border: `1px solid ${adv.rank <= 3 ? getRankColor(adv.rank) : "#e8eaed"}`,
          transition: "box-shadow 0.15s",
          userSelect: "none",
        }}
      >
        <CaretRightOutlined style={{
          fontSize: 11, color: "#aaa",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }} />
        <RankBadge rank={adv.rank} />
        <span style={{ fontSize: 12, fontWeight: adv.rank <= 3 ? 600 : 400, color: "#333", minWidth: 150, flex: 1 }}>
          <ShopOutlined style={{ color: "#8c8c8c", marginRight: 5 }} />
          {adv.adv_name}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <MetricPill label="CA" value={`${adv.total_ca?.toLocaleString("fr-FR")} €`} color="#389e0d" />
          <MetricPill label="eCPM" value={`${adv.ecpm}`} color="#1890ff" />
          <MetricPill label="Clickers" value={adv.clickers?.toLocaleString("fr-FR")} color="#722ed1" />
        </div>
        <Tag color="blue" style={{ fontSize: 10, marginLeft: "auto" }}>
          {bases.length} base{bases.length > 1 ? "s" : ""}
        </Tag>
      </div>

      {open && bases.length > 0 && (
        <div style={{
          marginTop: 4, marginLeft: 24,
          padding: "10px 10px 4px",
          background: "#fafbfc",
          borderRadius: 8,
          border: "1px dashed #d9d9d9",
        }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>
            TOP DATABASES
          </div>
          {bases.map((db) => (
            <DatabaseRow key={db.database_id} db={db} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Carte Tag + collapse advertisers ───────────────────────────────────────
const TagCard = ({ tag, monthLabel, monthColor }) => {
  const [open, setOpen] = useState(false);
  const advertisers = (tag.advertisers || []).slice(0, 10);

  return (
    <div style={{
      borderRadius: 12,
      border: "1px solid #e8eaed",
      marginBottom: 12,
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* Header du tag */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          padding: "12px 16px",
          background: open ? "#f0f5ff" : "#fafafa",
          cursor: "pointer",
          borderBottom: open ? "1px solid #d6e4ff" : "none",
          transition: "background 0.15s",
          userSelect: "none",
        }}
      >
        <CaretRightOutlined style={{
          color: "#1890ff",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }} />
        <RankBadge rank={tag.rank} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1d1d1f", flex: 1 }}>
          <TagsOutlined style={{ color: "#1890ff", marginRight: 6 }} />
          {tag.tag_name}
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <MetricPill label="CA" value={`${tag.total_ca?.toLocaleString("fr-FR")} €`} color="#389e0d" />
          <MetricPill label="eCPM" value={`${tag.ecpm}`} color="#1890ff" />
          <MetricPill label="Clickers" value={tag.clickers?.toLocaleString("fr-FR")} color="#722ed1" />
          <MetricPill label="Score" value={tag.weighted_score} color="#fa8c16" />
        </div>
        <Tag color={monthColor} style={{ fontSize: 10 }}>{monthLabel}</Tag>
        <Tag color="default" style={{ fontSize: 10 }}>
          {advertisers.length} annonceur{advertisers.length > 1 ? "s" : ""}
        </Tag>
      </div>

      {/* Collapse advertisers */}
      {open && (
        <div style={{ padding: "12px 16px", background: "#fff" }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 10, fontWeight: 600, letterSpacing: 0.5 }}>
            TOP ADVERTISERS — cliquez pour voir les databases
          </div>
          {advertisers.length === 0 ? (
            <Empty description="Aucun advertiser" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            advertisers.map((adv) => (
              <AdvertiserRow key={adv.adv_id} adv={adv} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Section mois (current / next) ──────────────────────────────────────────
const MONTH_NAMES = [
  "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const PAGE_SIZE = 5;
const SORT_OPTIONS = [
  { value: "total_ca",      label: "CA"          },
  { value: "ecpm",          label: "eCPM"        },
  { value: "clickers",      label: "Clickers"    },
  { value: "weighted_score",label: "Score"       },
];

const MonthSection = ({ monthData, monthLabel, monthColor }) => {
  const [page, setPage]       = useState(1);
  const [sortBy, setSortBy]   = useState("total_ca");

  const allTags = useMemo(() => {
    const list = monthData?.data || [];
    return [...list].sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
  }, [monthData, sortBy]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allTags.slice(start, start + PAGE_SIZE);
  }, [allTags, page]);

  return (
    <div>
      {/* En-tête mois + filtres */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14, flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {monthColor === "blue"
            ? <TrophyOutlined style={{ color: "#FFD700", fontSize: 16 }} />
            : <RiseOutlined style={{ color: "#52c41a", fontSize: 16 }} />
          }
          <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>
            {monthLabel}
          </span>
          <Tag color={monthColor}>{allTags.length} tags</Tag>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Trier par :</span>
          <Select
            size="small"
            value={sortBy}
            onChange={(v) => { setSortBy(v); setPage(1); }}
            style={{ width: 130 }}
          >
            {SORT_OPTIONS.map((o) => (
              <Option key={o.value} value={o.value}>{o.label}</Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Liste des tags paginée */}
      {paginated.length === 0 ? (
        <Empty description="Aucune donnée" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        paginated.map((tag) => (
          <TagCard
            key={tag.tag_id}
            tag={tag}
            monthLabel={monthLabel}
            monthColor={monthColor}
          />
        ))
      )}

      {/* Pagination */}
      {allTags.length > PAGE_SIZE && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={allTags.length}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
            size="small"
          />
        </div>
      )}
    </div>
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────
const RecommendationPanel = ({ startDate, endDate }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [sortBy,  setSortBy]  = useState("ca");           // tri API
  const [activeMonth, setActiveMonth] = useState("current");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ sort_by: sortBy });
        if (startDate) params.append("start_date", startDate.format?.("YYYY-MM-DD") ?? startDate);
        if (endDate)   params.append("end_date",   endDate.format?.("YYYY-MM-DD")   ?? endDate);

        const res = await fetch(
          `https://pl1.kontikimedia.com:9000/reporting/recommend?${params.toString()}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ RecommendationPanel fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy, startDate, endDate]);

  const currentMonthLabel = data?.current_month
    ? `${MONTH_NAMES[data.current_month.month]} ${data.current_month.year}`
    : "Mois en cours";
  const nextMonthLabel = data?.next_month
    ? `${MONTH_NAMES[data.next_month.month]} ${data.next_month.year}`
    : "Mois prochain";

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TagsOutlined style={{ color: "#1890ff" }} />
          <span>Recommandations par Tags</span>
        </div>
      }
      extra={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Indicateur de tri :</span>
          <Select
            size="small"
            value={sortBy}
            onChange={(v) => { setSortBy(v); }}
            style={{ width: 110 }}
          >
            <Option value="ca">CA</Option>
            <Option value="ecpm">eCPM</Option>
            <Option value="clickers">Clickers</Option>
          </Select>
        </div>
      }
      style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      bodyStyle={{ padding: "16px 20px" }}
    >
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin tip="Chargement des recommandations..." />
        </div>
      )}

      {error && !loading && (
        <Empty
          description={<span style={{ color: "#ff4d4f" }}>Erreur : {error}</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {!loading && !error && data && (
        <>
          {/* Onglets mois */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { key: "current", label: currentMonthLabel, icon: <TrophyOutlined />, color: "#1890ff" },
              { key: "next",    label: nextMonthLabel,    icon: <RiseOutlined />,   color: "#52c41a" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveMonth(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "5px 16px", borderRadius: 20, border: "none",
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  background: activeMonth === tab.key ? tab.color : "#f0f0f0",
                  color: activeMonth === tab.key ? "#fff" : "#555",
                  transition: "all 0.2s",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu du mois actif */}
          {activeMonth === "current" && (
            <MonthSection
              monthData={data.current_month}
              monthLabel={currentMonthLabel}
              monthColor="blue"
            />
          )}
          {activeMonth === "next" && (
            <MonthSection
              monthData={data.next_month}
              monthLabel={nextMonthLabel}
              monthColor="green"
            />
          )}
        </>
      )}
    </Card>
  );
};

export default RecommendationPanel;