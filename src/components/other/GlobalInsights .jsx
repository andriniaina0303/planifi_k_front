import React, { useMemo } from "react";
import { Card, Row, Col } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d"];

const GlobalInsights = ({ data, listetags }) => {
  // 🔹 Top Tags par eCPM
  const topTags = useMemo(() => {
    const tagsPerf = listetags.map((tag) => {
      const items = data.filter((a) => a.tags_id === tag.id);

      const sends = items.reduce((acc, a) => acc + a.globales.sends, 0);
      const ca = items.reduce((acc, a) => acc + a.globales.ca, 0);

      return {
        tag: tag.tag,
        eCPM: sends ? (ca / sends) * 1000 : 0,
      };
    });

    return tagsPerf
      .sort((a, b) => b.eCPM - a.eCPM)
      .slice(0, 10);
  }, [data, listetags]);

  // 🔹 Concentration CA
  const caDistribution = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.globales.ca - a.globales.ca);

    const top10 = sorted.slice(0, 10);
    const totalCA = sorted.reduce((acc, a) => acc + a.globales.ca, 0);
    const top10CA = top10.reduce((acc, a) => acc + a.globales.ca, 0);

    return [
      { name: "Top 10", value: top10CA },
      { name: "Others", value: totalCA - top10CA },
    ];
  }, [data]);

  return (
    <Row gutter={12}>
      {/* 🔥 Top Tags eCPM */}
      <Col span={24}>
        <div style={{ height: 250 }}>
          <Card title="Top 10 Tags par eCPM" size="small" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTags} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="tag" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="eCPM" fill="#722ed1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Col>

      {/* 💰 Concentration CA */}
      <Col span={24}>
        <div style={{ height: 250 }}>
          <Card title="Concentration CA (Top 10 vs Others)" size="small" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {caDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Col>
    </Row>
  );
};

export default GlobalInsights;