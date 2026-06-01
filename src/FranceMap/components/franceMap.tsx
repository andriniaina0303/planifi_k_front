import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { X, CirclePlus, CircleMinus, RotateCcw, Crosshair, Thermometer } from 'lucide-react';
import { getRandomPointInPolygon,adjustPointIfNearEdge } from "./function/points";
import { type DepartmentData } from "../MapApp";
import { getColorByPersonCount } from '../utils/colorutils';
import loadTemperatures from "../hooks/useTemperateAPI";
import DonutsGraph from "./donutsGraph";
import { getDepartmentName } from "../hooks/liste";
import Loading from "./Loading";
import { useLoading } from "../hooks/useLoading";
import { TOWN_MARKERS, getTownMarkersForRegion, getClicksForTown } from "../hooks/townMarkers";import {TownMarkers,TownMetroMarkers} from "./function/label_DOM";
import { getTemperatureColor, calculateRegionTemperature, getTemperatureRange, generateLegendGradient } from "./function/funcTemp";
import { getClicksForDepartment, getClicksByRegion, getLabelsByRegion, DEPARTMENT_TO_REGION, regions } from "./function/funcClick";

interface FranceMapProps {
  clickData: Record<string, number>;
  analyseDep: Record<string, any>;
  geoUrl: string;
  isRegionMode: boolean;
  isTownMode: boolean;
  onGeographiesLoad?: (geographies: any[]) => void;
  multiSelDept: DepartmentData[];  
  setMultiSelDep: React.Dispatch<React.SetStateAction<DepartmentData[]>>; 
  selectedTownCodes: string[];           // ← Les villes séléctionnées (reçu depuis App)
  onToggleTown: (code: string) => void; 
  onClearTowns: () => void;  // ← Effacer les villes sélectionnées (reçu depuis App)
  showHeatMap?: boolean ; // ← pour activer ou désactiver la heatmap de température
  showInfoPanel?: boolean;
}

type ZoomPosition = {
  coordinates: [number, number],
  zoom: number
}

const TotalNLEnvoyer = 100000; // Valeur totale pour le graphique (exemple, à ajuster selon les données réelles)

