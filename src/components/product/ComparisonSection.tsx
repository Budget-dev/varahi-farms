import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const rows = [
    { title: "Farmer-Owned", vivaan: true, others: false },
    { title: "Made in Micro-Units", vivaan: true, others: false },
    { title: "No Factory", vivaan: true, others: false },
    { title: "Traditional Extraction", vivaan: true, others: false },
    { title: "Freshly Made", vivaan: true, others: false },
  ];

  return (
    <section className="relative bg-[#D4EDE1] py-14 sm:py-20 px-4 overflow-hidden">
      
      {/* Top subtle hill wave curve */}
      <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-white" style={{
        clipPath: 'ellipse(60% 100% at 50% 0%)'
      }} />

      <div className="max-w-[850px] mx-auto relative z-10 pt-2">
        
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#113B29] tracking-tight">
            What Makes Us Different?
          </h2>
        </div>

        {/* 3-Column Comparison Table (Exact match to reference screenshots) */}
        <div className="grid grid-cols-12 gap-2 sm:gap-3 items-stretch">
          
          {/* Column 1: Feature Labels (White Rounded Card) */}
          <div className="col-span-6 sm:col-span-5 flex flex-col justify-between">
            {/* Empty Header Spacer to align with column headers */}
            <div className="h-12 sm:h-16 mb-2"></div>
            
            {/* Feature Rows */}
            <div className="flex flex-col gap-2.5 sm:gap-3 flex-1 justify-around">
              {rows.map((row, i) => (
                <div 
                  key={i} 
                  className="bg-white/95 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 border border-[#BCE1CE] shadow-2xs flex items-center min-h-[50px] sm:min-h-[58px]"
                >
                  <span className="font-sans text-xs sm:text-base font-extrabold text-[#113B29] leading-snug">
                    {row.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Vivaan (Golden Yellow Pillar Card - Matching Reference Column 2) */}
          <div className="col-span-3 sm:col-span-3.5 flex flex-col bg-[#F5BF38] rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-md border-2 border-[#DDA320]">
            {/* Header */}
            <div className="h-12 sm:h-16 flex items-center justify-center">
              <span className="font-serif font-black text-sm sm:text-xl text-[#1E293B] tracking-wide text-center">
                Vivaan
              </span>
            </div>

            {/* Checkmark Rows */}
            <div className="flex flex-col gap-2.5 sm:gap-3 flex-1 justify-around">
              {rows.map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-center min-h-[50px] sm:min-h-[58px]"
                >
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-[#143D24] stroke-[3.5]" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Others (Soft Mint Card - Matching Reference Column 3) */}
          <div className="col-span-3 sm:col-span-3.5 flex flex-col bg-[#C3E4D4] rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-[#A6D4BF]">
            {/* Header */}
            <div className="h-12 sm:h-16 flex items-center justify-center">
              <span className="font-serif font-bold text-sm sm:text-xl text-[#1E4D36] tracking-wide text-center">
                Others
              </span>
            </div>

            {/* Cross Rows */}
            <div className="flex flex-col gap-2.5 sm:gap-3 flex-1 justify-around">
              {rows.map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-center min-h-[50px] sm:min-h-[58px]"
                >
                  <X className="w-5 h-5 sm:w-7 sm:h-7 text-[#1A4D2E] stroke-[3]" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom hill wave curve */}
      <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-[#FAF6EE]" style={{
        clipPath: 'ellipse(60% 100% at 50% 100%)'
      }} />

    </section>
  );
};
