/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADVERTISERS.JSX - Page dashboard des annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Page principale affichant :
 * - KPIs globaux (Sends, Opens, Clicks, Unsubs, CTR)
 * - Filtres avancés sur les annonceurs avec plage de dates
 * - Graphiques comparatifs (chartSwitcher, topTags)
 * - Tableau avec liste détaillée de tous les annonceurs
 * 
 * Par défaut, affiche les données des 90 derniers jours
 */
import React, { useEffect, useMemo, useState } from "react";
import { get_all_databases,get_top_DB_tags} from "../../../api/databases";
import { getMappingData } from "../../../api/advertiser";
import "../../../assets/css/advertisers.css";
import { Card, Row, Col } from "antd";
import KpiCardReporting from "../../../components/Kpi/KpiCardReporting";
import ReportingTable from "../../../components/table/ReportingTable";
import { MailOutlined, EyeOutlined, LinkOutlined, StopOutlined } from "@ant-design/icons";
import ChartSwitcher from "../../../components/chart/ChartSwitcher";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import {TopDBEcpm} from "../../../components/chart/TopDBEcpm"
import { useTagStore, useCountryStore} from "../../../utils/storedZustand";
import TopDbsTags from "../../../components/chart/TopDBTags"



/**
 * Composant Advertisers
 * Page de dashboard avec filtrage par date, statistiques et visualisations des annonceurs
 * 
 * @component
 * @returns {JSX.Element} Dashboard complet avec KPIs, filtres, graphiques et tableau
 */
const Databases = () => {
  // État des annonceurs chargés depuis l'API
  const [listeDatabases, setListeDatabases] = useState([]);
  const[topdbTags,setTopdbTags] = useState([])

  // État de chargement
  const [loading, setLoading] = useState(true);

  // État des filtres actifs — initialise avec les valeurs par défaut (90 derniers jours)
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Mapping des tags 
  const { setTagMapping } = useTagStore();
  // État pour les mappings de tags
  const tagMapping = useTagStore((state) => state.tagMap);

  // Etat pour la liste des country
  const countryList = useCountryStore((state) => state.countries)
  
  /**
   * Convertit un objet dayjs en string au format YYYY-MM-DD
   * @param {dayjs.Dayjs} dayjsDate - Date au format dayjs
   * @returns {string|null} Date au format YYYY-MM-DD ou null
   */

  /**
   * Récupère la liste complète des annonceurs depuis l'API avec les paramètres de date
   * @param {dayjs.Dayjs} startDate - Date de début (dayjs object)
   * @param {dayjs.Dayjs} endDate - Date de fin (dayjs object)
   */
  const fetchReporting = async (startDate = null, endDate = null, country = null) => {
    try {
      setLoading(true);

      console.log("Date start : ", startDate)
      console.log("Date end: ",endDate)
      const db_tags = await get_top_DB_tags(startDate,endDate,country)
      const res = await get_all_databases(startDate, endDate, country);

      // console.log("✅ Fetched databases!!!");
      // console.log("Response data:", res);
      // console.log("Is array?", Array.isArray(res));
      // console.log("Length:", res?.length);
      console.log("Top DB fetched : ", db_tags)
      setTopdbTags(db_tags)
      setListeDatabases(Array.isArray(res) ? res : []);

    } catch (error) {
      console.error("❌ Erreur lors du fetch:", error);
      setListeDatabases([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Applique les filtres actuels à la liste de bases de données
   * Filtre par : nom, taux_clickers, taux_unsubs, taux_openers, taux_ca, taux_ecpm, minSends
   * Trie selon le critère sélectionné
   */
  const filteredData = useMemo(() => {
    if (!listeDatabases || !Array.isArray(listeDatabases)) return [];

    let d = [...listeDatabases];

    // Filtrer par annonceur spécifique si sélectionné
    if (Array.isArray(filters.all_fields) && filters.all_fields.length > 0) {
      d = d.filter((a) => filters.all_fields.includes(a.database_name));
    }

    // Filtrer par taux de clic
    if (filters.taux_clickers !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_clickers?.includes(filters.taux_clickers)
      );
    }

    // Filtrer par taux d'ouverture
    if (filters.taux_openers !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_openers?.includes(filters.taux_openers)
      );
    }

    // Filtrer par taux de désabonnement
    if (filters.taux_unsubs !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_unsubs?.includes(filters.taux_unsubs)
      );
    }

    // Filtrer par eCPM
    if (filters.taux_ecpm !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_ecpm?.includes(filters.taux_ecpm)
      );
    }

    // Filtrer par CA (Chiffre d'affaires)
    if (filters.taux_ca !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_ca?.includes(filters.taux_ca)
      );
    }

    // Filtrer par nombre minimum d'envois
    d = d.filter((a) => a.globales?.sends >= filters.minSends);

    // Trier selon le critère sélectionné
    d.sort(
      (a, b) => b.globales?.[filters.sortBy] - a.globales?.[filters.sortBy]
    );

    return d;
  }, [listeDatabases, filters]);

  /**
   * Calcul des statistiques globales (KPIs)
   */
  const stats = useMemo(() => {
    const totalSends = filteredData.reduce(
      (acc, a) => acc + (a.globales?.sends || 0),
      0
    );
    const totalOpen = filteredData.reduce(
      (acc, a) => acc + (a.globales?.openers || 0),
      0
    );
    const totalClick = filteredData.reduce(
      (acc, a) => acc + (a.globales?.clickers || 0),
      0
    );
    const totalUnsub = filteredData.reduce(
      (acc, a) => acc + (a.globales?.unsubs || 0),
      0
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



  /**
   * Chaque fois que les dates du filtre changent, refetch les données API
   * Les autres filtres (advertiser, taux_clickers, etc) filtrent côté client
   */
/**
   * Unique Effect pour le chargement initial ET les changements de filtres
   */
  useEffect(() => {
    // On s'assure d'avoir au moins les dates pour lancer le fetch
    if (filters.scheduleStart && filters.scheduleEnd) {
      // filters.country sera passé (qu'il soit null, 'ALL' ou une vraie valeur)
      fetchReporting(filters.scheduleStart, filters.scheduleEnd, filters.country);
    }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.country]); // 👈 Écoute sagement les changements

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading database reporting...</p>
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
          <KpiCardReporting
            key={idx}
            label={s.label}
            value={s.value}
            color={s.color}
          />
        ))}
      </Row>
      {/* ── Filtres ── */}
      <FilterReporting
        labelFilter="Databases"
        filters={filters}
        setFilters={setFilters}
        listes={listeDatabases}
        countries = {countryList}
        idList="database_id"
        keyList="database_name"
      />

      {/* ── Chart des Tops ── */}
      <Row gutter={12} wrap={false}>
        <Col flex="auto">
          <ChartSwitcher data={filteredData} keyFields="database_name" />
        </Col>
      </Row>


      {/* ── Table ── */}
      <Row>
        <Card
          style={{
            borderRadius: 10,
            height: "100%",
            width: "100%",
            overflow: "visible",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <ReportingTable data={filteredData} dataKey="database" date_start={filters.scheduleStart} date_end={filters.scheduleEnd} />
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
  styleSheet.cssRules.length
);

export default Databases;