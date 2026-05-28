import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Marker } from "react-simple-maps";

export type Town = {
  code: string;
  nom: string;
  coordinates: [number, number];
};

type TownMarkersProps = {
  towns: Town[];
  selectedTowns: string[];
  onToggleTown: (code: string) => void;
};

export const TownMarkers: React.FC<TownMarkersProps> = ({
  towns,
  selectedTowns,
  onToggleTown,
}) => {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseEnter = (
    event: React.MouseEvent,
    code: string,
    name: string
  ) => {
    setTooltipContent(code + " - " + name);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <>
      {towns.map((town) => (
        <Marker
          key={town.code}
          coordinates={town.coordinates}
          onMouseEnter={(e) => handleMouseEnter(e, town.code, town.nom)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => onToggleTown(town.code)}
        >
          {/* Épingle */}
          <g transform="translate(-4, -10)">
            <svg
              width="16"
              height="18"
              viewBox="0 0 24 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer border border-transparent"
            >
              <path
                d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z"
                fill={selectedTowns.includes(town.code) ? "#008000" : "#000"}
                stroke="#fff"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="4" fill="#fff" />
            </svg>
          </g>
        </Marker>
      ))}

      {tooltipContent &&
        createPortal(
          <div
            className="position-fixed text-white px-2 py-1 rounded"
            style={{
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              background: "rgba(0,0,0,0.7)",
              pointerEvents: "none",
              fontSize: "12px",
              zIndex: 9999,
              whiteSpace: "nowrap",
            }}
          >
            {tooltipContent}
          </div>,
          document.body
        )}
    </>
  );
};

export const TownMetroMarkers: React.FC<TownMarkersProps> = ({
  towns,
  selectedTowns,
  onToggleTown,
}) => {
  const [hoveredTown, setHoveredTown] = useState<string | null>(null);

  return (
    <>
      {towns.map((town) => (
        <Marker key={town.code} coordinates={town.coordinates}>
          {/* TEXTE toujours visible */}
          <text
            textAnchor="middle"
            y={-16}
            style={{
              fontSize: "10px",
              fontFamily: "sans-serif",
              fill: hoveredTown === town.code ? "#FAC900" : "#1a1a1a",
              fontWeight: "700",
              cursor: "pointer",
              paintOrder: "stroke",
              stroke: hoveredTown === town.code ? "#1a1a1a" : "#ffffff",
              strokeWidth: "1px",
            }}
            onMouseEnter={() => setHoveredTown(town.code)}
            onMouseLeave={() => setHoveredTown(null)}
            onClick={() => onToggleTown(town.code)}
          >
            {town.nom}
          </text>

          {/* MARKER visible seulement au hover */}
          {selectedTowns.includes(town.code) && (
            <g
              transform="translate(-8, -20)"
              className="transition"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                transition: "transform 0.8s ease-in, opacity 0.8s ease-in-out",
              }}
            >
              <svg
                width="20"
                height="22"
                viewBox="0 0 24 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z"
                  fill="#E8521A"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="12" r="4" fill="#fff" />
              </svg>
            </g>
          )}
        </Marker>
      ))}
    </>
  );
};