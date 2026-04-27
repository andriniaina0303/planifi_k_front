import React from "react";
import { Card, Col } from "antd";
import {
  MailOutlined,
  EyeOutlined,
  LinkOutlined,
  StopOutlined,
} from "@ant-design/icons";

const getIcon = (label, color) => {
  const style = { marginRight: 6, color, fontSize: 25 };
  switch (label.toLowerCase()) {
    case "sends":
      return <MailOutlined style={style} />;
    case "open":
      return <EyeOutlined style={style} />;
    case "click":
    case "ctr":
      return <LinkOutlined style={style} />;
    case "unsub":
      return <StopOutlined style={style} />;
    default:
      return null;
  }
};

const KpiCardAdvertiser = ({ label, value, color }) => {
  const Icon = getIcon(label, color);

  return (
    <Col xs={24} sm={12} md={8} lg={4}>
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
            backgroundColor: color,
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
          <span>{label}</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
          {value}
        </div>
      </Card>
    </Col>
  );
};

export default KpiCardAdvertiser;