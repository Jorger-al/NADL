import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import AnchorHeader from "@/data/Images/Sites/AnchorHeader.jpg";
import Anchor1 from "@/data/Images/Sites/Anchor1.jpg";
import Anchor2 from "@/data/Images/Sites/Anchor2.jpg";
import Africa from "@/data/Images/Sites/Africa.jpg";
import America from "@/data/Images/Sites/America.jpg";
import Asia from "@/data/Images/Sites/Asia.jpg";
import Europe from "@/data/Images/Sites/Europe.jpg";
import Oceania from "@/data/Images/Sites/Oceania.jpg";

export default function Astrolabe() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full h-[55vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://cdn.wallpapersafari.com/93/79/VOek3F.jpg"
              alt="Astrolabes"
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 w-full max-w-[1200px] mx-auto flex flex-col items-center">
            <h1 className="text-white text-5xl md:text-7xl font-extralight tracking-wide mb-6 font-display">
              Astrolabes
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mb-10">
              Exploring historical astrolabes, marine navigation instruments, and astronomical calculators used by early seafarers to map the stars.
            </p>
            <Link to="/explore/astrolabe">
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
                  src="https://replogleglobes.com/app/uploads/2022/10/sailors-instruments.jpg"
                  alt="Marine astrolabe"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">Navigating by the Stars</h2>
              <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                The mariner's astrolabe was a crucial instrument in the Age of Discovery, allowing sailors to measure the altitude of the sun or stars to determine their latitude at sea.
              </p>
            </div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="aspect-square overflow-hidden border border-gray-200 bg-white p-2">
                <img
                  src="https://www.history.navy.mil/content/dam/nhhc/our-collections/artifacts/Navigation/1967-415-R/NHHC_1967-415-R_crop.jpg"
                  alt="Recovered brass instruments"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-8 font-display tracking-wide">Rare Discoveries</h2>
              <p className="text-[#4b5563] text-lg leading-relaxed mb-8 font-light">
                Mariner's astrolabes are among the rarest maritime archaeological finds. Finding and preserving one provides invaluable data about historical metalwork and navigation history.
              </p>
            </div>
          </div>

        </section>

        {/* Explore by Region Cards */}
        <section className="bg-white border-t border-[#e5e7eb] py-24">
          <div className="w-full max-w-[1400px] mx-auto px-6">
            <h2 className="text-3xl font-light text-center text-[#1e3a5f] mb-16 font-display tracking-wide">Explore by Region</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "Africa",
                  slug: "africa",
                  img: Africa
                },
                {
                  title: "America",
                  slug: "america",
                  img: America
                },
                {
                  title: "Asia",
                  slug: "asia",
                  img: Asia
                },
                {
                  title: "Europe",
                  slug: "europe",
                  img: Europe
                },
                {
                  title: "Oceania",
                  slug: "oceania",
                  img: Oceania
                }
              ].map((region) => (
                <Link
                  key={region.title}
                  to={`/explore/astrolabes/${region.slug}`}
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
