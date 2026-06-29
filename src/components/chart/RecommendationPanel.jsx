import React, { useState, useMemo } from "react";
import { Row, Col, Tag, List, Select, Card } from "antd";
import { TrophyOutlined, RiseOutlined, CaretRightOutlined, ShopOutlined, DatabaseOutlined, TagsOutlined } from "@ant-design/icons";

const { Option } = Select;

const MONTH_NAMES = [
  "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const SORT_OPTIONS = [
  { value: "total_ca",  label: "CA"       },
  { value: "ecpm",      label: "eCPM"     },
  { value: "clickers",  label: "Clickers" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MetricPill = ({ label, value, color = "#555" }) => (
  <span style={{
    fontSize: 11, padding: "2px 8px", borderRadius: 10,
    background: "#f5f7fa", color,
    border: "1px solid #e8eaed", whiteSpace: "nowrap",
  }}>
    <span style={{ color: "#aaa", marginRight: 3 }}>{label}</span>
    <strong>{value}</strong>
  </span>
);

const Chevron = ({ open }) => (
  <CaretRightOutlined style={{
    fontSize: 11, color: "#aaa",
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.2s", flexShrink: 0,
  }} />
);

// ─── Ligne Database ───────────────────────────────────────────────────────────
const DatabaseRow = ({ db }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
    padding: "6px 10px", marginBottom: 4, borderRadius: 8,
    background: "#fafafa", border: "1px solid #f0f0f0",
  }}>
    <DatabaseOutlined style={{ color: "#8c8c8c", fontSize: 12 }} />
    <span style={{ fontSize: 12, fontWeight: 400, color: "#333", flex: 1, minWidth: 100 }}>
      {db.database_name}
    </span>
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      <MetricPill label="eCPM"     value={db.ecpm}                                     color="#1890ff" />
      <MetricPill label="CA"       value={`${db.total_ca?.toLocaleString("fr-FR")} €`} color="#389e0d" />
      <MetricPill label="Clickers" value={db.clickers?.toLocaleString("fr-FR")}        color="#722ed1" />
    </div>
  </div>
);

// ─── Ligne Advertiser (contrôlé par le parent) ────────────────────────────────
const AdvertiserRow = ({ adv, isOpen, onToggle }) => {
  const bases = adv.bases || [];

  return (
    <div style={{ marginBottom: 5 }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          padding: "7px 10px", borderRadius: 8, cursor: "pointer",
          background: isOpen ? "#f6ffed" : "#fff",
          border: `1px solid ${isOpen ? "#b7eb8f" : "#f0f0f0"}`,
          transition: "background 0.15s",
          userSelect: "none",
        }}
      >
        <Chevron open={isOpen} />
        <ShopOutlined style={{ color: "#8c8c8c", fontSize: 12 }} />
        <span style={{ fontSize: 12, fontWeight: 400, color: "#333", flex: 1, minWidth: 100 }}>
          {adv.adv_name}
        </span>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <MetricPill label="eCPM"     value={adv.ecpm}                                      color="#1890ff" />
          <MetricPill label="CA"       value={`${adv.total_ca?.toLocaleString("fr-FR")} €`} color="#389e0d" />
          <MetricPill label="Clickers" value={adv.clickers?.toLocaleString("fr-FR")}         color="#722ed1" />
        </div>
        <Tag color="default" style={{ fontSize: 10, marginLeft: "auto" }}>
          {bases.length} base{bases.length > 1 ? "s" : ""}
        </Tag>
      </div>

      {/* 👑 Un seul advertiser ouvert à la fois — bases scrollables */}
      {isOpen && bases.length > 0 && (
        <div style={{
          marginTop: 3, marginLeft: 20,
          padding: "8px 10px 4px",
          background: "#fafbfc",
          borderRadius: 8,
          border: "1px dashed #d9d9d9",
          maxHeight: 280,
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>
            TOP DATABASES
          </div>
          {bases.map((db) => <DatabaseRow key={db.database_id} db={db} />)}
        </div>
      )}
    </div>
  );
};

// ─── Item Tag (contrôlé par MonthSection) ────────────────────────────────────
const TagItem = ({ item, nameKey, isOpen, onToggle }) => {
  const [openAdvId, setOpenAdvId] = useState(null); // 👑 un seul advertiser ouvert

  const advertisers = item.advertisers || [];

  const handleAdvToggle = (advId) => {
    setOpenAdvId((prev) => (prev === advId ? null : advId));
  };

  // Reset advertisers quand le tag se ferme
  React.useEffect(() => {
    if (!isOpen) setOpenAdvId(null);
  }, [isOpen]);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          padding: "10px 12px", borderRadius: 10, cursor: "pointer",
          background: isOpen ? "#f0f5ff" : "#fff",
          border: `1px solid ${isOpen ? "#d6e4ff" : "#f0f0f0"}`,
          userSelect: "none", transition: "background 0.15s",
        }}
      >
        <Chevron open={isOpen} />
        <TagsOutlined style={{ color: "#1890ff", fontSize: 12 }} />
        <span style={{ fontSize: 13, fontWeight: 400, color: "#1d1d1f", flex: 1, minWidth: 80 }}>
          {item[nameKey]?.trim() ?? "—"}
        </span>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <MetricPill label="eCPM"     value={item.ecpm}                                      color="#1890ff" />
          <MetricPill label="CA"       value={`${item.total_ca?.toLocaleString("fr-FR")} €`} color="#389e0d" />
          <MetricPill label="Clickers" value={item.clickers?.toLocaleString("fr-FR")}         color="#722ed1" />
        </div>
        <Tag color="default" style={{ fontSize: 10 }}>
          {advertisers.length} annonceur{advertisers.length > 1 ? "s" : ""}
        </Tag>
      </div>

      {isOpen && (
        <div style={{
          marginTop: 4, marginLeft: 16,
          padding: "10px 12px 6px",
          background: "#fff",
          borderRadius: 8,
          border: "1px dashed #d6e4ff",
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
            TOP ADVERTISERS — cliquez pour voir les databases
          </div>
          {advertisers.length === 0
            ? <div style={{ color: "#ccc", fontSize: 12 }}>Aucun advertiser</div>
            : advertisers.map((adv) => (
                <AdvertiserRow
                  key={adv.adv_id}
                  adv={adv}
                  isOpen={openAdvId === adv.adv_id}          // 👑 contrôlé par le parent
                  onToggle={() => handleAdvToggle(adv.adv_id)} // 👑 un seul à la fois
                />
              ))
          }
        </div>
      )}
    </div>
  );
};

