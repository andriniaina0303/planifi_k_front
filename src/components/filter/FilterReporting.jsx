/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILTERADVERTISER.JSX - Composant de filtrage pour la liste d'annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Propose plusieurs filtres permettant de :
 * - Filtrer par annonceur spécifique
 * - Filtrer par performance (eCPM, CA, Click Rate, Open Rate, Désabs)
 * - Filtrer par nombre minimum d'envois
 * - Filtrer par plage de dates (par défaut : 90 derniers jours)
 * - Trier les résultats par métrique
 */

import React, { useState, useMemo } from "react";
import { Card, Row, Col, Select, Button, DatePicker } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const {RangePicker} = DatePicker;
/**
 * Génère les dates par défaut : fin = aujourd'hui, début = aujourd'hui - 90 jours
 * @returns {Object} Objet avec scheduleStart et scheduleEnd en format dayjs
 */
const generateDefaultDates = () => {
  const endDate = dayjs(); // Aujourd'hui
  const startDate = dayjs().subtract(4, 'months'); // 90 jours avant aujourd'hui
  // const endDate = dayjs('2026-03-12'); // Date qui marche
  // const startDate = dayjs('2025-12-13'); // Date qui marche
  return {
    scheduleStart: startDate,
    scheduleEnd: endDate,
  };
};

/**
 * Configuration par défaut des filtres
 * @type {Object}
 */

// ─── Helpers date ──────────────────────────────────────────────────────────────
 
/**
 * Retourne [dateDebut, dateFin] par défaut : les 3 derniers mois jusqu'à aujourd'hui
 * @returns {[dayjs.Dayjs, dayjs.Dayjs]}
 */
const getDefaultDateRange = () => [
  dayjs().subtract(3, "month").startOf("day"),
  dayjs().endOf("day"),
];

// ─── Configuration par défaut des filtres ──────────────────────────────────────
 
/**
 * Configuration par défaut des filtres
 * @type {Object}
 */

const DEFAULT_FILTERS = {
  all_fields: [],   // [] = "ALL" (aucune sélection = tout afficher)
  country : "FR",
  taux_clickers: "ALL",
  taux_openers: "ALL",
  taux_unsubs: "ALL",
  taux_ca: "ALL",
  taux_ecpm: "ALL",
  minSends: 0,
  sortBy: "sends",
  ...generateDefaultDates(),
};

/**
 * Composant FilterAdvertiser
 * Affiche une barre de filtres multicritères avec dates par défaut
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.filters - État actuel des filtres
 * @param {Function} props.setFilters - Fonction pour mettre à jour les filtres
 * @param {Array} props.listeAdvertiser - Liste complète des annonceurs disponibles
 * @returns {JSX.Element} Barre de filtres avec sélecteurs
 */
