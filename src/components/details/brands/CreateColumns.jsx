

// ── BrandSection columns ─────────────────────────────────────────────────────
/* 
 * Définition des colonnes du tableau pour l'affichage des Brands (marques).
 * Colonnes : Brand, Subject, Sends, Openers, Clickers, Unsubs, Open %, CTR %, CTO %, Unsub %.
 * Chaque colonne est triable et formatée selon son type (nombre, pourcentage, texte).
 */



import { LinkOutlined, SearchOutlined } from "@ant-design/icons";
import { Popover, Space, Tooltip, Typography, Select } from "antd";
import {fmt,pct, usd,formatDate} from "../../../utils/Helpers";
import { decodeBase64 } from "../../../utils/utils";
import { tokens } from "../../../utils/Tokens";
const { Text } = Typography;


const PopoverButton = ({
  content,
  title,
  color,
  label,
}) => {
  return (
    <Popover
      content={<div style={{ maxHeight: 200, overflowY: "auto" }}>{content}</div>}
      title={title}
      trigger="hover"
      placement="topRight"
    >
      <button
        style={{
          background: color,
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {label}
      </button>
    </Popover>
  );
};



export const buildSegmentButton = (segmentIds, segmentNames, tokens) => {
  
  const content = (
    <div>
      {(!segmentIds || segmentIds.length === 0) ? (
        <div style={{ padding: 8, fontSize: 12, color: "#999" }}>
          Aucun segment
        </div>
      ) : (
        segmentIds.map((id) => {
          const key = `${id}`;
          // console.log(`Nom du segment pour ID ${id} : ${segmentNames[key] || "Inconnu"}`);
          return (
            <div key={id} style={{ padding: 8, fontSize: 12 }}>
              • {segmentNames[key] || id}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <PopoverButton
      content={content}
      title={`Segments (${segmentIds?.length || 0})`}
      color={tokens.primary}
      label={`${segmentIds?.length || 0} segment(s)`}
    />
  );
};



export const buildListButton = (listNamesForBrand, tokens) => {
  const content = (
    <div>
      {(!listNamesForBrand || listNamesForBrand.length === 0) ? (
        <div style={{ padding: 8, fontSize: 12, color: "#999" }}>
          Aucune liste
        </div>
      ) : (
        listNamesForBrand.map((name, i) => (
          <div key={i} style={{ padding: 8, fontSize: 12 }}>
            ◆ {name}
          </div>
        ))
      )}
    </div>
  );

  return (
    <PopoverButton
      content={content}
      title={`Listes (${listNamesForBrand?.length || 0})`}
      color={tokens.success}
      label={`${listNamesForBrand?.length || 0} liste(s)`}
    />
  );
};



export const createBrandCols = (segmentNames,listNames,agencyName,rows=[]) => [
  {
    title: "Brand",
    dataIndex: "name",
    fixed: "left",
    width: 180,
    
    // 1. Génération et gestion du dropdown de filtrage par Select
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      
      // Extraction dynamique des marques uniques présentes dans le tableau actuel
      const brandOptions = Array.from(
        new Set(
          rows
            .map((row) => row.name)
            .filter(Boolean) // Élimine les valeurs nulles ou undefined
        )
      ).map((base64Name) => {
        const decoded = decodeBase64(base64Name);
        return {
          value: base64Name, // On garde le Base64 comme valeur technique/ID pour le filtre
          label: decoded,    // On affiche le nom décodé à l'utilisateur
        };
      }).sort((a, b) => a.label.localeCompare(b.label)); // Tri alphabétique des labels

      return (
        <div style={{ padding: 8, minWidth: 240 }} onKeyDown={(e) => e.stopPropagation()}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            style={{ width: '100%', marginBottom: 8 }}
            placeholder="Sélectionner des marques"
            value={selectedKeys}
            onChange={(values) => setSelectedKeys(values ? values : [])}
            options={brandOptions}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <a 
              onClick={() => confirm()} 
              style={{ color: "#1677ff", fontWeight: 'bold', cursor: 'pointer' }}
            >
              Filtrer
            </a>
            <a
              onClick={() => {
                clearFilters();
                confirm({ closeDropdown: true });
              }}
              style={{ cursor: 'pointer', color: '#999' }}
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

    // 2. La logique de comparaison d'Antd
    onFilter: (value, record) => {
      // 'value' contient ici le nom en Base64 sélectionné dans le Select
      // On fait une comparaison stricte sur la valeur brute (très rapide)
      return record.name === value;
    },

    render: (_, v) => (
      <>
        <Text strong style={{ display: "flex", fontSize: 12 }}>
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
      </>
    ),
  },
  {
    title: "Subject",
    dataIndex: "subject",
    align: "left",
    width: 300,
    render: (v) => (
      <Text ellipsis = {{tooltip:true}} strong style={{ width:500, fontSize: 12 }}>
        {decodeBase64(v)}
      </Text>
    ),
  },
  {
    title: <Text  strong>Date Sched.</Text>,
    dataIndex: "date_schedule",
    align: "left",
    width:90,
    render: (v) => (
      <Text ellipsis = {{tooltip:true}} strong style={{ fontSize: 12 }}>
        {v}<br />
      </Text>
    ),
  },
{
  title: "Segment",
  dataIndex: "segment_id",
  align: "left",    
  width: 210,
  render: (segmentIds, record) => {
    const listNamesForBrand = listNames[record.name] || [];
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

 {
    title: "Nom Agence",
    dataIndex: "agence_id",
    align: "left",
    width:120,
    render: (id) => (
        <button
          style={{
            background: tokens.info,
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "auto",
            padding: "2px 8px",
            fontSize: 12,
            fontWeight: 400,
            width:100
          }}
        >
          <Text ellipsis={{tooltip:true}}>
            {agencyName[id] || `ID: ${id}`}
          </Text>
        </button>
    ),
  },
  {
    title: "Models",
    dataIndex: "models",
    fixed: "left",
    width: 80,
    render: (models) => {
      if (!Array.isArray(models)) return "-";

      return (
        <Text ellipsis={{ tooltip: true }} strong style={{ fontSize: 12 }}>
          {models.map(m => `${m.model}(${usd(m.payvalue)})`).join(", ")}
        </Text>
      );
    }
  },
  {
    title: "Conv %",
    render: (_, record) => {
      const value =
        record.leads_val && record.clickers
          ? (record.leads_val / record.clickers) * 100
          : 0;

      return `${value.toFixed(2)} %`;
    },
  },
  {
    title: "Lead val.",
    dataIndex: "leads_val",
    align: "center",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
  },
  {
    title: "Click val.",
    dataIndex: "clicks_val",
    align: "center",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
  },
  {
    title: "Vol val.",
    dataIndex: "volume_val",
    align: "center",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
  },
  {
    title: "Sends",
    dataIndex: "sends",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
    align: "center",
  },
  {
    title: "Openers",
    dataIndex: "openers",
    sorter: (a, b) => a.openers - b.openers,
    align: "center",
    render: (_, record) => (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      width: "100%"
    }}>
      <span>{fmt(record.openers)}</span>
      <Text
        ellipsis={{ tooltip: true }}
        style={{
          maxWidth: 60, // ⚠️ obligatoire
          display: "inline-block", // ⚠️ obligatoire
          fontWeight: 400,
          fontSize: 12
        }}
      >
        ({pct(record.taux_cto)})
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
      width: "100%"
    }}>
      <span>{fmt(record.clickers)}</span>
      <Text style={{ color: tokens.warning, fontWeight: 400, fontSize:12 }}>
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
      width: "100%"
    }}>
      <span>{fmt(record.unsubs)}</span>
      <Text style={{ color: tokens.danger, fontWeight: 400, fontSize:12 }}>
        ({pct(record.taux_unsubs)})
      </Text>
    </div>
    ),
  },
  // {
  //   title: "Open %",
  //   dataIndex: "taux_openers",
  //   sorter: (a, b) => (a.taux_openers || 0) - (b.taux_openers || 0),
  //   render: (v) => (
  //     <Text style={{ color: tokens.success, fontWeight: 600 }}>{pct(v)}</Text>
  //   ),
  //   align: "right",
  // },
  {
    title: "CA",
    dataIndex: "ca",
    sorter: (a, b) => a.sends - b.sends,
    align: "center",
    render: fmt,
  },
  {
    title: "ecpm",
    dataIndex: "ecpm",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
    align: "center",
  }
];
