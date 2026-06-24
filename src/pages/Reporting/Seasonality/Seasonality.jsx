import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Row, Col } from "antd";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import { useTagStore } from "../../../utils/storedZustand";
import TopDbsTags from "../../../components/chart/TopDBTags";
import { get_top_DB_tags } from "../../../api/databases";
import { SeasonalHeatmap } from "../../../components/table/SeasonalTable";
import { getTopAdvByTags } from "../../../api/advertiser";
import RecommendationPanel from "../../../components/chart/RecommendationPanel";
import { getAllRecommendation } from "../../../api/recommend";

const Seasonality = () => {
  const tagMapping = useTagStore((state) => state.tagMap);
  const [loading, setLoading] = useState(true);
  const [loadingTopDB, setLoadingTopDB] = useState(false); // ── Géré de façon autonome ──
  const [modeFilters, setModeFilters] = useState("ecpm");
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    scheduleStart: dayjs().startOf('year'),
    scheduleEnd: dayjs().endOf('year'),
  }));
  const [topdbTags, setTopdbTags] = useState([]);
  const [topAdvTags, setTopAdvTags] = useState([]);
  const [recommendTags, setRecommendTags] = useState(null);

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

  // ── 1. Fetch Global (Premier chargement ou changement de date global) ──
  const fetchGlobalReporting = async (startDate, endDate, filterBy) => {
    try {
      setLoading(true);
      const [adv_tags, recTags] = await Promise.all([
        getTopAdvByTags(startDate, endDate, filterBy),
        getAllRecommendation(filterBy),
      ]);
      setTopAdvTags(adv_tags);
      setRecommendTags(recTags);
    } catch (error) {
      console.error("❌ Erreur lors du fetch global:", error);
      setTopAdvTags([]);
    } finally {
      setLoading(false);
    }
  };

  // ── 2. Fetch Spécifique pour le composant Top DBs (Cliquable/Indépendant) ──
  const fetchTopDBReporting = async (startDate, endDate, tagID) => {
    try {
      setLoadingTopDB(true); // Active le loader ciblé
      const db_tags = await get_top_DB_tags(startDate, endDate, tagID);
      setTopdbTags(db_tags);
    } catch (error) {
      console.error("❌ Erreur lors du fetch Top DB:", error);
      setTopdbTags([]);
    } finally {
      setLoadingTopDB(false); // Désactive le loader ciblé à coup sûr
    }
  };

  // ── Effect A : Écoute les filtres généraux (Dates, Mode eCPM/Volume) ──
  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchGlobalReporting(filters.scheduleStart, filters.scheduleEnd, modeFilters);
    }
  }, [filters.scheduleStart, filters.scheduleEnd, modeFilters]);

  // ── Effect B : Écoute les changements liés au Top DB (y compris le clic sur un Tag) ──
  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchTopDBReporting(filters.scheduleStart, filters.scheduleEnd, filters.tag || null);
    }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.tag]);

  if (loading) {
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
          />
        </Col>
        <Col span={6} style={{ alignSelf: "flex-start" }}>
          <TopDbsTags
            data={topdbTags}
            tagNames={tagMapping}
            tagValue={filters.tag}
            // ── Correction ici : on met juste à jour l'état, les useEffects s'occupent du reste ──
            onTagChange={(value) => setFilters((prev) => ({ ...prev, tag: value }))}
            loadingTop={loadingTopDB}
            styles={styles}
          />
        </Col>
      </Row>

      {/* Panel recommandations avec auto-slide */}
      <RecommendationPanel tags={recommendTags} />
    </div>
  );
};

export default Seasonality;