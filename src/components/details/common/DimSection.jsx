import {TeamOutlined, HeartOutlined, GlobalOutlined} from "@ant-design/icons";
import { Card, Col, Row, Table, Tag, Typography } from "antd";
import { fmt, pct} from "../../../utils/Helpers";
import { tokens } from "../../../utils/Tokens";
import { SmartChart } from "../../chart/ReportingDetailsChart";
import { AnalyseBadges } from "./AnalyseBadge";

const { Text } = Typography;
// ── DimSection ───────────────────────────────────────────────────────────────
/* 
 * Section affichant les analyses par dimensions (Age, Genre, ISP).
 * DIM_KEYS : liste des dimensions à afficher avec icônes associées.
 * dimCols : colonnes du tableau pour afficher les métriques par segment.
 * DimSection : composant React qui alterne entre vue graphique (chart) et tableau.
 */
const DIM_KEYS = [
  { key: "age_range", label: "Tranche d'âge", icon: <TeamOutlined /> },
  { key: "gender", label: "Genre", icon: <HeartOutlined /> },
  { key: "isp", label: "ISP / FAI", icon: <GlobalOutlined /> },
];

const dimCols = [
  {
    title: "Segment",
    dataIndex: "segment",
    fixed: "left",
    width: 120,
    render: (v) => (
      <Text strong style={{ fontSize: 12 }}>
        {v}
      </Text>
    ),
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
    sorter: (a, b) => a.taux_openers - b.taux_openers,
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
    title: "Unsub %",
    dataIndex: "taux_unsubs",
    sorter: (a, b) => a.taux_unsubs - b.taux_unsubs,
    render: (v) => (
      <Text style={{ color: tokens.danger, fontWeight: 600 }}>{pct(v)}</Text>
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
  // {
  //   title: "Analyses",
  //   dataIndex: "analyses",
  //   width: 280,
  //   render: (a) => <AnalyseBadges analyses={a} compact />,
  // },
];

export const DimSection = ({ dimensions, viewMode, hideFilter= false, styles }) => (
  <Row gutter={[16, 16]}>
    {DIM_KEYS.map(({ key, label, icon }) => {
      const dim = dimensions?.[key];
      if (!dim) return null;
      const entries = Object.entries(dim).filter(([, v]) => v.sends > 0);
      if (entries.length === 0) return null;

      const rows = entries.map(([seg, v]) => ({
        key: seg,
        segment: seg,
        ...v,
      }));

      return (
        <Col key={key} xs={24} lg={viewMode === "chart" ? 8 : 24}>
          <Card
            size="small"
            style={styles.card}
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span style={{ color: tokens.primary }}>{icon}</span>
                {label}
                <Tag
                  style={{ marginLeft: "auto", borderRadius: 10, fontSize: 10 }}
                >
                  {entries.length}
                </Tag>
              </div>
            }
          >
            {viewMode === "chart" ? (
              <SmartChart
                type="bar"
                labels={entries.map(([k]) => k)}
                height={220}
                datasets={[
                  {
                    label: "Sends",
                    data: entries.map(([, v]) => v.sends),
                    backgroundColor: `${tokens.primary}55`,
                    borderColor: tokens.primary,
                    borderWidth: 1.5,
                    borderRadius: 4,
                  },
                  {
                    label: "Openers",
                    data: entries.map(([, v]) => v.openers),
                    backgroundColor: `${tokens.success}55`,
                    borderColor: tokens.success,
                    borderWidth: 1.5,
                    borderRadius: 4,
                  },
                  {
                    label: "Clickers",
                    data: entries.map(([, v]) => v.clickers),
                    backgroundColor: `${tokens.warning}55`,
                    borderColor: tokens.warning,
                    borderWidth: 1.5,
                    borderRadius: 4,
                  },
                ]}
              />
            ) : (
              <Table
                dataSource={rows}
                columns={dimCols}
                size="xs"
                rowKey="segment"
                pagination={{
                  pageSize: 6,
                  size: "xs",
                  showSizeChanger: false,
                }}
                scroll={{ x:"max-content" }}
                style={{ marginTop: 4 }}
              />
            )}
          </Card>
        </Col>
      );
    })}
  </Row>
);
