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
import { get_liste_advertisers, getMappingData, getMappingValue } from "../../../api/advertiser";
import "../../../assets/css/advertisers.css";
// import { listetags } from "../../../components/table/ReportingTable";
import { Card, Row, Col } from "antd";
import KpiCardReporting from "../../../components/Kpi/KpiCardReporting";
import ReportingTable from "../../../components/table/ReportingTable";
import { MailOutlined, EyeOutlined, LinkOutlined, StopOutlined } from "@ant-design/icons";
import ChartSwitcher from "../../../components/chart/ChartSwitcher";
import TopTagsEcpm from "../../../components/chart/TopTagsEcpm";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import { useTagStore, useCountryStore} from "../../../utils/storedZustand";



/**
 * Composant Advertisers
 * Page de dashboard avec filtrage par date, statistiques et visualisations des annonceurs
 * 
 * @component
 * @returns {JSX.Element} Dashboard complet avec KPIs, filtres, graphiques et tableau
*/
const Advertisers = () => {


  const { setTagMapping } = useTagStore();
  const {setCountries} = useCountryStore();

  // État des annonceurs chargés depuis l'API
  const [listeAdvertiser, setListeAdvertisers] = useState([]);

  // État de chargement
  const [loading, setLoading] = useState(true);

  // État des filtres actifs — initialise avec les valeurs par défaut (90 derniers jours)
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // État pour les mappings de tags
  const tagMapping = useTagStore((state) => state.tagMap);

  // Etats pour stocké la liste des country 
  const countryList = useCountryStore((state) => state.countries)
  /**
   * Convertit un objet dayjs en string au format YYYY-MM-DD
   * @param {dayjs.Dayjs} dayjsDate - Date au format dayjs
   * @returns {string|null} Date au format YYYY-MM-DD ou null
   */
  const formatDateToString = (dayjsDate) => {
    if (!dayjsDate) return null;
    return dayjsDate.format('YYYY-MM-DD');
  };

  /**
   * Récupère la liste complète des annonceurs depuis l'API avec les paramètres de date
   * @param {dayjs.Dayjs} startDate - Date de début (dayjs object)
   * @param {dayjs.Dayjs} endDate - Date de fin (dayjs object)
   */
  const fetchReporting = async (startDate = null, endDate = null, country = null) => {
    try {
      setLoading(true);



      const res = await get_liste_advertisers(startDate, endDate, country);

      console.log("✅ Fetched advertisers!!!");
      console.log("Response data:", res);
      console.log("Is array?", Array.isArray(res));
      console.log("Length:", res?.length);

      setListeAdvertisers(Array.isArray(res) ? res : []);

    } catch (error) {
      console.error("❌ Erreur lors du fetch:", error);
      setListeAdvertisers([]);
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
  // let d = [...listeAdvertiser].map(item => ({
  //   ...item,
  //   globales: {
  //     ...item.globales,
  //     taux_cto: item.globales.taux_cto || 0,  // ← Ajoute une valeur par défaut
  //   }
  // }));
    // Filtrer par annonceur spécifique si sélectionné
    if (Array.isArray(filters.all_fields) && filters.all_fields.length > 0) {
      d = d.filter((a) => filters.all_fields.includes(a.advertiser_name));
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
  }, [listeAdvertiser, filters]);

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
   * Initialisation au montage : chargement des tags et des annonceurs
   * Les dates par défaut sont dans DEFAULT_FILTERS (90 derniers jours)
   */
useEffect(() => {
  const init = async () => {
    try {
      console.log("🔄 Init starting...");
      
      const tags = await getMappingData('tags', 'tags');
      const countries = await getMappingData('country','country');
      console.log("Countries fetched:", countries.length, "countries.");
      console.log("✅ Tags loaded:", tags.length, "items");
      setTagMapping(tags);
      setCountries(countries);

      console.log("📅 Dates:", DEFAULT_FILTERS.scheduleStart, DEFAULT_FILTERS.scheduleEnd);
      // await fetchReporting();
      console.log("✅ Init complete");
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation :", error);
    }
  };

  init();
}, []);

  /**
   * Chaque fois que les dates du filtre changent, refetch les données API
   * Les autres filtres (advertiser, taux_clickers, etc) filtrent côté client
   */
  useEffect(() => {
    // Refetch l'API uniquement si les dates changent
    if (filters.scheduleStart && filters.scheduleEnd && filters.country) {
      fetchReporting(filters.scheduleStart, filters.scheduleEnd, filters.country);
      }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.country]);

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
        labelFilter="Advertisers"
        filters={filters}
        setFilters={setFilters}
        listes={listeAdvertiser}
        countries = {countryList}
        idList="advertiser_id"
        keyList="advertiser_name"
      />

      {/* ── Chart des Tops ── */}
      <Row gutter={12} wrap={false}>
        <Col flex="auto">
          <ChartSwitcher data={filteredData} />
        </Col>
        <Col flex="none">
          <TopTagsEcpm data={filteredData} tagMapping={tagMapping} />
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
          {filteredData.length > 0 ? (
            <ReportingTable
              data={filteredData} 
              tagMapping={tagMapping} 
              dataKey="advertiser" 
              date_start={filters.scheduleStart} 
              date_end={filters.scheduleEnd}
            />
          ) : (
            <div style={{ padding: 20, textAlign: "center" }}>Aucune donnée</div>          
          )}
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

export default Advertisers;