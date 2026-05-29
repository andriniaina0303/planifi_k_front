import { useState, useEffect } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import {type  DepartmentData } from '../MapApp';
import { getColorByPersonCount, getBadgeStyle } from '../utils/colorutils';
import { Modal, Input, Button, Checkbox, Space, Row, Col, Empty } from 'antd';
import { getClicksForDepartment } from './function/funcClick';

interface ListeDepartementsProps {
  isOpen: boolean;
  onClose: () => void;
  allGeographies: any[];
  multiSelDept: DepartmentData[];
  setMultiSelDep: React.Dispatch<React.SetStateAction<DepartmentData[]>>;
  isRegionMode: boolean;
  ClickData : Record<string, number>
}

// Mapping des départements vers leurs régions (même que dans FranceMap)
const DEPARTMENT_TO_REGION: Record<string, string> = {
  // Île-de-France
  "75": "Île-de-France", "77": "Île-de-France", "78": "Île-de-France",
  "91": "Île-de-France", "92": "Île-de-France", "93": "Île-de-France",
  "94": "Île-de-France", "95": "Île-de-France",
  
  // Auvergne-Rhône-Alpes
  "01": "Auvergne-Rhône-Alpes", "03": "Auvergne-Rhône-Alpes", "07": "Auvergne-Rhône-Alpes",
  "15": "Auvergne-Rhône-Alpes", "26": "Auvergne-Rhône-Alpes", "38": "Auvergne-Rhône-Alpes",
  "42": "Auvergne-Rhône-Alpes", "43": "Auvergne-Rhône-Alpes", "63": "Auvergne-Rhône-Alpes",
  "69": "Auvergne-Rhône-Alpes", "73": "Auvergne-Rhône-Alpes", "74": "Auvergne-Rhône-Alpes",
  
  // Bourgogne-Franche-Comté
  "21": "Bourgogne-Franche-Comté", "25": "Bourgogne-Franche-Comté", "39": "Bourgogne-Franche-Comté",
  "58": "Bourgogne-Franche-Comté", "70": "Bourgogne-Franche-Comté", "71": "Bourgogne-Franche-Comté",
  "89": "Bourgogne-Franche-Comté", "90": "Bourgogne-Franche-Comté",
  
  // Bretagne
  "22": "Bretagne", "29": "Bretagne", "35": "Bretagne", "56": "Bretagne",
  
  // Centre-Val de Loire
  "18": "Centre-Val de Loire", "28": "Centre-Val de Loire", "36": "Centre-Val de Loire",
  "37": "Centre-Val de Loire", "41": "Centre-Val de Loire", "45": "Centre-Val de Loire",
  
  // Corse
  "2A": "Corse", "2B": "Corse",
  
  // Grand Est
  "08": "Grand Est", "10": "Grand Est", "51": "Grand Est", "52": "Grand Est",
  "54": "Grand Est", "55": "Grand Est", "57": "Grand Est", "67": "Grand Est",
  "68": "Grand Est", "88": "Grand Est",
  
  // Hauts-de-France
  "02": "Hauts-de-France", "59": "Hauts-de-France", "60": "Hauts-de-France",
  "62": "Hauts-de-France", "80": "Hauts-de-France",
  
  // Normandie
  "14": "Normandie", "27": "Normandie", "50": "Normandie",
  "61": "Normandie", "76": "Normandie",
  
  // Nouvelle-Aquitaine
  "16": "Nouvelle-Aquitaine", "17": "Nouvelle-Aquitaine", "19": "Nouvelle-Aquitaine",
  "23": "Nouvelle-Aquitaine", "24": "Nouvelle-Aquitaine", "33": "Nouvelle-Aquitaine",
  "40": "Nouvelle-Aquitaine", "47": "Nouvelle-Aquitaine", "64": "Nouvelle-Aquitaine",
  "79": "Nouvelle-Aquitaine", "86": "Nouvelle-Aquitaine", "87": "Nouvelle-Aquitaine",
  
  // Occitanie
  "09": "Occitanie", "11": "Occitanie", "12": "Occitanie", "30": "Occitanie",
  "31": "Occitanie", "32": "Occitanie", "34": "Occitanie", "46": "Occitanie",
  "48": "Occitanie", "65": "Occitanie", "66": "Occitanie", "81": "Occitanie", "82": "Occitanie",
  
  // Pays de la Loire
  "44": "Pays de la Loire", "49": "Pays de la Loire", "53": "Pays de la Loire",
  "72": "Pays de la Loire", "85": "Pays de la Loire",
  
  // Provence-Alpes-Côte d'Azur
  "04": "Provence-Alpes-Côte d'Azur", "05": "Provence-Alpes-Côte d'Azur", "06": "Provence-Alpes-Côte d'Azur",
  "13": "Provence-Alpes-Côte d'Azur", "83": "Provence-Alpes-Côte d'Azur", "84": "Provence-Alpes-Côte d'Azur",
  
  // DOM-TOM
  "971": "Guadeloupe", "972": "Martinique", "973": "Guyane",
  "974": "La Réunion", "976": "Mayotte"
};

