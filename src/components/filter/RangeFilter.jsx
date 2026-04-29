/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RANGEFILTER.JSX - Composant de filtre par plage numérique
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Permet à l'utilisateur de sélectionner une plage (min/max) pour filtrer
 * les données par valeurs numériques. Utilisé pour :
 * - Revenus min/max
 * - Ménages min/max
 * - CSP min/max
 */

import { InputNumber, Space } from "antd";

/**
 * Composant RangeFilter
 * Affiche deux champs InputNumber pour définir une plage de valeurs
 * 
 * @component
 * @param {Object} props
 * @param {string} props.label - Étiquette du filtre (ex: "Revenus")
 * @param {Object} props.value - Objet contenant {min, max}
 * @param {number} props.value.min - Valeur minimale
 * @param {number} props.value.max - Valeur maximale
 * @param {Function} props.onChange - Callback quand la plage change
 * @returns {JSX.Element} Conteneur avec deux InputNumbers et séparateur
 * @example
 * <RangeFilter 
 *   label="Revenu" 
 *   value={{min: 1000, max: 5000}}
 *   onChange={(newRange) => setRange(newRange)}
 * />
 */
export default function RangeFilter({ label, value, onChange }) {
  return (
    <div className="mb-3">
      {/* Étiquette du filtre */}
      <label className="form-label fw-bold">{label}</label>
      
      {/* Conteneur avec espacement horizontal */}
      <Space>
        {/* Champ pour la valeur minimale */}
        <InputNumber
          placeholder="Min"
          value={value.min}
          onChange={(min) => onChange({ ...value, min })}
        />
        
        {/* Séparateur visuel */}
        <span>—</span>
        
        {/* Champ pour la valeur maximale */}
        <InputNumber
          placeholder="Max"
          value={value.max}
          onChange={(max) => onChange({ ...value, max })}
        />
      </Space>
    </div>
  );
}
