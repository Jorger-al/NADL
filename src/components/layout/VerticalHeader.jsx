import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import logo from "@/data/Images/Home-Logo.png";
import htc_logo from "@/data/Images/Partners/HTC.png";

export function VerticalHeader() {
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const currentCollection = searchParams.get("collection") || "all";
  const currentCategory = searchParams.get("category") || "all";

  const navItems = [
    { icon: "explore", label: "All Sites", value: "all" },
    { icon: "layers", label: "SCH Portugal", value: "sch-portugal" },
    { icon: "water", label: "SCH Azores", value: "sch-azores" },
    { icon: "water", label: "SCH Madeira", value: "sch-madeira" }
  ];

  const bottomItems = [
    { icon: "settings", label: "Settings", path: "/settings" },
    { icon: "help_outline", label: "Support", path: "/support" },
  ];

  const subLinks = [
    { icon: "explore", label: "All Categories", value: "all" },
    { icon: "anchor", label: "Anchors", value: "anchors" },
    { icon: "architecture", label: "Artifacts", value: "artifacts" },
    { icon: "target", label: "Artillery & Guns", value: "artillery-guns" },
    { icon: "stars_2", label: "Astrolabes", value: "astrolabes" },
    { icon: "image", label: "Iconography", value: "iconography" },
    { icon: "castle", label: "Forts", value: "forts" },
    { icon: "grid_view", label: "Patterns", value: "patterns" },
    { icon: "water_drop", label: "Shipwrecks", value: "shipwrecks" },
    { icon: "more_horiz", label: "Others", value: "others-category" },
    { icon: "directions_boat", label: "Harbor Structures", value: "harbor-structures" },
    { icon: "sailing", label: "Shipyard Structures", value: "shipyard-structures" },
    { icon: "domain", label: "Other Structures", value: "other-structures" },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] text-[#d8d6d5] h-screen fixed left-0 top-0 z-[60] border-r border-[#d8d6d5]/10 shadow-2xl overflow-y-auto">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#d8d6d5]/10 flex items-center justify-center bg-[#0a0a0a]">
        <Link to="/" className="flex flex-col items-center group">
          <img
            src={logo}
            alt="NADL Logo"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-4">
        <span className="font-label text-[10px] text-[#d8d6d5]/40 uppercase tracking-widest mb-2">
          Collections
        </span>
        {navItems.map((item) => {
          const isActive = currentCollection === item.value && location.pathname === "/";
          return (
            <Link
              key={item.label}
              to={`/?collection=${item.value}&category=${currentCategory}`}
              className={`flex items-center gap-4 px-4 py-3 rounded-sm font-label text-xs uppercase tracking-widest transition-all ${isActive
                ? "bg-[#d8d6d5] text-[#0a0a0a] font-bold shadow-md"
                : "text-[#d8d6d5]/80 hover:bg-[#d8d6d5]/10 hover:text-[#d8d6d5]"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <div className="my-6 border-t border-[#d8d6d5]/10 mx-4"></div>

        <span className="font-label text-[10px] text-[#d8d6d5]/40 uppercase tracking-widest mb-2">
          Categories
        </span>
        <div className="flex flex-col gap-1">
          {subLinks.map((link) => {
            const isActive = currentCategory === link.value && location.pathname === "/";
            return (
              <Link
                key={link.label}
                to={`/?collection=${currentCollection}&category=${link.value}`}
                className={`flex items-center gap-4 px-4 py-3 rounded-sm font-label text-xs uppercase tracking-widest transition-all ${isActive
                  ? "bg-[#d8d6d5] text-[#0a0a0a] font-bold shadow-md"
                  : "text-[#d8d6d5]/80 hover:bg-[#d8d6d5]/10 hover:text-[#d8d6d5]"
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      {/*
      <div className="p-4 border-t border-[#d8d6d5]/10 flex flex-col gap-1">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-sm font-label text-xs uppercase tracking-widest text-[#d8d6d5]/80 hover:bg-[#d8d6d5]/10 hover:text-[#d8d6d5] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
      */}
    </aside>
  );
}
