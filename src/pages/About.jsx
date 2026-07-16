import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import Header from "@/data/Images/Headers/AboutHeader.png";
import ArtesLogo from "@/data/Images/Partners/Belas_Artes.png";
import BergenLogo from "@/data/Images/Partners/BergenMaritimeMuseum.png";
import FEUPLogo from "@/data/Images/Partners/FEUP.png";
import ISELLogo from "@/data/Images/Partners/ISEL.png";
import JustDiveLogo from "@/data/Images/Partners/justdive.jpg";
import INALogo from "@/data/Images/Partners/INA.png";
import NAPLogo from "@/data/Images/Partners/NAP.webp";
import HTCLogo from "@/data/Images/Partners/HTC.png";
import CFELogo from "@/data/Images/Partners/CFE.jpg";
import UCLogo from "@/data/Images/Partners/UCoimbra.jpg";

export default function About() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section — Full-width cinematic image, no text overlay */}
        <section className="relative w-full h-[300px] overflow-hidden">
          <img
            src={Header}
            alt="Maritime archaeology"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </section>

        {/* Main Content — Centered, narrow column */}
        <div className="w-full max-w-[900px] mx-auto px-6">

          {/* About Section */}
          <section className="py-14">
            {/* Title with accent bar */}
            <div className="flex items-start gap-4 mb-3">
              <div className="w-[3px] h-16 bg-[#705a44] shrink-0"></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  The Nautical Archaeology Digital Library
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  Filipe Castro • 2026
                </p>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-10 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The Nautical Archaeology Digital Library (NADL) is a comprehensive academic repository
                dedicated to the preservation and dissemination of underwater cultural heritage. By
                integrating traditional archaeological methodologies with cutting-edge digital
                technologies, the project creates high-fidelity records of shipwrecks, submerged
                landscapes, and maritime artifacts that are increasingly threatened by environmental
                changes and human activity.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Archaeology is public or it is nothing. The main purpose of any archaeological project
                is to acquire knowledge and share it with both the domain experts and the general public.
                Archaeologists destroy the sites they dig. Documenting and sharing are archaeologists' main
                responsibilities.
                The Nautical Archaeology Digital Library is part of the Centre for Functional Ecology at the
                University of Coimbra, and is funded by a FCT grant (<a className="text-[#705a44]" href="https://sciproj.ptcris.pt/en/7880EEC/">https://sciproj.ptcris.pt/en/7880EEC/</a>).
              </p>
            </div>
          </section>

          {/* Mission Box */}
          <section className="mb-20">
            <div className="border border-[#d1d5db] bg-white px-10 py-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mb-5">
                Our Mission
              </p>
              <blockquote className="text-[#2c2c2e] text-xl md:text-[20px] leading-[1.7] italic font-light">
                The Nautical Archaeology Digital Library mission is to be the place of a community of scholars
                as opposed to an hierarchy – and become a space where archaeologists from around the world can
                share their experiences and exchange information with their colleagues, as well as with a wider
                public. The second objective of NADL is to increase the visibility of nautical archaeology and
                emphasize its social importance.
              </blockquote>
            </div>
          </section>

          {/* Timeline / Chronological Narrative */}
          <section className="mb-20">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mb-10">
              Chronological Narrative
            </p>

            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-[#d1d5db]"></div>

              {/* Timeline events */}
              <div className="space-y-12">
                {/* 2006 */}
                <div className="relative">
                  <div className="absolute -left-8 top-[6px] w-[15px] h-[15px] rounded-full border-2 border-[#705a44] bg-white"></div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#705a44] pt-1.5 mb-2">
                    2006 — Foundation
                  </p>
                  <p className="text-[#4b5563] text-sm leading-[1.75] font-light">
                    The NADL started as a collaborative effort of researchers from the Texas A&M University's
                    Center for the Study of Digital Libraries (CSDL) and the J. Richard Steffy Ship Reconstruction
                    Laboratory (ShipLAB).
                    t originally drew its materials from the extensive collection of artifacts gathered from
                    the Pepper Wreck excavation in Portugal, as well as the extensive archives collected at the
                    ShipLAB during field studies over the past two decades.
                  </p>
                </div>

                {/* 2016 */}
                <div className="relative">
                  <div className="absolute -left-8 top-[6px] w-[15px] h-[15px] rounded-full border-2 border-[#705a44] bg-white"></div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#705a44] pt-1.5 mb-2">
                    2016 — Technical Expansion
                  </p>
                  <p className="text-[#4b5563] text-sm leading-[1.75] font-light">
                    Implementation of the first nationwide 3D scanning protocols for coastal
                    shipwrecks, resulting in the successful mapping of over 40 distinct historical
                    sites across the Mediterranean.
                  </p>
                </div>

                {/* 2021 */}
                <div className="relative">
                  <div className="absolute -left-8 top-[6px] w-[15px] h-[15px] rounded-full border-2 border-[#705a44] bg-white"></div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#705a44] pt-1.5 mb-2">
                    2021 — Global Open Access
                  </p>
                  <p className="text-[#4b5563] text-sm leading-[1.75] font-light">
                    Launch of the Digital Library interface, providing researchers worldwide with
                    high-resolution access to the repository's data-intensive archaeological models.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Web Development Team */}
          <section className="mb-20">
            <div className="border-t border-[#d1d5db] pt-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mb-8">
                Web Development Team
              </p>

              <div className="bg-white border border-[#d1d5db] p-10">
                <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
                  <div>
                    <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light mb-6">
                      The NADL platform was conceived and developed through a collaborative effort
                      involving final-year Computer Engineering students from
                      the Instituto Superior de Engenharia de Lisboa (ISEL), working alongside the
                      project's research team. Combining expertise in software engineering, digital
                      heritage and maritime archaeology, the initiative aimed to create an
                      accessible, scalable and sustainable digital platform capable of preserving
                      and managing underwater cultural heritage to researchers,
                      institutions and the wider public.
                    </p>

                    <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                      Discover the people behind the development of the Nautical Archaeology
                      Digital Library, the technologies adopted throughout the project, and the
                      collaborative process that transformed an academic initiative into a digital
                      platform for maritime heritage.
                    </p>

                    <div className="mt-8 flex justify-center">
                      <Link
                        to="/webdevelopmentteam"
                        className="inline-flex items-center gap-3 border border-[#705a44] px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold text-[#705a44] hover:bg-[#705a44] hover:text-white transition-all duration-300"
                      >
                        Meet the Team
                        <span className="text-lg">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Partners */}
          <section className="mb-20">
            <div className="border-t border-[#d1d5db] pt-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mb-10">
                Institutional Partners
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 text-[#6b7280]">
                {[
                  {
                    name: "Instituto Superior de Engenharia de Lisboa",
                    location: "Lisbon, Portugal",
                    url: "https://www.isel.pt/",
                    logo: ISELLogo
                  },
                  {
                    name: "Faculdade de Engenharia da Universidade do Porto",
                    location: "Porto, Portugal",
                    url: "https://www.fe.up.pt/",
                    logo: FEUPLogo
                  },
                  {
                    name: "Faculdade de Belas Artes da Universidade de Lisboa",
                    location: "Lisbon, Portugal",
                    url: "https://www.belasartes.ulisboa.pt/",
                    logo: ArtesLogo
                  },
                  {
                    name: "Just Dive",
                    location: "Peniche, Portugal",
                    url: "https://justdive.pt/",
                    logo: JustDiveLogo
                  },
                  {
                    name: "Bergen Maritime Museum",
                    location: "Bergen, Norway",
                    url: "https://sjofartsmuseum.museumvest.no/",
                    logo: BergenLogo
                  },
                  {
                    name: "Institute of Nautical Archaeology",
                    location: "Texas, USA",
                    url: "https://nauticalarch.org/",
                    logo: INALogo
                  },
                  {
                    name: "Nautical Archaeology Program",
                    location: "Texas, USA",
                    url: "https://anthropology.tamu.edu/nautical-archaeology-program/",
                    logo: NAPLogo
                  },
                  {
                    name: "História, Territórios e Comunidades",
                    location: "Portugal",
                    url: "https://htc.cfe.uc.pt/",
                    logo: HTCLogo
                  },
                  {
                    name: "Centre for Functional Ecology",
                    location: "Coimbra, Portugal",
                    url: "https://cfe.uc.pt/",
                    logo: CFELogo
                  },
                  {
                    name: "Universidade de Coimbra",
                    location: "Coimbra, Portugal",
                    url: "https://uc.pt/",
                    logo: UCLogo
                  }
                ].map((partner, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mb-5 flex items-center justify-center h-16 w-full"
                    >
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-full max-w-[160px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                      />
                    </a>
                    <p className="text-sm font-semibold text-[#374151] mb-1 leading-snug max-w-[240px]">
                      {partner.name}
                    </p>
                    <p className="text-xs text-[#9ca3af]">
                      {partner.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
