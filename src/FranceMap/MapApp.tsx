import { useState, useEffect,useMemo } from 'react'
import FranceMap from './components/franceMap'
// import './App.css'
import ListeDepartements from './components/listeDepartements'
import Option from './components/optionGeo'
import { ALL_TOWNS_LIST } from './hooks/townMarkers'
import { Modal } from 'antd'
import { DataClicks } from './components/function/funcClick'

// structure pour stocker nom, code ET nombre de personnes
export type DepartmentData = {
  nom: string;
  code: string;
  personnes: number;
};
function MapApp({data}:any) {
  // État pour gérer l'URL du GeoJSON
  const [geoUrl, setGeoUrl] = useState<string>(
    "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-avec-outre-mer.geojson"
  );
  // Stocker la valeur de data 
const [globalData, setGlobalData] = useState(
  typeof data === 'object' && data !== null && Object.keys(data).length > 0 ? data : null
);
console.log("globalData:", globalData)
console.log("analyse_dep:", globalData?.analyse_dep)

  //Importations des clicks depuis GlobalData
const clickData = useMemo(
  () => globalData ? DataClicks(globalData) : {},
  [globalData]
);
console.log("ClickData: ", clickData)
const analyseDep = useMemo(
  () => globalData?.analyse_dep ?? {},
  [globalData]
);

  // Etat pour le mode HeatMap 
  const  [isHeatMap, setIsHeatMap] = useState(false);
  
useEffect(() => {
  if (typeof data === 'object' && data !== null && Object.keys(data).length > 0) {
    setGlobalData(data);
  }
}, [data,isHeatMap]);
  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ nom: string; code: string }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allGeographies, setAllGeographies] = useState<any[]>([]);
  
  // États pour la sélection (remontés depuis FranceMap) - avec nombre de personnes
  const [multiSelDept, setMultiSelDep] = useState<DepartmentData[]>([]);

  // Nouvelle état pour mettre en valeur le départemment séléctionné dans l'input  
  const [highlightedDept, setHighlightedDept] = useState<string | null>(null);

  // Variable de département vide en mode ville (utilisée dans FranceMap)
  const ClearAllDep:DepartmentData[] = [];

  
  // États pour les modals de liste
  const [showDeptList, setShowDeptList] = useState(false);
  const [showRegionList, setShowRegionList] = useState(false);
  const [selectedTownCodes, setSelectedTownCodes] = useState<string[]>([]);
  const [showVilleList, setShowVilleList] = useState(false);

  // ← NOUVEAU : toggle ville (peut être appelé depuis App ET FranceMap)
  const handleToggleTown = (code: string) => {
    setMultiSelDep([]); // Réinitialiser les départements sélectionnés
    setSelectedTownCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };
  // Fonction pour effacer les villes sélectionnées (utilisée dans FranceMap)
  const handleClearTowns = () => setSelectedTownCodes([]);

// ✅ Après : une seule source de vérité
const [viewMode, setViewMode] = useState<'departement' | 'region' | 'ville'>('departement');

// Variables dérivées pour la compatibilité
const isRegionMode = viewMode === 'region';
const isTownMode = viewMode === 'ville';

  const handleViewChange = (url: string, mode: 'departement' | 'region' | 'ville') => {
    console.log('🔵 handleViewChange appelé avec mode:', mode);
    setGeoUrl(url);
    setViewMode(mode);
    console.log('🔵 viewMode après setState:', viewMode);  // ← Sera encore l'ancienne valeur !
    // Réinitialiser la recherche lors du changement de vue
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };
// En dehors de la fonction
console.log('🟢 App rendu avec viewMode:', viewMode, 'isRegionMode:', isRegionMode);


  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = allGeographies
      .filter(geo => {
        const nom = geo.properties.nom.toLowerCase();
        const code = geo.properties.code?.toLowerCase() || "";
        const searchTerm = query.toLowerCase();
        
        return nom.includes(searchTerm) || code.includes(searchTerm);
      })
      .slice(0, 10) // Limiter à 10 résultats
      .map(geo => ({
        nom: geo.properties.nom,
        code: geo.properties.code || geo.properties.nom
      }));

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Fonction pour sélectionner un résultat de recherche

  const handleSelectSearchResult = (nom: string, code: string) => {
  const identifier = isRegionMode ? nom : code;
  
  setHighlightedDept(identifier);  // ← mettre en valeur ce département
  
  setMultiSelDep(prev => {
    const isAlreadySelected = prev.some(
      dept => (isRegionMode ? dept.nom : dept.code) === identifier
    );
    if (!isAlreadySelected) {
      return [...prev, { nom, code, personnes: 0 }];
    }
    return prev;
  });

  // ← NE PAS vider searchQuery ici, l'utilisateur efface manuellement
  setSearchResults([]);
  setShowSearchResults(false);
};

const handleResetMap = () => {
  setHighlightedDept(null);
  setMultiSelDep([]);
  setSearchQuery("");
  setSearchResults([]);
  setShowSearchResults(false);
};



  // Callback pour recevoir les geographies de FranceMap
  const handleGeographiesLoad = (geographies: any[]) => {
    setAllGeographies(geographies);
  };