const FilterReporting = ({labelFilter, filters, setFilters, listes, countries = [], idList, keyList }) => {
  // ── État local pour les dates en attente de validation ──
  const [pendingDates, setPendingDates] = useState({
    scheduleStart: filters.scheduleStart,
    scheduleEnd: filters.scheduleEnd,
  });

  // ── État local pour la sélection multiple en attente (avant Search) ──
  const [pendingSelection, setPendingSelection] = useState(filters.all_fields ?? []);

  // ── Déterminer si la sélection a changé (bouton Search visible) ──
  const hasSelectionChanged = useMemo(() => {
    const applied = filters.all_fields ?? [];
    if (pendingSelection.length !== applied.length) return true;
    return pendingSelection.some((v, i) => v !== applied[i]);
  }, [pendingSelection, filters.all_fields]);

  // ── Déterminer si les dates ont changé ──
  const hasDateChanged = useMemo(() => {
    return (
      !pendingDates.scheduleStart?.isSame(filters.scheduleStart) ||
      !pendingDates.scheduleEnd?.isSame(filters.scheduleEnd)
    );
  }, [pendingDates, filters]);

  /**
   * Réinitialise tous les filtres à leurs valeurs par défaut (90 derniers jours)
   */
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPendingDates({
      scheduleStart: DEFAULT_FILTERS.scheduleStart,
      scheduleEnd: DEFAULT_FILTERS.scheduleEnd,
    });
    setPendingSelection([]);
  };

  /**
   * Applique les dates en attente à l'état global des filtres
   */
  const handleApplyDateFilter = () => {
    setFilters({
      ...filters,
      scheduleStart: pendingDates.scheduleStart,
      scheduleEnd: pendingDates.scheduleEnd,
    });
  };

  /**
   * Annule les modifications de dates (restaure les valeurs précédentes)
   */
  const handleCancelDateFilter = () => {
    setPendingDates({
      scheduleStart: filters.scheduleStart,
      scheduleEnd: filters.scheduleEnd,
    });
  };

  return (
    <Card style={{ borderRadius: 10, background: "#ffffff" }}>
      <Row gutter={8} align="bottom">     
        {/* ================= FILTRE ANNONCEUR ================= */}

        {/* ================= DATE DÉBUT ================= */}
        <Col span={2.4}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>Start Date</span>
            <DatePicker
              value={pendingDates.scheduleStart}
              onChange={(date) =>
                setPendingDates({
                  ...pendingDates,
                  scheduleStart: date,
                })
              }
              style={{ width: "80%" }}
              format="YYYY-MM-DD"
              placeholder="Start"
              status={
                hasDateChanged ? "warning" : ""
              }
            />
          </div>
        </Col>

        {/* ================= DATE FIN ================= */}
        <Col span={2.4}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>End Date</span>
            <DatePicker
              value={pendingDates.scheduleEnd}
              onChange={(date) =>
                setPendingDates({
                  ...pendingDates,
                  scheduleEnd: date,
                })
              }
              style={{ width: "80%" }}
              format="YYYY-MM-DD"
              placeholder="End"
              status={
                hasDateChanged ? "warning" : ""
              }
            />
          </div>
        </Col>

        {/* ================= FILTRE {labelFilter} — MULTI-SÉLECTION ================= */}
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

        {/* ================= Filtre Country  ================= */}
        { countries.length >0 && 
          <Col span={2.4}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>Country</span>
              <Select
                value={filters.country}
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
        }
        {/* ================= BOUTON RESET (TOUJOURS VISIBLE) ================= */}
        <Col span={2.4}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>&nbsp;</span>
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

        {/* ================= BOUTON SEARCH (APPARAÎT SI SÉLECTION MODIFIÉE) ================= */}
        {/* {hasSelectionChanged || hasDateChanged && (
          <Col span={2.4}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>&nbsp;</span>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                style={{ width: "100%", background: "#1890ff", borderColor: "#1890ff" }}
                onClick={() =>
                  setFilters({ ...filters, all_fields: pendingSelection })
                }
                title={`Appliquer la sélection de ${labelFilter}`}
              >
                Search
              </Button>
            </div>
          </Col>
        )} */}

          {(hasSelectionChanged || hasDateChanged) && (
          <Col span={2.4}>
            <div style={styles.filterCol}>
              <span style={styles.filterLabel}>&nbsp;</span>
              <div style={{ display: "flex", gap: 6 }}>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  style={{
                    flex: 1,
                    background: hasSelectionChanged ? "#1890ff" : "#1890ff",
                    borderColor: hasSelectionChanged ? "#1890ff" : "#1890ff",
                  }}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      // applique la sélection si elle a changé, sinon garde l'ancienne
                      all_fields: hasSelectionChanged ? pendingSelection : filters.all_fields,
                      // applique les dates si elles ont changé, sinon garde les anciennes
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

                {/* Bouton ✕ uniquement si date seule (pas de sélection en cours) */}
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
  filterLabel: { fontSize: 12, color: "#888" },
};

export { DEFAULT_FILTERS, generateDefaultDates };
export default FilterReporting;