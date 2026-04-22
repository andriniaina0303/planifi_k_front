import React, { useEffect, useMemo, useState } from "react";
import { get_liste_advertisers } from "../../api/advertiser";
import "../../assets/css/advertisers.css";
import { listetags } from "../../components/table/AdvertisersTable";
import {
  Card,
  Row,
  Select,
  Col,
  Button
} from "antd";
import AdvertisersTable from "../../components/table/AdvertisersTable";
import {
  MailOutlined,
  EyeOutlined,
  LinkOutlined,
  StopOutlined
} from "@ant-design/icons";
// import testAdvertisers from "../../data/testadv";
import ChartSwitcher from "../../components/chart/ChartSwitcher";
import TopTagsEcpm from "../../components/chart/TopTagsEcpm";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Advertisers = () => {
  const [listeAdvertiser, setListeAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    advertiser: "ALL",
    taux_clickers: "ALL",
    taux_openers: "ALL",
    taux_unsubs: "ALL",
    taux_ca: "ALL",
    taux_ecpm: "ALL",
    minSends: 0,
    sortBy: "sends",
  });
  const navigate = useNavigate();

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

  const [searchText, setSearchText] = useState("");
  const [searchAdvertiser, setSearchAdvertiser] = useState("");
  const [searchTag, setSearchTag] = useState("");

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
        {stats.map((s, idx) => {
          let Icon;
          switch (s.label.toLowerCase()) {
            case "sends":
              Icon = (
                <MailOutlined
                  style={{ marginRight: 6, color: s.color, fontSize: 25 }}
                />
              );
              break;
            case "open":
              Icon = (
                <EyeOutlined
                  style={{ marginRight: 6, color: s.color, fontSize: 25 }}
                />
              );
              break;
            case "click":
              Icon = (
                <LinkOutlined
                  style={{ marginRight: 6, color: s.color, fontSize: 25 }}
                />
              );
              break;
            case "unsub":
              Icon = (
                <StopOutlined
                  style={{ marginRight: 6, color: s.color, fontSize: 25 }}
                />
              );
              break;
            case "ctr":
              Icon = (
                <LinkOutlined
                  style={{ marginRight: 6, color: s.color, fontSize: 25 }}
                />
              );
              break;
            default:
              Icon = null;
          }
          return (
            <Col key={idx} xs={24} sm={12} md={8} lg={4}>
              <Card
                style={{
                  borderRadius: 10,
                  background: "#1e1e2f",
                  border: "none",
                  position: "relative",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
                bodyStyle={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    height: 3,
                    width: "100%",
                    backgroundColor: s.color,
                    borderRadius: "4px 4px 0 0",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 12,
                    color: "#aaa",
                  }}
                >
                  {Icon}
                  <span>{s.label}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
                  {s.value}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Chart des Tops */}
        <Row gutter={16}>
          <Col>
            <ChartSwitcher data={filteredData} />
          </Col>  
          <Col>
            <TopTagsEcpm data={filteredData} listetags={listetags} />
          </Col>
        </Row>



      {/* ── Filtres ── */}
      <Card style={{ borderRadius: 10, background: "#ffffff" }}>
        <Row gutter={12} align="bottom">
          <Col span={4}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>Advertiser</span>
              <Select
                showSearch
                value={filters.advertiser}
                onChange={(v) => setFilters({ ...filters, advertiser: v })}
                style={{ width: "100%" }}
              >
                <Option value="ALL">All advertisers</Option>
                {listeAdvertiser &&
                  listeAdvertiser.map((a) => (
                    <Option key={a.advrtiser_id} value={a.advertiser_name}>
                      {a.advertiser_name}
                    </Option>
                  ))}
              </Select>
            </div>
          </Col>
          <Col span={3}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>eCPM</span>
              <Select
                value={filters.taux_ecpm}
                onChange={(v) => setFilters({ ...filters, taux_ecpm: v })}
                style={{ width: "100%" }}
              >
                <Option value="ALL">All</Option>
                <Option value="🟢">🟢 Good</Option>
                <Option value="🟡">🟡 Medium</Option>
                <Option value="🔴">🔴 Low</Option>
              </Select>
            </div>
          </Col>
          <Col span={3}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>CA</span>
              <Select
                value={filters.taux_ca}
                onChange={(v) => setFilters({ ...filters, taux_ca: v })}
                style={{ width: "100%" }}
              >
                <Option value="ALL">All</Option>
                <Option value="🟢">🟢 Good</Option>
                <Option value="🟡">🟡 Medium</Option>
                <Option value="🔴">🔴 Low</Option>
              </Select>
            </div>
          </Col>
          <Col span={3}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>Click Rate</span>
              <Select
                value={filters.taux_clickers}
                onChange={(v) => setFilters({ ...filters, taux_clickers: v })}
                style={{ width: "100%" }}
              >
                <Option value="ALL">All clickers</Option>
                <Option value="🟢">🟢 Good</Option>
                <Option value="🟡">🟡 Medium</Option>
                <Option value="🔴">🔴 Low</Option>
              </Select>
            </div>
          </Col>
          <Col span={3}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>Open Rate</span>
              <Select
                value={filters.taux_openers}
                onChange={(v) => setFilters({ ...filters, taux_openers: v })}
                style={{ width: "100%" }}
              >
                <Option value="ALL">All openers</Option>
                <Option value="🟢">🟢 Bon</Option>
                <Option value="🟡">🟡 Moyen</Option>
                <Option value="🔴">🔴 Faible</Option>
              </Select>
            </div>
          </Col>
          <Col span={3}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>Unsub Rate</span>
              <Select
                value={filters.taux_unsubs}
                onChange={(v) => setFilters({ ...filters, taux_unsubs: v })}
                style={{ width: "100%" }}
              >
                <Option value="ALL">All unsub</Option>
                <Option value="🟢">🟢 Good</Option>
                <Option value="🟡">🟡 Medium</Option>
                <Option value="🔴">🔴 Low</Option>
              </Select>
            </div>
          </Col>
          <Col span={3}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>&nbsp;</span>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() =>
                  setFilters({
                    advertiser: "ALL",
                    taux_clickers: "ALL",
                    taux_openers: "ALL",
                    taux_unsubs: "ALL",
                    taux_ca: "ALL",
                    taux_ecpm: "ALL",
                    minSends: 0,
                    sortBy: "sends",
                  })
                }
              >
                Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

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
