// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Tabs, Row, Col, Collapse, Divider, Button, Select } from "antd";
// import b2c_image from "../../assets/images/b2c.png";
// import b2b_image from "../../assets/images/b2b.jpeg";

// import CountryMultiSelect from "../../components/CountryMultiSelect";
// import ScoreFilter from "../../components/ScoreFilter";
// import RangeFilter from "../../components/RangeFilter";
// import MultiSelectAnt from "../../components/MultiSelect";

// const targets = [
//   {
//     id: 1,
//     title: "-",
//     subtitle: "",
//     image: b2c_image,
//   },
//   {
//     id: 2,
//     title: "+",
//     subtitle: "",
//     image: b2b_image,
//   },
// ];

// const countries = [
//   { code: "FR", name: "France", flag: "🇫🇷" },
//   { code: "ES", name: "Espagne", flag: "🇪🇸" },
//   { code: "PL", name: "Pologne", flag: "🇵🇱" },
//   { code: "UK", name: "Royaume-Uni", flag: "🇬🇧" },
//   { code: "BEFR", name: "Belgique FR", flag: "🇧🇪" },
//   { code: "AU", name: "Australie", flag: "🇦🇺" },
//   { code: "DE", name: "Allemagne", flag: "🇩🇪" },
// ];

// const domainFamilies = [
//   "sfr",
//   "outlook",
//   "yahoo",
//   "orange",
//   "laposte",
//   "free",
//   "bouygues",
//   "apple",
//   "gmail",
//   "others",
// ];
// const sexes = ["Homme", "Femme", "Others"];
// const departments = ["75", "13", "69", "33", "31"]; // Exemple codes postaux
// const levierMarketing = ["Emailing", "SMS", "Télémarketing", "Google Ads"];
// const databaseList = ["Base A", "Base B", "Base C"];

// const ageRanges = [
//   "18",
//   "18-24",
//   "25-34",
//   "35-44",
//   "45-54",
//   "55-64",
//   "65-74",
//   "75",
//   "O",
// ];

// export default function Counting() {
//   const [selectedCountries, setSelectedCountries] = useState([]);
//   const [selectedDomains, setSelectedDomains] = useState([]);
//   const [selectedSexes, setSelectedSexes] = useState([]);
//   const [selectedDepartments, setSelectedDepartments] = useState([]);
//   const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
//   const [selectedLeviersMarketing, setSelectedLeviersMarketing] = useState([]);
//   const [selectedDatabases, setSelectedDatabases] = useState([]);
//   const [formData, setFormData] = useState({
//     target: "",
//     countries: [],
//     themes: [],
//     profile: {
//       income: { operator: ">=", value: 1 },
//       households: { operator: ">=", value: 1 },
//       csp: { operator: ">=", value: 1 },
//     },
//     scores: {
//       ownerScore: { operator: ">=", value: 1 },
//       houseTypeScore: { operator: ">=", value: 1 },
//       povertyScore: { operator: "<=", value: 2 },
//     },
//   });

//   return (
//     <Row gutter={[16, 16]}>
//       <Col span={12} style={{ borderRight: "1px solid red" }}>
//           {/* ================= TAB 1 : CIBLAGE ================= */}
//             <Row gutter={[16, 16]}>
//               {/* TYPE DE CIBLE */}
//               <Col span={24}>
//                 <div className="d-flex gap-3">
//                   {targets.map((t) => (
//                     <div
//                       key={t.id}
//                       className={`card flex-fill text-center ${
//                         formData.target === t.title
//                           ? "border-info border-3"
//                           : ""
//                       }`}
//                       style={{
//                         cursor: "pointer",
//                         padding: 16,
//                         color: "#fff",
//                         backgroundImage: `url(${t.image})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                         borderRadius: 8,
//                         width: 200,
//                         height: 152,
//                       }}
//                       onClick={() =>
//                         setFormData({ ...formData, target: t.title })
//                       }
//                     >
//                       <h6 className="fw-bold mb-0">{t.title}</h6>
//                       <small>{t.subtitle}</small>
//                     </div>
//                   ))}
//                 </div>
//               </Col>

