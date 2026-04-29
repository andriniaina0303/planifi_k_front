/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MULTISELECT.JSX - Sélecteur multiple réutilisable
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Composant Select multi-choix avec :
 * - Fonction "Sélectionner/Désélectionner tous"
 * - Support pour afficher des drapeaux (flags) optionnels
 * - Labels personnalisables pour objets complexes
 */

import React from "react";
import { Select, Divider, Row, Col } from "antd";

const { Option } = Select;

/**
 * Composant MultiSelectAnt
 * Sélecteur multiple avec option pour tout sélectionner/désélectionner
 * 
 * @component
 * @param {Object} props
 * @param {string} props.placeholder - Texte affichécomme label et placeholder
 * @param {Array} props.options - Options disponibles (chaînes ou objets {code, name, flag})
 * @param {Array} props.value - Valeurs sélectionnées
 * @param {Function} props.setValue - Callback pour mettre à jour les sélections
 * @param {boolean} [props.showFlag=false] - Afficher le drapeau s'il existe
 * @returns {JSX.Element} Sélecteur multi-choix
 * @example
 * const countries = [
 *   { code: "FR", name: "France", flag: "🇫🇷" },
 *   { code: "ES", name: "Espagne", flag: "🇪🇸" },
 * ];
 * <MultiSelectAnt
 *   placeholder="Pays"
 *   options={countries}
 *   value={selected}
 *   setValue={setSelected}
 *   showFlag={true}
 * />
 */
export default function MultiSelectAnt({
  placeholder,
  options,
  value,
  setValue,
  showFlag = false,
}) {
  /**
   * Retourne le label à afficher pour une option
   * Peut être une chaîne simple ou un objet avec flag
   */
  const getLabel = (o) => {
    if (typeof o === "object")
      return `${showFlag ? o.flag + " " : ""}${o.name}`;
    return o;
  };

  /**
   * Retourne la valeur/code d'une option
   * Utilisé pour identifier l'option dans le système
   */
  const getCode = (o) => (typeof o === "object" ? o.code : o);

  /**
   * Toggle : sélectionne tout ou désélectionne tout
   */
  const handleSelectAll = () => {
    if (value.length === options.length) setValue([]);
    else setValue(options.map(getCode));
  };

  return (
    <div className="mb-4">
      <Row>
        {/* Label/Placeholder */}
        <Col span={7} style={{textAlign: "center", padding: 5}}>
          <label className="form-label">{placeholder}</label>
        </Col>

        {/* Sélecteur multiple */}
        <Col span={17}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder={`Sélectionnez ${placeholder}`}
            value={value}
            onChange={setValue}
            optionLabelProp="label"
            // Menu personnalisé avec bouton "Sélectionner tous"
            dropdownRender={(menu) => (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", padding: 8 }}>
                  {/* Lien "Sélectionner/Désélectionner tous" */}
                  <a
                    style={{
                      flex: "1 0 100%",
                      marginBottom: 8,
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={handleSelectAll}
                  >
                    {value.length === options.length
                      ? "Désélectionner tous"
                      : "Sélectionner tous"}
                  </a>
                </div>
                {/* Ligne de séparation */}
                <Divider style={{ margin: "4px 0" }} />
                {/* Menu des options */}
                {menu}
              </>
            )}
          >
            {/* Génération des options */}
            {options.map((o) => {
              const code = getCode(o);
              return (
                <Option key={code} value={code} label={getLabel(o)}>
                  {getLabel(o)}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
    </div>
  );
}
