import React, { useEffect, useMemo, useState } from "react";
import { get_liste_advertisers } from "../../api/advertiser";
import "../../assets/css/advertisers.css";
import {
  Card,
  Row,
  Select,
  Col,
  Button,
  Table,
  Tag,
  Tooltip,
  Input,
} from "antd";
import {
  MailOutlined,
  EyeOutlined,
  LinkOutlined,
  StopOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import testAdvertisers from "../../data/testadv";
import ChartSwitcher from "../../components/ChartSwitcher";
import TopTagsEcpm from "../../components/TopTagsEcpm";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const listetags = [
  { id: 92, tag: "API", dwtag: "api" },
  { id: 53, tag: "Alarms", dwtag: "alarms" },
  { id: 42, tag: "Alcohol", dwtag: "alcohol_and_wine" },
  { id: 43, tag: "Beauty", dwtag: "beauty" },
  { id: 54, tag: "Books", dwtag: "books" },
  { id: 1, tag: "Bricolage - DIY", dwtag: "bricolage_diy" },
  { id: 97, tag: "Career", dwtag: "career" },
  { id: 2, tag: "Cars", dwtag: "cars" },
  { id: 70, tag: "Cleaning", dwtag: "cleaning" },
  { id: 46, tag: "Coffee", dwtag: "coffee" },
  { id: 55, tag: "Cooking", dwtag: "cooking" },
  { id: 3, tag: "Cosmetics", dwtag: "cosmetics" },
  { id: 56, tag: "Coupon - Discount", dwtag: "coupon_discount" },
  { id: 65, tag: "Credit Redemption - RAC", dwtag: "credit_redemption_rac" },
  { id: 4, tag: "Dating", dwtag: "dating" },
  {
    id: 5,
    tag: "Decoration - Furniture & Design",
    dwtag: "decoration_furniture_and_design",
  },
  { id: 49, tag: "Dentist", dwtag: "dentist" },
  { id: 7, tag: "Diet", dwtag: "diet" },
  { id: 6, tag: "Défisc - Tax", dwtag: "defisc_tax" },
  { id: 8, tag: "Ecommerce", dwtag: "ecommerce" },
  { id: 71, tag: "Electronics", dwtag: "electronics" },
  { id: 9, tag: "Energy", dwtag: "energy" },
  { id: 69, tag: "Epargne", dwtag: "epargne" },
  { id: 73, tag: "Fashion", dwtag: "fashion" },
  { id: 10, tag: "Finance", dwtag: "finance" },
  { id: 11, tag: "Food", dwtag: "food" },
  { id: 45, tag: "Forex", dwtag: "forex" },
  { id: 57, tag: "Gambling", dwtag: "gambling" },
  { id: 12, tag: "Gaming", dwtag: "gaming" },
  { id: 13, tag: "Garden", dwtag: "garden" },
  { id: 14, tag: "Health", dwtag: "health" },
  { id: 93, tag: "Health - Hearing", dwtag: "health_hearing" },
  { id: 15, tag: "High tech", dwtag: "high_tech" },
  { id: 17, tag: "Home assistance", dwtag: "home_assistance" },
  { id: 18, tag: "Ink", dwtag: "ink" },
  { id: 72, tag: "Insurance - Cars", dwtag: "cars" },
  { id: 19, tag: "Insurance - Funeral", dwtag: "insurance_funeral" },
  { id: 20, tag: "Insurance - Health", dwtag: "insurance_health" },
  { id: 21, tag: "Insurance - Home", dwtag: "insurance_home" },
  { id: 96, tag: "Insurance - Life", dwtag: "insurance_life" },
  { id: 58, tag: "Jewellery", dwtag: "jewellery" },
  { id: 22, tag: "Job", dwtag: "job" },
  { id: 23, tag: "Kids", dwtag: "kids" },
  { id: 61, tag: "Leisure", dwtag: "leisure" },
  { id: 24, tag: "Lingerie", dwtag: "lingerie" },
  { id: 25, tag: "Loan", dwtag: "loan" },
  { id: 26, tag: "Mode", dwtag: "mode" },
  { id: 77, tag: "Moto", dwtag: "Moto" },
  { id: 94, tag: "Newsletter", dwtag: "newsletter" },
  { id: 27, tag: "Obsèques - funeral", dwtag: "obseques_funeral" },
  { id: 52, tag: "Ong", dwtag: "ong_and_charity" },
  { id: 28, tag: "Optic", dwtag: "optic" },
  { id: 29, tag: "Pets", dwtag: "pets" },
  { id: 75, tag: "Politics", dwtag: "politics" },
  { id: 30, tag: "Real estate - immo", dwtag: "real_estate_immo" },
  { id: 50, tag: "Renovation", dwtag: "renovation" },
  {
    id: 78,
    tag: "Renovation - Air conditionning",
    dwtag: "renovation_air_conditionning",
  },
  { id: 84, tag: "Renovation - Heat pump", dwtag: "renovation_heat_pump" },
  { id: 79, tag: "Renovation - Heating", dwtag: "renovation_heating" },
  { id: 82, tag: "Renovation - Insulation", dwtag: "renovation_insulation" },
  {
    id: 80,
    tag: "Renovation - Secure shower",
    dwtag: "renovation_secure_shower",
  },
  {
    id: 85,
    tag: "Renovation - Solar panels",
    dwtag: "renovation_solar_panels",
  },
  {
    id: 83,
    tag: "Renovation - Stair climber",
    dwtag: "renovation_stair_climber",
  },
  { id: 81, tag: "Renovation - Windows", dwtag: "renovation_windows" },
  { id: 31, tag: "Sex Shop", dwtag: "sex_shop" },
  { id: 32, tag: "Sport", dwtag: "sport" },
  { id: 51, tag: "Studies", dwtag: "studies" },
  { id: 63, tag: "Supermarket", dwtag: "supermarket" },
  { id: 60, tag: "Survey", dwtag: "survey" },
  { id: 33, tag: "Sweepstakes", dwtag: "sweeptakes" },
  { id: 34, tag: "Swimming Pool", dwtag: "swimming_pool" },
  { id: 35, tag: "Telecom", dwtag: "telecom" },
  { id: 39, tag: "Trading", dwtag: "trading" },
  { id: 36, tag: "Training", dwtag: "training" },
  { id: 38, tag: "Travel", dwtag: "travel" },
  { id: 87, tag: "Travel - Bus", dwtag: "travel_bus" },
  { id: 89, tag: "Travel - Camping", dwtag: "travel_camping" },
  { id: 91, tag: "Travel - Cruise", dwtag: "travel_cruise" },
  { id: 86, tag: "Travel - Flight", dwtag: "travel_flight" },
  { id: 88, tag: "Travel - Hôtel", dwtag: "travel_hotel" },
  { id: 90, tag: "Travel - Train", dwtag: "travel_train" },
  { id: 40, tag: "Voyance - Clairvoyance", dwtag: "voyance_clairvoyance" },
  { id: 47, tag: "Water", dwtag: "water" },
  { id: 76, tag: "baby", dwtag: "baby" },
  { id: 64, tag: "credit", dwtag: "credit" },
  { id: 74, tag: "fonctionnaires", dwtag: "fonctionnaires" },
];

const tagMap = Object.fromEntries(listetags.map((t) => [t.id, t]));

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
      setListeAdvertisers(res);
      // setListeAdvertisers(testAdvertisers);
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // const filteredData = useMemo(() => {
  //   let d = [...listeAdvertiser];
  //   if (filters.advertiser !== "ALL") {
  //     d = d.filter((a) => a.advertiser_name === filters.advertiser);
  //   }
  //   if (filters.taux_clickers !== "ALL") {
  //     d = d.filter((a) =>
  //       a.globales.analyse.taux_clickers.includes(filters.taux_clickers),
  //     );
  //   }
  //   if (filters.taux_unsubs !== "ALL") {
  //     d = d.filter((a) =>
  //       a.globales.analyse.taux_unsubs.includes(filters.taux_unsubs),
  //     );
  //   }
  //   d = d.filter((a) => a.globales.sends >= filters.minSends);
  //   d.sort((a, b) => b.globales[filters.sortBy] - a.globales[filters.sortBy]);
  //   return d;
  // }, [listeAdvertiser, filters]);

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

  const getTagColor = (txt) => {
    if (!txt) return "default";
    if (txt.includes("🟢")) return "green";
    if (txt.includes("🟡")) return "gold";
    if (txt.includes("🔴")) return "red";
    return "default";
  };

  // ── Tooltip contenu analyse ──
  const AnalyseTooltip = ({ analyse }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 200,
      }}
    >
      {Object.entries(analyse).map(([key, value]) => (
        <div
          key={key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{ color: "#ccc", fontSize: 12, textTransform: "capitalize" }}
          >
            {key.replace(/_/g, " ")}
          </span>
          <Tag color={getTagColor(value)} style={{ margin: 0 }}>
            {value}
          </Tag>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    fetchReporting();
  }, []);

  const columns = [
    {
      title: "Advertiser",
      dataIndex: "advertiser_name",
      width: 120,
      sorter: (a, b) => a.advertiser_name.localeCompare(b.advertiser_name),

      // 🔍 filtre advertiser
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search advertiser"
            value={selectedKeys[0]}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKeys(value ? [value] : []);
              setSearchAdvertiser(value);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8 }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <a onClick={() => confirm()} style={{ color: "#1677ff" }}>
              Search
            </a>
            <a
              onClick={() => {
                clearFilters();
                setSearchAdvertiser("");
              }}
            >
              Reset
            </a>
          </div>
        </div>
      ),

      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),

      onFilter: (value, record) =>
        record.advertiser_name?.toLowerCase().includes(value.toLowerCase()),

      // 🎨 rendu avec tag en dessous
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag_id",
      width: 122,

      // 🔍 filtre autocomplete
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search tag"
            value={selectedKeys[0]}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKeys(value ? [value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8 }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <a onClick={() => confirm()} style={{ color: "#1677ff" }}>
              Search
            </a>
            <a onClick={() => clearFilters()}>Reset</a>
          </div>
        </div>
      ),

      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),

      // 🎯 filtre basé sur le NAME du tag
      onFilter: (value, record) => {
        const tag = tagMap[record.tag_id];
        return tag?.tag?.toLowerCase().includes(value.toLowerCase());
      },

      // 🎨 affichage
      render: (tag_id) => {
        const tag = tagMap[tag_id];

         return (
    <Tag
      color="cyan"
      style={{
        whiteSpace: "normal",
        display: "block",
        wordBreak: "break-word",
      }}
    >
      {tag ? tag.tag : "Unknown"}
    </Tag>
  );
      },
    },
    {
      title: "Env.",
      render: (_, r) => <b>{r.globales.sends}</b>,
      sorter: (a, b) => a.globales.sends - b.globales.sends,
    },
    {
      title: "Ouv.(%)",
      render: (_, r) => `${r.globales.taux_openers || 0}%`,
      sorter: (a, b) =>
        (a.globales.taux_openers || 0) - (b.globales.taux_openers || 0),
    },
    {
      title: "Clics(%)",
      render: (_, r) => (
        <span style={{ color: "#40a9ff" }}>
          {r.globales.taux_clickers || 0}%
        </span>
      ),
      sorter: (a, b) =>
        (a.globales.taux_clickers || 0) - (b.globales.taux_clickers || 0),
    },
    {
      title: "Dés.(%)",
      render: (_, r) => (
        <span style={{ color: "#ff4d4f" }}>{r.globales.taux_unsubs || 0}%</span>
      ),
      sorter: (a, b) =>
        (a.globales.taux_unsubs || 0) - (b.globales.taux_unsubs || 0),
    },
    {
      title: "CA(€)",
      render: (_, r) => `${r.globales.ca}`,
      sorter: (a, b) => a.globales.ca - b.globales.ca,
    },
    {
      title: "eCPM",
      render: (_, r) => `${r.globales.ecpm}`,
      sorter: (a, b) => a.globales.ecpm - b.globales.ecpm,
    },
  ];

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

      {/* ── Table + Charts ── */}
      <Row gutter={16} style={{ flex: 1 }}>
        <Col span={12}>
          <Card
            style={{ borderRadius: 10, height: "100%", width: "100%" }}
            bodyStyle={{ padding: 0 }}
          >
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="advrtiser_id"
             onRow={(record) => ({
                onClick: () =>
                  navigate(`/reporting/advertisers/${record.advertiser_id}`, {
                    state: { advertiser: record },
                  }),
                style: { cursor: "pointer" },
              })}
              tableLayout="fixed"
              bordered
              // ── Tooltip sur chaque ligne ──
              components={{
                body: {
                  row: ({ children, ...props }) => {
                    const record = filteredData.find(
                      (r) => r.advrtiser_id === props["data-row-key"],
                    );
                    return (
                      <Tooltip
                        title={
                          record ? (
                            <AnalyseTooltip analyse={record.globales.analyse} />
                          ) : null
                        }
                        placement="right"
                        color="#1e1e2f"
                        mouseEnterDelay={0.15}
                      >
                        <tr {...props} style={{ cursor: "pointer", width: "100%" }}>
                          {children}
                        </tr>
                      </Tooltip>
                    );
                  },
                },
              }}
              pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
                style: { marginTop: 12 },
                itemRender: (page, type, originalElement) => {
                  if (type === "page") {
                    return (
                      <div
                        style={{
                          borderRadius: "50%",
                          minWidth: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #d9d9d9",
                        }}
                      >
                        {page}
                      </div>
                    );
                  }
                  return originalElement;
                },
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              height: "100%",
            }}
          >
            <ChartSwitcher data={filteredData} />
            <TopTagsEcpm data={filteredData} listetags={listetags} />
          </div>
        </Col>
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
