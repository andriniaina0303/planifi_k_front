import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Popover, Tag, Select, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { StatusDot } from "../../utils/getStatusDots";

// Configuration des 12 mois de l'année
const ALL_MONTHS = [
  { key: "1", label: "Jan" }, { key: "2", label: "Fév" }, { key: "3", label: "Mar" },
  { key: "4", label: "Avr" }, { key: "5", label: "Mai" }, { key: "6", label: "Juin" },
  { key: "7", label: "Juil" }, { key: "8", label: "Août" }, { key: "9", label: "Sept" },
  { key: "10", label: "Oct" }, { key: "11", label: "Nov" }, { key: "12", label: "Déc" }
];

export const SeasonalHeatmap = ({ rawData = [], startDate, endDate, tagMapping }) => {

  /**
   * Transformer : Transforme la structure imbriquée du backend en lignes plates pour Ant Design
   */
  // console.log("Contenu de rawData : ", rawData)
  const navigate = useNavigate()

  // Formater les dates aux format traitable 
  const date_start = startDate.format && startDate.format("YYYY-MM-DD")
  const date_end = endDate.format && endDate.format("YYYY-MM-DD")  
  const formattedData = useMemo(() => {
    if (!Array.isArray(rawData)) return [];

    return rawData.map((item) => {
      // 1. On initialise la ligne avec les infos de base
      const row = {
        key: item.tag_id,
        thematic: item.tag_name,
      };

      // 2. On configure la correspondance
      ALL_MONTHS.forEach((month) => {
        const monthData = item.months && item.months[month.key];
        
        // 👑 CRUCIAL : On stocke tout l'objet du mois (contenant .global et .top5) au lieu du simple emoji string
        row[month.key] = monthData || null;
      });

      return row;
    });
  }, [rawData]);

  /**
   * Fonction de rendu du contenu stylisé de la liste top 5 dans le Popover
   */
  /**
   * Fonction de rendu du contenu de la liste top 5 dans le Popover
   */
  const renderPopoverContent = (monthData, record,fmt_date_st,fmt_date_end) => {
    // console.log("Contenu de record : ",record)
    const top5List = monthData?.top5 || [];

    if (top5List.length === 0) {
      return <span style={{ color: "#888", fontSize: "12px" }}>Aucun Advertisers</span>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
        {top5List.map((adv) => (
          <Tag
            key={adv.adv_id}
            onClick={(e) => {
              e.stopPropagation(); // Évite de propager le clic à la ligne du tableau

              // 1. Construction dynamique des paramètres de l'URL
              const queryParams = new URLSearchParams();
              if (record.key) queryParams.append("tag_id", record.key);
              if (fmt_date_st) queryParams.append("date_start", fmt_date_st);
              if (fmt_date_end) queryParams.append("date_end", fmt_date_end);

              const queryString = queryParams.toString();
              
              // 2. 👑 Base de l'URL modifiée avec le chemin absolu /reporting/advertisers/
              const targetUrl = queryString 
                ? `/reporting/advertisers/${adv.adv_id}?${queryString}` 
                : `/reporting/advertisers/${adv.adv_id}`;

              console.log("🚀 Redirection vers :", targetUrl);

              // 3. Navigation vers la page de détails de l'annonceur
              navigate(targetUrl, {
                state: { 
                  record: { advertiser_id: adv.adv_id, advertiser_name: adv.adv_name } 
                }
              });
            }}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              background: "#f5f5f5",
              border: "1px solid #d9d9d9",
              // color: "#1890ff",
              textAlign: "left",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              margin: 0,
              maxWidth: "220px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            className="hoverable-adv-tag"
          >
            {adv.rank}. {adv.adv_name}
          </Tag>
        ))}
      </div>
    );
  };

  /**
   * Configuration des colonnes d'Ant Design
   */
  const columns = [
    {
      title: "Thématique",
      dataIndex: "thematic",
      key: "thematic",
      align: "left",
      className: "heatmap-theme-cell",
      width: 150,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        
        // 🎯 ÉTAPE 1 : Générer les options directement depuis l'objet tagMapping
        // Object.entries permet de récupérer à la fois l'ID (la clé) et le Nom (la valeur textuelle)
        const themesOptions = useMemo(() => {
          if (!tagMapping || typeof tagMapping !== "object") return [];
          
          return Object.entries(tagMapping).map(([id, name]) => ({
            label: name,  // Ce qui est affiché à l'utilisateur (ex: "Mode")
            value: id,    // La valeur stockée en arrière-plan (l'ID du tag sous forme de string)
          }));
        }, [tagMapping]);

        return (
          <div style={{ padding: 8, width: 180 }}>
            <Select
              mode="multiple"
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Sélectionner thématiques"
              value={selectedKeys} // Tableau contenant les IDs de tags sélectionnés
              onChange={(values) => {
                // Stocke le tableau d'IDs sélectionnés dans les clés de filtrage d'AntD
                setSelectedKeys(values || []);
              }}
              style={{ width: "100%", marginBottom: 8 }}
              maxTagCount="responsive"
              options={themesOptions} // Liste d'options générée dynamiquement
            />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  clearFilters();
                  confirm({ closeDropdown: true });
                }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => confirm()}
              >
                Filtrer
              </Button>
            </div>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      
      // 🎯 ÉTAPE 2 : Ajuster la comparaison logique dans onFilter
      onFilter: (value, record) => {
        // 'value' ici est l'ID d'un tag sélectionné (issu de selectedKeys) transmis par AntD.
        // 'record.key' contient item.tag_id (configuré à la ligne 30 de votre script).
        
        // On compare directement l'ID sélectionné avec l'ID de la ligne du tableau
        return String(record.key) === String(value);
      },
    },
    ...ALL_MONTHS.map((month) => ({
      title: month.label,
      dataIndex: month.key,
      key: month.key,
      align: "center",
      // 👑 monthData reçoit maintenant l'objet complet du mois
      render: (monthData,record) => {
        const resultEmoji = monthData?.global?.result;
        // S'il n'y a pas de données ou pas de résultat, on affiche un tiret neutre
        if (!resultEmoji) return "-";

        return (
          // 👑 On enveloppe la pastille dans un Popover d'AntD activé au Hover
          <Popover
            title={<strong style={{ fontSize: "13px", color: "#111" }}>🏆 Top Advertisers</strong>}
            content={renderPopoverContent(monthData,record,date_start,date_end)}
            trigger="hover"
            placement="top"
            overlayInnerStyle={{ borderRadius: "8px", padding: "10px 12px" }}
          >
            {/* On ajoute un wrapper inline-block avec un curseur pointer pour indiquer le survol */}
            <div style={{ cursor: "pointer", display: "inline-block" }}>
              <StatusDot resultEmoji={resultEmoji} />
            </div>
          </Popover>
        );
      },
    })),
  ];

  return (
    <Card 
      title="🔥 Heatmap saisonnière" 
      size="medium"
      style={{ width: "100%", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      <p style={{ color: "#666", marginBottom: 20 }}>
        Cette vue permet de détecter en quelques secondes les meilleures périodes de diffusion pour chaque catégorie. Survolez un indicateur pour voir le top 5 des annonceurs.
      </p>

      <style>{`
        .custom-heatmap-table .ant-table-thead > tr > th {
          background: transparent !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #f0f0f0 !important;
          color: #555 !important;
        }
        .custom-heatmap-table .heatmap-theme-cell {
          font-weight: 500;
          color: #222;
        }
        .custom-heatmap-table .ant-table-cell {
          padding: 14px 8px !important;
        }
          
      `}</style>

      <Table
        className="custom-heatmap-table"
        dataSource={formattedData}
        columns={columns}
        pagination={false}
        scroll={{
            x: "100%",
            y: 500,
            scrollToFirstRowOnChange: true
        }}
      />
    </Card>
  );
};