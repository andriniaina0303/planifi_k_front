import { BarChartOutlined, DownloadOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import { exportGlobalTableXLS } from "../details/common/ExportBase";

export const TabExtraContent = ({
  mainTab,
  viewMode,
  setViewMode,
  data,
  clsConfig,
  agenceMapping,
  allbase
}) => {
  if (mainTab === "dimensions" || mainTab === "Dimensions Brands" ) {
    return (
      <Segmented
        value={viewMode}
        onChange={setViewMode}
        size="middle"
        style={{ marginTop: 10, marginRight: 10 }}
        options={[
          {
            label: <span><BarChartOutlined /> Charts</span>,
            value: "chart",
          },
          {
            label: <span><TableOutlined /> Tables</span>,
            value: "table",
          }
        ]}
      />
    );
  }

  if (mainTab === "bases") {
    return (
      <Button
        icon={<DownloadOutlined />}
        size="middle"
        style={{ marginTop: 10, marginRight: 10 }}
        onClick={() =>
          exportGlobalTableXLS(data.bases,allbase,clsConfig, agenceMapping)
        }
      >
        Export xls
      </Button>
    );
  }

  return null;
};