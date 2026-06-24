import React, { useState, useEffect } from "react";
import dayjs from "dayjs"; // 👑 Assurez-vous d'importer dayjs ici
import { Row, Col, Select, Calendar } from "antd";
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
  const [modeFilters,setModeFilters] = useState("ecpm")
  const [filters, setFilters] = useState(() =>( {
         ...DEFAULT_FILTERS,
      scheduleStart: dayjs().startOf('year'), // 👑 Fixe au 1er Janvier de l'année en cours (00:00:00)
      scheduleEnd: dayjs().endOf('year'),     // 👑 Fixe au 31 Décembre de l'année en cours (23:59:59)
    
  }));
  const [topdbTags, setTopdbTags] = useState([]);
  const [topAdvTags, setTopAdvTags] = useState([]);

  const [recommendDatabases, setRecommendDatabases] = useState(null);
  const [recommendAdvertisers, setRecommendAdvertisers] = useState(null);
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

  const fetchReporting = async (startDate = null, endDate = null, tagID = null, filterBy = null) => {
    try {
      setLoading(true);

       const [adv_tags, db_tags, recDatabases, recAdvertisers, recTags] = await Promise.all([
        getTopAdvByTags(startDate, endDate, filterBy),
        get_top_DB_tags(startDate, endDate, tagID),
        getAllRecommendation('databases'),
        getAllRecommendation('advertisers'),
        getAllRecommendation('tags'),
      ]);

      setTopAdvTags(adv_tags);
      setTopdbTags(db_tags);
      setRecommendDatabases(recDatabases);
      setRecommendAdvertisers(recAdvertisers);
      setRecommendTags(recTags);
    } catch (error) {
      console.error("❌ Erreur lors du fetch:", error);
      setTopAdvTags([]);
      setTopdbTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchReporting(filters.scheduleStart, filters.scheduleEnd, filters.tag || null, modeFilters);
    }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.tag, modeFilters]);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading seasonality reporting...</p>
      </div>
    );
  }
console.log("Mois configuré dans le calendrier :", filters.scheduleStart?.format("MMMM YYYY"));
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
          />
        </Col>
      </Row>

      {/* 👑 Panel recommandations avec auto-slide */}
      <RecommendationPanel
        databases={recommendDatabases}
        advertisers={recommendAdvertisers}
        tags={recommendTags}
      />
    </div>
  );
};

export default Seasonality;