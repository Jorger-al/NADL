import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import Header from "@/data/Images/Headers/DevelopmentHeader.jpg";
import ISELLogo from "@/data/Images/Partners/ISEL.png";

export default function WebDevelopmentTeam() {
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
                  Web Development Team
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  Meet the team behind the NADL platform
                </p>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-10 space-y-6">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The Nautical Archaeology Digital Library (NADL) was developed as the final-year project of
                Vítor Rebelo and Jorge Almeida, undergraduate students in the Bachelor's Degree in Computer
                Engineering and Multimedia at the Instituto Superior de Engenharia de Lisboa (ISEL). At the
                time of the project's development, Vítor was 23 years old and Jorge was 22, both completing
                the final stage of their academic journey while applying the knowledge and skills acquired
                throughout the programme to a real-world digital heritage initiative.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The multidisciplinary nature of the degree played a fundamental role in the successful
                implementation of the platform. Throughout their studies, the students developed strong
                competencies in software engineering, web development, database systems, human-computer
                interaction, multimedia technologies, user experience design, and project management. This
                combination of technical and design-oriented skills provided the foundation for building a
                modern, responsive, and scalable web platform capable of preserving valuable archaeological
                information to both researchers and the general public.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Beyond the technical implementation, the project represented an opportunity to bridge computer
                engineering with cultural heritage preservation. Working closely with specialists in nautical
                archaeology allowed the students to translate complex scientific requirements into intuitive
                digital solutions, ensuring that the platform would be both academically rigorous and accessible
                to a broad audience.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                The success of the project was made possible through the continuous guidance of Professor Pedro
                Fazenda, who supervised the development from an engineering perspective. His expertise, technical
                feedback, and academic mentorship were essential throughout every stage of the project, from
                system architecture and software design to implementation and evaluation.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Equally important was the collaboration with Professor Filipe Castro, project supervisor and
                founder of the Nautical Archaeology Digital Library. His extensive experience in nautical
                archaeology and digital heritage provided the project's vision and scientific direction.
                Through regular discussions and continuous feedback, he ensured that the platform addressed
                the needs of the archaeological community while remaining faithful to the mission of making
                maritime cultural heritage more accessible and better preserved for future generations.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Together, this collaboration between students, academia, and domain experts demonstrates how
                interdisciplinary partnerships can transform academic knowledge into practical solutions with
                lasting scientific and societal impact.
              </p>
            </div>

            <div className="flex flex-col items-center text-center mb-3">
              <a
                href="https://www.isel.pt/en"
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-2 flex items-center justify-center"
              >
                <img
                  src={ISELLogo}
                  alt="Instituto Superior de Engenharia de Lisboa logo"
                  className="max-h-full max-w-[600px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                />
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
