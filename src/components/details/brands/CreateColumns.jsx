

// ── BrandSection columns ─────────────────────────────────────────────────────
/* 
 * Définition des colonnes du tableau pour l'affichage des Brands (marques).
 * Colonnes : Brand, Subject, Sends, Openers, Clickers, Unsubs, Open %, CTR %, CTO %, Unsub %.
 * Chaque colonne est triable et formatée selon son type (nombre, pourcentage, texte).
 */



import { LinkOutlined } from "@ant-design/icons";
import { Popover, Space, Tooltip, Typography } from "antd";
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



export const createBrandCols = (segmentNames,base,listNames,agencyName) => [
  {
    title: "Brand",
    dataIndex: "name",
    fixed: "left",
    width: 140,
    render: (_, v) => (
      <>
        <Text strong style={{ fontSize: 12 }}>
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
    fixed: "left",
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
    fixed: "left",
    width:80,
    render: (v) => (
      <Text ellipsis = {{tooltip:true}} strong style={{ width:500, fontSize: 12 }}>
        {v}<br />
      </Text>
    ),
  },
{
  title: "Segment",
  dataIndex: "segment_id",
  width:190,
  fixed: "left",
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
    fixed: "left",
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
    align: "left",
    render: (models) => {
      if (!Array.isArray(models)) return "-";

      return (
        <Text ellipsis={{ tooltip: true }} strong style={{ width: 500, fontSize: 12 }}>
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
    fixed: "center",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
  },
  {
    title: "Click val.",
    dataIndex: "clicks_val",
    fixed: "center",
    sorter: (a, b) => a.sends - b.sends,
    render: fmt,
  },
  {
    title: "Vol val.",
    dataIndex: "volume_val",
    fixed: "center",
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
