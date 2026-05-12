/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADVERTISERS.JSX - Page dashboard des annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Page principale affichant :
 * - KPIs globaux (Sends, Opens, Clicks, Unsubs, CTR)
 * - Filtres avancés sur les annonceurs
 * - Graphiques comparatifs (chartSwitcher, topTags)
 * - Tableau avec liste détaillée de tous les annonceurs
 */
import React, { useEffect, useMemo, useState } from "react";
import { get_liste_advertisers, getMappingData, getMappingValue } from "../../api/advertiser";
import "../../assets/css/advertisers.css";
import { listetags } from "../../components/table/AdvertisersTable";
import { Card,Row,Col} from "antd";
import KpiCardAdvertiser from "../../components/Kpi/KpiCardAdvertiser";
import AdvertisersTable from "../../components/table/AdvertisersTable";
import {MailOutlined,EyeOutlined, LinkOutlined,StopOutlined} from "@ant-design/icons";
// import testAdvertisers from "../../data/testadv";
import ChartSwitcher from "../../components/chart/ChartSwitcher";
import TopTagsEcpm from "../../components/chart/TopTagsEcpm";
import FilterAdvertiser, {DEFAULT_FILTERS} from "../../components/filter/FilterAdvertiser";
import { buildDateMapping } from "../../utils/batchFiltersDating";

/**
 * Composant Advertisers
 * Page de dashboard avec filtrage, statistiques et visualisations des annonceurs
 * 
 * @component
 * @returns {JSX.Element} Dashboard complet avec KPIs, filtres, graphiques et tableau
 */
const Advertisers = () => {
  // État des annonceurs chargés depuis l'API
  const [listeAdvertiser, setListeAdvertisers] = useState([]);
  
  // État de chargement
  const [loading, setLoading] = useState(true);
  
  // État des filtres actifs
  const [filters, setFilters] = useState(DEFAULT_FILTERS);  

    // ➕ AJOUTE CES STATES POUR LES MAPPINGS
  const [tagMapping, setTagMapping] = useState({});

  //  Etat pour stocker les dates (nécessaire pour les filtres)
  const [dateMapping, setDateMapping] = useState({});

  /**
   * Récupère la liste complète des annonceurs depuis l'API
   */
const fetchReporting = async (
  startDate = null,
  endDate = null,
) => {
  try {
    setLoading(true);

    const res = await get_liste_advertisers(
      startDate,
      endDate,
    );

    console.log("Fetched advertisers!!!");
    console.log("Liste des Advertisers: ", res);

    setListeAdvertisers(res);

  } catch (error) {
    console.error("Erreur lors du fetch:", error);

  } finally {
    setLoading(false);
  }
};

  /**
   * Applique les filtres actuels à la liste d'annonceurs
   * Filtre par : nom, taux_clickers, taux_unsubs, taux_openers, taux_ca, taux_ecpm, minSends
   * Trie selon le critère sélectionné
   */
  const filteredData = useMemo(() => {
    if (!listeAdvertiser || !Array.isArray(listeAdvertiser)) return [];

    let d = [...listeAdvertiser];

    // Filtrer par annonceur spécifique si sélectionné
    if (filters.advertiser !== "ALL") {
      d = d.filter((a) => a.advertiser_name === filters.advertiser);
    }

    // Filtrer par taux de clic
    if (filters.taux_clickers !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_clickers?.includes(filters.taux_clickers),
      );
    }

    // Filtrer par taux d'ouverture
    if (filters.taux_openers !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_openers?.includes(filters.taux_openers),
      );
    }

    // Filtrer par taux de désabonnement
    if (filters.taux_unsubs !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_unsubs?.includes(filters.taux_unsubs),
      );
    }

    // Filtrer par eCPM
    if (filters.taux_ecpm !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_ecpm?.includes(filters.taux_ecpm),
      );
    }

    // Filtrer par CA (Chiffre d'affaires)
    if (filters.taux_ca !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_ca?.includes(filters.taux_ca),
      );
    }


    // Filtrer par nombre minimum d'envois
    d = d.filter((a) => a.globales?.sends >= filters.minSends);

    // Trier selon le critère sélectionné
    d.sort(
      (a, b) => b.globales?.[filters.sortBy] - a.globales?.[filters.sortBy],
    );

    return d;
  }, [listeAdvertiser, filters]);


  const stats = useMemo(() => {
    const totalSends = filteredData.reduce(
      (acc, a) => acc + a.globales.sends,
      0,
    );
    const totalOpen = filteredData.reduce(
      (acc, a) => acc + a.globales.openers,
      0,
    );
    const totalClick = filteredData.reduce(
      (acc, a) => acc + a.globales.clickers,
      0,
    );
    const totalUnsub = filteredData.reduce(
      (acc, a) => acc + a.globales.unsubs,
      0,
    );
    return [
      { label: "Sends", value: totalSends, color: "#1890ff" },
      { label: "Open", value: totalOpen, color: "#52c41a" },
      { label: "Click", value: totalClick, color: "#faad14" },
      { label: "Unsub", value: totalUnsub, color: "#f5222d" },
      {
        label: "CTR",
        value: totalSends
          ? ((totalClick / totalSends) * 100).toFixed(2) + "%"
          : "0%",
        color: "#722ed1",
      },
    ];
  }, [filteredData]);


useEffect(() => {
  const init = async () => {
    try {
      // Charger uniquement les tags
      const tags = await getMappingData('tags', 'tags');
      
      setTagMapping(tags);
    await fetchReporting();


    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
    }
  };

  init();
}, []);


  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading advertiser reporting...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >

      {/* ── KPI Cards ── */}
      <Row gutter={16}>
        {stats.map((s, idx) => (
          <KpiCardAdvertiser key={idx} label={s.label} value={s.value} color={s.color} />
        ))}
      </Row>

      {/* Chart des Tops */}
        <Row gutter={12} wrap={false}>
          <Col flex="auto">
            <ChartSwitcher data={filteredData} />
          </Col>  
          <Col flex="none">
            <TopTagsEcpm data={filteredData} tagMapping={tagMapping} />
          </Col>
        </Row>

      {/* ── Filtres ── */}
      <FilterAdvertiser
        filters={filters}
        setFilters={setFilters}
        listeAdvertiser={listeAdvertiser}
        dateMapping={dateMapping}
      />

      {/* ── Table ── */}
      <Row>
          <Card
            style={{ borderRadius: 10, height: "100%", width: "100%", overflow: "visible" }}
            bodyStyle={{ padding: 0 }}
          >
          <AdvertisersTable data={filteredData}   tagMapping={tagMapping}/>
          </Card>
      </Row>
    </div>
  );
};

const styles = {
  filterCol: { display: "flex", flexDirection: "column", gap: 5 },
  filterLabel: { fontSize: 12, color: "#888" },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #eee",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: { marginTop: "10px", fontSize: "14px", color: "#666" },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
  styleSheet.cssRules.length,
);

export default Advertisers;