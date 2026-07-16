import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import Header from "@/data/Images/Headers/UCHHeader.jpg";

export default function PortugalUCH() {
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
                  Portugal UCH
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  Filipe Castro • January 2026
                </p>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-10 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Portugal has an old and diverse seafaring tradition and a unique shipbuilding tradition.
                Situated on the nexus of two maritime worlds, the Atlantic/Baltic, and the Mediterranean
                traditions, Portugal developed a plethora of unique ships and boats, and the large oceangoing
                vessels that allowed the establishment of the India Route, the longest commercial route of
                its time during the early 16th century. These ships and boats have not been systematically
                inventoried and studied, however, despite an impressive amount of research developed by
                historians, ethnographers and archaeologists.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                This project consists of the development of a computer-based ontology to connect isolated
                bodies of data and share all the information available with the international community of
                maritime historians, ethnographers, and archaeologists. It is a development of the Nautical
                Archaeology Digital Library (NADL – NSF Grant IIS-0534314), a community of scholars that we
                have created and developed at Texas A&M University, which included a team of colleagues and
                students, since 2006.
              </p>
            </div>
          </section>

          <section className="pt-14">
            <div className="flex items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl md:text-3xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  Development
                </h1>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-6 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                This project is intended as an inventory of known underwater sites in Portuguese waters.
                The end product is a computer-based ontology that helps users to connect isolated bodies
                of data and share the information available. This first phase is a GIS-based database with
                references to underwater sites that have been declared by divers, fishermen, and other
                stakeholders of the sea.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                A national database of the underwater cultural heritage of any country is, by definition,
                a work in progress. Our's is being built from the bottom up. The official national database
                (Endovélico) is the result of a long process that started in the 1980s as an effort of a
                group of interested citizens.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The main objective of this project is to make data available and try to create a public
                interest on the underwater cultural heritage of Portugal. We hope that this project may be
                used as a learning environment where a wide range of stakeholders can ask questions and find
                answers, discuss interpretations, and participate in the making of this archive.
              </p>
            </div>
          </section>

          <section className="pt-14">
            <div className="flex items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl md:text-3xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  Outreach
                </h1>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-6 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Although municipalities have no jurisdiction over the waters along their coast, we are
                organizing the territory along Municipalities and Capitanias, the maritime authorities.
                The main reason is that we would like to involve the populations as much as possible in
                the study and protection of the cultural heritage, and try to engage local museums and
                schools in our effort.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                We have already established working relations with several municipalities, such as Esposende,
                Vila do Conde, Alcacer do Sal, or Lagos. Moreover, we want to work with groups of divers and
                help them develop scholarly projects that promote the strategic importance of Portugal's
                submerged cultural heritage.
              </p>
            </div>
          </section>

          <section className="py-14">
            <div className="flex items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl md:text-3xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  References
                </h1>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-6 space-y-2">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Demilio, C., Castro, F., 2025. "Digital Archaeology Underwater: Ethical, Epistemic
                and Climate Challenges for a Collaborative Future." Heritage, 8, 383.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Castro, F., 2025. "An Inventory for the Portuguese Submerged Cultural Heritage,"
                Journal of Maritime Archaeology.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Castro, F., Bita, C., Pissarra, J., Frabetti, B., 2024. "Portuguese India Route
                Ships," Journal of Maritime Archaeology.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Castro, F., and Medina, S., 2022. "Shipwrecks and Storytelling," Heritage, 5.4: 3397-3410.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Castro, F., 2022. "Carta Arqueológica Subaquática de Portugal," Almadan (online) 25.2: 9-17.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