const handleOpenDeptList = () => {
  // Passer en mode département si on n'y est pas
  if (isRegionMode) {  // ✅ Si on est en mode région, passer en département
    handleViewChange(
      "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-avec-outre-mer.geojson",
      'departement');
  }

  setShowDeptList(true);
};

const handleOpenRegionList = () => {
  // Passer en mode région si on n'y est pas
  if (!isRegionMode) {  // ✅ Si on n'est pas en mode région, y passer
    handleViewChange(
      "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-avec-outre-mer.geojson",
      'region'
    );
  }

  setShowRegionList(true);
};

  return (
    <>
      <div className='d-flex flex-column' >
        {/* <NavBar/> */}
        <div className=' rounded-3 w-100 pt-2 p-4 mt-2'>
          <div className='d-flex flex-column h-80 gap-0'>
            {/* Div contenant la carte et les option géo */}
            <div className='d-flex flex-column w-100'>
              {/* Passer tous les props à Option */}
              <div>
                <Option 
                  onViewChange={handleViewChange}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                  searchResults={searchResults}
                  showSearchResults={showSearchResults}
                  onSelectResult={handleSelectSearchResult}
                  isRegionMode={isRegionMode}
                  onOpenDeptList={handleOpenDeptList}
                  onOpenRegionList={handleOpenRegionList}
                  isTownMode={isTownMode}
                  onOpenVilleList={() => setShowVilleList(true)}
                  onToggleTown={handleToggleTown}
                  hasSelection={highlightedDept !== null}
                  onClearSelection={handleResetMap}
                />
              </div>

                    {/* div de la carte */}
              <section className='d-flex align-items-center justify-content-center' style={{ overflow: 'visible' }}> 
                {/* Passer tous les props à FranceMap */}
                  <FranceMap
                    clickData = {clickData}
                    analyseDep = {analyseDep}
                    geoUrl={geoUrl}
                    isRegionMode={isRegionMode}
                    onGeographiesLoad={handleGeographiesLoad}
                    multiSelDept={isTownMode?ClearAllDep:multiSelDept}
                    setMultiSelDep={setMultiSelDep}
                    isTownMode={isTownMode}
                    selectedTownCodes={selectedTownCodes} 
                    onToggleTown={handleToggleTown}      
                    onClearTowns={handleClearTowns} 
                    showHeatMap={isHeatMap}
                    showInfoPanel={false}
                    highlightedDept={highlightedDept}
                    onResetMap={handleResetMap}
                  />
              </section>
            </div>


                  {/* Modals pour les listes */}
            {viewMode === 'departement' &&
            <ListeDepartements
              isOpen={showDeptList}
              onClose={() =>{ setShowDeptList(false)}}
              allGeographies={allGeographies}
              multiSelDept={multiSelDept}
              setMultiSelDep={setMultiSelDep}
              isRegionMode={false}
              ClickData={clickData}
            />
            }

            {viewMode === 'region' &&
            <ListeDepartements
              isOpen={showRegionList}
              onClose={() =>{ setShowRegionList(false)}}
              allGeographies={allGeographies}
              multiSelDept={multiSelDept}
              setMultiSelDep={setMultiSelDep}
              isRegionMode={true}
              ClickData={clickData}
            />
            }

            {viewMode === 'ville' && showVilleList && (
              <Modal
                title="Liste des Villes"
                open={showVilleList}
                onCancel={() => setShowVilleList(false)}
                footer={[
                  selectedTownCodes.length > 0 && (
                    <button
                      key="clear"
                      className="btn btn-outline-danger btn-sm me-2"
                      onClick={() => setSelectedTownCodes([])}
                    >
                      Tout désélectionner
                    </button>
                  ),
                  <button
                    key="close"
                    className="btn btn-warning"
                    onClick={() => setShowVilleList(false)}
                  >
                    Fermer
                  </button>
                ]}
                width={500}
              >
                <div className="mb-3">
                  <p className="text-muted small">
                    {ALL_TOWNS_LIST.length} villes disponibles
                    {selectedTownCodes.length > 0 && (
                      <span className="ms-2 text-success fw-bold">
                        · {selectedTownCodes.length} sélectionnée{selectedTownCodes.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {ALL_TOWNS_LIST.map(town => {
                    const isSelected = selectedTownCodes.includes(town.code);
                    return (
                      <button
                        key={town.code}
                        className={`w-100 text-start p-2 border-bottom d-flex justify-content-between align-items-center ${isSelected ? 'bg-success bg-opacity-10 border-start border-success border-4' : ''}`}
                        onClick={() => handleToggleTown(town.code)}  
                        style={{ backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.1)' : 'transparent' }}
                      >
                        <div>
                          <p className="fw-semibold mb-1 small">{town.nom}</p>
                          <p className="text-muted mb-0 small">
                            {town.code}{town.domTom ? " · DOM-TOM" : ""}
                          </p>
                        </div>
                        {isSelected && <span className="text-success fw-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div> 
    </>
  )
}

export default MapApp