//               {/* THÉMATIQUE */}
//               <Col span={24}>
//                 <Divider orientation="left">👤 Profile</Divider>
//                 <Row gutter={[16, 16]}>
//                   <Col span={8}>
//                     <MultiSelectAnt
//                       placeholder="Age Range"
//                       options={ageRanges}
//                       value={selectedAgeRanges}
//                       setValue={setSelectedAgeRanges}
//                     />
//                   </Col>

//                   <Col span={8}>
//                     <MultiSelectAnt
//                       placeholder="Domain family"
//                       options={domainFamilies}
//                       value={selectedDomains}
//                       setValue={setSelectedDomains}
//                     />
//                   </Col>

//                   <Col span={8}>
//                     <MultiSelectAnt
//                       placeholder="Civility"
//                       options={sexes}
//                       value={selectedSexes}
//                       setValue={setSelectedSexes}
//                     />
//                   </Col>

//                   <Col span={8}>
//                     <ScoreFilter
//                       label="Landlords"
//                       value={formData.scores.ownerScore}
//                       onChange={(v) =>
//                         setFormData({
//                           ...formData,
//                           scores: { ...formData.scores, ownerScore: v },
//                         })
//                       }
//                     />
//                   </Col>

//                   <Col span={8}>
//                     <ScoreFilter
//                       label="Individual House"
//                       value={formData.scores.houseTypeScore}
//                       onChange={(v) =>
//                         setFormData({
//                           ...formData,
//                           scores: { ...formData.scores, houseTypeScore: v },
//                         })
//                       }
//                     />
//                   </Col>

//                   <Col span={8}>
//                     <ScoreFilter
//                       label="Poverty"
//                       value={formData.scores.povertyScore}
//                       onChange={(v) =>
//                         setFormData({
//                           ...formData,
//                           scores: { ...formData.scores, povertyScore: v },
//                         })
//                       }
//                     />
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>
//       </Col>
//     </Row>
//   );
// }
import React, { useState } from "react";
import {
  Row,
  Col,
  Select,
  Button,
  Divider,
  Checkbox,
  Card,
  Typography,
  Input,
  message,
} from "antd";
import axios from "axios";
import GenderPieChart from "../../components/GenderPieChart";
import DashboardCharts from "../../components/DashboardCharts";

const { Title } = Typography;
const { TextArea } = Input;

