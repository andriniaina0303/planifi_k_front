/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILTERSBAR.JSX - Barre de filtres pour tableau d'annonceurs
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Barre compacte de filtres permettant de :
 * - Filtrer par annonceur
 * - Filtrer par statut de clic (performance)
 * - Filtrer par taux de désabonnement
 * - Définir un nombre minimum d'envois
 * - Trier les résultats
 */

import React from "react";
import { Select, InputNumber, Button } from "antd";

const { Option } = Select;

/**
 * Composant FiltersBar
 * Barre de contrôle pour filtrer les annonceurs
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.data - Liste complète des annonceurs pour le dropdown
 * @param {Object} props.filters - État actuel des filtres
 * @param {Function} props.setFilters - Fonction pour mettre à jour un filtre
 * @param {Function} props.resetFilters - Fonction pour réinitialiser tous les filtres
 * @returns {JSX.Element} Barre de filtres
 */
const FiltersBar = ({ data, filters, setFilters, resetFilters }) => {
  // Fonction helper pour mettre à jour un filtre spécifique
  const set = (key) => (v) => setFilters((f) => ({ ...f, [key]: v }));

  return (
    <div className="filter-bar">
      {/* ================= FILTRE ANNONCEUR ================= */}
      <div className="filter-group">
        <label className="filter-label">Annonceur</label>
        <Select 
          value={filters.advertiser} 
          onChange={set("advertiser")} 
          style={{ width: 160 }}
        >
          <Option value="ALL">Tous</Option>
          {data.map((a) => (
            <Option key={a.advrtiser_id} value={a.advertiser_name}>
              {a.advertiser_name}
            </Option>
          ))}
        </Select>
      </div>

      {/* ================= FILTRE STATUT CLIC ================= */}
      <div className="filter-group">
        <label className="filter-label">Statut clic</label>
        <Select 
          value={filters.taux_clickers} 
          onChange={set("taux_clickers")} 
          style={{ width: 130 }}
        >
          <Option value="ALL">Tous</Option>
          <Option value="🟢">Bon</Option>
          <Option value="🟡">Moyen</Option>
          <Option value="🔴">Faible</Option>
        </Select>
      </div>

      {/* ================= FILTRE DÉSABONNEMENT ================= */}
      <div className="filter-group">
        <label className="filter-label">Désabo</label>
        <Select 
          value={filters.taux_unsubs} 
          onChange={set("taux_unsubs")} 
          style={{ width: 130 }}
        >
          <Option value="ALL">Tous</Option>
          <Option value="✅">Faible</Option>
          <Option value="🚨">Élevé</Option>
        </Select>
      </div>

      {/* ================= FILTRE ENVOIS MINIMUMS ================= */}
      <div className="filter-group">
        <label className="filter-label">Min envois</label>
        <InputNumber
          value={filters.minSends}
          onChange={(v) => set("minSends")(v || 0)}
          min={0}
          style={{ width: 100 }}
        />
      </div>

      {/* ================= FILTRE TRI ================= */}
      <div className="filter-group">
        <label className="filter-label">Trier par</label>
        <Select 
          value={filters.sortBy} 
          onChange={set("sortBy")} 
          style={{ width: 120 }}
        >
          <Option value="sends">Envois</Option>
          <Option value="clickers">Clics</Option>
          <Option value="unsubs">Désabos</Option>
        </Select>
      </div>

      {/* ================= BOUTON RESET ================= */}
      <Button onClick={resetFilters}>Reset</Button>
    </div>
  );
};

export default FiltersBar;