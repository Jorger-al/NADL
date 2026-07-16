import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { VerticalHeader } from "@/components/layout/VerticalHeader";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { GlobeVisualization } from "@/components/GlobeVisualization";
import { SiteDetailsPanel } from "@/components/SiteDetailsPanel";

const CATEGORY_MAP = {
  "shipwreck": "Shipwreck",
  "artillery": "Artillery & Guns",
  "anchors": "Anchor",
  "artifacts": "Artifact",
  "forts": "Fort",
  "harbor": "Harbor Structure",
  "shipyard": "Shipyard Structure",
  "structures": "Other Structure",
  "iconography": "Iconography",
  "astrolabes": "Astrolabe",
  "pattern": "Pattern",
  "other": "Other"
};

// Maps the sidebar category query-param values to display type names
const CATEGORY_FILTER_MAP = {
  "all": null,
  "anchors": "Anchor",
  "artifacts": "Artifact",
  "artillery-guns": "Artillery & Guns",
  "astrolabes": "Astrolabe",
  "iconography": "Iconography",
  "forts": "Fort",
  "patterns": "Pattern",
  "shipwrecks": "Shipwreck",
  "others-category": "Other",
  "harbor-structures": "Harbor Structure",
  "shipyard-structures": "Shipyard Structure",
  "other-structures": "Other Structure"
};

const TYPE_COLORS = {
  "Shipwreck": "#016fffff",
  "Artillery & Guns": "#e53935",
  "Anchor": "#8e24aa",
  "Artifact": "#fb8c00",
  "Fort": "#8d6e63",
  "Harbor Structure": "#7cb342",
  "Shipyard Structure": "#26dacbff",
  "Other Structure": "#64748b",
  "Iconography": "#ec407a",
  "Astrolabe": "#00a676",
  "Pattern": "#b33d0fff",
  "Other": "#a3a3a3"
};

const formatCoordinates = (lat, lng) => {
  if (lat == null || lng == null) return "";
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lngStr}`;
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const activeCollection = searchParams.get("collection") || "all";
  const activeCategory = searchParams.get("category") || "all";

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter markers based on the active collection and category
  const filteredMarkers = useMemo(() => {
    let result = markers;

    // Filter by collection
    if (activeCollection !== "all") {
      if (activeCollection === "others") {
        const schCollections = ["sch-portugal", "sch-azores", "sch-madeira"];
        result = result.filter((m) => !schCollections.includes(m.collection));
      } else {
        result = result.filter((m) => m.collection === activeCollection);
      }
    }

    // Filter by category
    const filterType = CATEGORY_FILTER_MAP[activeCategory];
    if (filterType) {
      result = result.filter((m) => m.type === filterType);
    }

    return result;
  }, [markers, activeCollection, activeCategory]);

  useEffect(() => {
    async function fetchSites() {
      try {
        const response = await fetch("${import.meta.env.VITE_DIRECTUS_URL}/items/sites?limit=-1");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const mapped = (result.data || []).map(site => {
          const type = CATEGORY_MAP[site.layer_category] || "Other";
          const color = TYPE_COLORS[type] || TYPE_COLORS["Other"];
          const region = [site.concelho, site.distrito, site.country].filter(Boolean).join(', ') || site.location || "Unknown Location";

          return {
            id: site.id,
            lat: site.lat,
            lng: site.lng,
            coordinates: formatCoordinates(site.lat, site.lng),
            name: site.name,
            type: type,
            region: region,
            status: site.status || "Unknown",
            completion: site.status && site.status.toLowerCase().includes("complete") ? "100%" : "N/A",
            artifactsCount: "N/A",
            description: site.description || "No description available.",
            color: color,
            collection: site.collection
          };
        });
        setMarkers(mapped);
      } catch (err) {
        console.error("Error loading sites from Directus:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, []);

  return (
    <div className="bg-surface font-body text-foreground h-screen flex flex-col overflow-hidden selection:bg-accent/20 selection:text-primary">
      {/* Top Navbar */}
      <TopNavBar />

      <div className="relative overflow-hidden flex-1 flex pt-20">
        {/* Sidebar Navigation (Fixed) */}
        <VerticalHeader />

        {/* Main Content Area */}
        <main className="flex-1 relative bg-black h-full ml-64">
          {/* Globe Visualization */}
          <div className="absolute inset-0 z-0">
            <GlobeVisualization
              markers={filteredMarkers}
              onMarkerClick={setSelectedMarker}
              onMarkerHover={setHoveredMarker}
            />
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-4 text-[#d8d6d5]">
              <div className="w-12 h-12 border-4 border-[#d8d6d5]/20 border-t-primary rounded-full animate-spin"></div>
              <p className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                Retrieving Archival Sites...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute top-24 left-18 bg-red-950/80 border border-red-500/30 p-4 rounded-sm z-30 text-[#d8d6d5] max-w-sm">
              <p className="font-label text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
                Data Access Error
              </p>
              <p className="text-sm text-red-200/80">
                Failed to fetch sites from Directus: {error}
              </p>
            </div>
          )}

          {/* Site Details Panel Overlay */}
          {selectedMarker && (
            <SiteDetailsPanel
              marker={selectedMarker}
              onClose={() => setSelectedMarker(null)}
            />
          )}

        </main>
      </div>
    </div>
  );
}





