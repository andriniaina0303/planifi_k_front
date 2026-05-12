/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADVERTISERSTABLE.JSX - Tableau détaillé des annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Affiche un tableau complet de tous les annonceurs avec :
 * - Recherche en temps réel
 * - Filtrage par tags
 * - Navigation vers les détails (click sur une ligne)
 * - Analyse du statut avec badges colorés
 * 
 * Liste complète des 97 tags du système
 */

import React, { useMemo, useState } from "react";
import { Table, Tag, Tooltip, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LISTE COMPLÈTE DES TAGS
 * ═══════════════════════════════════════════════════════════════════════════
 * Tous les tags disponibles pour le filtrage des annonceurs
 */
export const listetags = [
  { id: 92, tag: "API", dwtag: "api" },
  { id: 53, tag: "Alarms", dwtag: "alarms" },
  { id: 42, tag: "Alcohol", dwtag: "alcohol_and_wine" },
  { id: 43, tag: "Beauty", dwtag: "beauty" },
  { id: 54, tag: "Books", dwtag: "books" },
  { id: 1, tag: "Bricolage - DIY", dwtag: "bricolage_diy" },
  { id: 97, tag: "Career", dwtag: "career" },
  { id: 2, tag: "Cars", dwtag: "cars" },
  { id: 70, tag: "Cleaning", dwtag: "cleaning" },
  { id: 46, tag: "Coffee", dwtag: "coffee" },
  { id: 55, tag: "Cooking", dwtag: "cooking" },
  { id: 3, tag: "Cosmetics", dwtag: "cosmetics" },
  { id: 56, tag: "Coupon - Discount", dwtag: "coupon_discount" },
  { id: 65, tag: "Credit Redemption - RAC", dwtag: "credit_redemption_rac" },
  { id: 4, tag: "Dating", dwtag: "dating" },
  {
    id: 5,
    tag: "Decoration - Furniture & Design",
    dwtag: "decoration_furniture_and_design",
  },
  { id: 49, tag: "Dentist", dwtag: "dentist" },
  { id: 7, tag: "Diet", dwtag: "diet" },
  { id: 6, tag: "Défisc - Tax", dwtag: "defisc_tax" },
  { id: 8, tag: "Ecommerce", dwtag: "ecommerce" },
  { id: 71, tag: "Electronics", dwtag: "electronics" },
  { id: 9, tag: "Energy", dwtag: "energy" },
  { id: 69, tag: "Epargne", dwtag: "epargne" },
  { id: 73, tag: "Fashion", dwtag: "fashion" },
  { id: 10, tag: "Finance", dwtag: "finance" },
  { id: 11, tag: "Food", dwtag: "food" },
  { id: 45, tag: "Forex", dwtag: "forex" },
  { id: 57, tag: "Gambling", dwtag: "gambling" },
  { id: 12, tag: "Gaming", dwtag: "gaming" },
  { id: 13, tag: "Garden", dwtag: "garden" },
  { id: 14, tag: "Health", dwtag: "health" },
  { id: 93, tag: "Health - Hearing", dwtag: "health_hearing" },
  { id: 15, tag: "High tech", dwtag: "high_tech" },
  { id: 17, tag: "Home assistance", dwtag: "home_assistance" },
  { id: 18, tag: "Ink", dwtag: "ink" },
  { id: 72, tag: "Insurance - Cars", dwtag: "cars" },
  { id: 19, tag: "Insurance - Funeral", dwtag: "insurance_funeral" },
  { id: 20, tag: "Insurance - Health", dwtag: "insurance_health" },
  { id: 21, tag: "Insurance - Home", dwtag: "insurance_home" },
  { id: 96, tag: "Insurance - Life", dwtag: "insurance_life" },
  { id: 58, tag: "Jewellery", dwtag: "jewellery" },
  { id: 22, tag: "Job", dwtag: "job" },
  { id: 23, tag: "Kids", dwtag: "kids" },
  { id: 61, tag: "Leisure", dwtag: "leisure" },
  { id: 24, tag: "Lingerie", dwtag: "lingerie" },
  { id: 25, tag: "Loan", dwtag: "loan" },
  { id: 26, tag: "Mode", dwtag: "mode" },
  { id: 77, tag: "Moto", dwtag: "Moto" },
  { id: 94, tag: "Newsletter", dwtag: "newsletter" },
  { id: 27, tag: "Obsèques - funeral", dwtag: "obseques_funeral" },
  { id: 52, tag: "Ong", dwtag: "ong_and_charity" },
  { id: 28, tag: "Optic", dwtag: "optic" },
  { id: 29, tag: "Pets", dwtag: "pets" },
  { id: 75, tag: "Politics", dwtag: "politics" },
  { id: 30, tag: "Real estate - immo", dwtag: "real_estate_immo" },
  { id: 50, tag: "Renovation", dwtag: "renovation" },
  {
    id: 78,
    tag: "Renovation - Air conditionning",
    dwtag: "renovation_air_conditionning",
  },
  { id: 84, tag: "Renovation - Heat pump", dwtag: "renovation_heat_pump" },
  { id: 79, tag: "Renovation - Heating", dwtag: "renovation_heating" },
  { id: 82, tag: "Renovation - Insulation", dwtag: "renovation_insulation" },
  {
    id: 80,
    tag: "Renovation - Secure shower",
    dwtag: "renovation_secure_shower",
  },
  {
    id: 85,
    tag: "Renovation - Solar panels",
    dwtag: "renovation_solar_panels",
  },
  {
    id: 83,
    tag: "Renovation - Stair climber",
    dwtag: "renovation_stair_climber",
  },
  { id: 81, tag: "Renovation - Windows", dwtag: "renovation_windows" },
  { id: 31, tag: "Sex Shop", dwtag: "sex_shop" },
  { id: 32, tag: "Sport", dwtag: "sport" },
  { id: 51, tag: "Studies", dwtag: "studies" },
  { id: 63, tag: "Supermarket", dwtag: "supermarket" },
  { id: 60, tag: "Survey", dwtag: "survey" },
  { id: 33, tag: "Sweepstakes", dwtag: "sweeptakes" },
  { id: 34, tag: "Swimming Pool", dwtag: "swimming_pool" },
  { id: 35, tag: "Telecom", dwtag: "telecom" },
  { id: 39, tag: "Trading", dwtag: "trading" },
  { id: 36, tag: "Training", dwtag: "training" },
  { id: 38, tag: "Travel", dwtag: "travel" },
  { id: 87, tag: "Travel - Bus", dwtag: "travel_bus" },
  { id: 89, tag: "Travel - Camping", dwtag: "travel_camping" },
  { id: 91, tag: "Travel - Cruise", dwtag: "travel_cruise" },
  { id: 86, tag: "Travel - Flight", dwtag: "travel_flight" },
  { id: 88, tag: "Travel - Hôtel", dwtag: "travel_hotel" },
  { id: 90, tag: "Travel - Train", dwtag: "travel_train" },
  { id: 40, tag: "Voyance - Clairvoyance", dwtag: "voyance_clairvoyance" },
  { id: 47, tag: "Water", dwtag: "water" },
  { id: 76, tag: "baby", dwtag: "baby" },
  { id: 64, tag: "credit", dwtag: "credit" },
  { id: 74, tag: "fonctionnaires", dwtag: "fonctionnaires" },
];



// Créer un map pour accès rapide aux tags
const tagMap = Object.fromEntries(listetags.map((t) => [t.id, t]));

// Fonction pour déterminer la couleur du tag dans le tooltip
const getTagColor = (txt) => {
  if (!txt) return "default";
  if (txt.includes("🟢")) return "green";
  if (txt.includes("🟡")) return "gold";
  if (txt.includes("🔴")) return "red";
  return "default";
};

// Composant du tooltip avec l'analyse
const AnalyseTooltip = ({ analyse }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minWidth: 200,
     }}
  >
    {Object.entries(analyse).map(([key, value]) => (
      <div
        key={key}
        style={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{ color: "#ccc", fontSize: 12, textTransform: "capitalize"}}
        >
          {key.replace(/_/g, " ")}
        </span>
        <Tag color={getTagColor(value)} style={{ margin: 0 , whiteSpace: "normal", wordBreak: "break-word", flex: 1}}>
          {value}
        </Tag>
      </div>
    ))}
  </div>
);

