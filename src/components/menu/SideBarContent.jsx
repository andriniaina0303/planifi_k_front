

import { useState, useEffect } from "react";
import { FiSettings, FiLogOut, FiBell } from "react-icons/fi";
import { AiFillCalendar } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

import ReportingMenu from "./ReportingMenu";
import MenuItem from "../bouton/MenuItem";
import CountingMenuItem from "./CountingMenuItem";

import api, { logout } from "../../api/interceptor";

const activeStyle = {
  backgroundColor: "rgba(79, 209, 197, 0.15)",
  borderLeft: "3px solid #4fd1c5",
  borderRadius: "6px",
};

const SidebarContent = ({ onClose }) => {
  const location = useLocation();


  const isActive = (path) => location.pathname.startsWith(path);

   // Infos utilisateur récupérées depuis l'API
  const [user, seteUser] = useState({email:"", username:""});

  useEffect(() => {
     // Appel GET /auth/infos — le token est ajouté automatiquement par l'intercepteur
     api
      .get("/auth/infos")
      .then((res) =>{
        seteUser({
          email: res.data.email || "",
          username: res.data.username || "",
        });
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des infos utilisateur :", err);
        
      });
       
    }, []); 
     // Initiales pour l'avatar (ex: "Andre Kontiki" → "AK")
  const initials = user.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-4"
      style={{ minHeight: "100vh", width: 240 }}
    >
      {/* ================= LOGO ================= */}
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

      {/* ================= MENUS ================= */}

      <ReportingMenu onClose={onClose} />

      <CountingMenuItem onClose={onClose} />

      {/* Automatic Schedule */}
      <div style={isActive("/automatic-schedule") ? activeStyle : {}}>
        <MenuItem
          icon={AiFillCalendar}
          label="Automatic Schedule"
          onClick={onClose}
        />
      </div>

      {/* Paramètres */}
      <div style={isActive("/parametres") ? activeStyle : {}}>
        {/* <MenuItem
          icon={FiSettings}
          label="Paramètres"
          onClick={() => {
            navigate("/parametres");
            onClose?.();
          }}
        /> */}
         <MenuItem
          icon={FiSettings}
          label="Paramètres" 
          onClick={onClose}
        />

      </div>

      {/* ================= BAS DU SIDEBAR ================= */}
      <div className="mt-auto">
        <hr className="text-secondary" />

          {/* Notifications */}
        <div className="d-flex align-items-center gap-2 mb-3" style={isActive("/notifications") ? activeStyle : {}}>
          <MenuItem
            icon={FiBell}
            label="Notifications"
            onClick={onClose}
           />
         </div>


        {/* User */}
        <div className="d-flex align-items-center gap-2 mb-3">
          
            {/* Avatar avec initiales du username */}
          <div
            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 36, height: 36, fontSize: 13, fontWeight: 600 }}
          >
            {initials}
          </div>
          <div className="d-flex flex-column" >
            <span
            className="fw-semibold"
             style={{ fontSize: 13, lineHeight: 1.3 }}
          >
            {user.username || "—"}
          </span>

          <span
              className="text-secondary"
              style={{
                fontSize: 13,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.email || "—"}
            </span>

          </div>
          

        </div>

        {/* Logout */}
        <button
          className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={logout}
        >
          <FiLogOut />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default SidebarContent;