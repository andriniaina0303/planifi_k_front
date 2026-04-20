import React, { useState } from "react";
import "../assets/css/sidebar.css";

import { FiBarChart, FiDatabase } from "react-icons/fi";
import { BsFillMegaphoneFill } from "react-icons/bs";

import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";
import { useNavigate } from "react-router-dom";
import { AiFillBuild, AiFillCalculator, AiFillMail, AiFillUpSquare } from "react-icons/ai";


const CountingMenuItem = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <MenuItem
        icon={AiFillCalculator}
        label="Counting"
        color="#4fd1c5"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="mt-1">
          <SubMenuItem
            icon={AiFillBuild}
            label="Tasks"
            color="#63b3ed"
             onClick={() => {
                navigate("/counting/tasks");
                onClose?.();
            }}
          />
        </div>
      )}
    </>
  );
};

export default CountingMenuItem;
