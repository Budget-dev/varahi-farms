import React from 'react';
import Image from 'next/image';

export const FarmJourneySection: React.FC = () => {
  const steps = [
    { num: 1, title: "Milk", desc: "Fresh milk harvested ethically from free-grazing buffaloes", align: "left" },
    { num: 2, title: "Micro-Unit", desc: "Crafted in small village units using earthen pots & wooden bilona", align: "right" },
    { num: 3, title: "Ware House", desc: "Tested twice for 100% purity & packed in airtight glass jars", align: "left" },
    { num: 4, title: "Dispatch", desc: "Fast express direct doorstep delivery in 14 days from milking", align: "right" },
  ];

  return (
    <section className="relative bg-[#FAF6EE] py-14 sm:py-20 px-4 overflow-hidden border-t border-[#E8DFD0]">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#113B29] tracking-tight">
            From Our Farmers’<br className="sm:hidden" /> To Your Kitchen
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-bold mt-2">
            In Just 14 Days
          </p>
        </div>

        {/* Journey Illustration Graphic Card */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5DCD0] shadow-md bg-white mb-8">
          <div className="relative w-full aspect-16/9 sm:aspect-21/9 min-h-[240px] sm:min-h-[380px]">
            <Image 
              src="/products/buffalo-ghee/journey_map.jpg"
              alt="From Our Farmers To Your Kitchen 14 Day Journey"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1000px"
              priority
            />
          </div>
        </div>

        {/* 4 Interactive Step Milestones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((st) => (
            <div 
              key={st.num}
              className="bg-white rounded-2xl p-4 border border-[#E9DFCF] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#E76F51] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {st.num}
                </span>
                <span className="font-sans font-extrabold text-sm sm:text-base text-[#113B29]">
                  {st.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
