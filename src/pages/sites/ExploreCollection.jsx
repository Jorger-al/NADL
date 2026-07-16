import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";

export default function ExploreCollection() {
  const { type } = useParams();

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [activeSearch, setActiveSearch] = useState({ field: "name", value: "" });
  const [sortBy, setSortBy] = useState("alphabetical");

  let typeTitle = type.charAt(0).toUpperCase() + type.slice(1);

  if (typeTitle === "Iconography") {
    typeTitle = "Iconographies";
  } else if (typeTitle === "Artillery") {
    typeTitle = "Artillery";
  } else if (typeTitle === "Forts") {
    typeTitle = "Forts";
  } else if (typeTitle === "Astrolabe") {
    typeTitle = "Astrolabes";
  } else if (typeTitle === "Harbor") {
    typeTitle = "Harbor Structures";
  } else if (typeTitle === "Shipyard") {
    typeTitle = "Shipyard Structures";
  } else if (typeTitle === "Artifacts") {
    typeTitle = "Artifacts";
  } else {
    typeTitle = typeTitle + "s";
  }

  useEffect(() => {
    async function fetchSites() {
      try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/sites?limit=-1`);
        const result = await response.json();

        const filtered = (result.data || []).filter((site) => {
          if (!site.lat || !site.lng) return false;

          const matchesType =
            site.layer_category?.toLowerCase() === type.toLowerCase();

          return matchesType;
        }).sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", undefined, {
            sensitivity: "base",
          })
        );

        setSites(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, [type]);

  const filteredSites = useMemo(() => {
    let result = [...sites];
    if (activeSearch.value.trim()) {
      const term = activeSearch.value.toLowerCase().trim();
      result = result.filter((site) => {
        const fieldVal = site[activeSearch.field];
        return (fieldVal || "").toLowerCase().includes(term);
      });
    }

    return result.sort((a, b) => {
      if (sortBy === "z-a") {
        return (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
        });
      } else if (sortBy === "newest") {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      } else {
        // default alphabetical
        return (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        });
      }
    });
  }, [sites, activeSearch, sortBy]);

  return (
    <div className="bg-[#f3f4f6] min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-1 pt-28">

        {/* Hero */}
        <section className="max-w-[1200px] mx-auto mb-8">
          <div className="border border-gray-200 bg-white p-12">

            <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-4">
              Collection Archive
            </p>

            <h1 className="text-5xl font-light text-[#1e3a5f] mb-6 font-display">
              {typeTitle} Collection
            </h1>

            <p className="text-lg text-gray-600">
              Exploring {typeTitle.toLowerCase()} archaeological records and maritime heritage sites.
            </p>

          </div>
        </section>

        {/* Search Engine */}
        <section className="max-w-[1200px] mx-auto mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveSearch({ field: searchField, value: searchValue });
            }}
            className="flex gap-4 items-center bg-white border border-gray-200 p-4 w-full"
          >
            <div className="relative w-[20%]">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-sm pl-3 pr-8 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 cursor-pointer appearance-none"
              >
                <option value="name" className="bg-gray-50 text-gray-700">Name:</option>
                <option value="country" className="bg-gray-50 text-gray-700">Country:</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-[18px] text-gray-500">
                keyboard_arrow_down
              </span>
            </div>

            <textarea
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`Search by ${searchField}...`}
              rows={1}
              className="w-[40%] h-10 border border-gray-200 rounded-sm px-3 py-2.5 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 resize-none font-sans overflow-hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setActiveSearch({ field: searchField, value: searchValue });
                }
              }}
            />

            <button
              type="submit"
              className="w-[20%] h-10 bg-[#2f4050] hover:bg-[#1e3a5f] text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-300 rounded-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              Search
            </button>

            <div className="relative w-[20%]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-sm pl-3 pr-8 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 cursor-pointer appearance-none"
              >
                <option value="alphabetical" className="bg-gray-50 text-gray-700">Alphabetical Order (A-Z)</option>
                <option value="z-a" className="bg-gray-50 text-gray-700">Reversed Order (Z-A)</option>
                <option value="newest" className="bg-gray-50 text-gray-700">Newest</option>
                <option value="oldest" className="bg-gray-50 text-gray-700">Oldest</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-[18px] text-gray-500">
                keyboard_arrow_down
              </span>
            </div>
          </form>
        </section>

        {/* Sites Grid */}
        <section className="max-w-[1200px] mx-auto pb-24">

          {loading ? (
            <div className="text-center py-24">
              Loading sites...
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              No sites found in this region.
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              No matching sites found for your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {filteredSites.map((site) => (
                <Link
                  key={site.id}
                  to={`/site/${site.id}`}
                  className="group bg-white border border-gray-200 hover:border-gray-300 transition-all"
                >

                  <div className="h-64 overflow-hidden bg-gray-100">
                    <img
                      src={
                        site.image ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                      }
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="p-8">

                    <h2 className="text-2xl font-light text-[#1e3a5f] mb-4 line-clamp-1 font-display">
                      {site.name}
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem]">
                      {site.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{site.country}</span>
                      <span>
                        {site.lat?.toFixed(2)}; {site.lng?.toFixed(2)}
                      </span>
                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
