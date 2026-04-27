import "../../assets/css/sidebar.css";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom"
import SidebarContent from "../../components/menu /SideBarContent";

export default function Home() {
  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar Desktop */}
      <div className="d-none d-md-block">
        <SidebarContent />
      </div>

      {/* Offcanvas Mobile */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileMenu">
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Mobile toggle */}
        <div className="bg-white border-bottom px-3 py-2 d-md-none">
          <button
            className="btn btn-outline-secondary"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
          >
            <FiMenu />
          </button>
        </div>

        {/* Page Content */}
        <div className="overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}