// Données de clics simulées (les mêmes que dans FranceMap)
// const clickData: Record<string, number> = {
//   "75": 250,  // Paris
//   "92": 300,  // Hauts-de-Seine
//   "93": 150,  // Seine-Saint-Denis
//   "94": 180,  // Val-de-Marne
//   "973": 120, // Guyane
//   "69": 400,  // Rhône
//   "13": 350,  // Bouches-du-Rhône
//   "33": 280,  // Gironde
// };




// const getClicksForRegion = (regionName: string): number => {
//   let totalClicks = 0;
  
//   Object.entries(DEPARTMENT_TO_REGION).forEach(([deptCode, region]) => {
//     if (region === regionName) {
//       totalClicks += getClicksForDepartment(ClickdeptCode);
//     }
//   });
  
//   return totalClicks;
// };

// 🎯 Fonction pour calculer la largeur du modal de manière responsive
const getModalWidth = () => {
  if (typeof window === 'undefined') return 1000;
  const screenWidth = window.innerWidth;
  if (screenWidth < 576) return screenWidth - 32;   // Mobile: full width - 16px padding each side
  if (screenWidth < 768) return screenWidth - 64;   // Tablet: full width - 32px padding each side
  if (screenWidth < 1200) return Math.min(1000, screenWidth - 100); // Small desktop
  return 1000; // Desktop
};

