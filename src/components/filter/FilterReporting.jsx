/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILTERADVERTISER.JSX - Composant de filtrage pour la liste d'annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from "react";
import { Card, Row, Col, Select, Button, DatePicker } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { AlignCenter } from "lucide-react";

const { Option } = Select;
const { RangePicker } = DatePicker;

const generateDefaultDates = () => {
  const startDate = dayjs().startOf('month'); // 1er du mois courant
  const endDate = dayjs().endOf('month');     // Dernier jour du mois courant
  return {
    scheduleStart: startDate,
    scheduleEnd: endDate,
  };
};

const DEFAULT_FILTERS = {
  all_fields: [],   
  country: "FR",
  tag: undefined, // Ajout du champ tag par défaut
  taux_clickers: "ALL",
  taux_openers: "ALL",
  taux_unsubs: "ALL",
  taux_ca: "ALL",
  taux_ecpm: "ALL",
  minSends: 0,
  sortBy: "sends",
  ...generateDefaultDates(),
};

const FilterReporting = ({ labelFilter, filters, setFilters, listes, countries = [], tagList = [], idList, keyList }) => {
  
  console.log("Contenu de countries : ", countries)
  // ── État local pour les dates en attente de validation ──
  const [pendingDates, setPendingDates] = useState({
    scheduleStart: filters.scheduleStart,
    scheduleEnd: filters.scheduleEnd,
  });
  // Synchronise l'état local si le parent change (ex: Reset ou Initialisation)
React.useEffect(() => {
  setPendingDates({
    scheduleStart: filters.scheduleStart,
    scheduleEnd: filters.scheduleEnd,
  });
}, [filters.scheduleStart, filters.scheduleEnd]);

  // ── État local pour la sélection multiple en attente ──
  const [pendingSelection, setPendingSelection] = useState(filters.all_fields ?? []);

  // ── Déterminer si la sélection multiple a changé ──
  const hasSelectionChanged = useMemo(() => {
    // Si on est en mode "tag", la sélection multiple n'est pas affichée, donc pas de changement
    if (labelFilter === "tag") return false;
    
    const applied = filters.all_fields ?? [];
    if (pendingSelection.length !== applied.length) return true;
    return pendingSelection.some((v, i) => v !== applied[i]);
  }, [pendingSelection, filters.all_fields, labelFilter]);

  // ── Déterminer si les dates ont changé ──
  const hasDateChanged = useMemo(() => {
    return (
      !pendingDates.scheduleStart?.isSame(filters.scheduleStart) ||
      !pendingDates.scheduleEnd?.isSame(filters.scheduleEnd)
    );
  }, [pendingDates, filters]);

  /**
   * Réinitialise tous les filtres
   */

  const handleReset = () => {
    // Si c'est un tag, on cible l'année civile entière, sinon le défaut (4 mois glissants)
    const startDate = labelFilter === "tag" 
      ? dayjs().startOf('year') 
      : dayjs().subtract(4, 'months');

    const endDate = labelFilter === "tag" 
      ? dayjs().endOf('year') 
      : dayjs();

    const resetValues = {
      ...DEFAULT_FILTERS,
      scheduleStart: startDate,
      scheduleEnd: endDate,
    };

    setFilters(resetValues);
    setPendingDates({
      scheduleStart: resetValues.scheduleStart,
      scheduleEnd: resetValues.scheduleEnd,
    });
    setPendingSelection([]);
  };

  /**
   * Annule les modifications de dates
   */
  const handleCancelDateFilter = () => {
    setPendingDates({
      scheduleStart: filters.scheduleStart,
      scheduleEnd: filters.scheduleEnd,
    });
  };
  return (
    <Card style={{ borderRadius: 10, background: "#ffffff" }} styles={{ body: { padding: "12px 16px" } }}>
      {/* 1. Aligner verticalement au milieu pour égaliser toutes les hauteurs de composants */}
      <Row gutter={8} align="middle">     
        
        {/* ================= DATE DÉBUT ================= */}
        <Col span={4}>
          <div style={labelFilter === "tag" ? styles.filterRow : styles.filterCol}>
            <span style={styles.filterLabel}>Start Date: </span>
            <DatePicker
              value={pendingDates.scheduleStart}
              onChange={(date) =>
                setPendingDates({
                  ...pendingDates,
                  scheduleStart: date,
                })
              }
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Start"
              status={hasDateChanged ? "warning" : ""}
            />
          </div>
        </Col>

        {/* ================= DATE FIN ================= */}
        <Col span={4}>
          <div style={labelFilter === "tag" ? styles.filterRow : styles.filterCol}>
            <span style={styles.filterLabel}>End Date: </span>
            <DatePicker
              value={pendingDates.scheduleEnd}
              onChange={(date) =>
                setPendingDates({
                  ...pendingDates,
                  scheduleEnd: date,
                })
              }
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="End"
              status={hasDateChanged ? "warning" : ""}
            />
          </div>
        </Col>

        {labelFilter !== 'tag' && (
          /* AFFICHE LA MULTI-SÉLECTION INITIALE */
          <Col flex="auto">
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>{labelFilter}</span>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder={`All ${labelFilter}`}
                value={pendingSelection}
                onChange={(v) => setPendingSelection(v)}
                style={{ width: "100%", minWidth: 180 }}
                maxTagCount="responsive"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={
                  listes
                    ? listes.map((a) => ({
                        key: a[idList],
                        value: a[keyList],
                        label: a[keyList],
                      }))
                    : []
                }
              />
            </div>
          </Col>
        )}

        {/* ================= Filtre Country ================= */}
        {countries.length > 0 && (
          <Col span={3}>
            <div style={styles.filterCol}>
              {/* N'affiche le label "Country" que si ce n'est pas un tag, pour garder la ligne fine */}
              {labelFilter !== "tag" && <span style={styles.filterLabel}>Country</span>}
              <Select
                value={filters.country}
                style={{ width: "100%" }}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    country: value,
                  }))
                }
                options={countries.map((country) => ({
                  value: country.code,
                  label: country.name,
                }))}
              />
            </div>
          </Col>
        )}

        {/* ================= BOUTON RESET ================= */}
        <Col span={3}>
          <div style={styles.filterCol}>
            {/* 2. CONDITION ICI : On supprime complètement l'espace vide si c'est un tag */}
            {labelFilter !== "tag" && <span style={styles.filterLabel}>&nbsp;</span>}
            <Button 
              type="primary"
              icon={<ReloadOutlined />}
              style={{ width: "100%" }} 
              onClick={handleReset}
              title="Réinitialiser tous les filtres"
            >
              Reset
            </Button>
          </div>
        </Col>

        {/* ================= BOUTONS ACTIONS ================= */}
        {(hasSelectionChanged || hasDateChanged) && (
          <Col span={3}>
            <div style={styles.filterCol}>
              {/* 3. CONDITION ICI AUSSI : Pas d'espace supérieur en mode tag */}
              {labelFilter !== "tag" && <span style={styles.filterLabel}>&nbsp;</span>}
              <div style={{ display: "flex", gap: 6 }}>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  style={{
                    flex: 1,
                    background: "#1890ff",
                    borderColor: "#1890ff",
                  }}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      ...(labelFilter !== "tag" && { all_fields: pendingSelection }),
                      ...(hasDateChanged && {
                        scheduleStart: pendingDates.scheduleStart,
                        scheduleEnd: pendingDates.scheduleEnd,
                      }),
                    })
                  }
                  title={hasSelectionChanged ? `Appliquer la sélection de ${labelFilter}` : "Appliquer la plage de dates"}
                >
                  {hasSelectionChanged ? "Search" : "Filter"}
                </Button>

                {hasDateChanged && !hasSelectionChanged && (
                  <Button
                    type="default"
                    style={{ flex: 1 }}
                    onClick={handleCancelDateFilter}
                    title="Annuler les modifications de date"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          </Col>
        )}

      </Row>
    </Card>
  );
};

const styles = {
  filterCol: { display: "flex", flexDirection: "column", gap: 5 },
  filterRow: {width:"170px",display:"flex", flexDirection: "row", gap:8, whiteSpace: "nowrap", justifyContents: 'space-between',alignItems: "center"},
  filterLabel: { fontSize: 12, color: "#888", margin:0 },
  filterCard: {}
};

export { DEFAULT_FILTERS, generateDefaultDates };
export default FilterReporting;