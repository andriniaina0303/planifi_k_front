import { Search, MapPinHouse, Map, MapPinned, ClipboardList, X } from 'lucide-react';
import { useState } from 'react';
import { type DepartmentData } from '../MapApp';
import { searchTowns, type TownMarker } from '../hooks/townMarkers';
import {QuestionCircleOutlined}  from '@ant-design/icons';
import { Popover,Progress, Typography } from 'antd';


const { Title, Text, Paragraph } = Typography;
interface OptionProps {
  onViewChange: (url: string,mode: 'departement' | 'region' | 'ville') => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  searchResults: Array<{ nom: string; code: string }>;
  showSearchResults: boolean;
  onSelectResult: (nom: string, code: string) => void;
  isRegionMode: boolean;
  isTownMode: boolean;// Fonction pour basculer en mode ville
  onToggleMultiSelect?: () => void;
  isMultiSelectMode?: boolean;
  allGeographies?: any[];
  multiSelDept?: DepartmentData[];
  setMultiSelDep?: React.Dispatch<React.SetStateAction<DepartmentData[]>>;
  onOpenDeptList: () => void;
  onOpenRegionList: () => void;
  onOpenVilleList: () => void;  // Fonction pour ouvrir la liste des villes
  onToggleTown: (code: string) => void; // callback pour toggle ville
  hasSelection?: boolean;
  onClearSelection?: () => void;

}



