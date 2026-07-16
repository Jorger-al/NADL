import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const typeRouteMap = {
  "Shipwreck": "/shipwreck",
  "Artillery & Guns": "/artillery-guns",
  "Anchor": "/anchor",
  "Artifact": "/artifact",
  "Fort": "/fort",
  "Harbor Structure": "/harbor-structure",
  "Shipyard Structure": "/shipyard-structure",
  "Other Structure": "/landscape",
  "Iconography": "/iconography",
  "Astrolabe": "/astrolabe",
  "Pattern": "/pattern",
  "Other": "/shipwreck",
};

export function SiteDetailsPanel({ marker, onClose }) {
  const navigate = useNavigate();
  if (!marker) return null;

  const handleOverview = () => {
    const route = typeRouteMap[marker.type] ?? "/shipwreck";
    navigate(route);
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-96 bg-[#0a0a0a] border-l border-[#d8d6d5]/20 shadow-2xl z-20 overflow-y-auto animate-in slide-in-from-right flex flex-col font-body text-[#d8d6d5] selection:bg-[#d8d6d5] selection:text-[#0a0a0a]">
      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 border-b border-[#d8d6d5]/10">
        <div>
          <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block">
            Scanning Parameters
          </span>
          <span className="font-label text-xs font-bold text-[#d8d6d5] tracking-widest uppercase block mt-1">
            Archive Record // {marker.id.replace('PT-', '')}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#d8d6d5]/60 hover:text-[#d8d6d5] transition-colors p-2"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-8">
        {/* Site Name & Type */}
        <section>
          <span className="font-label text-[10px] uppercase tracking-widest text-[#4c5b71]/90 font-bold mb-2 block">
            {marker.type}
          </span>
          <h2 className="font-display text-4xl text-[#d8d6d5] font-semibold leading-tight">
            {marker.name}
          </h2>
        </section>

        {/* Location Block */}
        <section className="bg-[#0a0a0a] p-4 rounded-sm border border-[#d8d6d5]/10">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block mb-2">
            Location
          </span>
          <div className="font-body text-sm font-medium mb-1">
            {marker.region}
          </div>
          <div className="font-mono text-xs text-[#d8d6d5] bg-[#d8d6d5]/5 p-2 rounded-sm mt-2 border border-[#d8d6d5]/20">
            {marker.coordinates}
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-3 gap-4 border-y border-[#d8d6d5]/10 py-6">
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block mb-1">
              Status
            </span>
            <span className="font-body text-xs font-semibold text-[#d8d6d5] block leading-tight">
              {marker.status}
            </span>
          </div>
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block mb-1">
              Completion
            </span>
            <span className="font-display text-xl text-[#d8d6d5] block">
              {marker.completion}
            </span>
          </div>
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block mb-1">
              Artifacts
            </span>
            <span className="font-display text-xl text-[#d8d6d5] block">
              {marker.artifactsCount}
            </span>
          </div>
        </section>

        {/* Description */}
        <section>
          <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block mb-3">
            Description
          </span>
          <p className="text-sm leading-relaxed font-body text-[#d8d6d5]/80">
            {marker.description}
          </p>
        </section>

        {/* Archival Imagery (Empty structure as requested) */}
        <section>
          <span className="font-label text-[10px] uppercase tracking-widest text-[#d8d6d5]/60 block mb-3">
            Archival Imagery
          </span>
          <div className="h-48 w-full bg-[#d8d6d5]/10 rounded-sm border border-[#d8d6d5]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d8d6d5]/50 text-4xl">
              image
            </span>
          </div>
        </section>

        <section>
          <Button
            onClick={() => navigate(`/site/${marker.id}`)}
            className="w-full bg-[#171717] hover:bg-[#4c5b71]/90 text-[#d8d6d5] py-6 rounded-sm font-label text-xs font-bold uppercase tracking-widest flex justify-between items-center group transition-all"
          >
            More Details
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
              arrow_forward
            </span>
          </Button>
        </section>
      </div>

      {/* Footer CTA */}
      {!(marker.type && (marker.type.toLowerCase() === "other" || marker.type.toLowerCase() === "other structure")) && (
        <div className="px-8 py-6 border-t border-[#d8d6d5]/10 bg-[#0a0a0a]">
          <Button
            onClick={handleOverview}
            className="w-full bg-[#171717] hover:bg-[#4c5b71]/90 text-[#d8d6d5] py-6 rounded-sm font-label text-xs font-bold uppercase tracking-widest flex justify-between items-center group transition-all"
          >
            Overview
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
              arrow_forward
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
