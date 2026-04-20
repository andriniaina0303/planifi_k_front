import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Card,
  Table,
  Tag,
  Spin,
} from "antd";
import { get_liste_advertisers } from "../../api/advertiser";

const { Option } = Select;

const Advertisers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    advertiser: "ALL",
    taux_clickers: "ALL",
    taux_unsubs: "ALL",
    minSends: 0,
    sortBy: "sends",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await get_liste_advertisers();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(false), 500); // smooth UX
    }
  };

  const filteredData = useMemo(() => {
    let d = [...data];

    if (filters.advertiser !== "ALL") {
      d = d.filter((a) => a.advertiser_name === filters.advertiser);
    }

    if (filters.taux_clickers !== "ALL") {
      d = d.filter((a) =>
        a.globales.analyse.taux_clickers.includes(filters.taux_clickers)
      );
    }

    if (filters.taux_unsubs !== "ALL") {
      d = d.filter((a) =>
        a.globales.analyse.taux_unsubs.includes(filters.taux_unsubs)
      );
    }

    d = d.filter((a) => a.globales.sends >= filters.minSends);
    d.sort((a, b) => b.globales[filters.sortBy] - a.globales[filters.sortBy]);

    return d;
  }, [data, filters]);

  const stats = useMemo(() => {
    const totalSends = filteredData.reduce((acc, a) => acc + a.globales.sends, 0);
    const totalOpen = filteredData.reduce((acc, a) => acc + a.globales.openers, 0);
    const totalClick = filteredData.reduce((acc, a) => acc + a.globales.clickers, 0);
    const totalUnsub = filteredData.reduce((acc, a) => acc + a.globales.unsubs, 0);

    return {
      sends: totalSends,
      open: totalOpen,
      click: totalClick,
      unsub: totalUnsub,
      ctr:
        totalClick && totalSends
          ? ((totalClick / totalSends) * 100).toFixed(2)
          : 0,
    };
  }, [filteredData]);

  const getTagColor = (txt) => {
    if (txt.includes("🟢")) return "green";
    if (txt.includes("🟡")) return "gold";
    if (txt.includes("🔴")) return "red";
    return "default";
  };

  const columns = [
    {
      title: "Annonceur",
      dataIndex: "advertiser_name",
    },
    {
      title: "Envois",
      render: (_, r) => <b>{r.globales.sends}</b>,
    },
    {
      title: "Ouverture",
      render: (_, r) => `${r.globales.taux_openers || 0}%`,
    },
    {
      title: "Clic",
      render: (_, r) => (
        <span style={{ color: "#40a9ff" }}>
          {r.globales.taux_clickers || 0}%
        </span>
      ),
    },
    {
      title: "Désabo",
      render: (_, r) => (
        <span style={{ color: "#ff4d4f" }}>
          {r.globales.taux_unsubs || 0}%
        </span>
      ),
    },
    {
      title: "Statut",
      render: (_, r) => (
        <Tag color={getTagColor(r.globales.analyse.taux_clickers)}>
          {r.globales.analyse.taux_clickers}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={styles.loader}>
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>
          🚀 Loading advertiser reporting...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 🔥 FILTER BAR */}
      <Card style={styles.filterCard}>
        <Row gutter={16}>
          <Col>
            <Select
              value={filters.advertiser}
              onChange={(v) => setFilters({ ...filters, advertiser: v })}
              style={{ width: 160 }}
            >
              <Option value="ALL">Tous</Option>
              {data.map((a) => (
                <Option key={a.advrtiser_id} value={a.advertiser_name}>
                  {a.advertiser_name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col>
            <Select
              value={filters.taux_clickers}
              onChange={(v) => setFilters({ ...filters, taux_clickers: v })}
            >
              <Option value="ALL">Tous clic</Option>
              <Option value="🟢">🟢 Bon</Option>
              <Option value="🟡">🟡 Moyen</Option>
              <Option value="🔴">🔴 Faible</Option>
            </Select>
          </Col>

          <Col>
            <Select
              value={filters.taux_unsubs}
              onChange={(v) => setFilters({ ...filters, taux_unsubs: v })}
            >
              <Option value="ALL">Tous désabo</Option>
              <Option value="✅">✅ Faible</Option>
              <Option value="🚨">🚨 Élevé</Option>
            </Select>
          </Col>

          <Col>
            <InputNumber
              placeholder="Min envois"
              onChange={(v) => setFilters({ ...filters, minSends: v || 0 })}
            />
          </Col>

          <Col>
            <Select
              value={filters.sortBy}
              onChange={(v) => setFilters({ ...filters, sortBy: v })}
            >
              <Option value="sends">Envois</Option>
              <Option value="clickers">Clicks</Option>
              <Option value="unsubs">Unsubs</Option>
            </Select>
          </Col>

          <Col>
            <Button
              type="primary"
              danger
              onClick={() =>
                setFilters({
                  advertiser: "ALL",
                  taux_clickers: "ALL",
                  taux_unsubs: "ALL",
                  minSends: 0,
                  sortBy: "sends",
                })
              }
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 📊 STATS */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={4}>
          <Card style={styles.cardBlue}>📤 {stats.sends}</Card>
        </Col>
        <Col span={4}>
          <Card style={styles.cardGreen}>👁 {stats.open}</Card>
        </Col>
        <Col span={4}>
          <Card style={styles.cardCyan}>🖱 {stats.click}</Card>
        </Col>
        <Col span={4}>
          <Card style={styles.cardRed}>❌ {stats.unsub}</Card>
        </Col>
        <Col span={4}>
          <Card style={styles.cardPurple}>CTR {stats.ctr}%</Card>
        </Col>
      </Row>

      {/* 📋 TABLE */}
      <Card title="📊 Advertisers Performance" style={styles.tableCard}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="advrtiser_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
  },
  filterCard: {
    marginBottom: 20,
    background: "#1e293b",
    borderRadius: 10,
  },
  tableCard: {
    background: "#1e293b",
    borderRadius: 10,
  },
  loader: {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // 🎨 KPI COLORS
  cardBlue: { background: "#1677ff", color: "#fff", borderRadius: 10 },
  cardGreen: { background: "#52c41a", color: "#fff", borderRadius: 10 },
  cardCyan: { background: "#13c2c2", color: "#fff", borderRadius: 10 },
  cardRed: { background: "#ff4d4f", color: "#fff", borderRadius: 10 },
  cardPurple: { background: "#722ed1", color: "#fff", borderRadius: 10 },
};

export default Advertisers;