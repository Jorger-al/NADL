import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import Header from "@/data/Images/Headers/ContactsHeader.jpg";

export default function Contacts() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section — Full-width cinematic image, no text overlay */}
        <section className="relative w-full h-[300px] overflow-hidden">
          <img
            src={Header}
            alt="Portugal maritime exploration"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </section>

        {/* Main Content — Centered, narrow column */}
        <div className="w-full max-w-[900px] mx-auto px-6">

          {/* About Section */}
          <section className="pt-14">
            {/* Title with accent bar */}
            <div className="flex items-start gap-4 mb-3">
              <div className="w-[3px] h-16 bg-[#705a44] shrink-0"></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  Contacts
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  Contact our team for any questions or assistance
                </p>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-10 space-y-2">
              <p className="text-3xl md:text-2xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                Filipe Vieira de Castro
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                Project Overviewer
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                fvcastr@gmail.com
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
