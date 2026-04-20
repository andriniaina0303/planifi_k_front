import React from "react";
import "../assets/css/sidebar.css";

const MenuItem = ({ icon: Icon, label, onClick, color }) => (
  <button
    className="menu-btn w-100 text-start d-flex align-items-center gap-3 mb-1"
    onClick={onClick}
  >
    <Icon className="menu-icon" style={{ color }} />
    <span>{label}</span>
  </button>
);

export default MenuItem;
