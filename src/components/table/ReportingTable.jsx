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
import { Table, Tag, Tooltip, Input, Dropdown } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/Helpers";


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

const ReportingTable = ({ data, tagMapping = [], dataKey, date_start, date_end }) => {
  const navigate = useNavigate();
  const fmt_date_st = formatDate(date_start)
  const fmt_date_end = formatDate(date_end)

  // État pour la recherche d'advertiser (optionnel, à ajouter au parent si besoin)
  const [searchAdvertiser, setSearchAdvertiser] = React.useState("");


    // Créer le map à partir du array
  const tagMapFromAPI= tagMapping


  // Définition des colonnes
  const columns = useMemo(
    () => [
      {
        title: `${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}`,
        dataIndex: `${dataKey}_name`,
        sorter: (a, b) => a[dataKey + "_name"].localeCompare(b[dataKey + "_name"]),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${dataKey}`}
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
                  clearFilters() ; 
                  confirm ({closeDropdown : true});
                  setSearchAdvertiser("");
                  confirm({closeDropdown:true})
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
          record[dataKey + "_name"]?.toLowerCase().includes(value.toLowerCase()),
        render: (text) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 500 }}>{text}</span>
          </div>
        ),
      },
      ...(Object.keys(tagMapping).length > 0 ? 
      [
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
                <a onClick={() =>
                  {
                    clearFilters();
                    confirm({closeDropdown : true})
                  } }>Reset</a>
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
      ]
      : []),
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
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={(record, index) => `${record[dataKey + "_id"]}_${index}`}  // ← Combinaison unique
      onRow={(record) => ({
        onClick: () => {
          // 1. Récupération du tag_id depuis l'objet de la ligne cliquée
          const tagId = record.tag_id;

          // 2. Construction dynamique des paramètres de l'URL
          const queryParams = new URLSearchParams();
          
          if (tagId) queryParams.append("tag_id", tagId);
          if (fmt_date_st) queryParams.append("date_start", fmt_date_st);
          if (fmt_date_end) queryParams.append("date_end", fmt_date_end);

          // 3. Assemblage de l'URL finale (ex: "4892?date_start=2026-01-01&date_end=2026-06-15&tag_id=14")
          const queryString = queryParams.toString();
          const targetUrl = queryString 
            ? `${record[dataKey + "_id"]}?${queryString}` 
            : `${record[dataKey + "_id"]}`;

          // 4. Navigation vers la page de détails
          navigate(targetUrl, {
            state: { record: record, tagMapping: tagMapping }
          });
        },
        style: { cursor: "pointer" },
      })}
      tableLayout="auto"
      bordered
      // ── Tooltip sur chaque ligne ──
      components={{
        body: {
          row: ({ children, ...props }) => {
            // Extrais l'index de la clé (ex: "4892_0" → index 0)
            const rowKey = props["data-row-key"];

            if (!rowKey) {
              return <tr {...props}>{children}</tr>;
            }
            const index = parseInt(rowKey.split("_").pop());
            const record = data[index];  // ← Accès direct par index
            
            return (
              <Tooltip
                title={
                  record ? (
                    <AnalyseTooltip analyse={record.globales.analyse} />
                  ) : null
                }
                placement="top"
                align={{ offset: [0, ] }}
                color="#1e1e2f"
                mouseEnterDelay={0.15}
                getPopupContainer={(trigger) => trigger.parentNode}
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

export default ReportingTable;