const FranceMap: React.FC<FranceMapProps> = ({
  clickData,
  analyseDep,
  geoUrl,
  isRegionMode,
  onGeographiesLoad,
  isTownMode,
  multiSelDept,     
  setMultiSelDep,
  selectedTownCodes,
  onToggleTown,
  onClearTowns,
  showHeatMap=false,
  showInfoPanel = true
}) => {

// Fonction pour parcourir clickData et retourner le nbr de clicks et les cles pour chaque dep
const Tclicks: number[] = Object.values(clickData);
const Tcodes: string[] = Object.keys(clickData);

// Variable pour stocker les clicks par région
const regionClicks = React.useMemo<Record<string, number>>(() => {
  const result: Record<string, number> = {};
  const regions = new Set(Object.values(DEPARTMENT_TO_REGION));
  
  // regions.forEach((regionName) => {
  //   result[regionName] = getClicksForRegion(regionName);
  // });
  
  return result;
}, []);

// Variable pour stocker les données de température par département
const [temperatures, setTemperatures] = useState<Record<string, number>>({});
const [tempError, setTempError] = useState<string | null>(null);
const [tempLoading, setTempLoading] = useState<boolean>(true);
    const [minTemp, setMinTemp] = useState<number>(-10);
    const [maxTemp, setMaxTemp] = useState<number>(40);
    const [hoveredTemp, setHoveredTemp] = useState<number | undefined>(undefined);
    
    // Variable pour afficher le nom du departement/région sélectionné
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [codeHovered, setCodeHovered] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Variables pour voir la position de la souris 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Fonction pour le zoom de la carte 
  const [position, setPosition] = useState<ZoomPosition>({
    coordinates: [2.8, 43.8],
    zoom: 1
  });
  
  // Variable pour les limites des déplacement de la france metropolitain 
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [extent, setExtent] = useState<[[number, number], [number, number]]>();
  
  // État pour stocker les points générés par département et région
  const [departmentPoints, setDepartmentPoints] = useState<Record<string, [number, number]>>({});
  const [regionPoints, setRegionPoints] = useState<Record<string, [number, number]>>({});
  
  
  // Passer en props les globale data
  
  
  // Mémoïser les données du graphique pour  les régions et les villes afin d'éviter les recalculs inutiles lors du rendu de la carte
  const donutData = React.useMemo(() => {
    if (isTownMode) {
      // Toutes les villes qui ont des clics (pas seulement les sélectionnées)
      return TOWN_MARKERS
      .map(town => getClicksForTown(town.code))
      .filter(clics => clics > 0);
    }
    if (isRegionMode) return getClicksByRegion(regionClicks);
    return Tclicks;
  }, [isTownMode, isRegionMode, regionClicks]);
  
  const donutLabels = React.useMemo(() => {
    if (isTownMode) {
      return TOWN_MARKERS
      .filter(town => getClicksForTown(town.code) > 0)
      .map(town => town.nom);
    }
    if (isRegionMode) return getLabelsByRegion(regionClicks);
    return Tcodes.map(code => getDepartmentName(code));
  }, [isTownMode, isRegionMode, regionClicks]);
  
  //  Variable pour les NL ouvert(clicker) et les NL restants
  const totalNLOuvert = React.useMemo(() => {
  if (isTownMode) {
    // Total de tous les clics de toutes les villes
    return TOWN_MARKERS.reduce((sum, town) => sum + getClicksForTown(town.code), 0);
  }
  if (isRegionMode) {
    // Total de tous les clics de toutes les régions
    return Object.values(regionClicks).reduce((sum, val) => sum + val, 0);
  }
  // Total de tous les clics de tous les départements
  return Object.values(clickData).reduce((sum, val) => sum + val, 0);
}, [isTownMode, isRegionMode, regionClicks]);


    // Synchroniser multiSelDept avec clickData
  useEffect(() => {
    if (multiSelDept.length > 0) {
      const updatedDepts = multiSelDept.map(dept => {
        const clics = getClicksForDepartment(clickData,dept.code);
        // isRegionMode 
        //   ? getClicksForRegion(dept.nom)
        //   : getClicksForDepartment(dept.code);
        
        return {
          ...dept,
          personnes: clics
        };
      });
      
      const hasChanged = updatedDepts.some((dept, index) => 
        dept.personnes !== multiSelDept[index].personnes
      );
      
      if (hasChanged) {
        setMultiSelDep(updatedDepts);
      }
    }
  }, [isRegionMode]);

  // Hook pour gérer le chargement
    const {
    isLoading,
    message: loadingMessage,
    progress: loadingProgress,
    startLoading,
    stopLoading,
    updateMessage,
    updateProgress
  } = useLoading("Chargement de la carte...");

//  useEffect pour charger les données quand geoUrl ou isRegionMode change

useEffect(() => {

  
  let isMounted = true;
  
  const loadAllData = async () => {
    try {
      console.log("🚀 Chargement des données pour:", geoUrl);
      console.log("📍 Mode actuel:", isRegionMode ? "Région" : "Département");
      
      startLoading("Initialisation...");
      
      // 1. Charger la carte
      updateMessage("Chargement de la carte...");
      updateProgress(20);
      
      const response = await fetch(geoUrl);
      if (!response.ok) throw new Error('Erreur réseau carte');
      const data = await response.json();
      
      if (!isMounted) return;
      
      if (onGeographiesLoad && data.features) {
        onGeographiesLoad(data.features);
      }
      
      updateProgress(40);
      // Si showHeatMap est false, on ne charge pas les températures et on affiche directement la carte
      if (!showHeatMap) {
        updateProgress(100);
        stopLoading(); // ← libérer le loading avant de sortir
        return;
      }
      
      // 2. Charger les températures UNE SEULE FOIS
      updateMessage("Récupération des températures...");
      
      const temps = await loadTemperatures((progress, message) => {
        if (isMounted) {
          updateProgress(40 + (progress * 0.6));
          updateMessage(message);
        }
      });
      
      if (!isMounted) return;
      
      setTemperatures(temps);
      const range = getTemperatureRange(temps);
      setMinTemp(range.min);
      setMaxTemp(range.max);
      setTempLoading(false);
      
      updateProgress(100);
      console.log("✅ Chargement terminé avec succès");
      console.log("Mode activer :", isRegionMode ? "Région" : "Département");
      stopLoading();
      
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      if (isMounted) {
        setTempError(`Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`);
        setTempLoading(false);
        stopLoading();
      }
    }
  };

  loadAllData();

  return () => {
    isMounted = false;
  };
}, [geoUrl, isRegionMode]); //  Recharger quand geoUrl ou isRegionMode change


    // Fonction pour obtenir la température d'un département ou région
  const getTemperature = (code: string, nom: string): number | undefined => {
    if (isRegionMode) {
      return calculateRegionTemperature(nom, DEPARTMENT_TO_REGION, temperatures);
    } else {
      return temperatures[code];
    }
  };

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    console.log(position.zoom);
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  const renderMap = (terre: typeof regions[0], index: number) => (
    <div key={terre.name} className={`relative ${index === 0 ? "w-125 h-150" : ""}`}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: terre.scale, center: terre.center }}
        width={terre.width}
        height={terre.height}
      >
        {index === 0 ? (
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates as [number, number]}
            maxZoom={4}
            minZoom={1}
            translateExtent={extent}
            onMoveEnd={({ coordinates, zoom }) => {
              setPosition({ coordinates, zoom });
            }}
          >

            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHovered = hoveredDept === geo.properties.nom;
                  let shouldShowPoint = false;
                  let point: [number, number] | null = null;
                  let clicsCount = 0;

                  if (isRegionMode) {
                    const regionName = geo.properties.nom;
                    clicsCount =regionClicks[regionName] || 0;
                    shouldShowPoint = clicsCount > 0;

                    if (shouldShowPoint) {
                      if (!regionPoints[regionName]) {
                        point = getRandomPointInPolygon(geo);
                        const newPoint = adjustPointIfNearEdge(point, geo);
                        if (newPoint) {
                          setRegionPoints(prev => ({
                            ...prev,
                            [regionName]: newPoint
                          }));
                        }
                      } else {
                        point = regionPoints[regionName];
                      }
                    }
                  } else {
                    const deptCode = geo.properties.code;
                    clicsCount = getClicksForDepartment(clickData,deptCode);
                    shouldShowPoint = clicsCount > 0;

                    if (shouldShowPoint) {
                      if (!departmentPoints[deptCode]) {
                        point = getRandomPointInPolygon(geo);
                        const newPoint = adjustPointIfNearEdge(point, geo);
                        if (newPoint) {
                          setDepartmentPoints(prev => ({
                            ...prev,
                            [deptCode]: newPoint
                          }));
                        }
                      } else {
                        point = departmentPoints[deptCode];
                      }
                    }
                  }

                  if (!terre.filter(geo.properties.code)) {
                    return null;
                  }

                  //  mode multi-sélection
                  const isSelected = multiSelDept.some(dept => 
                    (isRegionMode ? dept.nom : dept.code) === 
                    (isRegionMode ? geo.properties.nom : geo.properties.code)
                  );

                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        onMouseEnter={(event) => {
                          setHoveredDept(geo.properties.nom);
                          setCodeHovered(geo.properties.code);
                          setHoveredTemp(getTemperature(geo.properties.code, geo.properties.nom));
                          const rect = event.currentTarget.getBoundingClientRect();
                          setMousePos({
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredDept(null);
                          setCodeHovered(null);
                          setHoveredTemp(undefined);
                        }}
                        style={{
                          default: {
                            fill: isSelected ? "#008000" : isHovered ? "#FFF0BC" : showHeatMap ? getTemperatureColor(getTemperature(geo.properties.code, geo.properties.nom), minTemp, maxTemp) : "#e1e1ef",
                            stroke: "#C1BFB1",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: isSelected ? "#008000" : "#FFF0BC",
                            stroke: "#C1BFB1",
                            strokeWidth: 0.7,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#FFD700",
                            stroke: "#C1BFB1",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                        }}
                        onClick={() => {
                          if (isTownMode) return; // ← bloque le clic en mode ville
                          const identifier = isRegionMode ? geo.properties.nom : geo.properties.code;
                          
                          //  toggle
                          const isAlreadySelected = multiSelDept.some(
                            dept => (isRegionMode ? dept.nom : dept.code) === identifier
                          );

                          if (isAlreadySelected) {
                            setMultiSelDep(prev => prev.filter(d => 
                              (isRegionMode ? d.nom : d.code) !== identifier
                            ));
                          } else {
                            const clics = 
                            getClicksForDepartment(clickData,geo.properties.code);
                            //Modifier ici ========???????
                            // isRegionMode 
                            //   ? getClicksForRegion(geo.properties.nom)
                            setMultiSelDep(prev => [...prev, {
                              nom: geo.properties.nom,
                              code: geo.properties.code || geo.properties.nom,
                              personnes: clics
                            }]);
                          }
                        }}
                        className={`${isTownMode ? "cursor-pointer " : "cursor-default"}`}
                      />
                      {point && shouldShowPoint && !isTownMode && (
                        <Marker coordinates={point as [number, number]}>
                          <circle 
                            r={isRegionMode ? 4 : 1} 
                            fill={getColorByPersonCount(clicsCount)} 
                            className="shadow-amber-300/50 z-50"
                          />
                        </Marker>
                      )}
                    </g>
                  );
                })
              }
            </Geographies>
            {/* ── AJOUT MODE VILLE : marqueurs sur la France métropolitaine ── */}
            {isTownMode &&
              <TownMetroMarkers
                towns={TOWN_MARKERS.filter(town => !town.domTom)}
                selectedTowns={selectedTownCodes}
                onToggleTown={onToggleTown}
              />
            }
          </ZoomableGroup>
        ) : (
          // Fragment englobant : Geographies + Markers DOM-TOM DANS ComposableMap
          <>
          
          <Geographies geography={geoUrl} >
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHovered = hoveredDept === geo.properties.nom;
                let shouldShowPoint = false;
                let point: [number, number] | null = null;
                let clicsCount = 0;

                if (isRegionMode) {
                  const regionName = geo.properties.nom;
                  clicsCount = regionClicks[regionName] || 0;
                  shouldShowPoint = clicsCount > 0;

                  if (shouldShowPoint) {
                    if (!regionPoints[regionName]) {
                      point = getRandomPointInPolygon(geo);
                      const newPoint = adjustPointIfNearEdge(point, geo);
                      if (newPoint) {
                        setRegionPoints(prev => ({
                          ...prev,
                          [regionName]: newPoint
                        }));
                      }
                    } else {
                      point = regionPoints[regionName];
                    }
                  }
                } else {
                  const deptCode = geo.properties.code;
                  clicsCount = getClicksForDepartment(clickData,deptCode);
                  shouldShowPoint = clicsCount > 0;

                  if (shouldShowPoint) {
                    if (!departmentPoints[deptCode]) {
                      point = getRandomPointInPolygon(geo);
                      const newPoint = adjustPointIfNearEdge(point, geo);
                      if (newPoint) {
                        setDepartmentPoints(prev => ({
                          ...prev,
                          [deptCode]: newPoint
                        }));
                      }
                    } else {
                      point = departmentPoints[deptCode];
                    }
                  }
                }

                if (!terre.filter(geo.properties.code)) {
                  return null;
                }

                //  mode multi-sélection
                const isSelected = multiSelDept.some(dept => 
                  (isRegionMode ? dept.nom : dept.code) === 
                  (isRegionMode ? geo.properties.nom : geo.properties.code)
                );

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onMouseEnter={(event) => {
                        setHoveredDept(geo.properties.nom);
                        setCodeHovered(geo.properties.code);
                        setHoveredTemp(getTemperature(geo.properties.code, geo.properties.nom));
                        const rect = event.currentTarget.getBoundingClientRect();
                        setMousePos({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredDept(null);
                        setCodeHovered(null);
                        setHoveredTemp(undefined);
                      }}
                      style={{
                        default: {
                          fill: isSelected ? "#008000" : isHovered ? "#FFF0BC" : showHeatMap ? getTemperatureColor(getTemperature(geo.properties.code, geo.properties.nom), minTemp, maxTemp) : "#e1e1ef",
                          stroke: "#C1BFB1",
                          strokeWidth: 0.3,
                          outline: "none",
                        },
                        hover: {
                          fill: isSelected ? "#008000" : "#FFF0BC",
                          stroke: "#C1BFB1",
                          strokeWidth: 0.3,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#FFD700",
                          stroke: "#C1BFB1",
                          strokeWidth: 0.3,
                          outline: "none",
                        },
                      }}
                      onClick={() => {
                        if (isTownMode) return; // ← bloque le clic en mode ville
                        const identifier = isRegionMode ? geo.properties.nom : geo.properties.code;
                        
                        // toggle
                        const isAlreadySelected = multiSelDept.some(
                          dept => (isRegionMode ? dept.nom : dept.code) === identifier
                        );

                        if (isAlreadySelected) {
                          setMultiSelDep(prev => prev.filter(d => 
                            (isRegionMode ? d.nom : d.code) !== identifier
                          ));
                        } else {
                          const clics = getClicksForDepartment(clickData,geo.properties.code);
                          // isRegionMode 
                          //   ? getClicksForRegion(geo.properties.nom)
                          //   : getClicksForDepartment(geo.properties.code);
                          
                          setMultiSelDep(prev => [...prev, {
                            nom: geo.properties.nom,
                            code: geo.properties.code || geo.properties.nom,
                            personnes: clics
                          }]);
                        }
                      }}
                      className={`flex gap-8 ${isTownMode ? "cursor-default" : "cursor-pointer"}`}
                    />
                    {point && shouldShowPoint  && !isTownMode && (
                      <Marker coordinates={point as [number, number]}>
                        <circle 
                          r={isRegionMode ? 1 : 0.5} 
                          fill={getColorByPersonCount(clicsCount)} 
                          className="shadow-glow"
                        />
                      </Marker>
                    )}
                  </g>
                );
              })
            }
          </Geographies>

          {/* ── MODE VILLE : marqueurs DOM-TOM ── */}
            {isTownMode &&(<TownMarkers
            towns={getTownMarkersForRegion(
              terre.name === "Guadeloupe" ? "971" :
              terre.name === "Martinique" ? "972" :
              terre.name === "Guyane"     ? "973" :
              terre.name === "La Réunion" ? "974" :
              terre.name === "Mayotte"    ? "976" : ""
            )}
            selectedTowns={selectedTownCodes}
            onToggleTown={onToggleTown}
          />)}
          </>
        )}
      </ComposableMap>

      {index === 0 && !dataLoaded && setTimeout(() => setDataLoaded(true), 100)}   

      {/* Div pour la légende des temperartures */}
      {index === 0 && showHeatMap && (
        <div className={`hidden xl:block fixed top-30 right-100  bg-white/95 p-4 rounded-lg shadow-lg  min-w-40 ${onscroll?'opacity-0':'opacity-100'} ease-in-out transition-opacity duration-3000`}>
          <div className="d-flex items-center gap-2 mb-3">
            <Thermometer className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-800">Température (°C)</h3>
          </div>

          {tempError ? (
            <p className="text-xs text-red-500">{tempError}</p>
          ) : tempLoading ? (
            <div className="flex flex-col gap-2">
              <div className="animate-pulse h-24 bg-gray-200 rounded"></div>
              <p className="text-xs text-gray-500 text-center">Chargement...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-row-reverse mb-2">
                <div
                  className="w-full h-32 rounded border border-gray-300"
                  style={{ background: generateLegendGradient(minTemp, maxTemp) }}
                >
                </div>
                <div className=" right-full mr-2 h-full flex flex-col gap-10 text-xs font-semibold text-gray-700">
                  <span>{maxTemp}°</span>
                  <span>{Math.round((maxTemp + minTemp) / 2)}°</span>
                  <span>{minTemp}°</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Écart:</span>
                  <span className="font-semibold">{maxTemp - minTemp}°C</span>
                </div>
              </div>
            </>
          )}
        </div>
    )}   
    {/* {index === 0 && (
      <div className={`hidden xl:block fixed top-55 right-150 bg-white/95 p-4 rounded-lg shadow-lg`}
          style={{ width: '200px', height: '200px' }}>
        <DonutsGraph 
          data={donutData}
          labels={donutLabels}
          totalNL={TotalNLEnvoyer} // ← total de NL envoyés
          totalNLOuvert={totalNLOuvert}
          isRegionMode={isRegionMode}
          isTownMode={isTownMode} 
        />
      </div>
    )} */}
  </div>
  );

  return (
    <>

      {isLoading && (
        <Loading
          message={loadingMessage}
          progress={loadingProgress}
          size="large"
          fullScreen={true}
        />
      )}
      <div className="position-relative d-flex justify-content-start align-items-start w-100 mx-auto">
        
        <div className="position-relative w-100 mt-4">
          {/* CARTE PRINCIPALE */}
          <div 
          className="position-absolute d-flex flex-column gap-2  rounded-4 shadow"
          style={{
            zIndex: 999,
            top : "20%",
            right: "30%"
            // background: "white"
          }}
        >
          <CirclePlus
            className="cursor-pointer rounded-circle p-1"
            onClick={handleZoomIn}
          />
          <CircleMinus
            className="cursor-pointer rounded-circle p-1"
            onClick={handleZoomOut}
          />
          <RotateCcw
            className="cursor-pointer rounded-circle p-1"
            onClick={() => setPosition({ coordinates: [2.8, 43.8], zoom: 1 })}
          />
        </div>
          <div
            ref={mapRef}
            className="position-relative mx-auto"
            style={{ width: "70%" }}
          >
            {renderMap(regions[0], 0)}
          </div>

          {/* GUADELOUPE */}
          <div
            className="position-absolute"
            style={{
              top: "1%",
              left: "5%",
              width: "180px"
            }}
          >
            {renderMap(regions[1], 1)}
          </div>

          {/* MARTINIQUE */}
          <div
            className="position-absolute"
            style={{
              top: "20%",
              left: "5%",
              width: "180px"
            }}
          >
            {renderMap(regions[2], 2)}
          </div>

          {/* GUYANE */}
          <div
            className="position-absolute"
            style={{
              top: "35%",
              left: "10%",
              width: "220px"
            }}
          >
            {renderMap(regions[3], 3)}
          </div>

          {/* RÉUNION */}
          <div
            className="position-absolute"
            style={{
              top: "15%",
              right: "10%",
              width: "180px"
            }}
          >
            {renderMap(regions[4], 4)}
          </div>

          {/* MAYOTTE */}
          <div
            className="position-absolute"
            style={{
              top: "35%",
              right: "10%",
              width: "160px"
            }}
          >
            {renderMap(regions[5], 5)}
          </div>
        </div>

        {/* TOOLTIP */}
        {hoveredDept && createPortal(
          <div
            className="
              position-fixed z-3
              bg-white text-dark
              px-3 py-1
              rounded shadow
              small fw-medium
              text-nowrap
            "
            style={{
              left: mousePos.x,
              top: mousePos.y,
              transform: "translate(-50%, -180%)",
              pointerEvents: "none"
            }}
          >
            <div className="fw-bold">
              {codeHovered} - {hoveredDept}
            </div>
            {codeHovered && clickData[codeHovered] !== undefined && (
                <div className="small mt-1 d-flex flex-column gap-1">
                  <span>🖱️ Clickers : {analyseDep[codeHovered].taux_clickers}</span>
                  <span>📬 Openers : {analyseDep[codeHovered].taux_openers}</span>
                  <span>🚫 Unsubs : {analyseDep[codeHovered].taux_unsubs}</span>
                </div>
            )}
            {hoveredTemp !== undefined && !tempLoading && (
              <div className="small mt-1 d-flex align-items-center gap-1">
                {hoveredTemp ? (
                  <>🌡️ {hoveredTemp.toFixed(1)}°C</>
                ) : (
                  <span className="text-muted">Aucune température disponible</span>
                )}
              </div>
            )}
          </div>,
          document.body
        )}
      </div>      
      {/* ← Div Droite : affiche seulement si des sélections existent */}
      {(isTownMode ? selectedTownCodes.length > 0 : multiSelDept.length > 0) &&   showInfoPanel && (
        <div className="bg-fondBlanc shadow-lg rounded-5 flex-shrink-0 position-fixed overflow-y-auto" 
          style={{
            bottom: 0,
            left: 0,
            right: 8,
            top: 'auto',
            zIndex: 50,
            width: '280px',
            height: '50%',
            maxHeight: '100vh',
            transition: 'all 0.3s ease'
          }}>
          {/* Header fixe */}
          <div className="p-2 p-md-3 border-bottom border-warning">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="fs-6 fw-bold text-jaune d-flex align-items-center gap-2">
                <Crosshair className="w-5 h-5" />{isTownMode ? "Villes" : isRegionMode ? "Régions" : "Départements"} sélectionnés
              </h2>
              <X
                className="w-5 h-5"
                style={{cursor: 'pointer', color: '#ffc107'}}
                onClick={() => isTownMode ? onClearTowns() : setMultiSelDep([])}
              />
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="d-flex flex-column p-3 overflow-hidden" style={{flex: 1}}>

            {isTownMode ? (
              // ── MODE VILLE ──
              <>
                <p className="fw-semibold mb-3 flex-shrink-0">
                  Villes sélectionnées ({selectedTownCodes.length}) :
                </p>

                <div className="bg-light rounded p-2 mb-3 flex-shrink-0" style={{opacity: 0.7}}>
                  <p className="text-sm fw-bold mb-1">📍 Total des clics :</p>
                  <p className="fs-4 fw-bold">
                    {selectedTownCodes.reduce((sum, code) => sum + getClicksForTown(code), 0)}
                  </p>
                </div>

                <ul
                  className={`list-unstyled ${selectedTownCodes.length > 3 ? 'overflow-y-auto' : ''}`}
                  style={{ 
                    maxHeight: selectedTownCodes.length > 3 ? 'calc(3 * 82px)' : 'none',
                    gap: '8px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {selectedTownCodes.map(code => {
                    const town = TOWN_MARKERS.find(t => t.code === code);
                    if (!town) return null;
                    const clics = getClicksForTown(code);
                    const color = getColorByPersonCount(clics);

                    return (
                      <li key={code} className="bg-secondary rounded p-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <div
                              className="rounded-circle flex-shrink-0"
                              style={{ 
                                width: '16px', 
                                height: '16px',
                                backgroundColor: color === "#9CA3AF" ? 'transparent' : color 
                              }}
                            />
                            <div className="flex-grow-1">
                              <p className="fw-semibold text-sm mb-0">{town.nom}</p>
                              <p className="text-xs text-secondary mb-0">Code INSEE: {code}</p>
                              <p className="text-xs fw-bold mb-0" style={{marginTop: '4px'}}>
                                {clics} clic{clics > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            className="btn btn-link text-jaune fw-bold p-0"
                            style={{fontSize: '1.5rem', textDecoration: 'none'}}
                            onClick={() => onToggleTown(code)}
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>

            ) : (
              // ── MODE DÉPARTEMENT / RÉGION ──
              <>
                <p className="fw-semibold mb-3 flex-shrink-0">
                  {isRegionMode ? "Régions" : "Départements"} sélectionné(s) ({multiSelDept.length}) :
                </p>

                <div className="bg-light rounded p-2 mb-3 flex-shrink-0" style={{opacity: 0.7}}>
                  <p className="text-sm fw-bold mb-1">📍 Total des clics :</p>
                  <p className="fs-4 fw-bold">
                    {multiSelDept.reduce((total, dept) => {
                      const clics = getClicksForDepartment(clickData,dept.code);
                      // isRegionMode
                      //   ? getClicksForRegion(dept.nom)
                      //   : getClicksForDepartment(dept.code);
                      return total + clics;
                    }, 0)}
                  </p>
                </div>

                <ul
                  className={`list-unstyled ${multiSelDept.length > 3 ? 'overflow-y-auto' : ''}`}
                  style={{ 
                    maxHeight: multiSelDept.length > 3 ? 'calc(3 * 82px)' : 'none',
                    gap: '8px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {multiSelDept.map((dept) => {
                    const { nom, code } = dept;
                    const personnes = getClicksForDepartment(clickData,code);
                    // isRegionMode
                    //   ? getClicksForRegion(nom)
                    //   : getClicksForDepartment(code);
                    const color = getColorByPersonCount(personnes);

                    return (
                      <li key={code} className="bg-secondary rounded p-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <div
                              className="rounded-circle flex-shrink-0"
                              style={{ 
                                width: '16px', 
                                height: '16px',
                                backgroundColor: color === "#9CA3AF" ? 'transparent' : color 
                              }}
                            />
                            <div className="flex-grow-1">
                              <p className="fw-semibold text-sm mb-0">{nom}</p>
                              {!isRegionMode && (
                                <p className="text-xs text-secondary mb-0">Code: {code}</p>
                              )}
                              <p className="text-xs fw-bold mb-0" style={{marginTop: '4px'}}>
                                {personnes} clic{personnes > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            className="btn btn-link text-jaune fw-bold p-0"
                            style={{fontSize: '1.5rem', textDecoration: 'none'}}
                            onClick={() => setMultiSelDep(prev => prev.filter(d => d.code !== code))}
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

          </div>

          {/* Footer - reste à sa place */}
          <div className="p-3 border-top border-warning flex-shrink-0">
            <button
              className="btn btn-warning w-100 py-2 text-white fw-semibold"
              onClick={() => isTownMode ? onClearTowns() : setMultiSelDep([])}
            >
              Tout effacer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FranceMap;