import { getHealthScore } from "../../utils/healthKitFunc";
import { SmartChart } from "../chart/ReportingDetailsChart";
import ReportingDetailCharts from "../chart/ReportingDetailsChart";
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
  ExperimentOutlined,
  FireOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { Chart } from "chart.js";
import { Tooltip, Tag, Card, Col, Divider, Popover, Row, Typography,Collapse,Table, Flex, FloatButton} from "antd";
import { FunnelViz } from "./common/FunnelViz";
import { RateBar } from "./common/RateBar";
import { AnalyseBadges } from "./common/AnalyseBadge";
import { tokens } from "../../utils/Tokens";
import { useMemo, useEffect, useState } from "react";
import { pct,fmt } from "../../utils/Helpers";
import { buildRecommendations } from "../../utils/getSegmentRecomd";
import { TopBrandsSlider } from "./common/CreateColsTop";
import { decodeBase64 } from "../../utils/utils";
import { getKeyMapping } from "../../utils/getDataKeys";

const {Text, Paragraph} = Typography;


// ── SegmentRecommendations ───────────────────────────────────────────────────
/* 
 * Analyse les segments (Age, Genre, ISP) de toutes les bases pour identifier les meilleures performances.
 * Calcule pour chaque dimension : meilleur CTR, meilleur open rate, moins de désabos, segment à éviter.
 * Affiche recommandations formatées avec synthèse textuelle pour optimiser le ciblage.
 */
const SegmentRecommendations = ({styles,recommendations }) => {
 
 
  if (recommendations.length === 0) return null;
 
  // Préparer les items du Collapse
 
  return (
  <Card
    size="small"
    style={{
      ...styles.card,
      border: `1px solid ${tokens.primary}33`,
    }}
  >
    {/* ── TITRE GLOBAL ── */}
    <div style={{ marginBottom: 10 }}>
      <span style={{ ...styles.sectionTitle }}>
        <BulbOutlined style={{ color: tokens.warning, fontSize: 18 }} />
        Recommandations par segment
        <Tag
          color="blue"
          style={{ borderRadius: 10, fontSize: 10, marginLeft: 8 }}
        >
          {recommendations.length} dimensions analysées
        </Tag>
      </span>
 
      <Paragraph style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
        Récapitulatif des meilleurs segments identifiés sur l'ensemble des bases
        pour optimiser le ciblage.
      </Paragraph>
    </div>
 
    {/* ── 🔥 SYNTHÈSE EN HAUT ── */}
    <SyntheseText recommendations={recommendations} />
 
    {/* ── 3 Cards ── */}
    <Row gutter={[16, 16]}>
      {recommendations.map((rec) => (
        <Col xs={24} md={8} key={rec.dimKey}>
          <Card
            size="small"
            style={{
              ...styles.card,
              borderRadius: 12,
              border: `1px solid ${rec.color}22`,
              background: `${rec.color}02`,
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  }}
                >
                  {rec.icon}
                </div>
                <div>
                  <Text strong>{rec.label}</Text>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>
                    {rec.totalSegments} segments
                  </div>
                </div>
              </div>
            }
          >
            {/* Contenu des 4 boîtes (Best CTR, Best Open, etc) */}
            <div style={{ padding: "8px 0" }}>
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
          </Card>
        </Col>
      ))}
    </Row>
  </Card>
  );
};




