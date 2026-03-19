// app/country-selector/components/WorldMap.tsx
"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useState } from "react";

// TopoJSON file for world map (simplified, includes country codes)
const WORLD_GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

export interface CountryFeature {
  id: string; // ISO A3 code (e.g., "USA")
  properties: {
    name: string;
  };
}

interface WorldMapProps {
  onCountryClick: (feature: CountryFeature) => void;
}

export default function WorldMap({ onCountryClick }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 130,
        center: [0, 30], // Centered for better visibility
      }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
      }}
    >
      <Geographies geography={WORLD_GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHovered = hoveredCountry === geo.id;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onCountryClick(geo as unknown as CountryFeature)}
                onMouseEnter={() => setHoveredCountry(geo.id)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{
                  default: {
                    fill: "#e0e8f0", // fractional-grayLight
                    stroke: "#8a9ab0", // fractional-grayMid
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "#0A8A80", // brand-teal
                    stroke: "#0B3F44", // brand-tealDark
                    strokeWidth: 1,
                    outline: "none",
                    cursor: "pointer",
                    transition: "fill 0.2s ease",
                  },
                  pressed: {
                    fill: "#E45C48", // brand-coral
                    stroke: "#0B3F44",
                    strokeWidth: 1,
                    outline: "none",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}