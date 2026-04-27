import React, { useState } from "react";
import { Form, Select, Button, Divider } from "antd";
import MultiSelectAnt from "./MultiSelect";

const { Option } = Select;
// Données exemples
const countries = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Espagne", flag: "🇪🇸" },
  { code: "PL", name: "Pologne", flag: "🇵🇱" },
  { code: "UK", name: "Royaume-Uni", flag: "🇬🇧" },
  { code: "BEFR", name: "Belgique FR", flag: "🇧🇪" },
  { code: "AU", name: "Australie", flag: "🇦🇺" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
];

const domainFamilies = ["sfr","outlook","yahoo","orange","laposte","free","bouygues","apple","gmail","others"];
const sexes = ["Homme","Femme","Others"];
const departments = ["75","13","69","33","31"]; // Exemple codes postaux
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
const levierMarketing = [
    'Emailing',
    'SMS',
    'Télémarketing',
    'Google Ads'
]

const databaseList = [
  "Base A",
  "Base B",
"Base C",
]


export default function CountryMultiSelect() {
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
        <MultiSelectAnt
          label="Levier Marketing"
          options={levierMarketing}
          value={selectedLeviersMarketing}
          setValue={setSelectedLeviersMarketing}
          showFlag
        />
        <MultiSelectAnt
          label="Pays"
          options={countries}
          value={selectedCountries}
          setValue={setSelectedCountries}
          showFlag
        />
        <MultiSelectAnt
          label="Base de données"
          options={databaseList}
          value={selectedDatabases}
          setValue={setSelectedDatabases}
        />
        <MultiSelectAnt
          label="Domain Family"
          options={domainFamilies}
          value={selectedDomains}
          setValue={setSelectedDomains}
        />
        
        <MultiSelectAnt
          label="Départements / Zipcodes"
          options={departments}
          value={selectedDepartments}
          setValue={setSelectedDepartments}
        />
      </Form>
    </div>
  );
}
