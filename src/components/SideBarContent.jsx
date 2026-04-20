import {
  FiSettings,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import { AiFillCalendar } from "react-icons/ai";


import ReportingMenu from "./ReportingMenu";
import MenuItem from "./MenuItem";
import CountingMenuItem from "./CountingMenuItem";

const SidebarContent = ({ onClose }) => (
  <div
    className="d-flex flex-column bg-dark text-white p-4"
    style={{ minHeight: "100vh", width: 240 }}
  >
    {/* Logo */}
    <h5 className="d-flex align-items-center mb-4">
      <span
        style={{
          width: 6,
          height: 24,
          backgroundColor: "#4fd1c5",
          marginRight: 8,
          borderRadius: 4,
        }}
      />
      Planifik
    </h5>

    {/* Menus */}
    <ReportingMenu onClose={onClose} />
    <CountingMenuItem onClose={onClose} />

    <MenuItem
      icon={AiFillCalendar}
      label="Automatic Schedule"
      onClick={onClose}
    />
    <MenuItem icon={FiSettings} label="Paramètres" onClick={onClose} />

    {/* PUSH EN BAS */}
    <div className="mt-auto">
      <hr className="text-secondary" />

      {/* Notifications */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <FiBell />
        <span>Notifications</span>
      </div>

      {/* User */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32 }}
        >
          AK
        </div>
        <span>Andre Kontiki</span>
      </div>

      {/* Logout */}
      <button className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
        <FiLogOut />
        Déconnexion
      </button>
    </div>
  </div>
);

export default SidebarContent;
