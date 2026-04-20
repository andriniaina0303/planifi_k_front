import React, { useState } from "react";
import "../assets/css/sidebar.css";

import { FiBarChart, FiDatabase } from "react-icons/fi";
import { BsFillMegaphoneFill } from "react-icons/bs";

import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";
import { useNavigate } from "react-router-dom";


const ReportingMenu = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <MenuItem
        icon={FiBarChart}
        label="Reporting"
        color="#4fd1c5"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="mt-1">
          <SubMenuItem
            icon={BsFillMegaphoneFill}
            label="Advertisers"
            color="#63b3ed"
             onClick={() => {
                navigate("/reporting/advertisers");
                onClose?.();
            }}
          />
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
      )}
    </>
  );
};

export default ReportingMenu;
