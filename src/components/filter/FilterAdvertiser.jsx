/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILTERADVERTISER.JSX - Composant de filtrage pour la liste d'annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Propose plusieurs filtres permettant de :
 * - Filtrer par annonceur spécifique
 * - Filtrer par performance (eCPM, CA, Click Rate, Open Rate, Désabs)
 * - Filtrer par nombre minimum d'envois
 * - Trier les résultats par métrique
 */

import React from "react";
import { Card, Row, Col, Select, Button , DatePicker} from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const {RangePicker} = DatePicker;
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
  advertiser: "ALL",
  taux_clickers: "ALL",
  taux_openers: "ALL",
  taux_unsubs: "ALL",
  taux_ca: "ALL",
  taux_ecpm: "ALL",
  minSends: 0,
  sortBy: "sends",
  dateRange: getDefaultDateRange(),
};

/**
 * Composant FilterAdvertiser
 * Affiche une barre de filtres multicritères
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.filters - État actuel des filtres
 * @param {Function} props.setFilters - Fonction pour mettre à jour les filtres
 * @param {Array} props.listeAdvertiser - Liste complète des annonceurs disponibles
 * @returns {JSX.Element} Barre de filtres avec sélecteurs
 */
const FilterAdvertiser = ({ filters, setFilters, listeAdvertiser }) => {
  /**
   * Réinitialise tous les filtres à leurs valeurs par défaut
   */
  const handleReset = () => setFilters(DEFAULT_FILTERS);

   /**
   * Gère le changement de la plage de dates
   * @param {[dayjs.Dayjs, dayjs.Dayjs] | null} dates
   */
  const handleDateChange = (dates) => {
    setFilters({ ...filters, dateRange: dates ?? getDefaultDateRange() });
  };

  return (
    <Card style={{ borderRadius: 10, background: "#ffffff" }}>
      <Row gutter={12} align="bottom">

         {/* ================= FILTRE DATES ================= */}
        <Col span={5}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>Période (date_schedule)</span>
            <RangePicker
              value={filters.dateRange}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              allowClear={false}
              style={{ width: "100%" }}
              presets={[
                {
                  label: "3 derniers mois",
                  value: getDefaultDateRange(),
                },
                {
                  label: "6 derniers mois",
                  value: [dayjs().subtract(6, "month").startOf("day"), dayjs().endOf("day")],
                },
                {
                  label: "Cette année",
                  value: [dayjs().startOf("year"), dayjs().endOf("day")],
                },
                {
                  label: "Année précédente",
                  value: [
                    dayjs().subtract(1, "year").startOf("year"),
                    dayjs().subtract(1, "year").endOf("year"),
                  ],
                },
              ]}
            />
          </div>
        </Col>

        {/* ================= FILTRE ANNONCEUR ================= */}
        <Col span={4}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>Advertiser</span>
            <Select
              showSearch
              value={filters.advertiser}
              onChange={(v) => setFilters({ ...filters, advertiser: v })}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All advertisers</Option>
              {/* Affiche dynamiquement tous les annonceurs disponibles */}
              {listeAdvertiser &&
                listeAdvertiser.map((a) => (
                  <Option key={a.advrtiser_id} value={a.advertiser_name}>
                    {a.advertiser_name}
                  </Option>
                ))}
            </Select>
          </div>
        </Col>


        

        {/* ================= FILTRE eCPM ================= */}
        <Col span={3}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>eCPM</span>
            <Select
              value={filters.taux_ecpm}
              onChange={(v) => setFilters({ ...filters, taux_ecpm: v })}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All</Option>
              <Option value="🟢">🟢 Good</Option>
              <Option value="🟡">🟡 Medium</Option>
              <Option value="🔴">🔴 Low</Option>
            </Select>
          </div>
        </Col>

        {/* ================= FILTRE CA ================= */}
        <Col span={3}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>CA</span>
            <Select
              value={filters.taux_ca}
              onChange={(v) => setFilters({ ...filters, taux_ca: v })}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All</Option>
              <Option value="🟢">🟢 Good</Option>
              <Option value="🟡">🟡 Medium</Option>
              <Option value="🔴">🔴 Low</Option>
            </Select>
          </div>
        </Col>

        {/* ================= FILTRE CLICK RATE ================= */}
        <Col span={3}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>Click Rate</span>
            <Select
              value={filters.taux_clickers}
              onChange={(v) => setFilters({ ...filters, taux_clickers: v })}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All clickers</Option>
              <Option value="🟢">🟢 Good</Option>
              <Option value="🟡">🟡 Medium</Option>
              <Option value="🔴">🔴 Low</Option>
            </Select>
          </div>
        </Col>

        {/* ================= FILTRE OPEN RATE ================= */}
        <Col span={3}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>Open Rate</span>
            <Select
              value={filters.taux_openers}
              onChange={(v) => setFilters({ ...filters, taux_openers: v })}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All openers</Option>
              <Option value="🟢">🟢 Bon</Option>
              <Option value="🟡">🟡 Moyen</Option>
              <Option value="🔴">🔴 Faible</Option>
            </Select>
          </div>
        </Col>

        <Col span={3}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>Unsub Rate</span>
            <Select
              value={filters.taux_unsubs}
              onChange={(v) => setFilters({ ...filters, taux_unsubs: v })}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All unsub</Option>
              <Option value="🟢">🟢 Good</Option>
              <Option value="🟡">🟡 Medium</Option>
              <Option value="🔴">🔴 Low</Option>
            </Select>
          </div>
        </Col>

        <Col span={3}>
          <div style={styles.filterCol}>
            <span style={styles.filterLabel}>&nbsp;</span>
            <Button type="primary" style={{ width: "100%" }} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

const styles = {
  filterCol: { display: "flex", flexDirection: "column", gap: 5 },
  filterLabel: { fontSize: 12, color: "#888" },
};

export { DEFAULT_FILTERS, getDefaultDateRange };
export default FilterAdvertiser;