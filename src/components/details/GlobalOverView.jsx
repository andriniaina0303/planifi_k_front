import { getHealthScore } from "../../utils/healthKitFunc";
import { SmartChart } from "../chart/AdvertiserDetailChart";
import AdvertiserDetailCharts from "../chart/AdvertiserDetailChart";
import { HealthGauge, HealthExplainer } from "../healthComponents/HealthKit";
import {
  FundOutlined,
  AreaChartOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  HeartOutlined,
  GlobalOutlined,
  PieChartOutlined,
  BulbOutlined,
  AimOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  ExperimentOutlined
} from "@ant-design/icons";
import { Chart } from "chart.js";
import { Tag, Card, Col, Divider, Popover, Row, Typography} from "antd";
import { FunnelViz } from "./common/FunnelViz";
import { RateBar } from "./common/RateBar";
import { AnalyseBadges } from "./common/AnalyseBadge";
import { tokens } from "../../utils/Tokens";
import { useMemo } from "react";
import { pct,fmt } from "../../utils/Helpers";

const {Text, Paragraph} = Typography;


// ── SegmentRecommendations ───────────────────────────────────────────────────
/* 
 * Analyse les segments (Age, Genre, ISP) de toutes les bases pour identifier les meilleures performances.
 * Calcule pour chaque dimension : meilleur CTR, meilleur open rate, moins de désabos, segment à éviter.
 * Affiche recommandations formatées avec synthèse textuelle pour optimiser le ciblage.
 */
