import React, { useEffect, useState } from "react";
import { Row, Col, Calendar } from "antd";
import { get_top_DB_tags } from "../../../api/databases";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import TopDbsTags from "../../../components/chart/TopDBTags";
import { useCountryStore, useTagStore } from "../../../utils/storedZustand";

const Seasonality = () => {
  const countryList = useCountryStore((state) => state.countries);

  const tagMapping = useTagStore((state) => state.tagMap);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [topDbTags, setTopDbTags] = useState([]);
  const [loading, setLoading] = useState(true);


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
  }
  /**
   * Récupère le top des DB par tags (score) pour la période/pays sélectionnés
   */
  const fetchTopDbTags = async (startDate = null, endDate = null, country = null) => {
    try {
      setLoading(true);
      const db_tags = await get_top_DB_tags(startDate, endDate, country);
      setTopDbTags(Array.isArray(db_tags) ? db_tags : []);
    } catch (error) {
      console.error("❌ Erreur lors du fetch des top DB tags:", error);
      setTopDbTags([]);
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value) => {
  switch (value.date()) {
    case 8:
      return [{ type: "success", content: "Campagne Email" }];
    case 15:
      return [{ type: "warning", content: "Newsletter" }];
    default:  
      return [];
  }
};

  const cellRender = (current) => {
    const listData = getListData(current);

    return (
      <ul style={{ padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index} style={{ listStyle: "none" }}>
            <Badge status={item.type} text={item.content} />
          </li>
         ))}
      </ul>
  );
};$

  // Refetch à chaque changement de dates ou de pays
  useEffect(() => {
    if (filters.scheduleStart && filters.scheduleEnd) {
      fetchTopDbTags(filters.scheduleStart, filters.scheduleEnd, filters.country);
    }
  }, [filters.scheduleStart, filters.scheduleEnd, filters.country]);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading top-performing databases by tags...</p>
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
      <FilterReporting
        labelFilter="Tags"
        filters={filters}
        setFilters={setFilters}
        listes={[]}
        countries={countryList}
        idList="id"
        keyList="name"
      />

      <Row  wrap={false} gutter={12}>
        <Col flex="auto" >
          <TopDbsTags data={topDbTags} tagNames={tagMapping} />
        </Col>
      </Row>
      <Calendar cellRender={cellRender} />
      
    </div>
  );
};

export default Seasonality;