const SyntheseText = ({ recommendations = [] }) => {
  if (recommendations.length === 0) return null;

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: 10,
        background: "linear-gradient(135deg, #fefce8, #fef9c3)",
        border: "1px solid #fde68a",
      }}
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExperimentOutlined style={{ color: "#f59e0b" }} />
          💡 Synthèse ciblage
        </span>
      }
    >
      <div
        style={{
          fontSize: 11,
          color: "#78350f",
          lineHeight: 1.7,
        }}
      >
        {recommendations.map((rec) => (
          <div key={rec.dimKey} style={{ marginBottom: 6 }}>
            <strong>{rec.label} :</strong> privilégier{" "}

            <Tag color="green" style={{ fontSize: 10 }}>
              {rec.bestCtr.segment}
            </Tag>

            {" "} (CTR {rec.bestCtr.ctr.toFixed(2)}%)

            {rec.bestCtr.segment !== rec.bestOpen.segment && (
              <>
                {" "}ou{" "}
                <Tag color="blue" style={{ fontSize: 10 }}>
                  {rec.bestOpen.segment}
                </Tag>
                {" "} (Open {rec.bestOpen.openRate.toFixed(2)}%)
              </>
            )}

            {" "}· éviter{" "}

            <Tag color="red" style={{ fontSize: 10 }}>
              {rec.worstCtr.segment}
            </Tag>
          </div>
        ))}
      </div>
    </Card>
  );
};


// ── GlobalOverview ───────────────────────────────────────────────────────────
/* 
 * Vue d'ensemble globale : 3 colonnes affichant le funnel, les taux clés et le diagnostic santé.
 * En haut (côte à côte) : slider Top Brands et recommandations par segment.
 * En bas : graphiques comparatifs par base et autres analyses.
 */
export const GlobalOverview = ({ segmentNames, open, setOpen, data, mappingData, styles, label_value, tagMapping}) => {
  const g = data.globales;
  const { idKey, nameKey, singularKey, pluralKey } = getKeyMapping(mappingData);
  const key_value = label_value === "database" ? "advertisers" : "bases";
  const health = getHealthScore(g);
  console.log("TagMapping reçu depuis GlobalOverview: ",tagMapping)

  const [ShowBackTop,setShowBackTop] = useState(false)
  // console.log("MappingData:", mappingData);
  const dataMapped = Object.fromEntries(mappingData.map((db) => [db[idKey], db[nameKey]]));
  // console.log("DataMapped:", dataMapped);
  const recommendations = useMemo(() => {
    return buildRecommendations(data,key_value);
  }, [data]);
  
useEffect(() =>{
    const BtnOnScroll = () => {
    // Afficher le bouton si on a scrollé plus de 300px
    setShowBackTop(window.scrollY > 100);
    console.log("Valeur de ShowBackTop: ",ShowBackTop)
  };

  window.addEventListener("scroll", BtnOnScroll);
  return () => window.removeEventListener("scroll", BtnOnScroll);
},[])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div style={{height:"auto"}}>
{/* Bouton Back to Top Custom */}
      {ShowBackTop && (
        <button
          onClick={scrollToTop}
          className="flex bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
          style={{
            width: "48px",
            height: "48px",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        </button>
      )}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Slider Top Brands */}
        <Col xs={24} lg={24}>
          <SegmentRecommendations 
            styles={styles} 
            recommendations={recommendations}
          />     
        </Col>
      </Row>
      {/* ── SECTION RECOMMANDATIONS ── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Slider Top Brands */}
        <Col xs={24} lg={24}>
          <TopBrandsSlider segmentNames ={segmentNames} data={data} styles={styles} key_value={key_value} label_value={label_value} tagMapping={tagMapping} />
        </Col>
      </Row>

      {/* ── SECTION BASSE : KPIs ET GRAPHIQUES ── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }} >
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
              </span>
            }
          >
            <div style={{ padding: "0px 0" }}>
              {" "}
              <div style={{ marginBottom: 14, textAlign: "center" }}>
                {" "}
                <HealthGauge open={open} setOpen={setOpen} score={health} g={g} showExplainer/>{" "}
              </div>{" "}
              <Divider style={{ margin: "10px 0" }} />{" "}
              <AnalyseBadges analyses={g.analyses} />{" "}
            </div>
          </Card>
        </Col>
      </Row>
        
     {/* ── CHARTS : Taux d'engagement et revenue par base ── */}
      <ReportingDetailCharts
        key_value={data[key_value]}
        label_value={key_value}
        idKey = {idKey}
        nameKey = {nameKey}
        dataMapped={dataMapped}
        styles={styles}
        tokens={tokens}
        SmartChart={SmartChart}
      />
    </div>
  );
};