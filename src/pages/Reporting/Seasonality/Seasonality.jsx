import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Row, Col } from "antd";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import { useTagStore,useCountryStore } from "../../../utils/storedZustand";
import TopDbsTags from "../../../components/chart/TopDBTags";
import { get_top_DB_tags } from "../../../api/databases";
import { SeasonalHeatmap } from "../../../components/table/SeasonalTable";
import { getTopAdvByTags } from "../../../api/advertiser";
import RecommendationPanel from "../../../components/chart/RecommendationPanel";
import { getAllRecommendation } from "../../../api/recommend";

const Seasonality = () => {

  const {setCountries} = useCountryStore();

  const tagMapping = useTagStore((state) => state.tagMap);
  const countryList = useCountryStore((state) => state.countries)
  
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingTopDB, setLoadingTopDB] = useState(false); // Géré de façon autonome pour le composant de droite
  const [loadingRecom, setLoadingRecom] = useState(false);
  const [loadingHeatMap, setLoadingHeatMap] = useState(false);
  const [modeFilters, setModeFilters] = useState("ecpm");
  const [sortBy, setSortBy] = useState("ecpm");
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    scheduleStart: dayjs().startOf('year'),
    scheduleEnd: dayjs().endOf('year'),
  }));

  const [topdbTags, setTopdbTags] = useState([]);
  const [topAdvTags, setTopAdvTags] = useState([]);
  const [recommendTags, setRecommendTags] = useState(null);

  const styles = {
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

// ── Premier chargement global ──
useEffect(() => {
  const init = async () => {
    await Promise.all([
      getTopAdvByTags(filters.scheduleStart, filters.scheduleEnd, modeFilters).then(setTopAdvTags).catch(() => setTopAdvTags([])),
      get_top_DB_tags(filters.scheduleStart, filters.scheduleEnd, filters.tag || null).then(setTopdbTags).catch(() => setTopdbTags([])),
      getAllRecommendation(sortBy).then(setRecommendTags).catch(() => setRecommendTags(null)),
    ]);
    setIsFirstLoad(false); // débloque l'affichage
  };
  init();
}, []); // une seule fois


// ── Heatmap : skip au premier rendu ──
useEffect(() => {
  if (isFirstLoad) return;
  if (!filters.scheduleStart || !filters.scheduleEnd) return;

  setLoadingHeatMap(true);
  getTopAdvByTags(filters.scheduleStart, filters.scheduleEnd, modeFilters)
    .then(setTopAdvTags)
    .catch(() => setTopAdvTags([]))
    .finally(() => setLoadingHeatMap(false));

}, [filters.scheduleStart, filters.scheduleEnd, filters.tag, modeFilters]);


// ── Top DBs : skip au premier rendu ──
useEffect(() => {
  if (isFirstLoad) return;
  if (!filters.scheduleStart || !filters.scheduleEnd) return;

  setLoadingTopDB(true);
  get_top_DB_tags(filters.scheduleStart, filters.scheduleEnd, filters.tag || null)
    .then(setTopdbTags)
    .catch(() => setTopdbTags([]))
    .finally(() => setLoadingTopDB(false));

}, [filters.scheduleStart, filters.scheduleEnd, filters.tag]);


// ── Recommendations : skip au premier rendu ──
useEffect(() => {
  if (isFirstLoad) return;

  setLoadingRecom(true);
  getAllRecommendation(sortBy)
    .then(setRecommendTags)
    .catch(() => setRecommendTags(null))
    .finally(() => setLoadingRecom(false));

}, [sortBy]);



  

  if (isFirstLoad) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading seasonality reporting...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, height: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filtres */}
      <FilterReporting
        labelFilter="tag"
        filters={filters}
        setFilters={setFilters}
        listes={[]}
        countries={countryList}
        idList="id"
        keyList="name"
        tagList={tagMapping}
      />

      {/* Heatmap + TopDbsTags */}
      <Row gutter={12}>
        <Col span={18}>
          <SeasonalHeatmap
            rawData={topAdvTags}
            startDate={filters.scheduleStart}
            endDate={filters.scheduleEnd}
            tagMapping={tagMapping}
            modeFilters={modeFilters}
            setModeFilters={setModeFilters}
            isLoading = {loadingHeatMap}
            styles={styles}
          />
        </Col>
        <Col span={6} style={{ alignSelf: "flex-start" }}>
          <TopDbsTags
            data={topdbTags}
            tagNames={tagMapping}
            tagValue={filters.tag}
            onTagChange={(value) => setFilters((prev) => ({ ...prev, tag: value }))}
            loadingTop={loadingTopDB} // Prop nettoyé, utilise la bonne variable autonome
            styles={styles}
          />
        </Col>
      </Row>

      {/* Panel recommandations */}
      <RecommendationPanel
        tags={recommendTags}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isLoading={loadingRecom}
        styles={styles}
      />
    </div>
  );
};

export default Seasonality;