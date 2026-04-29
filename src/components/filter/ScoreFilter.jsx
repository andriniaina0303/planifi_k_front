/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCOREFILTER.JSX - Composant de filtre avec comparateur numérique
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Permet de filtrer par score avec un opérateur de comparaison :
 * - Sélection de l'opérateur (=, <, ≤, >, ≥)
 * - Saisie de la valeur numérique
 * Utilisé pour les scores de propriétaire, type de maison, pauvreté, etc.
 */

import { Select, InputNumber, Space, Row, Col } from "antd";

/**
 * Liste des opérateurs disponibles pour la comparaison
 * @type {Array<Object>}
 */
const operators = [
  { value: "=", label: "=" },
  { value: "<", label: "<" },
  { value: "<=", label: "≤" },
  { value: ">", label: ">" },
  { value: ">=", label: "≥" },
];

/**
 * Composant ScoreFilter
 * Affiche un sélecteur d'opérateur et un champ numérique pour filtrer par score
 * 
 * @component
 * @param {Object} props
 * @param {string} props.label - Nom du score (ex: "Propriétaires")
 * @param {Object} props.value - Objet {operator, value} contenant l'opérateur et la valeur
 * @param {string} props.value.operator - L'opérateur de comparaison (=, <, etc.)
 * @param {number} props.value.value - La valeur numérique
 * @param {Function} props.onChange - Callback quand le filtre change
 * @param {number} [props.min=0] - Valeur minimale autorisée
 * @param {number} [props.max=3] - Valeur maximale autorisée
 * @returns {JSX.Element} Champ de score avec opérateur
 * @example
 * <ScoreFilter
 *   label="Propriétaires"
 *   value={{operator: ">=", value: 1}}
 *   onChange={(newFilter) => setFilter(newFilter)}
 *   min={0}
 *   max={3}
 * />
 */
export default function ScoreFilter({
  label,
  value,
  onChange,
  min = 0,
  max = 3,
}) {
  return (
    <div className="mb-4">
      <Row>
        {/* Étiquette du filtre */}
        <Col span={10} style={{textAlign: "center", padding: 5}}>
          {label}
        </Col>
        
        {/* Sélecteur et InputNumber */}
        <Space>
          {/* ================= SÉLECTEUR OPÉRATEUR ================= */}
          <Col span={4}>
            <Select
              className="centered-select"
              value={value.operator}
              onChange={(op) => onChange({ ...value, operator: op })}
              style={{ width: 80, textAlign: "center" }}
              options={operators}
            />
          </Col>
          
          {/* ================= CHAMP VALEUR NUMÉRIQUE ================= */}
          <Col span={4}>
            <InputNumber
              className="centered-input"
              min={min}
              max={max}
              value={value.value}
              onChange={(val) => onChange({ ...value, value: val })}
            />
          </Col>
        </Space>
      </Row>
    </div>
  );
}