// Options
const AGE_OPTIONS = [
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
const GENDER_OPTIONS = ["M", "F", "O"];
const MAIN_ISP_OPTIONS = [
  "gmail",
  "yahoo",
  "outlook",
  "orange",
  "sfr",
  "free",
  "laposte",
  "bouygues",
  "apple",
  "others",
];

const SCORE_SEGMENTS = {
  none: null,
  low: [0, 0.33],
  medium: [0.33, 0.66],
  high: [0.66, 1],
};

const SCORE_OPTIONS = [
  { value: "none", label: "Aucun filtre" },
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyen" },
  { value: "high", label: "Élevé" },
];

export default function Counting() {
  const [loading, setLoading] = useState(false);
  const [countResult, setCountResult] = useState(null);

  const [form, setForm] = useState({
    database_id: 1,
    locationInput: "",
    gender: [],
    age_ranges: [],
    optin_email: false,
    main_isp: [],
    scores: {
      median_income: null,
      individual_house: null,
      landlords: null,
      poverty: null,
      csp: null,
    },
  });

  const parseLocations = () => {
    const values = form.locationInput
      .split(/[\s,;\n]+/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const departements = values.filter((v) => v.length === 2);
    const zipcodes = values.filter((v) => v.length > 2);

    return { departements, zipcodes };
  };
  
  const buildPayload = () => {
    const { departements, zipcodes } = parseLocations();

    const scoresPayload = {};
    Object.entries(form.scores).forEach(([key, value]) => {
      if (value !== null) scoresPayload[key] = { min: value[0], max: value[1] };
    });

    return {
      database_id: form.database_id,
      departements,
      zipcodes,
      gender: form.gender,
      age_ranges: form.age_ranges,
      optin_email: form.optin_email,
      main_isp: form.main_isp,
      scores: scoresPayload,
    };
  };

  const handleCount = async () => {
    try {
      setLoading(true);
      const payload = buildPayload();
      const res = await axios.post(
        "http://localhost:8000/comptage/count",
        payload,
      );
      const all = res.data;
      console.log(all);
      setCountResult(all.data);
    } catch (err) {
      message.error("Erreur lors du comptage " + err);
    } finally {
      setLoading(false);
    }
  };

  const renderSelectWithAll = (field, options, placeholder) => {
    const value = form[field];
    return (
      <Select
        mode="multiple"
        placeholder={placeholder}
        value={value}
        style={{ width: "100%" }}
        onChange={(vals) => {
          if (vals.includes("__all__")) {
            setForm({ ...form, [field]: options });
          } else if (vals.includes("__none__")) {
            setForm({ ...form, [field]: [] });
          } else {
            setForm({ ...form, [field]: vals });
          }
        }}
      >
        <Select.Option key="__all__" value="__all__">
          Tout sélectionner
        </Select.Option>
        <Select.Option key="__none__" value="__none__">
          Tout désélectionner
        </Select.Option>
        {options.map((opt) => (
          <Select.Option key={opt} value={opt}>
            {opt}
          </Select.Option>
        ))}
      </Select>
    );
  };

  return (
    <Row style={{ padding: 0 }}>
      <Col span={10}>
        {/* ================= PROFIL ================= */}
        <Divider orientation="left">👤 Profil</Divider>
        <Card style={{ marginBottom: 30 }}>
          <Row gutter={16}>
            <Col span={8}>
              {renderSelectWithAll("gender", GENDER_OPTIONS, "Genre")}
            </Col>
            <Col span={8}>
              {renderSelectWithAll("age_ranges", AGE_OPTIONS, "Tranches d'âge")}
            </Col>
            <Col span={8} style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={form.optin_email}
                onChange={(e) =>
                  setForm({ ...form, optin_email: e.target.checked })
                }
              >
                Optin Email uniquement
              </Checkbox>
            </Col>
            <Col span={16} style={{ marginTop: 16 }}>
              {renderSelectWithAll("main_isp", MAIN_ISP_OPTIONS, "Main ISP")}
            </Col>
          </Row>
        </Card>

        {/* ================= LOCALISATION ================= */}
        <Divider orientation="left">📍 Localisation</Divider>
        <Card style={{ marginBottom: 30 }}>
          <TextArea
            rows={4}
            placeholder="Coller ici vos codes postaux ou départements (ex: 75 13 69000 33000)"
            value={form.locationInput}
            onChange={(e) =>
              setForm({ ...form, locationInput: e.target.value })
            }
          />
        </Card>

        {/* ================= SCORES ================= */}
        <Divider orientation="left">📊 Scores socio-démographiques</Divider>
        <Card style={{ marginBottom: 30 }}>
          <Row gutter={[16, 16]}>
            {[
              "median_income",
              "individual_house",
              "landlords",
              "poverty",
              "csp",
            ].map((scoreKey) => (
              <Col span={12} key={scoreKey}>
                <label style={{ fontWeight: 500 }}>
                  {scoreKey.replace("_", " ")}
                </label>
                <Select
                  style={{ width: "100%", marginTop: 5 }}
                  defaultValue="none"
                  options={SCORE_OPTIONS}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      scores: {
                        ...prev.scores,
                        [scoreKey]: SCORE_SEGMENTS[value],
                      },
                    }))
                  }
                />
              </Col>
            ))}
          </Row>
        </Card>

        {/* ================= ACTION ================= */}
        <Row justify="center">
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleCount}
          >
            Lancer le comptage
          </Button>
        </Row>
      </Col>
      <Col span={1}></Col>
      <Col span={13}>
            {countResult && <DashboardCharts countResult={countResult} />}
      </Col>
    </Row>
  );
}
