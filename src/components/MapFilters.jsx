import React from "react";
import { globeFilters } from "@/data/mockData";

export function MapFilters({ activeFilters, onFilterChange }) {
  const handleToggle = (category, value) => {
    const current = activeFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    
    onFilterChange({ ...activeFilters, [category]: updated });
  };

  return (
    <div className="absolute top-8 right-8 w-72 bg-surface/90 backdrop-blur-xl border border-border/20 shadow-2xl p-6 rounded-sm z-10 ambient-shadow">
      <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
        <span className="material-symbols-outlined text-primary">filter_list</span>
        <h3 className="font-display text-lg text-primary">Global Filters</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(globeFilters).map(([category, options]) => (
          <div key={category}>
            <h4 className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold mb-3">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isActive = (activeFilters[category] || []).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleToggle(category, option)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-secondary-container text-on-secondary-container border border-secondary"
                        : "bg-surface-containerHighest text-muted-foreground border border-transparent hover:bg-surface-container"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
