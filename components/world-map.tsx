"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Visitor = {
  country: string;
  count: number;
  lat: number;
  lng: number;
};

export function WorldMap() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    // Simulate visitor data (in real app, get from Supabase)
    const mockVisitors: Visitor[] = [
      { country: "US", count: 45, lat: 39.8283, lng: -98.5795 },
      { country: "GB", count: 23, lat: 54.7024, lng: -3.2766 },
      { country: "CA", count: 12, lat: 56.1304, lng: -106.3468 },
      { country: "AU", count: 8, lat: -25.2744, lng: 133.7751 },
      { country: "DE", count: 15, lat: 51.1657, lng: 10.4515 },
    ];

    setVisitors(mockVisitors);
  }, []);

  return (
    <div className="w-full h-64 bg-lounge-soft/30 rounded-lg overflow-hidden">
      <ComposableMap
        projectionConfig={{ scale: 100 }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2a1f1a"
                stroke="#c7a17a"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>
        {visitors.map((visitor, i) => (
          <Marker key={i} coordinates={[visitor.lng, visitor.lat]}>
            <circle
              r={Math.sqrt(visitor.count) * 2}
              fill="#c7a17a"
              opacity={0.6}
              className="animate-pulse"
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

