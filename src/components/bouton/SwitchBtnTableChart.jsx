
import {useState} from "react";
import { BarChartOutlined, DownloadOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import { exportGlobalTableXLS } from "../details/common/ExportBase";
import { get_advertiser_name } from "../../api/advertiser";

export const TabExtraContent = ({
  mainTab,
  viewMode,
  setViewMode,
  data,
  clsConfig,
  agenceMapping,
  advertiser_id,   // ID de l'annonceur courant (depuis useParams dans le parent)
  allbase,
}) => {
  const [exporting, setExporting] = useState(false);

  if (mainTab === "dimensions") {
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

  if (mainTab === "bases") {
    return (
      <Button
        icon={<DownloadOutlined />}
        size="middle"
        loading={exporting}  // ← spinner natif Ant Design pendant l'export
        disabled={exporting}  // ← empêche un double-clic
        style={{
          marginTop: 10,
          marginRight: 10,
          backgroundColor: exporting? "#a0c4ff" : "#1677ff",
          borderColor:exporting? "#a0c4ff" : "#1677ff",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "6px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#4096ff";
          e.currentTarget.style.borderColor = "#4096ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1677ff";
          e.currentTarget.style.borderColor = "#1677ff";
        }}
        onClick={async () => {
          if (exporting) return;  // Sécurité anti-double-clic
          setExporting(true);
          try{
             // Résolution du nom via l'API all_advertisers (avec cache — pas de double fetch)
          const advertiserName = await get_advertiser_name(advertiser_id);
          await exportGlobalTableXLS( 
            data.bases,
            allbase,
            clsConfig,
            agenceMapping,
            { id: advertiser_id, name: advertiserName }
          );
          } finally {
            setExporting(false);  // ← s'exécute uniquement quand l'export est vraiment terminé
          }
        }}
      >
        {exporting ? "Exporting en cours..." : "Export xls"}
      </Button>
    );
  }

  return null;
};