import React from "react";

const KpiCard = ({ label, value, sub }) => {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
};

export default KpiCard;