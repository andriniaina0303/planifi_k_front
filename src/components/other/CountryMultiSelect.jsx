/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COUNTRYMULTISELECT.JSX - Formulaire de ciblage multi-critères
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Composant de sélection pour le ciblage avancé :
 * - Pays (avec drapeaux)
 * - Bases de données
 * - Domain families
 * - Départements/codes postaux
 * - Leviers marketing
 * 
 * À utiliser pour la sélection multiple de critères dans des formulaires de campagne
 */

import React, { useState } from "react";
import { Form, Select, Button, Divider } from "antd";
import MultiSelectAnt from "./MultiSelect";

const { Option } = Select;

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES - Listes de sélection disponibles
// ═══════════════════════════════════════════════════════════════════════════

/** Pays disponibles pour le ciblage */
const countries = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Espagne", flag: "🇪🇸" },
  { code: "PL", name: "Pologne", flag: "🇵🇱" },
  { code: "UK", name: "Royaume-Uni", flag: "🇬🇧" },
  { code: "BEFR", name: "Belgique FR", flag: "🇧🇪" },
  { code: "AU", name: "Australie", flag: "🇦🇺" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
];

/** Familles de domaines de courriel */
const domainFamilies = ["sfr","outlook","yahoo","orange","laposte","free","bouygues","apple","gmail","others"];

/** Genre/Civilité */
const sexes = ["Homme","Femme","Others"];

/** Codes postaux/Départements en France */
const departments = ["75","13","69","33","31"];

/** Leviers marketing disponibles */
const levierMarketing = [
    'Emailing',
    'SMS',
    'Télémarketing',
    'Google Ads'
]

/** Bases de données disponibles */
const databaseList = [
  "Base A",
  "Base B",
  "Base C",
]

/** Tranches d'âge */
const ageRanges = [
  "18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65-74",
  "75",
  "O",
];

/**
 * Composant CountryMultiSelect
 * Formulaire complet de sélection multi-critères pour le ciblage
 * 
 * @component
 * @returns {JSX.Element} Formulaire avec multiples sélecteurs
 */
export default function CountryMultiSelect() {
  // États pour chaque critère de sélection
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedSexes, setSelectedSexes] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
  const [selectedLeviersMarketing, setSelectedLeviersMarketing] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);

  return (
    <div className="container py-4">
      <Form layout="vertical">
        {/* ================= LEVIER MARKETING ================= */}
        <MultiSelectAnt
          placeholder="Levier Marketing"
          options={levierMarketing}
          value={selectedLeviersMarketing}
          setValue={setSelectedLeviersMarketing}
          showFlag={false}
        />
        
        {/* ================= PAYS ================= */}
        <MultiSelectAnt
          placeholder="Pays"
          options={countries}
          value={selectedCountries}
          setValue={setSelectedCountries}
          showFlag={true}
        />
        
        {/* ================= BASE DE DONNÉES ================= */}
        <MultiSelectAnt
          placeholder="Base de données"
          options={databaseList}
          value={selectedDatabases}
          setValue={setSelectedDatabases}
        />
        
        {/* ================= DOMAIN FAMILY ================= */}
        <MultiSelectAnt
          placeholder="Domain Family"
          options={domainFamilies}
          value={selectedDomains}
          setValue={setSelectedDomains}
        />
        
        {/* ================= DÉPARTEMENTS/ZIPCODES ================= */}
        <MultiSelectAnt
          placeholder="Départements / Zipcodes"
          options={departments}
          value={selectedDepartments}
          setValue={setSelectedDepartments}
        />
      </Form>
    </div>
  );
}
