import React, { useState, useEffect } from "react";
import dayjs from "dayjs"; // 👑 Assurez-vous d'importer dayjs ici
import { Row, Col, Select, Calendar } from "antd";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import { useTagStore } from "../../../utils/storedZustand";
import TopDbsTags from "../../../components/chart/TopDBTags";
import { get_top_DB_tags } from "../../../api/databases";
import { SeasonalHeatmap } from "../../../components/table/SeasonalTable";
import { getTopAdvByTags } from "../../../api/advertiser";

const Seasonality = () => {
  const { setTagMapping } = useTagStore();
  const tagMapping = useTagStore((state) => state.tagMap);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    return {
      ...DEFAULT_FILTERS,
      scheduleStart: dayjs().startOf('year'), // 👑 Fixe au 1er Janvier de l'année en cours (00:00:00)
      scheduleEnd: dayjs().endOf('year'),     // 👑 Fixe au 31 Décembre de l'année en cours (23:59:59)
    };
  });
  const [topdbTags, setTopdbTags] = useState([]);
  const [topAdvTags, setTopAdvTags] = useState([]);
  
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

  const fetchReporting = async (startDate = null, endDate = null, tagID = null) => {
    try {
      setLoading(true);
      const adv_tags = await getTopAdvByTags(startDate, endDate);
      const db_tags = await get_top_DB_tags(startDate, endDate, tagID);
      
      console.log("Valeur de adv_tags fetched : ",adv_tags)
      setTopAdvTags(adv_tags);
      setTopdbTags(db_tags);
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
      fetchReporting(filters.scheduleStart, filters.scheduleEnd, filters.tag || null);
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
console.log("Mois configuré dans le calendrier :", filters.scheduleStart?.format("MMMM YYYY"));
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
      {/* Barre supérieure de filtres (Où vous gérez vos boutons/dates/années) */}
      <FilterReporting
        labelFilter="tag"
        filters={filters}
        setFilters={setFilters}
        listes={[]}
        idList="id"
        keyList="name"
        tagList={tagMapping}
      />

      {/* Zone Graphique */}
      <Row gutter={12} >
        <Col span={18}>
          {/* <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 10, background: '#fff' }}>
            <Calendar 
              mode="year" // 1. Garde le calendrier en mode Année (affichage des 12 mois)
              value={filters.scheduleStart} // 2. Le calendrier écoute l'état de vos filtres
              onPanelChange={onPanelChange}
              headerRender={() => {
                // 3. Supprime complètement le header natif (et donc son Select d'année)
                // return null; 
                
                // Option alternative si vous voulez quand même afficher juste le titre textuel de l'année :
                return <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>Année: {filters.scheduleStart?.format('YYYY')}</div>;
              }}
            />
          </div> */}
          <SeasonalHeatmap 
            rawData={topAdvTags} 
            startDate={filters.scheduleStart} 
            endDate={filters.scheduleEnd} 
            tagMapping = {tagMapping}
          />
        </Col>
        <Col span={6} style = {{alignSelf:'flex-start'}}>
          <TopDbsTags 
            data={topdbTags} 
            tagNames={tagMapping} 
            tagValue={filters.tag}
            onTagChange={(value) => 
              setFilters((prev) => ({ ...prev, tag: value }))
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default Seasonality;