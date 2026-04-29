/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOME.JSX - Disposition principale avec Sidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Layout racine contenant :
 * - Sidebar (menu de navigation) - Visible sur desktop, offcanvas sur mobile
 * - Contenu principal qui affiche les pages via <Outlet />
 * 
 * Responsive : 
 * - Desktop (md+) : Sidebar fixe à gauche
 * - Mobile (-md) : Menu hamburger qui ouvre le sidebar en offcanvas
 */

import "../../assets/css/sidebar.css";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom"
import SidebarContent from "../../components/menu/SideBarContent";

/**
 * Composant Home - Layout principal
 * 
 * @component
 * @returns {JSX.Element} Layout avec sidebar et outlet pour les sous-pages
 */
export default function Home() {
  return (
    <div className="d-flex vh-100 bg-light">
      {/* ================= SIDEBAR DESKTOP ================= */}
      {/* Affichée uniquement sur écrans md et plus grands */}
      <div className="d-none d-md-block">
        <SidebarContent />
      </div>

      {/* ================= OFFCANVAS SIDEBAR MOBILE ================= */}
      {/* Menu hamburger qui affiche le sidebar en overlay sur mobile */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileMenu">
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <div className="flex-grow-1 d-flex flex-column overflow-x-hidden">
        {/* ================= BOUTON MENU MOBILE ================= */}
        {/* Visible uniquement sur écrans < md */}
        <div className="bg-white border-bottom px-3 py-2 d-md-none">
          <button
            className="btn btn-outline-secondary"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
          >
            <FiMenu />
          </button>
        </div>

        {/* ================= PAGE DYNAMIQUE ================= */}
        {/* <Outlet /> affiche le composant de la route actuellement active */}
        <div className="overflow-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}