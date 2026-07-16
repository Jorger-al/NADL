import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function Landscape() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1498623116890-37e912163d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Ocean landscape"
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 w-full max-w-[1200px] mx-auto flex flex-col items-center">
            <h1 className="text-white text-5xl md:text-7xl font-extralight tracking-wide mb-6 font-display">
              Landscapes
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mb-10">
              Exploring maritime environments and coastal heritage through digital archives and archaeological research.
            </p>
            <button className="bg-[#e5e7eb] text-[#1e3a5f] px-8 py-3 rounded-sm font-medium tracking-wider hover:bg-white transition-colors duration-300 text-sm uppercase">
              Explore Collection
            </button>
          </div>
        </section>

        {/* Content Sections */}
        <section className="w-full max-w-[1200px] mx-auto px-6 py-24 space-y-32">

          {/* Block 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="aspect-square overflow-hidden border border-gray-200 bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Coastal archaeology"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">Coastal Archaeology</h2>
              <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                Discover the intersection of land and sea. Our research documents how historical communities interacted with coastal environments, adapting to changing tides and maritime economies over centuries.
              </p>
            </div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="aspect-square overflow-hidden border border-gray-200 bg-white p-2">
                <img
                  src="https://i.natgeofe.com/n/29e593b8-a434-4a14-88c3-7130a88e081c/18452.jpg"
                  alt="Underwater mapping"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">Submerged Landscapes</h2>
              <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                Explore forgotten terrains beneath the waves. Utilizing advanced sonar and photogrammetry, we reconstruct ancient topographies that were once inhabited before sea-level rises transformed the map.
              </p>
            </div>
          </div>

        </section>

        {/* Explore by Region Cards */}
        <section className="bg-white border-t border-[#e5e7eb] py-24">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-light text-center text-[#1e3a5f] mb-16 font-display tracking-wide">Explore by Region</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Mediterranean",
                  slug: "mediterranean",
                  img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80"
                },
                {
                  title: "North Sea",
                  slug: "north-sea",
                  img: "https://uk.ponant.com/_next/image?url=https%3A%2F%2Fmycreativehub.ponant.com%2Ftransform%2Ff2b3926b-c0f4-4dbf-a21c-cf74741b77b1%2FNo-39_FAROE-ISLAND_AKRABERG-AND-LIGHTHOUSE-StudioPONANT_Doriane-Letexier%3Fio%3Dtransform%253Afill%252Cwidth%253A768%252Cheight%253A432%26focuspoint%3D0.5%252C0.5%26format%3Dwebp&w=3840&q=75"
                },
                {
                  title: "Baltic",
                  slug: "baltic",
                  img: "https://shoreproject.eu/wp-content/uploads/2024/05/Baltic-coast_Hendrik-Morkel-1-800x449.jpg"
                },
                {
                  title: "Atlantic Coast",
                  slug: "atlantic-coast",
                  img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80"
                }
              ].map((region) => (
                <Link
                  key={region.title}
                  to={`/explore/landscape/${region.slug}`}
                  className="group border border-[#e5e7eb] bg-white p-2 cursor-pointer hover:border-gray-300 transition-colors">
                  <div className="w-full h-48 overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                    <img
                      src={region.img}
                      alt={region.title}
                      className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-center font-light text-[#374151] uppercase tracking-widest text-xs mb-2">{region.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
