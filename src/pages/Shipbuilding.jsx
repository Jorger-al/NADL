import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import shipbuildingImage from "@/data/Images/Headers/shipbuilding-header.jpg";

export default function Shipbuilding() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section — Full-width cinematic image, no text overlay */}
        <section className="relative w-full h-[300px] overflow-hidden">
          <img
            src={shipbuildingImage}
            alt="Shipbuilding"
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
                  Shipbuilding
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  Filipe Castro • January 2026
                </p>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-10 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Ships are complex artifacts, conceived and built to operate between two environments –
                water and air – with different viscosities, weights, and dynamics. To understand the
                evolution of shipbuilding we must use written documents, iconography, and archaeological
                remains. This subject is interesting from many different viewpoints, as part of the
                broader histories of science and technology, as part of the social and cultural environments
                that produced each ship type, route, trade network, and economical environment, and as an
                inhabited machine where small communities lived sustainable lives for relatively long periods.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                In the NADL project we are interested in the study of how ships were conceived, designed,
                built, operated, lost, degraded, found, and used again, either by looters, treasure hunters,
                or archaeologist and historians.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The recording process is of major interest to us, because it determines the amount and
                quality of the data acquired. Archaeologists destroy what they dig, and only have one shot
                at each archaeological site. The storage, organization, and sharing of the primary data is
                as important, because what is not published doesn't exist for all intents and purposes.
                The reconstruction process is less of a responsibility and allows freedom and imagination
                to act alongside with scholarship.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                We are searching for ways to share archaeological information that may interest a broader
                public and serve as means to inspire reflections about the past, present, and future of the
                human species. We welcome artists to repurpose the information we gather and create, and
                we welcome computer experts to help us expedite the recording process, facilitate the
                organization and sharing of the data, and to provide eloquent ways to explain what we study
                and allow an as broad as possible public to enjoy our discoveries and theories about the past.
              </p>
            </div>
          </section>

          <section className="py-14">
            <div className="flex items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl md:text-3xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  Iberian Ships
                </h1>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-6 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The ships of the Renaissance are of special interest to us, because this is a period in which
                European ships and sailors evolved capacity and seamanship to be capable of sailing several
                months away from land and ventured into the Atlantic, Indian, and Pacific Oceans.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                After 1500, the economic advantages of the newly opened maritime trade routes became obvious.
                Although sailing around the African continent was a long and dangerous endeavor, a small ship
                with 150 tons of capacity could carry the cargo of 1500 camels and stay away from most thieves,
                warlords, tolls and taxes.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                During these two centuries the conception and construction of oceangoing ships evolved and
                blended along the Atlantic coasts of the Iberian Peninsula, a region situated on the nexus of
                two diverse seafaring worlds: the Mediterranean and the North Atlantic and Baltic.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                What emerged from this symbiosis between the Atlantic and Mediterranean shipbuilding traditions
                was a flush-laid, skeleton-built, two or three-masted vessel with new arrangements of square
                and lateen sails. Construction details and phases, or transitions in development, are still
                largely unknown because most shipwrecks from this period have been destroyed by treasure
                hunters, and the answers to these questions and others can only be found through
                archaeological research.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Modern nautical archaeology has contributed much to Iberian maritime studies since the
                field's inception in the 1960's. Initial research into early European shipwrecks in the
                New World began in the 1980's and continued into the 1990's with students from Texas A&M,
                although historical research into this time period dates back to the late 19th century
                with the coming 400th anniversary of 1492.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
