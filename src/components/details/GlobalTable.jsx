import 
{   Card, 
    Table, 
    Progress, 
    Popover, 
    Modal, 
    Typography, 
    Tooltip, 
    Tag, 
    Tabs, 
    Row, 
    Col,
    Divider
 } from "antd";
import {LinkOutlined, DatabaseOutlined, EyeOutlined, MailOutlined, DollarOutlined, StopOutlined, FireOutlined, DashboardOutlined, PieChartOutlined} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { AnalyseBadges } from "./common/AnalyseBadge";
import { getHealthColor,getHealthScore } from "../../utils/healthKitFunc";
import { HealthExplainer } from "../healthComponents/HealthKit";
import { pct, fmt, usd } from "../../utils/Helpers";
import { tokens } from "../../utils/Tokens";
import { decodeBase64 } from "../../utils/utils";
import { RateBar } from "./common/RateBar";
import { FunnelViz } from "./common/FunnelViz";
import { DimSection } from "./common/DimSection";


const { Text } = Typography;



const CHART_PALETTE = [ 
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#84cc16",
  "#e11d48",
];

// ── BrandSection columns ─────────────────────────────────────────────────────
/* 
 * Définition des colonnes du tableau pour l'affichage des Brands (marques).
 * Colonnes : Brand, Subject, Sends, Openers, Clickers, Unsubs, Open %, CTR %, CTO %, Unsub %.
 * Chaque colonne est triable et formatée selon son type (nombre, pourcentage, texte).
 */
const brandCols = [
  {
    title: "Brand",
    dataIndex: "name",
    fixed: "left",
    width: 140,
    render: (_, v) => (
      <>
        <Text strong style={{ fontSize: 12 }}>
          {decodeBase64(v.name)}
        </Text>
        <Tooltip title={v.creativities}>
          <a
            href={v.creativities}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color: tokens.primary,
              maxWidth: 170,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            <LinkOutlined style={{ marginRight: 4 }} />
            Lien du kit
          </a>
        </Tooltip>
      </>
    ),
  },
  {
    title: "Subject",
    dataIndex: "subject",
    fixed: "left",
    // width: 450,
    render: (v) => (
      <Text ellipsis = {{tooltip:true}} strong style={{ width:500, fontSize: 12 }}>
        {decodeBase64(v)}
      </Text>
    ),
  },
  {
    title: "Segment",
    dataIndex: "SL",
    fixed: "left",
    render: fmt,
    sorter: (a, b) => a.sends - b.sends,
  },
  {
    title: "Leads validés",
    dataIndex: "VL",
    fixed: "left",
    render: fmt,
    sorter: (a, b) => a.sends - b.sends,
  },
  {
    title: "Id routeur",
    dataIndex: "id_routers",
    render: fmt,
    align: "right",
  },
  {
    title: "Sends",
    dataIndex: "sends",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
    align: "right",
  },
  {
    title: "Openers",
    dataIndex: "openers",
    sorter: (a, b) => a.openers - b.openers,
    render: fmt,
    align: "right",
  },
  {
    title: "Clickers",
    dataIndex: "clickers",
    sorter: (a, b) => a.clickers - b.clickers,
    render: fmt,
    align: "right",
  },
  {
    title: "Unsubs",
    dataIndex: "unsubs",
    sorter: (a, b) => a.unsubs - b.unsubs,
    render: fmt,
    align: "right",
  },
  {
    title: "Open %",
    dataIndex: "taux_openers",
    sorter: (a, b) => (a.taux_openers || 0) - (b.taux_openers || 0),
    render: (v) => (
      <Text style={{ color: tokens.success, fontWeight: 600 }}>{pct(v)}</Text>
    ),
    align: "right",
  },
  {
    title: "CTR %",
    dataIndex: "taux_clickers",
    sorter: (a, b) => a.taux_clickers - b.taux_clickers,
    render: (v) => (
      <Text style={{ color: tokens.warning, fontWeight: 600 }}>{pct(v)}</Text>
    ),
    align: "right",
  },
  {
    title: "CTO %",
    dataIndex: "taux_cto",
    sorter: (a, b) => a.taux_cto - b.taux_cto,
    render: pct,
    align: "right",
  },
  {
    title: "Unsub %",
    dataIndex: "taux_unsubs",
    sorter: (a, b) => a.taux_unsubs - b.taux_unsubs,
    render: (v) => (
      <Text style={{ color: tokens.danger, fontWeight: 600 }}>{pct(v)}</Text>
    ),
    align: "right",
  },
];



