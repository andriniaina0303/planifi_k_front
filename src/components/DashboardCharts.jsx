import React from "react";
import { Row, Col, Typography, Card } from "antd";
import GenderPieChart from "./GenderPieChart";

const { Title, Text } = Typography;

const DashboardCharts = ({ countResult }) => {
  if (!countResult) {
    return <Text type="secondary">Chargement des données...</Text>;
  }

  return (
    <Col span={24} style={{ padding: "0" }}>
      {/* Volume total des contacts */}
      <Row justify="center" style={{ marginBottom: 0 }}>
        <Col style={{ textAlign: "center" }}>
          <div>
            <Text style={{ fontSize: 14, fontWeight: 500, color: "#555" }}>
              Total Contacts
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: 24, fontWeight: 700, color: "#1890ff" }}>
              {countResult.total_contacts.toLocaleString()}
            </Text>
          </div>
        </Col>
      </Row>

      {/* Graphiques */}
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card style={{ textAlign: "center" }}>
            <Title level={5}>Répartition par âge</Title>
            {countResult.by_age ? (
              <GenderPieChart
                apiData={{
                  status: "success",
                  data: {
                    by_gender: countResult.by_age,
                    total_contacts: countResult.total_contacts,
                  },
                }}
              />
            ) : (
              <Text type="secondary">Chargement...</Text>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card style={{ textAlign: "center" }}>
            <Title level={5}>Répartition par genre</Title>
            {countResult.by_gender ? (
              <GenderPieChart
                apiData={{
                  status: "success",
                  data: {
                    by_gender: countResult.by_gender,
                    total_contacts: countResult.total_contacts,
                  },
                }}
              />
            ) : (
              <Text type="secondary">Chargement...</Text>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card style={{ textAlign: "center" }}>
            <Title level={5}>Répartition par ISP</Title>
            {countResult.by_isp ? (
              <GenderPieChart
                apiData={{
                  status: "success",
                  data: {
                    by_gender: countResult.by_isp,
                    total_contacts: countResult.total_contacts,
                  },
                }}
              />
            ) : (
              <Text type="secondary">Chargement...</Text>
            )}
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default DashboardCharts;
