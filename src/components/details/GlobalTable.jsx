
import 
{   Card, 
    Select,
    Table, 
    Progress, 
    Popover, 
    Modal, 
    Typography, 
    Tooltip, 
    Tag, 
    Tabs, 
    Row, 
    Col,
    Divider,
    Space,
    Spin,
    Collapse,
    Button
 } from "antd";
import 
{
  LinkOutlined, 
  DatabaseOutlined, 
  EyeOutlined, 
  MailOutlined, 
  DollarOutlined, 
  StopOutlined, 
  FireOutlined, 
  DashboardOutlined, 
  PieChartOutlined,
  SearchOutlined
} from "@ant-design/icons";
import React, { useState, useMemo, useEffect } from "react";
import { AnalyseBadges } from "./common/AnalyseBadge";
import { getHealthColor,getHealthScore } from "../../utils/healthKitFunc";
import { HealthExplainer } from "../healthComponents/HealthKit";
import { pct, fmt, usd,formatDate } from "../../utils/Helpers";
import { tokens } from "../../utils/Tokens";
import { decodeBase64 } from "../../utils/utils";
import { RateBar } from "./common/RateBar";
import { FunnelViz } from "./common/FunnelViz";
import { DimSection } from "./common/DimSection";
import { get_segment_name } from "../../api/advertiser";
import { TabExtraContent } from "../bouton/SwitchBtnTableChart"; 
import { createBrandCols } from "./brands/CreateColumns";
import { mergeColumns, reorderColumns } from "./common/createMergedColumns";
import { getDimensionCollapseItems, DimensionsCollapse} from "./brands/DimensionsCollaps";
import { getKeyMapping } from "../../utils/getDataKeys";
const { Text } = Typography;



const CHART_PALETTE = [ 
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#84cc16",
  "#e11d48",
];



// ── BaseCard ─────────────────────────────────────────────────────────────────
/* 
 * Affiche le détail complet d'une base de données en carte collapsible.
 * Contient 3 onglets : Aperçu (KPIs + Funnel), Brands (tableau/chart), Dimensions (segments).
 * Affiche la classification (A/B/C/D), l'indicateur de santé, et les KPIs clés en header.
 */
