import { Grid, Card, Table, Tag, Row, Col, Typography, Tooltip, Carousel,Space} from "antd";
import {
  FireOutlined,
  TrophyOutlined,
  AimOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { tokens } from "../../../utils/Tokens"; 
import { pct, fmt } from "../../../utils/Helpers";
import { useMemo, useRef } from "react";
import { decodeBase64 } from "../../../utils/utils";
import { buildSegmentButton, buildListButton } from "../brands/CreateColumns";

const { useBreakpoint } = Grid;
const { Text } = Typography;
/* 
 * Composant TopBrandsSlider
 * Affiche un carousel avec 3 tableaux :
 * 1. Top 10 marques par CTR
 * 2. Top 10 objets par CTR
 * 3. Top 10 objets par Open Rate
 * Les titres et sous-titres sont dynamiques selon l'onglet.
 */
export const TopBrandsSlider = ({segmentNames, data, styles, key_value, label_value }) => {
  const carouselRef = useRef();
  const screens = useBreakpoint();

  // Configuration des 3 vues
  const viewConfigs = [
    {
      id: "subject-ctr",
      modeFilter: "taux_clickers",
      getInfo: "subject",
      icon: <AimOutlined />,
      title: "Top 10 Objets",
      subtitle: "Les 10 meilleurs sujets d'email triés par taux de clics (CTR).",
      tagLabel: "Par CTR",
    },
    ...(`${label_value}_name` === "advertiser_name" ? [
    {
      id: "brands-ctr",
      modeFilter: "taux_clickers",
      getInfo: "name",
      icon: <FireOutlined />,
      title: "Top 10 Marques",
      subtitle: "Les 10 meilleures marques triées par taux de clics (CTR).",
      tagLabel: "Par CTR",
    },]: [])
  ];

  // Extraire et trier les top 10 par configuration
  const topBrandsData = useMemo(() => {
    return viewConfigs.map((config) => {
      const allBrands = [];

      if (data[key_value] && Array.isArray(data[key_value])) {
        data[key_value].forEach((kv) => {
          if (kv.brands && Array.isArray(kv.brands)) {
            kv.brands.forEach((brand) => {
              allBrands.push({
                ...brand,
                [`${label_value}_name`]: kv[`${label_value}_name`],
                [`${label_value}_id`]: kv[`${label_value}_id`],
                advertiser_name: kv.advertiser_name,
                advertiser_id: kv.advertiser_id,
              });
            });
          }
        });
      }

      return {
        ...config,
        brands: allBrands
          .sort((a, b) => (b[config.modeFilter] || 0) - (a[config.modeFilter] || 0))
          .slice(0, 10),
      };
    });
  }, [data]);
// console.log("Contenu de topBrandsData à afficher: ", topBrandsData)
  // Décoder le nom depuis base64
  const decodeBrandName = (encodedName) => {
    try {
      return decodeBase64(encodedName);
    } catch (e) {
      return encodedName;
    }
  };

  // Couleur de rang
  const getRankColor = (index) => {
    if (index === 0) return tokens.warning; // Or
    if (index === 1) return "#c0c0c0"; // Argent
    if (index === 2) return "#cd7f32"; // Bronze
    return tokens.primary;
  };

  // Générer les colonnes pour chaque vue
  const generateColumns = (config) => [
    {
      title: "Rang",
      dataIndex: "rank",
      key: "rank",
      width: 50,
      align: "center",
      render: (_, __, index) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {index < 3 && (
            <TrophyOutlined style={{ color: getRankColor(index), fontSize: 14 }} />
          )}
          <Text strong style={{ fontSize: 12, color: getRankColor(index) }}>
            #{index + 1}
          </Text>
        </div>
      ),
    },
{
  title: config.getInfo === "subject" ? "Subjects" : "Brands",
  dataIndex: config.getInfo,
  key: config.getInfo,
  width: config.getInfo === "subject" ? 400 : "auto",

  render: (text) => {
    const isSmallScreen = screens.xs || screens.sm || screens.md;

    return (
      <Tooltip title={decodeBrandName(text)}>
        <Text
          ellipsis={isSmallScreen}
          style={{
            fontSize: 12,
            whiteSpace: "nowrap",
            display: "block",
            maxWidth: isSmallScreen ? 400 : "100%",
          }}
        >
          {decodeBrandName(text)}
        </Text>
      </Tooltip>
    );
  },
},

  ...(label_value === "database" ?[
      {
        title: "Advertisers",
        dataIndex: "advertiser_name",
        key: "advertiser_name",
        width: 100,
        align: "left",
        // sorter: (a, b) => a.sends - b.sends,
        render: (value) => (
          <Text style={{ fontSize: 12, color: "#6b7280", fontWeight:"bolder" }}>
            {value}          
          </Text>
        ),
      },
      {
        title: "Brands",
        dataIndex: "name",
        key:"brand_name",
        // fixed: "left",
        width: 110,
        render: (_, v) => (
          <div style={{display: "flex",flexDirection: "column",gap: 2}}>
            <Text ellipsis = {{tooltip:true}} strong style={{ fontSize: 12 }}>
              {decodeBase64(v.name)}
            </Text>
            <Tooltip title={v.creativities}>    
              <a   
                href={v.creativities}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 11,
                  color: tokens.primary,
                  maxWidth: 170,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >
                <LinkOutlined style={{ marginRight: 4 }} />
                Lien du kit
              </a>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "Segment",
        dataIndex: "segment_id",
        width:190,
        fixed: "left",
        render: (segmentIds, record) => {
          // console.log("Contenu de record: ", record)
          const listNamesForBrand = record.ListName || [];
          console.log("ListeName: ",listNamesForBrand)
          const segmentBtn =
            segmentIds?.length > 0
              ? buildSegmentButton(segmentIds, segmentNames, tokens)
              : null;

          const listBtn =
            listNamesForBrand?.length > 0
              ? buildListButton(listNamesForBrand, tokens)
              : null;

          return (
            <Space>
              {segmentBtn}
              {listBtn}
              {!segmentBtn && !listBtn && (
                <span style={{ fontSize: 12, color: "#999" }}>
                  Aucun segment/liste
                </span>
              )}
            </Space>
          );
        },
      },
    ]:[]),
    {
      title: config.modeFilter === "taux_clickers" ? "CTR" : "Open Rate",
      dataIndex: config.modeFilter,
      key: config.modeFilter,
      width: 70,
      align: "right",
      sorter: (a, b) => (a[config.modeFilter] || 0) - (b[config.modeFilter] || 0),
      render: (value) => (
        <Text
          strong
          style={{
            fontSize: 12,
            color: config.modeFilter === "taux_clickers" ? tokens.success : tokens.warning,
          }}
        >
          {pct(value)}
        </Text>
      ),
    },
    {
      title: config.modeFilter === "taux_clickers" ? "Open Rate" : "CTR",
      dataIndex: config.modeFilter === "taux_clickers" ? "taux_openers" : "taux_clickers",
      key: config.modeFilter === "taux_clickers" ? "taux_openers" : "taux_clickers",
      width: 80,
      align: "right",
      sorter: (a, b) => (a[config.modeFilter === "taux_clickers" ? "taux_openers" : "taux_clickers"] || 0) - (b[config.modeFilter === "taux_clickers" ? "taux_openers" : "taux_clickers"] || 0),
      render: (value) => (
        <Text style={{ fontSize: 11, color : config.modeFilter === "taux_clickers" ? tokens.warning : tokens.success}}>
          {pct(value)}
        </Text>
      ),
    },
    {
      title: "Sends",
      dataIndex: "sends",
      key: "sends",
      width: 80,
      align: "right",
      sorter: (a, b) => a.sends - b.sends,
      render: (value) => (
        <Text style={{ fontSize: 11, color: "#6b7280" }}>
          {fmt(value)}
        </Text>
      ),
    },
    {
      title: "Clickers",
      dataIndex: "clicks",
      key: "clicks",
      width: 70,
      align: "right",
      sorter: (a, b) => a.clicks - b.clicks,
      render: (value) => (
        <Text strong style={{ fontSize: 11, color: "#6b7280" }}>
          {fmt(value)}
        </Text>
      ),
    },
    {
      title: "CTO",
      dataIndex: "taux_cto",
      key: "taux_cto",
      width: 60,
      align: "right",
      sorter: (a, b) => (a.taux_cto || 0) - (b.taux_cto || 0),
      render: (value) => (
        <Text style={{ fontSize: 11, color: "#6b7280" }}>
          {pct(value)}
        </Text>
      ),
    },
    {
      title: "Unsubs.",
      dataIndex: "unsubs",
      key: "unsubs",
      width: 60,
      align: "right",
      sorter: (a, b) => a.unsubs - b.unsubs,
      render: (value, record) => (
        <Text
          style={{
            fontSize: 11,
            color:tokens.danger,
          }}
        >
          {fmt(value)} ({pct(record.taux_unsubs)})
        </Text>
      ),
    },
  ];

  // Préparer les données de la table
const getTableData = (brands) =>
  brands.map((brand, index) => ({
    ...brand,
    key: `${label_value}_${index}`,  // ← Suffisant et stable
    rank: index + 1,
  }));

  return (
    <Card
      size="small"
      title={
        label_value === "advertiser" ? (
          <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div
                onClick={() => carouselRef.current?.prev()}
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: `1px solid ${tokens.primary}33`,
                    transition: "all 0.2s",
                }}
              >
                <LeftOutlined />
              </div>

              <div
                onClick={() => carouselRef.current?.next()}
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: `1px solid ${tokens.primary}33`,
                    transition: "all 0.2s",
                }}
              >
                <RightOutlined />
              </div>
            </div>
          </div>
        ) : null
      }
    >
      <Carousel ref={carouselRef} autoplay={true} dots>
        {topBrandsData.map((viewData, idx) =>
          (
          <div key={viewData.id}>
            {/* ── TITRE DYNAMIQUE ── */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ ...styles.sectionTitle }}>
                {viewData.icon}
                {viewData.title}
                <Tag
                  color={tokens.success}
                  style={{ borderRadius: 10, fontSize: 10, marginLeft: 8 }}
                >
                  {viewData.tagLabel}
                </Tag>
              </span>

              <Typography.Paragraph
                style={{ fontSize: 12, color: "#6b7280", marginTop: 6, marginBottom: 0 }}
              >
                {viewData.subtitle}
              </Typography.Paragraph>
            </div>

            {/* ── TABLE ── */}
            {viewData.brands.length > 0 ? (
              <Table
                columns={generateColumns(viewData)}
                dataSource={getTableData(viewData.brands)}
                pagination={false}
                size="small"
                bordered={false}
                style={{ fontSize: 12, marginBottom:24}}
                rowClassName={(record, index) => {
                  if (index < 3) {
                    return `top-brand-row-${index}`;
                  }
                  return "";
                }}
                scroll={{ x: 700 }}
              />
            ) : (
              <Text type="secondary">Aucune donnée disponible</Text>
            )}
          </div>
        ))}
      </Carousel>

      {/* ── CSS CUSTOM POUR HIGHLIGHTS ── */}
      <style>{`
        .top-brand-row-0 {
          background-color: ${tokens.warning}08 !important;
        }
        .top-brand-row-1 {
          background-color: #c0c0c008 !important;
        }
        .top-brand-row-2 {
          background-color: #cd7f3208 !important;
        }
        .ant-carousel .slick-dots li button {
          background-color: ${tokens.primary} !important;
          height: 40px !important;
          width: 40px !important;
          opacity: 0.4;
      }
        .ant-carousel .slick-dots {
          bottom: -4px;
        }

        .ant-carousel .slick-dots li.slick-active button {
        opacity: 1;
        width: 24px !important;
        border-radius: 10px !important;
        }
      `}</style>
    </Card>
  );
};