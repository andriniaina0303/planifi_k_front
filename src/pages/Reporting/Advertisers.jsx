import React, { useEffect, useMemo, useState } from "react";
import { get_liste_advertisers } from "../../api/advertiser";
import "../../assets/css/advertisers.css";
import { listetags } from "../../components/table/AdvertisersTable";
import { Card,Row,Col} from "antd";
import KpiCardAdvertiser from "../../components/Kpi/KpiCardAdvertiser";
import AdvertisersTable from "../../components/table/AdvertisersTable";
import {MailOutlined,EyeOutlined, LinkOutlined,StopOutlined} from "@ant-design/icons";
// import testAdvertisers from "../../data/testadv";
import ChartSwitcher from "../../components/chart/ChartSwitcher";
import TopTagsEcpm from "../../components/chart/TopTagsEcpm";
import FilterAdvertiser, {DEFAULT_FILTERS} from "../../components/filter/FilterAdvertiser";

const Advertisers = () => {
  const [listeAdvertiser, setListeAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);  

  const fetchReporting = async () => {
    try {
      setLoading(true);
      const res = await get_liste_advertisers();
      console.log("Fetched advertisers!!!");
      setListeAdvertisers(res);
      // setListeAdvertisers(testAdvertisers);
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const filteredData = useMemo(() => {
    if (!listeAdvertiser || !Array.isArray(listeAdvertiser)) return [];

    let d = [...listeAdvertiser];

    if (filters.advertiser !== "ALL") {
      d = d.filter((a) => a.advertiser_name === filters.advertiser);
    }

    if (filters.taux_clickers !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_clickers?.includes(filters.taux_clickers),
      );
    }

    if (filters.taux_unsubs !== "ALL") {
      d = d.filter((a) =>
        a.globales?.analyse?.taux_unsubs?.includes(filters.taux_unsubs),
      );
    }

    d = d.filter((a) => a.globales?.sends >= filters.minSends);

    d.sort(
      (a, b) => b.globales?.[filters.sortBy] - a.globales?.[filters.sortBy],
    );

    return d;
  }, [listeAdvertiser, filters]);


  const stats = useMemo(() => {
    const totalSends = filteredData.reduce(
      (acc, a) => acc + a.globales.sends,
      0,
    );
    const totalOpen = filteredData.reduce(
      (acc, a) => acc + a.globales.openers,
      0,
    );
    const totalClick = filteredData.reduce(
      (acc, a) => acc + a.globales.clickers,
      0,
    );
    const totalUnsub = filteredData.reduce(
      (acc, a) => acc + a.globales.unsubs,
      0,
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


  useEffect(() => {
    fetchReporting();
  }, []);

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
          <KpiCardAdvertiser key={idx} label={s.label} value={s.value} color={s.color} />
        ))}
      </Row>

      {/* Chart des Tops */}
        <Row gutter={12} wrap={false}>
          <Col flex="auto">
            <ChartSwitcher data={filteredData} />
          </Col>  
          <Col flex="none">
            <TopTagsEcpm data={filteredData} listetags={listetags} />
          </Col>
        </Row>

      {/* ── Filtres ── */}
      <FilterAdvertiser
        filters={filters}
        setFilters={setFilters}
        listeAdvertiser={listeAdvertiser}
      />

      {/* ── Table ── */}
      <Row>
          <Card
            style={{ borderRadius: 10, height: "100%", width: "100%" }}
            bodyStyle={{ padding: 0 }}
          >
          <AdvertisersTable data={filteredData} />
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
  styleSheet.cssRules.length,
);

export default Advertisers;
