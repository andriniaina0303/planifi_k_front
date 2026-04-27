import React, { useState } from "react";
import "../../assets/css/sidebar.css";

// Import des icônes utilisées dans le menu
import { FiBarChart, FiDatabase } from "react-icons/fi";
import { BsFillMegaphoneFill } from "react-icons/bs";

// Composants personnalisés pour structurer le menu
import MenuItem from "../bouton/MenuItem";
import SubMenuItem from "../bouton/SubMenuItem";

// Hook de navigation (React Router)
import { useNavigate } from "react-router-dom";


// Composant principal du menu Reporting
const ReportingMenu = ({ onClose }) => {

  // État local qui contrôle si le sous-menu est ouvert ou fermé
  const [open, setOpen] = useState(false);

  // Fonction pour changer de route (navigation sans reload)
  const navigate = useNavigate();

  return (
    <>
      {/* MENU PRINCIPAL : Reporting */}
      <MenuItem
        icon={FiBarChart}              // Icône du menu
        label="Reporting"              // Texte affiché
        color="#4fd1c5"                // Couleur du menu
        onClick={() => setOpen(!open)} // Clique => ouvre/ferme le sous-menu
      />

      {/* SOUS-MENU : affiché uniquement si open === true */}
      {open && (
        <div className="mt-1">

          {/* OPTION 1 : Advertisers */}
          <SubMenuItem
            icon={BsFillMegaphoneFill}
            label="Advertisers"
            color="#63b3ed"
            onClick={() => {
              // Navigation vers la page advertisers
              navigate("/reporting/advertisers");

              // Ferme le menu sidebar si la fonction onClose existe
              onClose?.();
            }}
          />

          {/* OPTION 2 : Database */}
          <SubMenuItem
            icon={FiDatabase}
            label="Database"
            color="#f6ad55"
            onClick={() => {
              // Navigation vers la page database
              navigate("/reporting/database");

              // Ferme le menu sidebar si nécessaire
              onClose?.();
            }}
          />
        </div>
      )}
    </>
  );
};

// Export du composant pour l'utiliser ailleurs
export default ReportingMenu;