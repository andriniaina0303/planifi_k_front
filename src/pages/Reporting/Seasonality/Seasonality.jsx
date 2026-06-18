import React, { useState } from "react";
import {Row, Col} from "antd";
import FilterReporting, { DEFAULT_FILTERS } from "../../../components/filter/FilterReporting";
import { useCountryStore, useTagStore } from "../../../utils/storedZustand";
import TopDbsTags from "../../../components/chart/TopDBTags";

const Seasonality = () => {

  const countryList = useCountryStore((state) => state.countries);

  const tagMapping = useTagStore((state) => state.tagMap);


  // État des filtres, initialisé avec les valeurs par défaut (90 derniers jours)
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [dbData, setdbData] = useState([]);

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
        labelFilter="Advertisers"
        filters={filters}
        setFilters={setFilters}
        listes={[]}
        countries={countryList}
        idList="id"
        keyList="name"
      />

      <Row>
        <Col span={24}>
          <TopDbsTags data={dbData} tagNames={tagMapping} />
        </Col>
      </Row>
    </div>
    
  );
};

export default Seasonality;