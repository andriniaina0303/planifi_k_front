import React from "react";
import { Select, InputNumber, Button } from "antd";

const { Option } = Select;

const FiltersBar = ({ data, filters, setFilters, resetFilters }) => {
  const set = (key) => (v) => setFilters((f) => ({ ...f, [key]: v }));

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Annonceur</label>
        <Select value={filters.advertiser} onChange={set("advertiser")} style={{ width: 160 }}>
          <Option value="ALL">Tous</Option>
          {data.map((a) => (
            <Option key={a.advrtiser_id} value={a.advertiser_name}>
              {a.advertiser_name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Statut clic</label>
        <Select value={filters.taux_clickers} onChange={set("taux_clickers")} style={{ width: 130 }}>
          <Option value="ALL">Tous</Option>
          <Option value="🟢">Bon</Option>
          <Option value="🟡">Moyen</Option>
          <Option value="🔴">Faible</Option>
        </Select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Désabo</label>
        <Select value={filters.taux_unsubs} onChange={set("taux_unsubs")} style={{ width: 130 }}>
          <Option value="ALL">Tous</Option>
          <Option value="✅">Faible</Option>
          <Option value="🚨">Élevé</Option>
        </Select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Min envois</label>
        <InputNumber
          value={filters.minSends}
          onChange={(v) => set("minSends")(v || 0)}
          min={0}
          style={{ width: 100 }}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Trier par</label>
        <Select value={filters.sortBy} onChange={set("sortBy")} style={{ width: 120 }}>
          <Option value="sends">Envois</Option>
          <Option value="clickers">Clics</Option>
          <Option value="unsubs">Désabos</Option>
        </Select>
      </div>

      <Button onClick={resetFilters}>Reset</Button>
    </div>
  );
};

export default FiltersBar;