import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Advertisers from "./pages/Reporting/Advertisers";
import AdvertiserDetail from "./pages/Reporting/AdvertiserDetail";
import Database from "./pages/Reporting/Databases";
import Counting from "./pages/Counting/Counting";
import LoginPage from "./pages/Login/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />}>
          <Route index element={<h2>Bienvenue sur Planifik 🚀</h2>} />

          {/* Reporting */}
          <Route path="reporting/advertisers" element={<Advertisers />} />
          <Route path="reporting/advertisers/:advertiser_id" element={<AdvertiserDetail />} />
          <Route path="reporting/database" element={<Database />} />

          {/* Counting */}
          <Route path="counting" element={<Counting />}>
            <Route path="tasks" element={<Counting />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}