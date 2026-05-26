import { useState } from "react";
import { BarChartOutlined, DownloadOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import { exportGlobalTableXLS } from "../details/common/ExportBase";
import { exportAdvertiserXLS } from "../details/common/ExportAdvertiser";
import { get_advertiser_name } from "../../api/advertiser";
import { get_database_name } from "../../api/databases"; // mapping database_id → database_name via /reporting/all_bases


export const TabExtraContent = ({
  mainTab,
  viewMode,
  setViewMode,
  data,
  clsConfig,
  agenceMapping,
  advertiser_id,   // utilisé dans AdvertiserDetail (ExportBase)
  database_id,     // utilisé dans DatabaseDetail (ExportAdvertiser)
  allbase,
  tag_name
}) => {
  const [exporting, setExporting] = useState(false);

  // ── Bouton style partagé ────────────────────────────────────────────────────
  const btnStyle = {
    marginTop: 10,
    marginRight: 10,
    backgroundColor: exporting ? "#a0c4ff" : "#1677ff",
    borderColor:     exporting ? "#a0c4ff" : "#1677ff",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  };

  const onMouseEnter = (e) => {
    if (exporting) return;
    e.currentTarget.style.backgroundColor = "#4096ff";
    e.currentTarget.style.borderColor = "#4096ff";
  };
  const onMouseLeave = (e) => {
    if (exporting) return;
    e.currentTarget.style.backgroundColor = "#1677ff";
    e.currentTarget.style.borderColor = "#1677ff";
  };

  // ── Onglet dimensions → Segmented chart/table ──────────────────────────────
  if (mainTab?.toLowerCase().includes("dimensions")) {
    return (
      <Segmented
        value={viewMode}
        onChange={setViewMode}
        size="middle"
        style={{ marginTop: 10, marginRight: 10 }}
        options={[
          { label: <span><BarChartOutlined /> Charts</span>, value: "chart" },
          { label: <span><TableOutlined /> Tables</span>,    value: "table" },
        ]}
      />
    );
  }

  // ── Onglet "bases" → ExportBase (AdvertiserDetail) ─────────────────────────
  if (mainTab === "bases") {
    return (
      <Button
        icon={<DownloadOutlined />}
        size="middle"
        loading={exporting}
        disabled={exporting}
        style={btnStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={async () => {
          if (exporting) return;
          setExporting(true);
          try {
            const advertiserName = await get_advertiser_name(advertiser_id);
            await exportGlobalTableXLS(
              data.bases,
              allbase,
              clsConfig,
              agenceMapping,
              { id: advertiser_id, name: advertiserName }
            );
          } finally {
            setExporting(false);
          }
        }}
      >
        {exporting ? "Export en cours..." : "Export xls"}
      </Button>
    );
  }

  // ── Onglet "advertisers" → ExportAdvertiser (DatabaseDetail) ───────────────
  if (mainTab === "advertisers") {
    return (
      <Button
        icon={<DownloadOutlined />}
        size="middle"
        loading={exporting}
        disabled={exporting}
        style={btnStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={async () => {
          if (exporting) return;
          setExporting(true);
          try {
            // data.database_id existe mais data.database_name n'est PAS retourné par /reporting/database/{id}
            // → on résout le nom via /reporting/all_bases (avec cache dans get_database_name)
            const dbName = await get_database_name(data.database_id || database_id);
            await exportAdvertiserXLS(
              data.advertisers,
              agenceMapping,
              tag_name,
              clsConfig,
              { id: data.database_id || database_id, name: dbName }
            );
          } finally {
            setExporting(false);
          }
        }}
      >
        {exporting ? "Export en cours..." : "Export xls"}
      </Button>
    );
  }

  return null;
};