export default function Option({
  onViewChange,
  onSearch,
  searchQuery,
  searchResults,
  showSearchResults,
  onSelectResult,
  isRegionMode,
  onOpenDeptList,
  onOpenRegionList,
  onOpenVilleList,
  isTownMode,
  onToggleTown,
  hasSelection = false,
  onClearSelection, 
}: OptionProps) {

  // Etats pour la recherche de villes
  const [townSearchResults, setTownSearchResults] = useState<TownMarker[]>([]);
  const [showTownResults, setShowTownResults] = useState(false);

  // États pour les dropdowns
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  // URLs des fichiers GeoJSON
  const urlRegions = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-avec-outre-mer.geojson";
  const urlDepartements = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-avec-outre-mer.geojson";
  const handleRegionClick = () => {
    onViewChange(urlRegions, 'region');
    setShowDeptDropdown(false);
    setShowRegionDropdown(false);
  };

  const handleDepartementClick = () => {
    onViewChange(urlDepartements, 'departement');
    setShowDeptDropdown(false);
    setShowRegionDropdown(false);
  };
  

const handleVilleClick = () => {
  // On garde le fond "départements" comme base visuelle
  // Les marqueurs ponctuels seront gérés par isTownMode dans FranceMap
  onViewChange(urlDepartements, 'ville');  // ← 'ville' active isTownMode
  setShowDeptDropdown(false);
  setShowRegionDropdown(false);
};

const btnDisabled = true

 return (
    <div className="d-flex font-poppins align-items-center w-100">
      <div className="d-flex flex-column gap-3 w-100">       
        {/* Ligne 1: Boutons de sélection */}
        {/* <ul className="d-flex flex-wrap align-items-center gap-2 list-unstyled">
          Départements 
          <li className="position-relative">
            <div
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill cursor-pointer ${!isRegionMode && !isTownMode ? "btn btn-warning" : "btn btn-light text-dark"}`}
              onClick={() => {
                handleDepartementClick();
                setShowDeptDropdown(!showDeptDropdown);
              }}
              style={{ cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <MapPinned style={{ width: '1rem', height: '1rem' }} />
              <span className="d-none d-sm-inline">Départements</span>
              <span className="d-sm-none">Dépt.</span>
            </div>
          </li>

          {/* Régions 
          <li className="position-relative">
            <div
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${btnDisabled? "btn-secondary opacity-50" : isRegionMode ? "btn btn-warning" : "btn btn-light text-dark"}`}
              onClick={() => {
                if (btnDisabled) return;
                handleRegionClick();
                console.log("Mode activer :", isRegionMode ? "Région" : "Département");
                setShowRegionDropdown(!showRegionDropdown);
              }}
              style={{ cursor: btnDisabled? 'not-allowed':'pointer', fontSize: '0.9rem' }}
            >
              <Map style={{ width: '1rem', height: '1rem' }} />
              <span className="d-none d-sm-inline">Régions</span>
              <span className="d-sm-none">Rég.</span>
            </div>
          </li>
*/}
          {/* Villes 
          <li 
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${
              btnDisabled? "btn-secondary opacity-50" :
              !isRegionMode && isTownMode
                ? "btn btn-warning" 
                : "btn btn-light text-dark"}`}
            onClick={() => {
              if (btnDisabled) return;
              handleVilleClick();
            }}
            style={{ cursor: btnDisabled? 'not-allowed':'pointer', fontSize: '0.9rem' }}
          >
            <MapPinHouse style={{ width: '1rem', height: '1rem' }} />
            <span className="d-none d-sm-inline">Villes</span>
            <span className="d-sm-none">Vil.</span>
          </li>
        </ul> */}

        {/* Ligne 2: Recherche et sélection multiple */}
        <div className="d-flex flex-lg-row gap-2 w-100">

          {/* Barre de recherche */}
          <div className="position-relative d-flex" style={{ flex: '1 1 auto' }}>
            <div className="d-flex w-100 h-70 position-relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  if (isTownMode) {
                    onSearch(e.target.value);
                    const results = searchTowns(e.target.value);
                    setTownSearchResults(results);
                    setShowTownResults(results.length > 0 && e.target.value.trim() !== "");
                  } else {
                    onSearch(e.target.value);
                    setShowTownResults(false);
                  }
                }}
                placeholder={
                  isTownMode ? "Ville..." :
                  isRegionMode ? "Région..." :
                  "Département..."
                }
                className="form-control custom-input"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingRight: searchQuery ? '2rem' : undefined }}
              />
              {/* Bouton effacer manuel */}
              {hasSelection ? (
                <button
                  className="btn btn-danger"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, whiteSpace: 'nowrap' }}
                  onClick={() => {
                    onSearch("");
                    setTownSearchResults([]);
                    setShowTownResults(false);
                    onClearSelection?.();
                  }}
                >
                  <X style={{ width: '1rem', height: '1rem' }} />
                  <span className="d-none d-sm-inline ms-1">Effacer</span>
                </button>
              ) : (
                <button className="btn btn-warning" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, whiteSpace: 'nowrap' }}>
                  <Search style={{ width: '1rem', height: '1rem' }} />
                  <span className="d-none d-sm-inline ms-1">Rechercher</span>
                </button>
              )}
            </div>
              <style>
    {`
      .custom-input:focus {
        outline: none !important;
        box-shadow: none !important;
        border-color: orange !important;
      }
    `}
  </style>

            {/* Dropdown résultats VILLES */}
            {isTownMode && showTownResults && (
              <div className="position-absolute top-100 start-0 end-0 mt-1 bg-white border border-gray-300 rounded shadow-lg" style={{ zIndex: 50, maxHeight: '300px', overflowY: 'auto' }}>
                {townSearchResults.map((town) => (
                  <button
                    key={town.code}
                    onClick={() => {
                      onToggleTown(town.code); // ← toggle ville sélectionnée
                      setShowTownResults(false);
                      onSearch(""); // reset input
                    }}
                    className="w-100 text-start px-3 py-2 border-bottom border-gray-200 bg-white"
                    style={{ border: 'none', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff8e1'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <p className="fw-semibold mb-1 small text-gray-800">{town.nom}</p>
                    <p className="small text-muted mb-0">
                      Code INSEE: {town.code}
                      {town.domTom && " 🌊 DOM-TOM"}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Dropdown résultats DEPT/RÉGION (existant dans la liste) */}
            {!isTownMode && showSearchResults && (
              <div className="position-absolute top-100 start-0 end-0 mt-1 bg-white border border-gray-300 rounded shadow-lg" style={{ zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectResult(result.nom, result.code)}
                      className="w-100 text-start px-3 py-2 border-bottom border-gray-200 bg-white"
                      style={{ border: 'none', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff8e1'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      <p className="fw-semibold mb-1 small text-gray-800">{result.nom}</p>
                      {!isRegionMode && (
                        <p className="small text-muted mb-0">Code: {result.code}</p>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 small text-muted">
                    Aucun résultat trouvé
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bouton liste */}
          <div className="d-flex">
            <button
              onClick={
                isTownMode ? onOpenVilleList :
                isRegionMode ? onOpenRegionList :
                onOpenDeptList
              }
              className="btn btn-warning d-flex gap-2 align-items-center"
              style={{ whiteSpace: 'nowrap' }}
            >
              <ClipboardList style={{ width: '1.25rem', height: '1.25rem' }} />
              Liste des {isTownMode ? 'Villes' : isRegionMode ? 'Régions' : 'Départements'}
            </button>
          </div>
          <div className='d-flex'>
            <Popover
              content={
                <div style={{ width: 220, padding: 4, maxHeight: '300px', overflowY: 'auto'}}>
                  <div style={{ marginBottom: 10 }}>
                    <Text strong style={{ fontSize: 13 }}>Légende des points</Text>
                    <Paragraph style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 0" }}>
                      Densité de clickers par zone géographique.
                    </Paragraph>
                  </div>

                  {[
                    {
                      dot: "#ef4444",
                      label: "Rouge",
                      range: "1 – 200",
                      desc: "Zones à faible activité",
                      percent: 20,
                      bg: "#fff1f2",
                      border: "#fca5a5",
                      badgeBg: "#fee2e2",
                      textColor: "#991b1b",
                      barColor: "#ef4444",
                    },
                    {
                      dot: "#f59e0b",
                      label: "Jaune",
                      range: "201 – 500",
                      desc: "Zones à activité modérée",
                      percent: 55,
                      bg: "#fffbeb",
                      border: "#fde68a",
                      badgeBg: "#fef3c7",
                      textColor: "#92400e",
                      barColor: "#f59e0b",
                    },
                    {
                      dot: "#22c55e",
                      label: "Rouge",
                      range: "> 500",
                      desc: "Zones les plus denses",
                      percent: 100,
                      bg: "#f0fdf4",
                      border: "#86efac",
                      badgeBg: "#dcfce7",
                      textColor: "#166534",
                      barColor: "#22c55e",
                    },
                    {
                      dot: "#d1d5db",
                      label: "Aucun point",
                      range: "0",
                      desc: "Aucun clicker dans ce département",
                      percent: 0,
                      bg: "#f9fafb",
                      border: "#f3f4f6",
                      badgeBg: "#f3f4f6",
                      textColor: "#6b7280",
                      barColor: "#9ca3af",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        marginBottom: 6,
                        background: item.bg,
                        border: `1px solid ${item.border}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, color: item.textColor }}>
                          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: item.dot, marginRight: 5, verticalAlign: "middle" }} />
                          {item.label}
                        </Text>
                        <span style={{ fontSize: 11, fontWeight: 700, background: item.badgeBg, color: item.textColor, padding: "1px 7px", borderRadius: 12 }}>
                          {item.range}
                        </span>
                      </div>
                      <Progress
                        percent={item.percent}
                        showInfo={false}
                        strokeColor={item.barColor}
                        trailColor="#e5e7eb"
                        size="small"
                        style={{ marginBottom: 3 }}
                      />
                      <Text style={{ fontSize: 9, color: "#9ca3af" }}>{item.desc}</Text>
                    </div>
                  ))}
                </div>
              }>
              <button className="btn btn-warning d-flex gap-2 align-items-center">
                <QuestionCircleOutlined style={{fontSize: "22px"}}/>
              </button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}