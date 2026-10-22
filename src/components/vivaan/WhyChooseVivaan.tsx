"use client";

import React from 'react';

const WHY_CHOOSE_ITEMS = [
  {
    title: "Native Breeds & Seeds",
    desc: "Only indigenous Gir cows & native non-GMO seed varieties grown on pesticide-free soil.",
    icon: (
      <svg className="w-9 h-9 text-[#0D3B2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-7" />
        <path d="M9 9a3 3 0 0 1 6 0c0 4-3 6-3 6" />
        <path d="M12 15a4 4 0 0 0-4-4 4 4 0 0 0-4 4" />
        <path d="M12 15a4 4 0 0 1 4-4 4 4 0 0 1 4 4" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    title: "Traditional Vedic Processing",
    desc: "Slow cold wood-pressed at room temperature and hand-churned Vedic Bilona curd method.",
    icon: (
      <svg className="w-9 h-9 text-[#0D3B2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="14" width="14" height="7" rx="2" />
        <path d="M12 3v11" />
        <path d="M8 8l4-4 4 4" />
        <path d="M9 14h6" />
      </svg>
    )
  },
  {
    title: "100+ Lab Quality Tests",
    desc: "Every single batch rigorously tested for 0% adulteration, zero heavy metals, and zero preservatives.",
    icon: (
      <svg className="w-9 h-9 text-[#0D3B2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    )
  },
  {
    title: "Direct From Native Farmers",
    desc: "Ethical, transparent direct partnerships that empower generational rural farmer families.",
    icon: (
      <svg className="w-9 h-9 text-[#0D3B2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M7 14h10" />
        <path d="M10 11V6h4v5" />
        <path d="M4 14H2v-3a2 2 0 0 1 2-2h3" />
        <path d="M17 9h3a2 2 0 0 1 2 2v3h-2" />
      </svg>
    )
  }
];

export const WhyChooseVivaan: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-[#FFFFFF] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
            Why Choose Vivaan?
          </h2>
          <div className="w-16 h-0.5 bg-[#0D3B2E]/20 mx-auto mt-3 rounded-full" />
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {WHY_CHOOSE_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FBF9F5] border border-[#EBE3D3] hover:border-[#0D3B2E]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-[#E0D7C5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xs">
                {item.icon}
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#0D3B2E] mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4524] font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