const SegmentRecommendations = ({ data, styles }) => {
  const recommendations = useMemo(() => {
    const merged = {};
    data.bases.forEach((base) => {
      if (!base.dimensions) return;
      Object.entries(base.dimensions).forEach(([dimKey, dimData]) => {
        if (!merged[dimKey]) merged[dimKey] = {};
        Object.entries(dimData).forEach(([seg, vals]) => {
          if (!merged[dimKey][seg])
            merged[dimKey][seg] = {
              sends: 0,
              openers: 0,
              clickers: 0,
              unsubs: 0,
            };
          merged[dimKey][seg].sends += vals.sends || 0;
          merged[dimKey][seg].openers += vals.openers || 0;
          merged[dimKey][seg].clickers += vals.clickers || 0;
          merged[dimKey][seg].unsubs += vals.unsubs || 0;
        });
      });
    });

    const dimLabels = {
      age_range: {
        label: "Tranche d'âge",
        icon: <TeamOutlined />,
        color: tokens.primary,
      },
      gender: {
        label: "Civilité / Genre",
        icon: <HeartOutlined />,
        color: tokens.pink,
      },
      isp: { label: "ISP / FAI", icon: <GlobalOutlined />, color: tokens.cyan },
    };

    const results = [];

    Object.entries(merged).forEach(([dimKey, segments]) => {
      const meta = dimLabels[dimKey] || {
        label: dimKey,
        icon: <PieChartOutlined />,
        color: tokens.purple,
      };
      const entries = Object.entries(segments)
        .filter(([, v]) => v.sends > 0)
        .map(([seg, v]) => ({
          segment: seg,
          ...v,
          openRate: v.sends ? (v.openers / v.sends) * 100 : 0,
          ctr: v.sends ? (v.clickers / v.sends) * 100 : 0,
          unsubRate: v.sends ? (v.unsubs / v.sends) * 100 : 0,
        }));

      if (entries.length === 0) return;

      // Meilleur CTR
      const bestCtr = [...entries].sort((a, b) => b.ctr - a.ctr)[0];
      // Meilleur open rate
      const bestOpen = [...entries].sort((a, b) => b.openRate - a.openRate)[0];
      // Plus bas unsub
      const bestUnsub = [...entries].sort(
        (a, b) => a.unsubRate - b.unsubRate,
      )[0];
      // Pire segment
      const worstCtr = [...entries].sort((a, b) => a.ctr - b.ctr)[0];
      // Plus gros volume
      const biggestVol = [...entries].sort((a, b) => b.sends - a.sends)[0];

      results.push({
        dimKey,
        ...meta,
        bestCtr,
        bestOpen,
        bestUnsub,
        worstCtr,
        biggestVol,
        totalSegments: entries.length,
      });
    });

    return results;
  }, [data]);

  if (recommendations.length === 0) return null;

  return (
    <Card
      size="small"
      style={{
        ...styles.card,
        marginTop: 20,
        border: `1px solid ${tokens.primary}33`,
      }}
      title={
        <span style={{ ...styles.sectionTitle, marginBottom: 0 }}>
          <BulbOutlined style={{ color: tokens.warning, fontSize: 18 }} />
          Recommandations par segment
          <Tag
            color="blue"
            style={{ borderRadius: 10, fontSize: 10, marginLeft: 8 }}
          >
            {recommendations.length} dimensions analysées
          </Tag>
        </span>
      }
    >
      <Paragraph style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
        Récapitulatif des meilleurs segments identifiés sur l'ensemble des bases
        pour optimiser le ciblage.
      </Paragraph>

      <Row gutter={[14, 14]}>
        {recommendations.map((rec) => (
          <Col key={rec.dimKey} xs={24} md={8}>
            <div
              style={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                background: "#fff",
                height: "100%",
              }}
            >
              {/* Header dim */}
              <div
                style={{
                  padding: "12px 16px",
                  background: `linear-gradient(135deg, ${rec.color}12, ${rec.color}05)`,
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${rec.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: rec.color,
                    fontSize: 14,
                  }}
                >
                  {rec.icon}
                </div>
                <div>
                  <Text strong style={{ fontSize: 13 }}>
                    {rec.label}
                  </Text>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>
                    {rec.totalSegments} segments
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ padding: "12px 16px" }}>
                {/* Best CTR */}
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginBottom: 8,
                    background: `${tokens.success}08`,
                    border: `1px solid ${tokens.success}22`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <AimOutlined
                      style={{ color: tokens.success, fontSize: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: tokens.success,
                        textTransform: "uppercase",
                      }}
                    >
                      Meilleur CTR
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong style={{ fontSize: 13 }}>
                      {rec.bestCtr.segment}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: tokens.success,
                      }}
                    >
                      {pct(rec.bestCtr.ctr)}
                    </Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.bestCtr.sends)} sends · {pct(rec.bestCtr.openRate)}{" "}
                    open
                  </Text>
                </div>

                {/* Best Open */}
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginBottom: 8,
                    background: `${tokens.info}08`,
                    border: `1px solid ${tokens.info}22`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <EyeOutlined style={{ color: tokens.info, fontSize: 12 }} />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: tokens.info,
                        textTransform: "uppercase",
                      }}
                    >
                      Meilleur Open Rate
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong style={{ fontSize: 13 }}>
                      {rec.bestOpen.segment}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: tokens.info,
                      }}
                    >
                      {pct(rec.bestOpen.openRate)}
                    </Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.bestOpen.sends)} sends · {pct(rec.bestOpen.ctr)}{" "}
                    CTR
                  </Text>
                </div>

                {/* Best Unsub (lowest) */}
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginBottom: 8,
                    background: `${tokens.cyan}08`,
                    border: `1px solid ${tokens.cyan}22`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <SafetyCertificateOutlined
                      style={{ color: tokens.cyan, fontSize: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: tokens.cyan,
                        textTransform: "uppercase",
                      }}
                    >
                      Moins de désabo
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong style={{ fontSize: 13 }}>
                      {rec.bestUnsub.segment}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: tokens.cyan,
                      }}
                    >
                      {pct(rec.bestUnsub.unsubRate)}
                    </Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.bestUnsub.sends)} sends
                  </Text>
                </div>

                {/* Worst — à éviter */}
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: `${tokens.danger}06`,
                    border: `1px solid ${tokens.danger}18`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <CloseCircleOutlined
                      style={{ color: tokens.danger, fontSize: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: tokens.danger,
                        textTransform: "uppercase",
                      }}
                    >
                      À éviter / surveiller
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong style={{ fontSize: 13 }}>
                      {rec.worstCtr.segment}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: tokens.danger,
                      }}
                    >
                      {pct(rec.worstCtr.ctr)} CTR
                    </Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.worstCtr.sends)} sends ·{" "}
                    {pct(rec.worstCtr.unsubRate)} unsub
                  </Text>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Résumé textuel */}
      <div
        style={{
          marginTop: 16,
          padding: "14px 18px",
          borderRadius: 10,
          background: "linear-gradient(135deg, #fefce8, #fef9c3)",
          border: "1px solid #fde68a",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <ExperimentOutlined
            style={{ color: tokens.warning, fontSize: 18, marginTop: 2 }}
          />
          <div>
            <Text strong style={{ fontSize: 12, color: "#92400e" }}>
              💡 Synthèse ciblage
            </Text>
            <div
              style={{
                fontSize: 11,
                color: "#78350f",
                marginTop: 4,
                lineHeight: 1.7,
              }}
            >
              {recommendations.map((rec) => (
                <div key={rec.dimKey}>
                  <strong>{rec.label} :</strong> privilégier{" "}
                  <Tag
                    color="green"
                    style={{ fontSize: 10, borderRadius: 4, margin: 0 }}
                  >
                    {rec.bestCtr.segment}
                  </Tag>{" "}
                  (CTR {pct(rec.bestCtr.ctr)})
                  {rec.bestCtr.segment !== rec.bestOpen.segment && (
                    <span>
                      {" "}
                      ou{" "}
                      <Tag
                        color="blue"
                        style={{ fontSize: 10, borderRadius: 4, margin: 0 }}
                      >
                        {rec.bestOpen.segment}
                      </Tag>{" "}
                      (Open {pct(rec.bestOpen.openRate)})
                    </span>
                  )}{" "}
                  · éviter{" "}
                  <Tag
                    color="red"
                    style={{ fontSize: 10, borderRadius: 4, margin: 0 }}
                  >
                    {rec.worstCtr.segment}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};


// ── GlobalOverview ───────────────────────────────────────────────────────────
/* 
 * Vue d'ensemble globale : 3 colonnes affichant le funnel, les taux clés et le diagnostic santé.
 * Affiche aussi les graphiques comparatifs par base (AdvertiserDetailCharts).
 * Affiche les recommandations segment en bas.
 */
export const GlobalOverview = ({ data, allbase, styles}) => {
  const g = data.globales;
  const health = getHealthScore(g);
  const dbMap = Object.fromEntries(allbase.map((db) => [db.id, db.basename]));

  return (
    <div>
      {/* <KpiDashboard g={g} /> */}
      <Row gutter={[16, 16]} style={{ marginTop: 0 }}>
        <Col xs={8}>
          <Card
            size="small"
            style={styles.card}
            title={
              <span style={styles.sectionTitle}>
                <FundOutlined style={{ color: tokens.primary }} /> Tunnel de
                conversion
              </span>
            }
          >
            <FunnelViz g={g} />
          </Card>
        </Col>
        <Col xs={8}>
          <Card
            size="small"
            style={styles.card}
            title={
              <span style={styles.sectionTitle}>
                <AreaChartOutlined style={{ color: tokens.success }} /> Taux
                clés
              </span>
            }
          >
            <div style={{ padding: "8px 0" }}>
              <RateBar
                label="Open Rate"
                value={g.taux_openers}
                color={tokens.success}
                max={50}
              />
              <RateBar
                label="Click Rate (CTR)"
                value={g.taux_clickers}
                color={tokens.warning}
                max={10}
              />
              <RateBar
                label="Click-to-Open (CTO)"
                value={g.taux_cto}
                color={tokens.cyan}
                max={30}
              />
              <RateBar
                label="Unsub Rate"
                value={g.taux_unsubs}
                color={tokens.danger}
                max={2}
              />
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card
            size="small"
            style={styles.card}
            title={
              <span style={styles.sectionTitle}>
                <CheckCircleOutlined style={{ color: tokens.success }} />{" "}
                Diagnostic
                {/* <Popover
                  content={<HealthExplainer g={g}/>}
                  title={null}
                  trigger="click"
                  placement="bottomRight"
                >
                
                  <QuestionCircleOutlined
                    style={{
                      color: "#9ca3af",
                      fontSize: 13,
                      cursor: "pointer",
                      marginLeft: 4,
                    }}
                  />
                </Popover> */}
              </span>
            }
          >
            <div style={{ padding: "0px 0" }}>
              {" "}
              <div style={{ marginBottom: 14, textAlign: "center" }}>
                {" "}
                <HealthGauge score={health} g={g} showExplainer/>{" "}
              </div>{" "}
              <Divider style={{ margin: "10px 0" }} />{" "}
              <AnalyseBadges analyses={g.analyses} />{" "}
            </div>
          </Card>
        </Col>
      </Row>
        
     {/* Chart Taux d'engagement et revenue par base */}
      <AdvertiserDetailCharts
        bases={data.bases}
        dbMap={dbMap}
        styles={styles}
        tokens={tokens}
        SmartChart={SmartChart}
      />

      {/* Recommandations segment */}
      <SegmentRecommendations data={data} styles={styles}/>
    </div>
  );
};
