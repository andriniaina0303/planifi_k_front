import {
  FiSettings,
  FiLogOut,
  FiBell,
} from "react-icons/fi";

import { AiFillCalendar } from "react-icons/ai";

// Menus principaux (composants déjà créés)
import ReportingMenu from "./ReportingMenu";
import MenuItem from "../bouton/MenuItem";
import CountingMenuItem from "./CountingMenuItem";


// Composant principal du sidebar
const SidebarContent = ({ onClose }) => (
  <div
    // Conteneur principal du sidebar
    className="d-flex flex-column bg-dark text-white p-4"

    // Style inline : hauteur + largeur fixe
    style={{ minHeight: "100vh", width: 240 }}
  >

    {/* ================= LOGO ================= */}
    <h5 className="d-flex align-items-center mb-4">
      {/* Petit rectangle décoratif à gauche du logo */}
      <span
        style={{
          width: 6,
          height: 24,
          backgroundColor: "#4fd1c5",
          marginRight: 8,
          borderRadius: 4,
        }}
      />

      {/* Nom de l'application */}
      Planifik
    </h5>

    {/* ================= MENUS PRINCIPAUX ================= */}

    {/* Menu Reporting (avec sous-menu) */}
    <ReportingMenu onClose={onClose} />

    {/* Menu Counting (avec sous-menu) */}
    <CountingMenuItem onClose={onClose} />

    {/* Menu simple sans sous-menu */}
    <MenuItem
      icon={AiFillCalendar}
      label="Automatic Schedule"
      onClick={onClose} // ferme sidebar si nécessaire
    />

    {/* Menu paramètres */}
    <MenuItem
      icon={FiSettings}
      label="Paramètres"
      onClick={onClose}
    />

    {/* ================= BAS DU SIDEBAR ================= */}
    <div className="mt-auto">

      {/* Ligne de séparation */}
      <hr className="text-secondary" />

      {/* ================= NOTIFICATIONS ================= */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <FiBell />
        <span>Notifications</span>
      </div>

      {/* ================= USER ================= */}
      <div className="d-flex align-items-center gap-2 mb-3">

        {/* Avatar utilisateur */}
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32 }}
        >
          AK
        </div>

        {/* Nom utilisateur */}
        <span>Andre Kontiki</span>
      </div>

      {/* ================= LOGOUT ================= */}
      <button
        className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
      >
        <FiLogOut />
        Déconnexion
      </button>

    </div>
  </div>
);

export default SidebarContent;