const AdvertisersTable = ({ data, tagMapping = [] }) => {
  const navigate = useNavigate();

  // État pour la recherche d'advertiser (optionnel, à ajouter au parent si besoin)
  const [searchAdvertiser, setSearchAdvertiser] = React.useState("");


    // Créer le map à partir du array
  const tagMapFromAPI = Object.fromEntries(
    tagMapping.map(t => [t.tag_id, t.tag_name])
  );
  // Définition des colonnes
  const columns = useMemo(
    () => [
      {
        title: "Advertiser",
        dataIndex: "advertiser_name",
        sorter: (a, b) => a.advertiser_name.localeCompare(b.advertiser_name),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search advertiser"
              value={selectedKeys[0]}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedKeys(value ? [value] : []);
                setSearchAdvertiser(value);
              }}
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <a onClick={() => confirm()} style={{ color: "#1677ff" }}>
                Search
              </a>
              <a
                onClick={() => {
                  clearFilters();
                  setSearchAdvertiser("");
                }}
              >
                Reset
              </a>
            </div>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) =>
          record.advertiser_name?.toLowerCase().includes(value.toLowerCase()),
        render: (text) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 500 }}>{text}</span>
          </div>
        ),
      },
      {
        title: "Tag",
        dataIndex: "tag_id",
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search tag"
              value={selectedKeys[0]}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedKeys(value ? [value] : []);
              }}
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <a onClick={() => confirm()} style={{ color: "#1677ff" }}>
                Search
              </a>
              <a onClick={() => clearFilters()}>Reset</a>
            </div>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) => {
          const tagName = tagMapFromAPI[record.tag_id] || "";
          return tagName.toLowerCase().includes(value.toLowerCase());
        },
        render: (tag_id) => {
          const tagName = tagMapFromAPI[tag_id];
          return (
            <Tag
              color="cyan"
              style={{
                whiteSpace: "normal",
                display: "block",
                wordBreak: "break-word",
              }}
            >
              {tagName || `ID: ${tag_id}`}
            </Tag>
          );
        },
      },
      {
        title: "Sends",
        render: (_, r) => <b>{r.globales.sends}</b>,
        sorter: (a, b) => a.globales.sends - b.globales.sends,
      },
      {
        title: "Openers(%)",
        render: (_, r) => `${r.globales.taux_openers || 0}%`,
        sorter: (a, b) =>
          (a.globales.taux_openers || 0) - (b.globales.taux_openers || 0),
      },
      {
        title: "Clickers(%)",
        render: (_, r) => (
          <span style={{ color: "#40a9ff" }}>
            {r.globales.taux_clickers || 0}%
          </span>
        ),
        sorter: (a, b) =>
          (a.globales.taux_clickers || 0) - (b.globales.taux_clickers || 0),
      },
      {
        title: "Unsubs(%)",
        render: (_, r) => (
          <span style={{ color: "#ff4d4f" }}>
            {r.globales.taux_unsubs || 0}%
          </span>
        ),
        sorter: (a, b) =>
          (a.globales.taux_unsubs || 0) - (b.globales.taux_unsubs || 0),
      },
      {
        title: "CA(€)",
        render: (_, r) => `${r.globales.ca}`,
        sorter: (a, b) => a.globales.ca - b.globales.ca,
      },
      {
        title: "eCPM",
        render: (_, r) => `${r.globales.ecpm}`,
        sorter: (a, b) => a.globales.ecpm - b.globales.ecpm,
      },
    ],
    [tagMapping]
  );

  if (!data || data.length === 0) {
    return <div style={{ padding: 20, textAlign: "center" }}>Aucune donnée</div>;
  }

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="advrtiser_id"
      onRow={(record) => ({
        onClick: () =>
          navigate(`${record.advertiser_id}`, {
            state: { advertiser: record },
          }),
        style: { cursor: "pointer" },
      })}
      tableLayout="auto"
      bordered
      // ── Tooltip sur chaque ligne ──
      components={{
        body: {
          row: ({ children, ...props }) => {
            const record = data.find(
              (r) => r.advrtiser_id === props["data-row-key"]
            );
            return (
              <Tooltip
                title={
                  record ? (
                    <AnalyseTooltip analyse={record.globales.analyse} />
                  ) : null
                }
                placement="top"
                align={{ offset: [0, ] }} // 👈 ici
                color="#1e1e2f"
                mouseEnterDelay={0.15}
                getPopupContainer={(trigger) => trigger.parentNode}//Corrige le problème de z-index de la page 
                // overlayInnerStyle={{ width: 280}} // 👈 ici
              >
                <tr {...props} style={{ cursor: "pointer", width: "100%" }}>
                  {children}
                </tr>
              </Tooltip>
            );
          },
        },
      }}
      pagination={{
        pageSize: 10,
        position: ["bottomCenter"],
        style: { marginTop: 12 },
        itemRender: (page, type, originalElement) => {
          if (type === "page") {
            return (
              <div
                style={{
                  borderRadius: "50%",
                  minWidth: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #d9d9d9",
                }}
              >
                {page}
              </div>
            );
          }
          return originalElement;
        },
      }}
    />
  );
};

export default AdvertisersTable;

