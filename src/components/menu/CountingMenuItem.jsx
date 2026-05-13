import React, { useState } from "react";
import "../../assets/css/sidebar.css";

// Icônes (plusieurs importées, mais seules certaines sont utilisées ici)
import { FiBarChart, FiDatabase } from "react-icons/fi";
import { BsFillMegaphoneFill } from "react-icons/bs";
import {
  AiFillBuild,
  AiFillCalculator,
  AiFillMail,
  AiFillUpSquare
} from "react-icons/ai";

// Composants de menu réutilisables
import MenuItem from "../bouton/MenuItem";
import SubMenuItem from "../bouton/SubMenuItem";

// Navigation React Router
import { useNavigate, useLocation } from "react-router-dom";

const activeStyle = {
  backgroundColor: "rgba(79, 209, 197, 0.15)",
  borderLeft: "3px solid #4fd1c5",
  borderRadius: "6px",
};

// Composant du menu "Counting"
const CountingMenuItem = ({ onClose }) => {


  // Hook pour changer de page sans recharger
  const navigate = useNavigate();
  const location = useLocation();

   const isCountingActive = location.pathname.startsWith("/counting");
   
  // État local pour gérer l'ouverture/fermeture du sous-menu
  const [open, setOpen] = useState(isCountingActive);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* MENU PRINCIPAL : Counting */}
      <MenuItem
        icon={AiFillCalculator}     // Icône du menu principal
        label="Counting"            // Texte affiché
        color="#4fd1c5"             // Couleur de l’icône
        onClick={() => setOpen(!open)} // Toggle ouverture/fermeture
      />

      {/* SOUS-MENU : affiché uniquement si open === true */}
      {open && (
        <div className="mt-1"  style={isActive("/counting/tasks") ? activeStyle : {}}>

          {/* OPTION UNIQUE : Tasks */}
          <SubMenuItem
            icon={AiFillBuild}
            label="Tasks"
            color="#63b3ed"

            onClick={() => {
              // Navigation vers la page tasks
              navigate("/counting/tasks");
              // Ferme éventuellement le sidebar si onClose existe
              onClose?.();
            }}
          />

        </div>
      )}
    </>
  );
};

export default CountingMenuItem;