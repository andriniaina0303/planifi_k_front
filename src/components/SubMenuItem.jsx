import React from "react";
import "../assets/css/sidebar.css";

const SubMenuItem = ({ icon: Icon, label, onClick, color }) => (
  <button
    className="submenu-btn w-100 text-start d-flex align-items-center gap-2 mb-1"
    onClick={onClick}
  >
    <Icon size={14} style={{ color }} />
    <span>{label}</span>
  </button>
);

export default SubMenuItem;
