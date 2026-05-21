import { Tooltip, Typography,Collapse } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { tokens } from "../../../utils/Tokens";
import { decodeBase64 } from "../../../utils/utils";
import { buildSegmentButton, buildListButton  } from "./CreateColumns";
import { DimSection } from "../common/DimSection";
const { Text } = Typography;

export const getDimensionCollapseItems = (base = {},segmentNames,listNames,viewMode,styles,brandSort="asc") => {
    const sortedBrands = (base.brands || [])
    .slice()
    .sort((a, b) => {
        const nameA = decodeBase64(a.name);
        const nameB = decodeBase64(b.name);

        return brandSort === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    return sortedBrands.map((brand, index) => ({
    key: `${base.database_id}_${index}`,

    label: (
        <div
            style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            width: "100%",
            paddingRight: 20,
            }}
        >
            {/* BRAND */}
            <div
            style={{
                minWidth: 220,
                maxWidth: 220,
                display: "flex",
                flexDirection: "column",
            }}
            >
            <Text strong style={{ fontSize: 12 }}>
                {decodeBase64(brand.name)}
            </Text>

            <Tooltip title={brand.creativities}>
                <a
                href={brand.creativities}
                target="_blank"
                rel="noreferrer"
                style={{
                    fontSize: 11,
                    color: tokens.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                >
                <LinkOutlined style={{ marginRight: 4 }} />
                Lien du kit
                </a>
            </Tooltip>
            </div>

            {/* SUBJECT */}
            <div style={{ flex: 1, minWidth: 300, maxWidth: 500 }}>
            <Text ellipsis={{ tooltip: true }} strong style={{ fontSize: 12 }}>
                {decodeBase64(brand.subject)}
            </Text>
            </div>

            {/* 🔥 SEGMENTS + LISTES */}
            <div style={{ display: "flex", gap: 8 }}>
            {buildSegmentButton(
                brand.segment_id,
                segmentNames,
                brand,
                tokens
            )}

            {buildListButton(
                listNames[brand.name] || [],
                tokens
            )}
            </div>
        </div>
    ),

    children: (
      <div>
        <DimSection 
            dimensions={brand.dimensions}
            viewMode={viewMode}
            styles={styles}
        />
      </div>
    ),
  }));
};

export const DimensionsCollapse = ({ items }) => {
  return (
    <Collapse
      accordion
      items={items}
    />
  );
};