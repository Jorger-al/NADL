import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import Atlantic from "@/data/Images/Sites/Atlantic.jpg";
import Baltic from "@/data/Images/Sites/Baltic.jpg";
import Mediterranean from "@/data/Images/Sites/Mediterranean.jpg";
import NorthSea from "@/data/Images/Sites/NorthSea.jpg";

export default function Shipwreck() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full h-[55vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80"
              alt="Shipwreck underwater"
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 w-full max-w-[1200px] mx-auto flex flex-col items-center">
            <h1 className="text-white text-5xl md:text-7xl font-extralight tracking-wide mb-6 font-display">
              Shipwrecks
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mb-10">
              Preserving maritime history through the exploration of submerged
              vessels, underwater archaeology, and digital reconstruction.
            </p>
            <Link to="/explore/shipwreck">
              <button className="bg-[#e5e7eb] text-[#1e3a5f] px-8 py-3 rounded-sm font-medium tracking-wider hover:bg-white transition-colors duration-300 text-sm uppercase">
                Explore Collection
              </button>
            </Link>
          </div>
        </section>

        {/* Content Sections */}
        <section className="w-full max-w-[1200px] mx-auto px-6 py-24 space-y-32">

          {/* Block 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="aspect-square overflow-hidden border border-gray-200 bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"
                  alt="Historic shipwreck"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">Historic Shipwrecks</h2>
              <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                Discover the remains of historic vessels lost beneath the sea.
                Through archaeological investigation and archival research, we
                uncover stories of trade, exploration, and naval conflict
                preserved underwater for centuries.
              </p>
            </div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="aspect-square overflow-hidden border border-gray-200 bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1000&q=80"
                  alt="Underwater exploration"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">Deep Sea Exploration</h2>
              <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                Explore submerged wreck sites through advanced sonar imaging,
                photogrammetry, and 3D reconstruction technologies. These
                digital methods allow researchers to preserve fragile wrecks and
                study them without disturbing their underwater environment.
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
                  img: Mediterranean
                },
                {
                  title: "North Sea",
                  slug: "north-sea",
                  img: NorthSea
                },
                {
                  title: "Baltic",
                  slug: "baltic",
                  img: Baltic
                },
                {
                  title: "Atlantic Coast",
                  slug: "atlantic-coast",
                  img: Atlantic
                }
              ].map((region) => (
                <Link
                  key={region.title}
                  to={`/explore/shipwreck/${region.slug}`}
                  className="group border border-[#e5e7eb] bg-white p-2 cursor-pointer hover:border-gray-300 transition-colors">
                  <div className="w-full h-48 overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                    <img
                      src={region.img}
                      alt={region.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-600 transform group-hover:scale-105"
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