// ── BaseCard ─────────────────────────────────────────────────────────────────
/* 
 * Affiche le détail complet d'une base de données en carte collapsible.
 * Contient 3 onglets : Aperçu (KPIs + Funnel), Brands (tableau/chart), Dimensions (segments).
 * Affiche la classification (A/B/C/D), l'indicateur de santé, et les KPIs clés en header.
 */
const BaseCard = ({ base, viewMode, allbase, clsConfig, styles }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const cls = clsConfig[base.classification] || clsConfig.C;
  const health = getHealthScore(base);
  const dbMap = Object.fromEntries(allbase.map((db) => [db.id, db.basename]));
  return (
    <Card
      style={{
        ...styles.card,
        marginBottom: 16,
        borderLeft: `4px solid ${cls.color}`,
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header avec sends, CTR, unsub rate */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          background: `linear-gradient(90deg, ${cls.bg}, transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `${cls.color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: cls.color,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <DatabaseOutlined />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {dbMap[base.database_id]}
              </Text>
              <span
                style={{
                  ...styles.badge,
                  color: cls.color,
                  background: cls.bg,
                }}
              >
                {cls.icon} {cls.label}
              </span>
              <Tag
                color="purple"
                style={{
                  borderRadius: 6,
                  fontSize: 10,
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                Router {base.id_routers}
              </Tag>
            </div>
            {base.date_schedule && (
              <Text style={{ fontSize: 11, color: "#9ca3af" }}>
                Planifié: {base.date_schedule.join(", ")}
              </Text>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Mini health */}
          <Popover
            content={<HealthExplainer g={base} />}
            title={null}
            trigger="click"
            placement="bottomRight"
          >
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <Progress
                type="circle"
                percent={health}
                width={40}
                strokeWidth={8}
                strokeColor={getHealthColor(health)}
                trailColor="#f3f4f6"
                format={() => (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: getHealthColor(health),
                    }}
                  >
                    {health}
                  </span>
                )}
              />
            </div>
          </Popover>

          {/* KPIs inline dans le header */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              {
                l: "Sends",
                v: fmt(base.sends),
                c: tokens.primary,
                icon: <MailOutlined />,
              },
              {
                l: "Open%",
                v: pct(base.taux_openers),
                c: tokens.success,
                icon: <EyeOutlined />,
              },
              {
                l: "CTR%",
                v: pct(base.taux_clickers),
                c: tokens.warning,
                icon: <LinkOutlined />,
              },
              {
                l: "Unsub%",
                v: pct(base.taux_unsubs),
                c: tokens.danger,
                icon: <StopOutlined />,
              },
            ].map(({ l, v, c, icon }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: c, fontSize: 10 }}>{icon}</span>
                  {l}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 20px 16px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{ marginBottom: 0 }}
          items={[
            {
              key: "overview",
              label: (
                <span>
                  <DashboardOutlined /> Vue globale
                </span>
              ),
              children: (
                <Row gutter={[16, 16]} style={{ paddingTop: 8 }}>
                  <Col xs={24} md={14}>
                    <Row gutter={[10, 10]}>
                      {[
                        {
                          l: "Sends",
                          v: fmt(base.sends),
                          c: tokens.primary,
                          i: <MailOutlined />,
                        },
                        {
                          l: "Openers",
                          v: fmt(base.openers),
                          c: tokens.success,
                          i: <EyeOutlined />,
                        },
                        {
                          l: "Clickers",
                          v: fmt(base.clickers),
                          c: tokens.warning,
                          i: <LinkOutlined />,
                        },
                        {
                          l: "Unsubs",
                          v: fmt(base.unsubs),
                          c: tokens.danger,
                          i: <StopOutlined />,
                        },
                        {
                          l: "eCPM",
                          v: usd(base.ecpm),
                          c: tokens.purple,
                          i: <DollarOutlined />,
                        },
                        {
                          l: "CA",
                          v: usd(base.ca),
                          c: tokens.cyan,
                          i: <DollarOutlined />,
                        },
                      ].map(({ l, v, c, i }) => (
                        <Col key={l} xs={8}>
                          <div
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid #f3f4f6",
                              background: "#fafafa",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span style={{ color: c }}>{i}</span>
                              {l}
                            </div>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#111827",
                              }}
                            >
                              {v}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    <div style={{ marginTop: 12 }}>
                      <RateBar
                        label="Open Rate"
                        value={base.taux_openers}
                        color={tokens.success}
                        max={50}
                      />
                      <RateBar
                        label="Click Rate"
                        value={base.taux_clickers}
                        color={tokens.warning}
                        max={10}
                      />
                      <RateBar
                        label="Unsub Rate"
                        value={base.taux_unsubs}
                        color={tokens.danger}
                        max={2}
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={10}>
                    <div style={{ marginBottom: 12 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        Funnel de conversion
                      </Text>
                    </div>
                    <FunnelViz g={base} />
                    <Divider style={{ margin: "12px 0" }} />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 6,
                        display: "block",
                      }}
                    >
                      Analyses
                    </Text>
                    <AnalyseBadges analyses={base.analyses} />
                  </Col>
                </Row>
              ),
            },
            {
              key: "brands",
              label: (
                <span>
                  <FireOutlined /> Brands ({base.brands?.length || 0})
                </span>
              ),
              children: (
                <div style={{ paddingTop: 8 }}>
                  {viewMode === "chart" ? (
                    <Row gutter={[14, 14]}>
                      <Col xs={24} lg={14}>
                        <SmartChart
                          type="bar"
                          labels={
                            base.brands?.map((b) => decodeBase64(b.name)) || []
                          }
                          height={240}
                          datasets={[
                            {
                              label: "Sends",
                              data: base.brands?.map((b) => b.sends) || [],
                              backgroundColor: `${tokens.primary}77`,
                              borderColor: tokens.primary,
                              borderWidth: 1.5,
                              borderRadius: 5,
                            },
                            {
                              label: "Openers",
                              data: base.brands?.map((b) => b.openers) || [],
                              backgroundColor: `${tokens.success}77`,
                              borderColor: tokens.success,
                              borderWidth: 1.5,
                              borderRadius: 5,
                            },
                            {
                              label: "Clickers",
                              data: base.brands?.map((b) => b.clickers) || [],
                              backgroundColor: `${tokens.warning}77`,
                              borderColor: tokens.warning,
                              borderWidth: 1.5,
                              borderRadius: 5,
                            },
                          ]}
                        />
                      </Col>
                      <Col xs={24} lg={10}>
                        <SmartChart
                          type="doughnut"
                          labels={base.brands?.map((b) => b.name) || []}
                          height={240}
                          datasets={[
                            {
                              data: base.brands?.map((b) => b.sends) || [],
                              backgroundColor: CHART_PALETTE.slice(
                                0,
                                base.brands?.length || 0,
                              ),
                              borderWidth: 2,
                              borderColor: "#fff",
                            },
                          ]}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <Table
                      dataSource={
                        base.brands?.map((b, i) => ({ key: i, ...b })) || []
                      }
                      columns={brandCols}
                      size="small"
                      pagination={{
                        pageSize: 8,
                        size: "small",
                        showSizeChanger: false,
                      }}
                      scroll={{ x: 1400 }}
                    />
                  )}
                </div>
              ),
            },
            {
              key: "dimensions",
              label: (
                <span>
                  <PieChartOutlined /> Dimensions
                </span>
              ),
              children: (
                <div style={{ paddingTop: 8 }}>
                  <DimSection
                    dimensions={base.dimensions}
                    viewMode={viewMode}
                    hideFilters
                    styles={styles}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};




// ── GlobalTable ──────────────────────────────────────────────────────────────
/* 
 * Affiche la liste de toutes les bases en tableau avec filtres et tri.
 * Colonnes : Database, Classe, Health, Sends, Openers, Open %, Clickers, CTR %, Unsubs, CA, eCPM, Analyses.
 * Clic sur une ligne ouvre un modal avec le détail de la base (BaseCard).
 */
export const GlobalTable = ({ bases, allbase, clsConfig, styles}) => {
  const [f, setF] = useState({ minSends: null, cls: null });
  const [selectedBase, setSelectedBase] = useState(null); // ← ajout
  const rows = useMemo(() => {
    let d = bases.map((b) => ({ key: b.database_id, ...b }));
    if (f.minSends) d = d.filter((r) => r.sends >= f.minSends);
    if (f.cls) d = d.filter((r) => r.classification === f.cls);
    return d;
  }, [bases, f]);

  const dbMap = Object.fromEntries(allbase.map((db) => [db.id, db.basename]));
  const cols = [
    {
      title: "Database",
      dataIndex: "database_id",
      fixed: "left",
      width: 180,
      render: (v) => (
        <Text strong style={{ fontSize: 12 }}>
          {dbMap[v] || `DB #${v}`}
        </Text>
      ),
    },

    {
      title: "Classe",
      dataIndex: "classification",
      width: 110,
      render: (v) => {
        const c = clsConfig[v] || clsConfig.C;
        return (
          <span style={{ ...styles.badge, color: c.color, background: c.bg }}>
            {c.icon} {c.label}
          </span>
        );
      },
    },
    {
      title: "Health",
      width: 80,
      render: (_, r) => {
        const s = getHealthScore(r);
        return (
          <Progress
            type="circle"
            percent={s}
            width={30}
            strokeWidth={10}
            strokeColor={getHealthColor(s)}
            format={() => (
              <span style={{ fontSize: 9, fontWeight: 700 }}>{s}</span>
            )}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "Sends",
      dataIndex: "sends",
      sorter: (a, b) => a.sends - b.sends,
      render: fmt,
      align: "right",
    },
    {
      title: "Openers",
      dataIndex: "openers",
      sorter: (a, b) => a.openers - b.openers,
      render: fmt,
      align: "right",
    },
    {
      title: "Open %",
      dataIndex: "taux_openers",
      sorter: (a, b) => a.taux_openers - b.taux_openers,
      render: (v) => (
        <Text style={{ color: tokens.success, fontWeight: 600, fontSize: 12 }}>
          {pct(v)}
        </Text>
      ),
      align: "right",
    },
    {
      title: "Clickers",
      dataIndex: "clickers",
      sorter: (a, b) => a.clickers - b.clickers,
      render: fmt,
      align: "right",
    },
    {
      title: "CTR %",
      dataIndex: "taux_clickers",
      sorter: (a, b) => a.taux_clickers - b.taux_clickers,
      render: (v) => (
        <Text style={{ color: tokens.warning, fontWeight: 600, fontSize: 12 }}>
          {pct(v)}
        </Text>
      ),
      align: "right",
    },
    {
      title: "Unsubs",
      dataIndex: "unsubs",
      sorter: (a, b) => a.unsubs - b.unsubs,
      render: fmt,
      align: "right",
    },
    {
      title: "Unsub %",
      dataIndex: "taux_unsubs",
      sorter: (a, b) => a.taux_unsubs - b.taux_unsubs,
      render: (v) => (
        <Text style={{ color: tokens.danger, fontWeight: 600, fontSize: 12 }}>
          {pct(v)}
        </Text>
      ),
      align: "right",
    },
    {
      title: "CA",
      dataIndex: "ca",
      sorter: (a, b) => (a.ca || 0) - (b.ca || 0),
      render: usd,
      align: "right",
    },
    {
      title: "eCPM",
      dataIndex: "ecpm",
      sorter: (a, b) => (a.ecpm || 0) - (b.ecpm || 0),
      render: usd,
      align: "right",
    },
    {
      title: "Analyses",
      dataIndex: "analyses",
      width: 260,
      render: (a) => <AnalyseBadges analyses={a} compact />,
    },
  ];
  return (
    <>
    <Card size="large" style={styles.card}>
        <Table
          dataSource={rows}
          columns={cols}
          size="small"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 12,
            size: "small",
            showSizeChanger: true,
            showTotal: (t) => (
              <Text style={{ fontSize: 11, color: "#9ca3af" }}>{t} bases</Text>
            ),
          }}
          onRow={(record) => ({
            onClick: () => setSelectedBase(record),
            style: { cursor: "pointer" },
          })}
        />
    </Card>
      <Modal // ← ajout
        open={!!selectedBase}
        onCancel={() => setSelectedBase(null)}
        footer={null}
        width="80%"
        style={{ top: 40 }}
        destroyOnClose
      >
        {selectedBase && (
          <BaseCard base={selectedBase} viewMode={"table"} allbase={allbase} clsConfig={clsConfig} styles={styles}/>
        )}
      </Modal>
    </>
  );
};
