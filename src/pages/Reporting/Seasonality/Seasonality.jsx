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
  const [loadingTopDB, setLoadingTopDB] = useState(false); // Géré de façon autonome pour le composant de droite
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

  // ── 1. Fetch Global (Heatmap + Recommandations) ──
  const fetchReporting = async (startDate = null, endDate = null, filterBy = null, sort = "ecpm") => {
    try {
      setLoading(true);
      const [adv_tags, recTags] = await Promise.all([
        getTopAdvByTags(startDate, endDate, filterBy),
        getAllRecommendation(sort),
      ]);
      setTopAdvTags(adv_tags);
      setRecommendTags(recTags);
    } catch (error) {
      console.error("❌ Erreur lors du fetch global:", error);
      setTopAdvTags([]);
      setRecommendTags(null);
    } finally {
      setLoading(false);
    }
  };

  // ── 2. Fetch Spécifique pour le composant Top DBs (Autonome & Rapide) ──
  const fetchTopDBReporting = async (startDate, endDate, tagID) => {
    try {
      setLoadingTopDB(true);
      const db_tags = await get_top_DB_tags(startDate, endDate, tagID);
      setTopdbTags(db_tags);
    } catch (error) {
      console.error("❌ Erreur lors du fetch Top DB:", error);
      setTopdbTags([]);
    } finally {
      setLoadingTopDB(false);
    }
  };

  // ── Effect A : Écoute les filtres généraux (Sauf le filtre Tag pour éviter le rechargement global) ──
  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchReporting(
        filters.scheduleStart,
        filters.scheduleEnd,
        modeFilters,
        sortBy
      );
    }
  }, [filters.scheduleStart, filters.scheduleEnd, modeFilters, sortBy]);

  // ── Effect B : Écoute spécifiquement le composant Top DBs (Réagit au changement de date et de Tag) ──
  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchTopDBReporting(
        filters.scheduleStart,
        filters.scheduleEnd,
        filters.tag || null
      );
    }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.tag]);

  // Changement du tri provenant de RecommendationPanel
  const handleSortChange = async (val) => {
    setSortBy(val);
    try {
      const recTags = await getAllRecommendation(val);
      setRecommendTags(recTags);
    } catch (error) {
      console.error("❌ Erreur recommandation:", error);
    }
  };

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
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default Seasonality;