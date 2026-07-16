import React from 'react';
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import outreachImage from "@/data/Images/outreach-header.png";

export default function Outreach() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
      <TopNavBar />

      <main className="flex-1 pt-16">
        {/* Hero Section — Full-width cinematic image, no text overlay */}
        <section className="relative w-full h-[300px] overflow-hidden">
          <img
            src={outreachImage}
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
                  Why Archaeology Matters
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#705a44] mt-2">
                  Filipe Castro • 2026
                </p>
              </div>
            </div>

            {/* Description text */}
            <div className="mt-10 space-y-6 pb-14">
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                In an old interview to a Duch television channel, philosopher George Steiner mentioned a scene
                in Hemingway’s book The Sun Also Rises that exposed eloquently the importance of memory and
                cultural references for a good and meaningful life. In the scene, one of two close friends
                on the way from Pamplona mentions the sight of the roofs of Roncesvalles in the horizon.
                The significance of those words, which announced, for the educated readers, the betrayal the
                main character, Jake Barnes, was going to suffer from his friend Bill Gorton. Associating
                Roncesvalles with the song of Roland and his death, betrayed by one of his knights would have,
                according to Steiner, prepared the reader for the upcoming events and land thickness, interest,
                and drama to the book. Steiner's point was that as people forget the song of Roland and the story
                of Charlemagne, their lives become flatter and less interesting, less complicated and rich.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                These references, memories, and stories are pieces of knowledge that philosopher Daniel Dennett
                calls thinking tools, as they are the tools that allow us to reason. One of his colleagues,
                Bo Dahlbom, wrote that as we cannot do much carpentry with bare hands, we cannot do much thinking
                with bare brains. We need memories, references, memes, to think better and faster, and archaeology,
                as literature and cinema, provide them in abundance, and make our lives richer, and far more interesting.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                Archaeology is a source of information about our past, the landscapes where our ancestors lived, their
                convictions, their thoughts, their problems, and knowing these landscapes we can imagine ourselves in
                them, and try to understand our humanity better, from a different viewpoint. In defense of our memories
                and our knowledge, George Steiner mentioned William Blake, something about the preciousness of the
                details when we try to inventory the totality of the human experience. Archaeology matters because
                it lends thickness to our lives.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                This section is a repository of data pertaining to maritime archaeology and its importance, and to
                treasure hunting, something that archaeologists consider highly destructive, and based on a shallow
                and unsophisticated attitude towards our past, culture, identity, and humanity, but that anthropologists
                must take into consideration as an important part of the human adventure: misery, basic needs, or just
                greed move people to look for easy wealth, lost treasure waiting to be found and make the finders
                perhaps happy, or as it often happens, make them fight over every coin and worry about the treasure
                they have missed.
              </p>
              <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light">
                It is impossible to talk about archaeology, the source of wonder about our humanity and the our human
                condition, without talking about treasure hunters and their celebrated fever for easy wealth, which
                deafens them to the great philosophical questions that inspire the rest of us: who are we? where do we
                come from? what can we know? where are we going to? what should we do? and turns them to more pedestrian
                answers, like the famous one 'today is the day!'
              </p>
            </div>
          </section>

          {/*<section className="pt-14">
            <div className="flex items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl md:text-3xl font-light text-[#2f4050] tracking-tight leading-tight font-display">
                  Resources
                </h1>
              </div>
            </div>
          </section> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
