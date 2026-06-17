import { useParams,useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Tag,
  Table,
  Select,
  Tabs,
  Tooltip,
  Segmented,
  Statistic,
  Progress,
  Divider,
  Badge,
  Space,
  Typography,
  Empty,
  Dropdown,
  Popover,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  TableOutlined,
  MailOutlined,
  EyeOutlined,
  LinkOutlined,
  StopOutlined,
  GlobalOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  RiseOutlined,
  FallOutlined,
  FireOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  StarOutlined,
  TeamOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  FundOutlined,
  TrophyOutlined,
  AlertOutlined,
  MoreOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  AimOutlined,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  CrownOutlined,
  HeartOutlined,
  MehOutlined,
  DislikeOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { Chart, registerables } from "chart.js";
import ReportingDetailCharts from "../../../components/chart/ReportingDetailsChart.jsx"; 
import { get_advertisers_detail, getMappingData, getMappingValue, get_segment_name} from "../../../api/advertiser.js";
import { useLocation } from "react-router-dom";
import { TabExtraContent } from "../../../components/bouton/SwitchBtnTableChart.jsx";

// import testAdvertisers from "../../data/testadv";
// import testandre from "../../temp/adv_detail.json";
// import { get_all_databases } from "../../api/databases";
// import KpiCard from "../../components/Kpi/KpiCardAdvertiserDetail";
import {HeadersDetails} from "../../../components/headers/HeadersDetails.jsx";
import {
  HealthExplainer,
  HealthGauge,
} from "../../../components/healthComponents/HealthKit.jsx";
import { getHealthScore,getHealthLabel } from "../../../utils/healthKitFunc.js";
Chart.register(...registerables);

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
import { SmartChart } from "../../../components/chart/ReportingDetailsChart.jsx";
import { tokens } from "../../../utils/Tokens.js";
import {fmt, pct, usd} from "../../../utils/Helpers.js";
import { AnalyseBadges } from "../../../components/details/common/AnalyseBadge.jsx";
import { RateBar } from "../../../components/details/common/RateBar.jsx";
import { FunnelViz } from "../../../components/details/common/FunnelViz.jsx";
import { GlobalOverview } from "../../../components/details/GlobalOverView.jsx";
import { GlobalTable } from "../../../components/details/GlobalTable.jsx";
import { DimSection } from "../../../components/details/common/DimSection.jsx";
import MapApp from "../../../FranceMap/MapApp.js"
import { useTagStore } from "../../../utils/storedZustand.js";

/* 
 * Configuration des classifications (A, B, C, D) pour les bases de données.
 * Chaque classe a une couleur, un label et une icône pour la visualisation.
 * A : Excellent, B : Bon, C : Neutre, D : Mauvais
 */
const clsConfig = {
  A: {
    color: "#166534", // vert foncé
    bg: "#dcfce7",
    label: "A",
    icon: <TrophyOutlined />, // 🏆 top
  },
  B: {
    color: "#22c55e", // vert clair
    bg: "#f0fdf4",
    label: "B",
    icon: <CheckCircleOutlined />, // ✅ bon
  },
  C: {
    color: "#38bdf8", // bleu clair
    bg: "#eff6ff",
    label: "C",
    icon: <InfoCircleOutlined />, // ℹ️ neutre / info
  },
  D: {
    color: "#ef4444", // rouge
    bg: "#fef2f2",
    label: "D",
    icon: <CloseCircleOutlined />, // ❌ mauvais
  },
}; // Fin clsConfig : chaque classe (A/B/C/D) pour \u00e9valuer la qualit\u00e9 des bases



// ── Styles ───────────────────────────────────────────────────────────────────
/* 
 * Styles et configurations visuelles centralisées pour toute la page.
 * Inclut les spacing, couleurs, ombres et borderRadius cohérents.
 */
const styles = {
  page: {
    padding: "24px 28px",
    minHeight: "100vh",
    background: tokens.bg,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  headerCard: {
    background: tokens.headerGradient,
    borderRadius: tokens.cardRadius,
    border: "none",
    marginBottom: 24,
    boxShadow: tokens.shadowLg,
    overflow: "hidden",
  },
  card: {
    borderRadius: tokens.cardRadius,
    border: "1px solid #e5e7eb",
    boxShadow: tokens.shadow,
    overflow: "hidden",
    height: "100%",
  },
  // kpiCard: {
  //   borderRadius: 14,
  //   border: "1px solid #e5e7eb",
  //   boxShadow: tokens.shadow,
  //   transition: "all 0.2s ease",
  //   cursor: "default",
  //   overflow: "hidden",
  //   //height: "100%",
  // },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
};


// ── KpiDashboard ─────────────────────────────────────────────────────────────
/* 
 * Affiche une grille de 7 KPIs principaux + indicateur de santé.
 * KPIs affichés : Sends, Openers, Clickers, Unsubs, CTO, eCPM, CA.
 * Chaque KPI a une couleur, un label et une unité spécifiques.
 */
const KpiDashboard = ({ g }) => {
  const kpis = [
    {
      icon: <MailOutlined />,
      label: "Total Sends",
      value: fmt(g.sends),
      color: tokens.primary,
      subtitle: "Emails envoyés",
    },
    {
      icon: <EyeOutlined />,
      label: "Openers",
      value: fmt(g.openers),
      color: tokens.success,
      subtitle: pct(g.taux_openers) + " open rate",
    },
    {
      icon: <LinkOutlined />,
      label: "Clickers",
      value: fmt(g.clickers),
      color: tokens.warning,
      subtitle: pct(g.taux_clickers) + " CTR",
    },
    {
      icon: <StopOutlined />,
      label: "Unsubs",
      value: fmt(g.unsubs),
      color: tokens.danger,
      subtitle: pct(g.taux_unsubs) + " unsub rate",
    },
    {
      icon: <ThunderboltOutlined />,
      label: "CTO",
      value: pct(g.taux_cto),
      color: tokens.cyan,
      subtitle: "Click-to-Open",
    },
    {
      icon: <DollarOutlined />,
      label: "eCPM",
      value: usd(g.ecpm),
      color: tokens.purple,
      subtitle: "Revenue / 1k",
    },
    {
      icon: <DollarOutlined />,
      label: "Chiffre d'aff.",
      value: usd(g.ca),
      color: tokens.pink,
      subtitle: "Revenue total",
    },
  ];

  return (
    <Row gutter={[14, 14]}>
      {kpis.map((kpi) => (
        <Col key={kpi.label} xs={12} sm={8} md={6} lg={6} xl={3}>
          <KpiCard {...kpi} />
        </Col>
      ))}
      <Col xs={24} sm={8} md={6} lg={6} xl={3}>
        <div
          style={{
            ...styles.kpiCard,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 12,
          }}
        >
          <HealthGauge score={getHealthScore(g)} g={g} showExplainer />
        </div>
      </Col>
    </Row>
  );
};


// ── Main Component ───────────────────────────────────────────────────────────
/* 
 * Composant principal : page de détail pour un annonceur (advertiser).
 * Récupère l'ID de l'annonceur depuis l'URL (useParams).
 * Charge les données : listes de bases de données et détails de l'annonceur.
 * Affiche un header avec informations globales, puis 3 onglets (Analyse globale, Bases, Dimensions).
 * Gère les états : loading, data absent, viewMode (chart/table), mainTab (global/bases/dimensions).
 */
const AdvertiserDetail = ({ _mockData }) => {
  const { advertiser_id } = useParams();

  const [searchParams] = useSearchParams();

  // On extrait les variables directement depuis l'URL
  const tagIdParam = searchParams.get("tag_id");
  const startDateParam = searchParams.get("date_start");
  const endDateParam = searchParams.get("date_end");

  const navigate = useNavigate();
  const tagMapping = useTagStore(
  (state) => state.tagMap
);
  
  // État de la page
  const [data, setData] = useState(_mockData || null);           // Données complètes du rapport
  const [loading, setLoading] = useState(!_mockData);             // État chargement
  const [viewMode, setViewMode] = useState("chart");              // Mode affichage : \"chart\" ou \"table\"
  const [mainTab, setMainTab] = useState("global");               // Onglet actif : \"global\", \"bases\", \"dimensions\"
  const [openPopover, setOpenPopover] = useState(null) // Etat pour gérer l'ouverture du popover d'explication du health score

  // Etat pour stocker les mapping agences et databases 
  const [agenceMapping, setAgenceMapping] = useState({});
  const [databaseMapping, setDatabaseMapping] = useState({});

  // État pour stocker tous les segments indexés par leur ID
  const [allsegmentNames, setAllSegmentNames] = useState({});

  // Récupération des segments en filtrant par base de données (database_id)
  const fetchSegmentsByDatabases = useCallback(async (bases) => {
    if (!bases || bases.length === 0) return;

    try {
      // 1. Récupérer tous les database_id uniques de l'annonceur
      const databaseIds = [
        ...new Set(bases.map((base) => base.database_id).filter(Boolean))
      ];

      if (databaseIds.length === 0) return;

      // 2. Lancer toutes les requêtes en parallèle (une par database_id)
      // On suppose ici que get_segment_name prend l'ID de la base en paramètre (ex: get_segment_name(dbId))
      const promises = databaseIds.map((dbId) => get_segment_name(dbId));
      const results = await Promise.all(promises);

      // 3. Fusionner les résultats de chaque base dans un seul dictionnaire
      const segmentMap = {};
      results.forEach((resSegments) => {
        if (Array.isArray(resSegments)) {
          resSegments.forEach((seg) => {
            segmentMap[seg.id_segment] = seg.segment_name;
          });
        }
      });

      setAllSegmentNames(segmentMap);
    } catch (error) {
      console.error("❌ Erreur lors du fetch des segments par base:", error);
    }
  }, []);

useEffect(() => {
  const handleScroll = (e) =>{
      // ignore scroll dans le popover
    if (e.target.closest(".ant-popover")) return;
    setOpenPopover(null);
  }
  window.addEventListener("wheel", handleScroll);

  return () => {
    window.removeEventListener("wheel", handleScroll);
  };
}, []);




// Appel API : récupère les données à mapper (agences, databases) pour afficher les noms au lieu des IDs
  const fetchMappings = useCallback(async () => {
  try {
    const [agences, databases] = await Promise.all([
      getMappingData('agences', 'agences'),
      getMappingData('all_bases', 'databases'),
    ]);

    setAgenceMapping(agences);
    setDatabaseMapping(databases);

  } catch (e) {
    console.error(e);
  }
}, []);

  /* Appel API : récupère les détails de l'annonceur actuel par son ID */
/* Appel API : récupère les détails de l'annonceur actuel par son ID */
  const fetchd = useCallback(async () => {
    try {
      setLoading(true);
      const res = await get_advertisers_detail(advertiser_id, tagIdParam, startDateParam, endDateParam);
      console.log(res);
      setData(res);
      
      // 🚀 Déclenchement du fetch par bases de données
      if (res && res.bases) {
        fetchSegmentsByDatabases(res.bases);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [advertiser_id, tagIdParam, startDateParam, endDateParam, fetchSegmentsByDatabases]);


  const listNamesMapping = useMemo(() => {
  if (!data || !data.bases) return {};
  const mapping = {};
  
  data.bases.forEach((bd) => {
    (bd.brands || []).forEach((brand) => {
      if (brand.ListName && Array.isArray(brand.ListName)) {
        mapping[brand.name] = brand.ListName;
      }
    });
  });
  
  return mapping;
}, [data]);
  /* Effect : charge les bases au mount et recharge les données si _mockData change ou ID change */
/* Effect : charge les bases au mount et recharge les données si _mockData ou ID change */
  useEffect(() => {
    fetchMappings();
    if (!_mockData) {
      fetchd();
    } else if (_mockData && _mockData.bases) {
      // Extraction des segments depuis les bases du mockData
      fetchSegmentsByDatabases(_mockData.bases);
    }
  }, [advertiser_id, _mockData, fetchMappings, fetchd, fetchSegmentsByDatabases]);



  /* Affichage d'attente : spinner pendant le chargement des données */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          flexDirection: "column",
          gap: 16,
          background: tokens.bg,
        }}
      >
        <style>{`
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid #e5e7eb",
            borderTop: `3px solid ${tokens.primary}`,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <Text
          style={{
            color: "#6b7280",
            fontSize: 14,
            fontWeight: 500,
            animation: "pulse 1.5s infinite",
          }}
        >
          Chargement du rapport…
        </Text>
      </div>
    );

  /* Affichage d'erreur : si les données n'ont pas pu être chargées */
  if (!data)
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ position: "absolute", top: 24, left: 24 }}
        >
          Retour
        </Button>
        <Empty
          description={
            <div>
              <Text style={{ fontSize: 15, color: "#6b7280" }}>
                Aucune donnée disponible
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Advertiser #{advertiser_id}
              </Text>
            </div>
          }
        />
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchd}
          style={{ marginTop: 16, borderRadius: 8 }}
        >
          Réessayer
        </Button>
      </div>
    );

  /* Calculs pour l'affichage du header : score de santé global et nombre total de brands */
  const health = getHealthScore(data.globales);
  const totalBrands =
    data.bases?.reduce((s, b) => s + (b.brands?.length || 0), 0) || 0;

  /* Rendu principal : page complète du rapport avec header et onglets */
  return (
    <div style={styles.page}>
      {/* Header */}
      <HeadersDetails 
        labelKey="advertiser"
        open={openPopover}
        setOpen={setOpenPopover}
        styles={styles} 
        data={data} 
        totalBrands={totalBrands} 
        health={health} 
        navigate={navigate}
        getHealthLabel={getHealthLabel} 
        HealthExplainer={<HealthExplainer g={data.globales}/>}
      /> 

      {/* Onglets : 3 vues du rapport (Analyse globale / Bases / Dimensions) */}
      <Card
        style={{ ...styles.card, border: "none" }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          activeKey={mainTab}
          onChange={setMainTab}
          size="large"
          style={{ padding: "0 24px"}}
          tabBarStyle={{ marginBottom: 0, fontWeight: 600 }}

          // Ajouter Segmented
          tabBarExtraContent={
            <TabExtraContent
              mainTab={mainTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              data={data}
              clsConfig={clsConfig}
              agenceMapping={agenceMapping}
              allbase={databaseMapping}
              advertiser_id={advertiser_id} 
            />
          }

          items={[
            {
              key: "global",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <DashboardOutlined /> Analyse globale
                </span>
              ),
              children: (
                <div style={{ padding: "20px 4px 24px" }}>
                  {/* Onglet 1 : Vue d'ensemble globale avec funnel, taux clés, diagnostic et recommandations */}
                  <GlobalOverview 
                    open={openPopover} 
                    setOpen={setOpenPopover} 
                    data={data} 
                    mappingData={databaseMapping} 
                    styles={styles} 
                    label_value="advertiser" 
                    tagMapping={tagMapping}
                  />
                </div>
              ),
            },
            {
              key: "bases",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <DatabaseOutlined /> Bases
                  <Badge
                    count={data.bases?.length || 0}
                    style={{
                      backgroundColor: tokens.primary,
                      fontSize: 10,
                      marginLeft: 2,
                    }}
                  />
                </span>
              ),
              children: (
                <div style={{ 
                  padding: "20px 4px 24px",
                  overflow: "hidden",
                }}>
                  {/* Onglet 2 : Tableau de toutes les bases de données avec tri/filtres et modal détail au clic */}
                  <GlobalTable 
                    bases={data.bases} 
                    allbase={databaseMapping} 
                    agencyName={agenceMapping} 
                    clsConfig={clsConfig} 
                    styles={styles} 
                    viewMode={viewMode} 
                    setViewMode={setViewMode} 
                    segmentNames={allsegmentNames}
                    listNames={listNamesMapping}
                  />
                  {/* <div style={styles.sectionTitle}>
                    <DatabaseOutlined style={{ color: tokens.primary }} />
                    Détail par base ({data.bases?.length})
                  </div>
                  {data.bases.map((base) => (
                    <BaseCard
                      key={base.database_id}
                      base={base}
                      viewMode={viewMode}
                    />
                  ))} */}
                </div>
              ),
            },
            {
              key: "dimensions",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <PieChartOutlined /> Dimensions globales
                </span>
              ),
              children: (
                <div style={{ padding: "20px 4px 24px" }}>
                  {/* Onglet 3 : Analyse agrégée des dimensions (Age, Genre, ISP) sur toutes les bases */}
                  {(() => {
                    const merged = {};
                    data.bases.forEach((base) => {
                      if (!base.dimensions) return;
                      Object.entries(base.dimensions).forEach(
                        ([dimKey, dimData]) => {
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
                        },
                      );
                    });
                    Object.values(merged).forEach((dimData) => {
                      Object.values(dimData).forEach((v) => {
                        v.taux_openers = v.sends
                          ? (v.openers / v.sends) * 100
                          : 0;
                        v.taux_clickers = v.sends
                          ? (v.clickers / v.sends) * 100
                          : 0;
                        v.taux_unsubs = v.sends
                          ? (v.unsubs / v.sends) * 100
                          : 0;
                        v.taux_cto = v.openers
                          ? (v.clickers / v.openers) * 100
                          : 0;
                      });
                    });
                    return Object.keys(merged).length > 0 ? (
                      <DimSection
                        dimensions={merged}
                        viewMode={viewMode}
                        hideFilters
                        styles={styles}
                      />
                    ) : (
                      <Empty description="Aucune dimension disponible" />
                    );
                  })()}
                </div>
              ),
            },
            {
              key: "Departement",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <EnvironmentOutlined  /> Analyse par Département
                </span>
              ),
              children: (
                <div style={{ padding: "20px 4px 16px", height:"650px"}}>
                  {/* Onglet 1 : Vue d'ensemble globale avec funnel, taux clés, diagnostic et recommandations */}
                  {/* <GlobalOverview open={openPopover} setOpen={setOpenPopover} data={data} mappingData={databaseMapping} styles={styles} label_value="advertiser" /> */}
                  <MapApp data={data.globales} />
                </div>
              ),
            },
          ]}
        />
      </Card>
          
      {/* Footer du rapport : informations de génération */}
      {/* <div
        style={{
          textAlign: "center",
          padding: "20px 0 8px",
          color: "#9ca3af",
          fontSize: 11,
        }}
      >
        Rapport généré automatiquement · Advertiser #{data.advertiser_id} ·{" "}
        {new Date().toLocaleDateString("fr-FR")}
      </div> */}
    </div>
  );
};

export default AdvertiserDetail;