// ─── Section mois ─────────────────────────────────────────────────────────────
const MonthSection = ({ monthData, nameKey, monthIcon, monthLabel, monthTag }) => {
  const [sortBy, setSortBy]       = useState("ecpm");
  const [openTagId, setOpenTagId] = useState(null); // 👑 un seul tag ouvert à la fois

  const list = monthData?.data || [];
    

  const handleTagToggle = (tagId) => {
    setOpenTagId((prev) => (prev === tagId ? null : tagId));
  };

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, flexWrap: "wrap", gap: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
          {monthIcon} {monthLabel} {monthTag}
        </span>
        
      </div>

      <List
        rowKey="tag_id"
        dataSource={list}
        pagination={{
          size: "small",
          position: "bottom",
          hideOnSinglePage: true,
          pageSize: 5,
        }}
        renderItem={(item) => (
          <TagItem
            item={item}
            nameKey={nameKey}
            isOpen={openTagId === item.tag_id}
            onToggle={() => handleTagToggle(item.tag_id)}
          />
        )}
      />
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const RecommendationPanel = ({ tags, onSortChange, sortBy, isLoading, styles }) => {
  const sections = {
    nameKey: "tag_name",
    title: "Recommandation des tags",
    data: tags,
  };
  if (isLoading) {
      return (
        <Card>
          <div style={styles.loaderContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.text}>Loading All Recommendations by {sortBy}...</p>
          </div>
        </Card>
      );
    }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #f0f0f0",
      padding: "16px 20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16, flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
          <TagsOutlined style={{ color: "#1890ff" }} />
          {sections.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Trier :</span>
          <Select size="small" value={sortBy} onChange={onSortChange} style={{ width: 110 }}>
            <Option value="ca">CA</Option>
            <Option value="ecpm">eCPM</Option>
            <Option value="clickers">Clickers</Option>
          </Select>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <MonthSection
            monthData={sections.data?.current_month}
            nameKey={sections.nameKey}
            monthIcon={<TrophyOutlined style={{ color: "#FFD700" }} />}
            monthLabel={`${MONTH_NAMES[sections.data?.current_month?.month] ?? ""} ${sections.data?.current_month?.year ?? ""}`}
            monthTag={<Tag color="blue" style={{ fontSize: 10 }}>Mois en cours</Tag>}
          />
        </Col>
        <Col span={12}>
          <MonthSection
            monthData={sections.data?.next_month}
            nameKey={sections.nameKey}
            monthIcon={<RiseOutlined style={{ color: "#52c41a" }} />}
            monthLabel={`${MONTH_NAMES[sections.data?.next_month?.month] ?? ""} ${sections.data?.next_month?.year ?? ""}`}
            monthTag={<Tag color="green" style={{ fontSize: 10 }}>Mois prochain</Tag>}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RecommendationPanel;