export default function ListeDepartements({
  isOpen,
  onClose,
  allGeographies,
  multiSelDept,
  setMultiSelDep,
  isRegionMode,
  ClickData
}: ListeDepartementsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGeos, setFilteredGeos] = useState(allGeographies);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  // 📱 Listener pour responsive
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGeos(allGeographies);
    } else {
      const filtered = allGeographies.filter(geo => {
        const nom = geo.properties.nom.toLowerCase();
        const code = geo.properties.code?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return nom.includes(search) || code.includes(search);
      });
      setFilteredGeos(filtered);
    }
  }, [searchTerm, allGeographies]);

  const handleCheckboxChange = (nom: string, code: string) => {
    const identifier = isRegionMode ? nom : code;
    const isAlreadySelected = multiSelDept.some(
      dept => (isRegionMode ? dept.nom : dept.code) === identifier
    );

    if (isAlreadySelected) {
      setMultiSelDep(prev => prev.filter(d => 
        (isRegionMode ? d.nom : d.code) !== identifier
      ));
    } else {
      // Récupérer le nombre réel de clics depuis clickData
      const clics = getClicksForDepartment(ClickData,code)
      // isRegionMode 
      //   ? getClicksForRegion(nom)
      //   : getClicksForDepartment(code);
      
      setMultiSelDep(prev => [...prev, { nom, code, personnes: clics }]);
    }
  };


  const isSelected = (nom: string, code: string): DepartmentData | undefined => {
    const identifier = isRegionMode ? nom : code;
    return multiSelDept.find(
      dept => (isRegionMode ? dept.nom : dept.code) === identifier
    );
  };

  const selectAll = () => {
    const allItems: DepartmentData[] = filteredGeos.map(geo => {
      const nom = geo.properties.nom;
      const code = geo.properties.code || geo.properties.nom;
      const clics = getClicksForDepartment(ClickData,code)
      // isRegionMode 
      //   ? getClicksForRegion(nom)
      //   : getClicksForDepartment(code);
      
      return {
        nom,
        code,
        personnes: clics
      };
    });
    setMultiSelDep(allItems);
  };

  const deselectAll = () => {
    setMultiSelDep([]);
  };

  if (!isOpen) return null;

  // Calculer le total réel des clics
  const totalPersonnes = multiSelDept.reduce((sum, dept) => {
    const clics = getClicksForDepartment(ClickData,dept.code)
    // isRegionMode 
      // ? getClicksForRegion(dept.nom)
      // : getClicksForDepartment(dept.code);
    return sum + clics;
  }, 0);


  // Fonction pour réinitialiser le input de recherche, la séléction multiple et fermer le screen
  const closeScreen = (close=()=>{})=>{
    setSearchTerm("");
    close()
  }

  return (
    <Modal
      title={
        <div className="d-flex align-items-center gap-2">
          <MapPin style={{ width: '1.5rem', height: '1.5rem' }} />
          <span>Liste des {isRegionMode ? 'Régions' : 'Départements'}</span>
        </div>
      }
      open={isOpen}
      onCancel={() => closeScreen(onClose)}
      width={getModalWidth()}
      style={{ 
        maxHeight: 'calc(100vh - 200px)'
      }}
      bodyStyle={{
        maxHeight: 'calc(100vh - 320px)',
        overflowY: 'auto',
        padding: screenWidth < 576 ? '12px' : '16px'
      }}
      headerStyle={{
        padding: screenWidth < 576 ? '12px' : '16px'
      }}
      footer={[
        <Button key="close" type="primary" onClick={() => closeScreen(onClose)}>
          Fermer
        </Button>
      ]}
      wrapClassName="liste-departements-modal"
    >
      {/* Info sélection */}
      <div className="mb-4">
        <p className="text-muted mb-1 small">
          <span className="fw-bold" style={{ color: '#FAC900' }}>{multiSelDept.length}</span> sélectionné{multiSelDept.length > 1 ? 's' : ''} sur {allGeographies.length}
          {totalPersonnes > 0 && ` • ${totalPersonnes} clics au total`}
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-3">
        <Space size="middle" style={{ width: '100%' }}>
          <Input
            placeholder={`Rechercher ${isRegionMode ? 'une région' : 'un département'}...`}
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              fontSize: screenWidth < 576 ? '14px' : '16px'
            }}
            size={screenWidth < 576 ? 'small' : 'middle'}
          />
        </Space>
      </div>

      {/* Selection buttons */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        <Button 
          size="small" 
          onClick={selectAll}
          style={{ fontSize: screenWidth < 576 ? '12px' : '14px' }}
        >
          Tout sélectionner
        </Button>
        <Button 
          danger 
          size="small" 
          onClick={deselectAll}
          style={{ fontSize: screenWidth < 576 ? '12px' : '14px' }}
        >
          Tout désélectionner
        </Button>
      </div>

      {/* Grid of departments/regions */}
      <div>
        <Row gutter={[8, 8]}>
          {filteredGeos.length > 0 ? (
            filteredGeos.map((geo, index) => {
              const nom = geo.properties.nom;
              const code = geo.properties.code || geo.properties.nom;
              const selected = isSelected(nom, code);
              
              // Obtenir les clics réels depuis clickData
              const clicsReels = getClicksForDepartment(ClickData,code)
              // isRegionMode 
              //   ? getClicksForRegion(nom)
              //   : getClicksForDepartment(code);

              // Responsive grid: mobile=24, tablet=12, desktop=8, xl=6
              const colSpan = screenWidth < 576 
                ? { xs: 24 } 
                : screenWidth < 768 
                ? { xs: 24, sm: 12 } 
                : { xs: 24, sm: 12, md: 8, lg: 6 };

              return (
                <Col key={index} {...colSpan}>
                  <div
                    className={`d-flex align-items-center gap-2 p-3 border rounded-2 ${
                      selected
                        ? 'bg-success bg-opacity-10 border-success'
                        : 'bg-white border-light'
                    }`}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderWidth: selected ? '2px' : '1px',
                      backgroundColor: selected ? 'rgba(0, 200, 83, 0.1)' : '#fff',
                      padding: screenWidth < 576 ? '8px 12px' : '12px'
                    }}
                    onMouseOver={(e) => {
                      if (!selected) e.currentTarget.style.backgroundColor = '#fff8e1';
                    }}
                    onMouseOut={(e) => {
                      if (!selected) e.currentTarget.style.backgroundColor = '#fff';
                    }}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={selected ? true : false}
                      onChange={() => handleCheckboxChange(nom, code)}
                    />

                    {/* Nom et code */}
                    <div style={{ flex: '1 1 auto' }}>
                      {isRegionMode ? (
                        <p className="fw-semibold mb-0 small" style={{ fontSize: screenWidth < 576 ? '12px' : '14px' }}>
                          {nom}
                        </p>
                      ) : (
                        <>
                          <p 
                            className="fw-semibold mb-1 small" 
                            style={{ fontSize: screenWidth < 576 ? '12px' : '14px' }}
                          >
                            {nom}
                          </p>
                          <p 
                            className="text-muted mb-0 small" 
                            style={{ fontSize: screenWidth < 576 ? '10px' : '12px' }}
                          >
                            Code: {code}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Affichage du nombre de clics (lecture seule) */}
                    {selected && clicsReels > 0 && (
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: getColorByPersonCount(clicsReels),
                            display: screenWidth < 576 ? 'none' : 'block' // Hide on mobile
                          }}
                        ></div>
                        <span 
                          className={`small px-2 py-1 rounded ${getBadgeStyle(clicsReels)}`}
                          style={{ fontSize: screenWidth < 576 ? '10px' : '12px' }}
                        >
                          {clicsReels}
                        </span>
                      </div>
                    )}
                    
                    {/* Message si aucun clic */}
                    {selected && clicsReels === 0 && (
                      <span 
                        className="small text-muted italic"
                        style={{ fontSize: screenWidth < 576 ? '10px' : '12px' }}
                      >
                        Aucun clic
                      </span>
                    )}
                  </div>
                </Col>
              );
            })
          ) : (
            <Col xs={24}>
              <Empty description="Aucun résultat trouvé" />
            </Col>
          )}
        </Row>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" style={{
        flexWrap: screenWidth < 576 ? 'wrap' : 'nowrap',
        gap: '12px'
      }}>
        <div>
          <p className="small text-muted mb-1">
            <span className="fw-bold" style={{ color: '#FAC900' }}>{multiSelDept.length}</span> élément{multiSelDept.length > 1 ? 's' : ''} sélectionné{multiSelDept.length > 1 ? 's' : ''}
          </p>
          {totalPersonnes > 0 && (
            <p className="small text-muted mb-0">
              Total : <span className="fw-bold">{totalPersonnes}</span> clics
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}


//  Departement par région 

export const departementToRegion: Record<string, string> = {
      "01": "Auvergne-Rhône-Alpes",
      "03": "Auvergne-Rhône-Alpes",
      "07": "Auvergne-Rhône-Alpes",
      "15": "Auvergne-Rhône-Alpes",
      "26": "Auvergne-Rhône-Alpes",
      "38": "Auvergne-Rhône-Alpes",
      "42": "Auvergne-Rhône-Alpes",
      "43": "Auvergne-Rhône-Alpes",
      "63": "Auvergne-Rhône-Alpes",
      "69": "Auvergne-Rhône-Alpes",
      "73": "Auvergne-Rhône-Alpes",
      "74": "Auvergne-Rhône-Alpes",

      "21": "Bourgogne-Franche-Comté",
      "25": "Bourgogne-Franche-Comté",
      "39": "Bourgogne-Franche-Comté",
      "58": "Bourgogne-Franche-Comté",
      "70": "Bourgogne-Franche-Comté",
      "71": "Bourgogne-Franche-Comté",
      "89": "Bourgogne-Franche-Comté",
      "90": "Bourgogne-Franche-Comté",

      "22": "Bretagne",
      "29": "Bretagne",
      "35": "Bretagne",
      "56": "Bretagne",

      "18": "Centre-Val de Loire",
      "28": "Centre-Val de Loire",
      "36": "Centre-Val de Loire",
      "37": "Centre-Val de Loire",
      "41": "Centre-Val de Loire",
      "45": "Centre-Val de Loire",

      "2A": "Corse",
      "2B": "Corse",

      "08": "Grand Est",
      "10": "Grand Est",
      "51": "Grand Est",
      "52": "Grand Est",
      "54": "Grand Est",
      "55": "Grand Est",
      "57": "Grand Est",
      "67": "Grand Est",
      "68": "Grand Est",
      "88": "Grand Est",

      "02": "Hauts-de-France",
      "59": "Hauts-de-France",
      "60": "Hauts-de-France",
      "62": "Hauts-de-France",
      "80": "Hauts-de-France",

      "75": "Île-de-France",
      "77": "Île-de-France",
      "78": "Île-de-France",
      "91": "Île-de-France",
      "92": "Île-de-France",
      "93": "Île-de-France",
      "94": "Île-de-France",
      "95": "Île-de-France",

      "14": "Normandie",
      "27": "Normandie",
      "50": "Normandie",
      "61": "Normandie",
      "76": "Normandie",

      "16": "Nouvelle-Aquitaine",
      "17": "Nouvelle-Aquitaine",
      "19": "Nouvelle-Aquitaine",
      "23": "Nouvelle-Aquitaine",
      "24": "Nouvelle-Aquitaine",
      "33": "Nouvelle-Aquitaine",
      "40": "Nouvelle-Aquitaine",
      "47": "Nouvelle-Aquitaine",
      "64": "Nouvelle-Aquitaine",
      "79": "Nouvelle-Aquitaine",
      "86": "Nouvelle-Aquitaine",
      "87": "Nouvelle-Aquitaine",

      "09": "Occitanie",
      "11": "Occitanie",
      "12": "Occitanie",
      "30": "Occitanie",
      "31": "Occitanie",
      "32": "Occitanie",
      "34": "Occitanie",
      "46": "Occitanie",
      "48": "Occitanie",
      "65": "Occitanie",
      "66": "Occitanie",
      "81": "Occitanie",
      "82": "Occitanie",

      "44": "Pays de la Loire",
      "49": "Pays de la Loire",
      "53": "Pays de la Loire",
      "72": "Pays de la Loire",
      "85": "Pays de la Loire",

      "04": "Provence-Alpes-Côte d'Azur",
      "05": "Provence-Alpes-Côte d'Azur",
      "06": "Provence-Alpes-Côte d'Azur",
      "13": "Provence-Alpes-Côte d'Azur",
      "83": "Provence-Alpes-Côte d'Azur",
      "84": "Provence-Alpes-Côte d'Azur",

      // Guadeloupe
      "971": "Guadeloupe",
      
      // Martinique
      "972": "Martinique",
      
      // Guyane
      "973": "Guyane",
      
      // La Réunion
      "974": "La Réunion",
      
      // Mayotte
      "976": "Mayotte",
}