const BaseCard = ({ base, viewMode, setViewMode, allbase, clsConfig, styles, segmentNames, listNames, agencyName, idKey, nameKey }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const cls = clsConfig[base.classification] || clsConfig.C;
  const health = getHealthScore(base);
  const dbMap = Object.fromEntries(allbase.map((db) => [db[idKey], db[nameKey]]));
  const brandCols = createBrandCols(segmentNames,listNames,agencyName,base.brands)
  // Etat pour filtrer dans dimensions brands 
  const [brandSort, setBrandSort] = useState("asc");
  // Etat pour gérer les segements appliquer à la base
  const [segments,setSegments] = useState(null)
  // console.log("Nom de segment reçu dans BaseCard : ", segmentNames)
  return (
    <Card
      style={{
        ...styles.card,
        marginBottom: 16,
        borderLeft: `4px solid ${cls.color}`,
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header avec sends, CTR, unsub rate */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          background: `linear-gradient(90deg, ${cls.bg}, transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `${cls.color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: cls.color,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <DatabaseOutlined />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {dbMap[base[idKey]]}
              </Text>
              <span
                style={{
                  ...styles.badge,
                  color: cls.color,
                  background: cls.bg,
                }}
              >
                {cls.icon} {cls.label}
              </span>
              {/* <Tag
                color="purple"
                style={{
                  borderRadius: 6,
                  fontSize: 10,
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                Router {base.id_routers}
              </Tag> */}
            </div>
            {/* {base.date_schedule && (
              <Text style={{ fontSize: 11, color: "#9ca3af" }}>
                Planifié: {base.date_schedule.join(", ")}
              </Text>
            )} */}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Mini health */}
          <Popover
            content={<HealthExplainer g={base} />}
            title={null}
            trigger="click"
            placement="bottomRight"
          >
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <Progress
                type="circle"
                percent={health}
                width={40}
                strokeWidth={8}
                strokeColor={getHealthColor(health)}
                trailColor="#f3f4f6"
                format={() => (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: getHealthColor(health),
                    }}
                  >
                    {health}
                  </span>
                )}
              />
            </div>
          </Popover>

          {/* KPIs inline dans le header */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              {
                l: "Sends",
                v: fmt(base.sends),
                c: tokens.primary,
                icon: <MailOutlined />,
              },
              {
                l: "Open%",
                v: pct(base.taux_openers),
                c: tokens.success,
                icon: <EyeOutlined />,
              },
              {
                l: "CTR%",
                v: pct(base.taux_clickers),
                c: tokens.warning,
                icon: <LinkOutlined />,
              },
              {
                l: "Unsub%",
                v: pct(base.taux_unsubs),
                c: tokens.danger,
                icon: <StopOutlined />,
              },
            ].map(({ l, v, c, icon }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: c, fontSize: 10 }}>{icon}</span>
                  {l}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 20px 16px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{ marginBottom: 0 }}

          tabBarExtraContent={
            <TabExtraContent
              mainTab={activeTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          }


          items={[
            {
              key: "overview",
              label: (
                <span>
                  <DashboardOutlined /> Vue globale
                </span>
              ),
              children: (
                <Row gutter={[16, 16]} style={{ paddingTop: 8 }}>
                  <Col xs={24} md={14}>
                    <Row gutter={[10, 10]}>
                      {[
                        {
                          l: "Sends",
                          v: fmt(base.sends),
                          c: tokens.primary,
                          i: <MailOutlined />,
                        },
                        {
                          l: "Openers",
                          v: fmt(base.openers),
                          c: tokens.success,
                          i: <EyeOutlined />,
                        },
                        {
                          l: "Clickers",
                          v: fmt(base.clickers),
                          c: tokens.warning,
                          i: <LinkOutlined />,
                        },
                        {
                          l: "Unsubs",
                          v: fmt(base.unsubs),
                          c: tokens.danger,
                          i: <StopOutlined />,
                        },
                        {
                          l: "eCPM",
                          v: usd(base.ecpm),
                          c: tokens.purple,
                          i: <DollarOutlined />,
                        },
                        {
                          l: "CA",
                          v: usd(base.ca),
                          c: tokens.cyan,
                          i: <DollarOutlined />,
                        },
                      ].map(({ l, v, c, i }) => (
                        <Col key={l} xs={8}>
                          <div
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid #f3f4f6",
                              background: "#fafafa",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span style={{ color: c }}>{i}</span>
                              {l}
                            </div>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#111827",
                              }}
                            >
                              {v}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    <div style={{ marginTop: 12 }}>
                      <RateBar
                        label="Open Rate"
                        value={base.taux_openers}
                        color={tokens.success}
                        max={50}
                      />
                      <RateBar
                        label="Click Rate"
                        value={base.taux_clickers}
                        color={tokens.warning}
                        max={10}
                      />
                      <RateBar
                        label="Unsub Rate"
                        value={base.taux_unsubs}
                        color={tokens.danger}
                        max={2}
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={10}>
                    <div style={{ marginBottom: 12 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        Funnel de conversion
                      </Text>
                    </div>
                    <FunnelViz g={base} />
                    <Divider style={{ margin: "12px 0" }} />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 6,
                        display: "block",
                      }}
                    >
                      Analyses
                    </Text>
                    <AnalyseBadges analyses={base.analyses} />
                  </Col>
                </Row>
              ),
            },
            {
              key: "dimensions",
              label: (
                <span>
                  <PieChartOutlined /> Dimensions Globale
                </span>
              ),
              children: (
                <div style={{ paddingTop: 8 }}>
                  <DimSection
                    dimensions={base.dimensions}
                    viewMode={viewMode}
                    hideFilters
                    styles={styles}
                  />
                </div>
              ),
            },
            {
              key: "brands",
              label: (
                <span>
                  <FireOutlined /> Brands ({base.brands?.length || 0})
                </span>
              ),
              children: (
                <div style={{ paddingTop: 8 }}>
                    <Table
                    dataSource={
                      base.brands?.map((b, i) => ({
                        key: i,
                        ...b,
                      })) || []
                    }
                      columns={brandCols}
                      size="small"
                      pagination={{
                        pageSize: 8,
                        size: "small",
                        showSizeChanger: false,
                      }}
                      scroll={{ x: 1400 }}
                      bordered={true}
                      // className="custom-table"
                    />
                </div>
              ),
            },
            {
              key: "Dimensions Brands",
              label:(<span><PieChartOutlined /> Dimensions Brands</span>),
              children:(
                <div style={{}}>
                  <div style={{display:"flex", paddingBottom:8 }}>
                    <Text style={{fontWeight:"bold", padding:4,}}>
                      trier par :
                    </Text>
                    <Button
                      style={{
                        padding:4,
                        fontSize:12
                      }}
                      type="primary"
                      onClick={() =>
                        setBrandSort((prev) => (prev === "asc" ? "desc" : "asc"))
                      }
                    >
                      Nom : {brandSort === "asc" ? "A" : "Z"}
                    </Button>
                  </div>
                  <DimensionsCollapse 
                    items={getDimensionCollapseItems(base,segmentNames,listNames,viewMode,styles,brandSort)}
                  />
                </div>
              )
            }
          ]}
        />
      </div>
    </Card>
  );
};

// ── GlobalTable ──────────────────────────────────────────────────────────────
/* 
 * Affiche la liste de toutes les bases en tableau avec filtres et tri.
 * Colonnes : Database, Classe, Health, Sends, Openers, Open %, Clickers, CTR %, Unsubs, CA, eCPM, Analyses.
 * Clic sur une ligne ouvre un modal avec le détail de la base (BaseCard).
 */
export const GlobalTable = ({ 
  database_id, 
  bases, 
  allbase, 
  tagName,
  agencyName, 
  clsConfig, 
  styles, 
  viewMode, 
  setViewMode, 
  dataLabel,
  onFilteredBasesChange,
  segmentNames,
  listNames
  
}) => {

  // État pour la recherche d'advertiser (optionnel, à ajouter au parent si besoin)
  const [searchCols, setSearchCols] = React.useState("");

  const [f, setF] = useState({ minSends: null, cls: null });
  // Valeurs actuellement sélectionnées dans le filtre de la colonne "Databases".
  // Vide => aucun filtre actif => on exporte tout (comportement inchangé).
  const [selectedDbFilter, setSelectedDbFilter] = useState([]);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState([]);

  const [selectedBase, setSelectedBase] = useState(null); // ← ajout
  const { idKey, nameKey, singularKey, pluralKey } = getKeyMapping(allbase);
  // console.log("Contenu de AgencyName reçu dans GlobalTable: ",agencyName)
  const dataIndex = dataLabel === 'database' ? 'advertiser' : 'database'

  // Variable pour stocké le tableau de DB/ADV 
  const [filteredData, setFilteredData] = useState([])
 

 const rows = useMemo(() => {
  let d = bases.flatMap((b) => {
    if (!b.brands || b.brands.length === 0) {
      return [{ ...b, key: `${b[`${dataIndex}_id`]}` }];
    }
    return b.brands.map((brand, i) => ({
      ...b,        // données advertiser (sends global, classification, ca, brands[], etc.)
      ...brand,    // données brand (écrasent celles de l'advertiser si même clé)
      key: `${b[`${dataIndex}_id`]}_${i}`,
    }));
  });
  if (f.minSends) d = d.filter((r) => r.sends >= f.minSends);
  if (f.cls) d = d.filter((r) => r.classification === f.cls);
  return d;
}, [bases, f]);

  // ── Données filtrées pour l'export ───────────────────────────────────────
 const filteredBases = useMemo(() => {
  const hasDbFilter = selectedDbFilter && selectedDbFilter.length > 0;
  const hasBrandFilter = selectedBrandFilter && selectedBrandFilter.length > 0;

  // Si aucun filtre n'est activé, on retourne tout
  if (!hasDbFilter && !hasBrandFilter) return bases;

  const dbSet = new Set(selectedDbFilter.map(String));
  const brandSet = new Set(selectedBrandFilter.map(String));

  return bases
    // 1. On applique le premier filtre global sur la base de données / l'annonceur
    .filter((b) => {
      if (!hasDbFilter) return true;
      return dbSet.has(String(b[idKey]));
    })
    // 2. On reconstruit l'objet en filtrant les brands à l'intérieur
    .map((b) => {
      // Si aucun filtre de marque n'est coché, on garde toutes ses marques intactes
      if (!hasBrandFilter) return b;

      // Sinon, on ne garde que les marques cochées dans le filtre
      const marquesFiltrees = (b.brands || []).filter((brand) => 
        // /!\ Ajustez brand.name ou brand.brand_id selon ce que renvoie votre filtre AntD
        brandSet.has(String(brand.name)) || brandSet.has(String(brand.brand_id))
      );

      // On retourne une copie de la base avec uniquement ses marques sélectionnées
      return {
        ...b,
        brands: marquesFiltrees,
      };
    })
    // 3. Sécurité : Si un annonceur n'a plus aucune marque valide après le filtre, on l'exclut de l'export
    .filter((b) => b.brands && b.brands.length > 0);

}, [bases, selectedDbFilter, selectedBrandFilter, idKey]);



  // On informe le parent (qui détient le bouton "Export") du sous-ensemble
  // actuellement filtré, pour qu'il l'utilise à la place de `bases` complet.
  useEffect(() => {
    if (typeof onFilteredBasesChange === "function") {
      onFilteredBasesChange(filteredBases);
    }
  }, [filteredBases]);

  const dbMap = Object.fromEntries(allbase.map((db) => [db[`${idKey}`], db[`${nameKey}`]]));
  const tagMap = tagName
  const agenceMap = Object.fromEntries(
    agencyName.map((ag) => [ag.agence_id, ag.agence_name])
  );  
  const titre =  pluralKey.charAt(0).toUpperCase() + pluralKey.slice(1);
  const brandCols = createBrandCols(segmentNames,listNames,agenceMap,rows)
  const baseCols  = [
    {
      title: `${titre}`,
      dataIndex: `${idKey}`,
      fixed: "left",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        // 1. On transforme notre dbMap en une liste d'options triées pour le Select
        const selectOptions = Object.entries(dbMap).map(([id, label]) => ({
          value: id,     // La clé brute (ID)
          label: label,  // Le texte affiché
        }));

        return (
          <div style={{ padding: 8, minWidth: 200 }}>
            <Select
              mode="multiple" // FORCE LA MULTI-SÉLECTION
              allowClear
              style={{ width: '100%', marginBottom: 8 }}
              placeholder="Sélectionner des advertisers"
              // selectedKeys est un tableau contenant les valeurs sélectionnées
              value={selectedKeys}
              // On passe directement le tableau de valeurs sélectionnées
              onChange={(values) => {
                setSelectedKeys(values ? values : []);
              }}
              options={selectOptions}
              // Permet de chercher textuellement DANS la liste déroulante
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <a onClick={() => confirm()} style={{ color: "#1677ff", fontWeight: 'bold' }}>
                Filtrer
              </a>
              <a
                onClick={() => {
                  clearFilters();
                  confirm({ closeDropdown: true });
                }}
              >
                Reset
              </a>
            </div>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),

      // 2. CORRECTION CRITIQUE DU ONFILTER POUR LE TABLEAU DE VALEURS
      onFilter: (value, record) => {
        // Dans le cas d'une multi-sélection locale, Ant Design exécute 'onFilter' 
        // pour CHAQUE valeur sélectionnée dans le tableau.
        // 'value' correspond ici à UNE SEULE des clés sélectionnées (ex: "1" ou "2").
        
        const recordId = String(record[idKey]);
        return recordId === String(value);
      },

      render: (v) => (
        <Text strong style={{ fontSize: 12 }}>
          {dbMap[v] || `DB #${v}`}
        </Text>
      ),
    },

    ...dataLabel === "database" ?[
      {
        title: "Tags",
        dataIndex:"tags",
        fixed:"left",
        render: (_, record) => {
          const tagId = record.tag_id;
          return (
            <Tag color="blue">
              {tagMap[tagId] || `Tag #${tagId}`}
            </Tag>
          );
        },
      },
    ]:[],

    {
      title: "Classe",
      dataIndex: "classification",
      fixed:"left",
      render: (v) => {
        const c = clsConfig[v] || clsConfig.C;
        return (
          <span style={{ ...styles.badge, color: c.color, background: c.bg }}>
            {c.icon} {c.label}
          </span>
        );
      },
    },
    {
      title: "Health",
      dataIndex:"healthGauge",
      fixed:"left",
      render: (_, r) => {
        const s = getHealthScore(r);
        return (
          <Progress
            type="circle"
            percent={s}
            width={30}
            strokeWidth={10}
            strokeColor={getHealthColor(s)}
            format={() => (
              <span style={{ fontSize: 9, fontWeight: 700 }}>{s}</span>
            )}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "Sends",
      dataIndex: "sends",
      sorter: (a, b) => a.sends - b.sends,
      render: fmt,
      align: "center",
    },
    {
      title: "Openers ",
      dataIndex: "openers", // Gardé pour le tri principal
      sorter: (a, b) => a.openers - b.openers,
      align: "center",
      render: (_, record) => (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          gap: "2px",
          width: "100%"
        }}>
          {/* Affichage du nombre brut (Openers) */}
          <span>{fmt(record.openers)}</span>
          
          {/* Affichage du pourcentage (Open %) */}
          <Text style={{ color: tokens.success, fontWeight: 600, fontSize: 10 }}>
            ({pct(record.taux_openers)})
          </Text>
        </div>
      ),
    },
    {
      title: "Clickers",
      dataIndex: "clickers",
      sorter: (a, b) => a.clickers - b.clickers,
      align: "center",
      render: (_, record) => (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          gap: "2px",
          width: "100%"
        }}>
          {/* Affichage du nombre brut (Openers) */}
          <span>{fmt(record.clickers)}</span>
          
          {/* Affichage du pourcentage (Open %) */}
          <Text style={{ color: tokens.warning, fontWeight: 600, fontSize: 10 }}>
            ({pct(record.taux_clickers)})
          </Text>
        </div>
      ),
    },
    {
      title: "Unsubs",
      dataIndex: "unsubs",
      sorter: (a, b) => a.unsubs - b.unsubs,
      align: "center",
      render: (_, record) => (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          gap: "2px",
          width: "100%"
        }}>
          {/* Affichage du nombre brut (Openers) */}
          <span>{fmt(record.unsubs)}</span>
          
          {/* Affichage du pourcentage (Open %) */}
          <Text style={{ color: tokens.danger, fontWeight: 600, fontSize: 10 }}>
            ({pct(record.taux_unsubs)})
          </Text>
        </div>
      ),
    },
    {
      title: "CA",
      dataIndex: "ca",
      sorter: (a, b) => (a.ca || 0) - (b.ca || 0),
      render: usd,
      align: "right",
    },
    {
      title: "eCPM",
      dataIndex: "ecpm",
      sorter: (a, b) => (a.ecpm || 0) - (b.ecpm || 0),
      render: usd,
      align: "right",
    },
    // {
    //   title: "Analyses",
    //   dataIndex: "analyses",
    //   width: 260,
    //   render: (a) => <AnalyseBadges analyses={a} compact />,
    // },
  ];

  // Colonne encore désorganisé
  const Precols = mergeColumns(baseCols, brandCols);

  const orderCols = [`${idKey}`,"tags","classification","healthGauge","name","models","subject","date_schedule","segment_id","agence_id"]
  // Colonne final à utilisé 

  const cols = reorderColumns(Precols,orderCols)
  return (
    <>
    <Card size="large" style={styles.card}>
        <Table
          dataSource={rows}
          columns={cols}
          size="small"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 12,
            size: "small",
            showSizeChanger: true,
            showTotal: (t) => (
              <Text style={{ fontSize: 11, color: "#9ca3af" }}>{t} bases</Text>
            ),
          }}
          onChange={(pagination, filters) => {
            // 'filters' contient les valeurs sélectionnées par colonne filtrable,
            // ex: { [idKey]: ["123"] } ou { [idKey]: null } si reset/aucun filtre.
            setSelectedDbFilter(filters[idKey] || []);
            // Filtre Brand (Ajustez "name" par la clé exacte configurée dans 'dataIndex' de votre colonne Brand)
            setSelectedBrandFilter(filters["name"] || []);
          }}
          onRow={(record) => ({
          onClick: () => {
            setSelectedBase(record);
          },
            style: { cursor: "pointer" },
          })}
        />
    </Card>
    <Modal
      open={!!selectedBase}
      onCancel={() => setSelectedBase(null)}
      footer={null}
      width="100%"
      style={{ top: 40 }}
      styles={{
        content: {
          paddingRight: 50, // ← Espace INTERNE pour éviter le X
        }
      }}
      destroyOnClose
    >
      {selectedBase && (
        <BaseCard
          base={selectedBase}
          viewMode={viewMode} 
          setViewMode={setViewMode}
          allbase={allbase} 
          clsConfig={clsConfig} 
          styles={styles} 
          segmentNames={segmentNames}
          listNames={listNames}
          agencyName={agenceMap}
          idKey={idKey}
          nameKey={nameKey}
        />
      )}
    </Modal>
    </>
  );
};