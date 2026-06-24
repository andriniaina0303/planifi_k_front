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
  const { setTagMapping } = useTagStore();
  const tagMapping = useTagStore((state) => state.tagMap);

  const [loading, setLoading] = useState(true);
  const [loadingDbTags, setLoadingDbTags] = useState(true);
  const [modeFilters, setModeFilters] = useState("ecpm");
  const [sortBy, setSortBy] = useState("ecpm");

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    scheduleStart: dayjs().startOf("year"),
    scheduleEnd: dayjs().endOf("year"),
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

  // 👑 Fetch principal (heatmap + topDB + recommandations)
  const fetchReporting = async (startDate = null, endDate = null, tagID = null, filterBy = null, sort = "ecpm") => {
    try {
      setLoading(true);
      setLoadingDbTags(true);

      const [adv_tags, db_tags, recTags] = await Promise.all([
        getTopAdvByTags(startDate, endDate, filterBy),
        get_top_DB_tags(startDate, endDate, tagID).finally(() => setLoadingDbTags(false)),
        getAllRecommendation(sort),
      ]);

      setTopAdvTags(adv_tags);
      setTopdbTags(db_tags);
      setRecommendTags(recTags);
    } catch (error) {
      console.error("❌ Erreur lors du fetch:", error);
      setTopAdvTags([]);
      setTopdbTags([]);
      setRecommendTags(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchReporting(
        filters.scheduleStart,
        filters.scheduleEnd,
        filters.tag || null,
        modeFilters,
        sortBy
      );
    }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.tag, modeFilters, sortBy]);

  // 👑 Changement du tri API depuis RecommendationPanel → relance uniquement getAllRecommendation
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
            loading={loadingDbTags}
            onTagChange={(value) => setFilters((prev) => ({ ...prev, tag: value }))}
          />
        </Col>
      </Row>

      {/* 👑 Panel recommandations */}
      <RecommendationPanel
        tags={recommendTags}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default Seasonality;