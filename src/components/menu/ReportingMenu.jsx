
import React, { useState } from "react";
import "../../assets/css/sidebar.css";

import { FiBarChart, FiDatabase, FiMap } from "react-icons/fi";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { SafetyOutlined,ClockCircleOutlined} from '@ant-design/icons';


import MenuItem from "../bouton/MenuItem";
import SubMenuItem from "../bouton/SubMenuItem";

import { useNavigate, useLocation } from "react-router-dom";

const activeStyle = {
  backgroundColor: "rgba(79, 209, 197, 0.15)",
  borderLeft: "3px solid #4fd1c5",
  borderRadius: "6px",
};

const ReportingMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isReportingActive = location.pathname.startsWith("/reporting");
  const [open, setOpen] = useState(isReportingActive);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* MENU PRINCIPAL : Reporting */}
      <div 
      // style={isReportingActive ? activeStyle : {}}
      >
        <MenuItem
          icon={FiBarChart}
          label="Reporting"
          color="#4fd1c5"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* SOUS-MENU */}
      {open && (
        <div className="mt-1">

          {/* Advertisers */}
          <div style={isActive("/reporting/advertisers") ? activeStyle : {}}>
            <SubMenuItem
              icon={BsFillMegaphoneFill}
              label="Advertisers"
              color="#63b3ed"
              onClick={() => {
                navigate("/reporting/advertisers");
                onClose?.();
              }}
            />
          </div>

          {/* Database */}  
          <div style={isActive("/reporting/database") ? activeStyle : {}}>
            <SubMenuItem
              icon={FiDatabase}
              label="Database"
              color="#f6ad55"
              onClick={() => {
                navigate("/reporting/database");
                onClose?.();
              }}
            />
          </div>

          {/* Database */}  
          <div style={isActive("/reporting/seasonality") ? activeStyle : {}}>
            <SubMenuItem
              icon={ClockCircleOutlined}
              label="Seasonality"
              color="#12b61f"
              onClick={() => {
                navigate("/reporting/seasonality");
                onClose?.();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReportingMenu;