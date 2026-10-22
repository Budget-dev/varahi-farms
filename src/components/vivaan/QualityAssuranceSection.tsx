"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUALITY_CARDS = [
  {
    title: "In-House Lab Testing Exceeding FSSAI Parameters",
    desc: "Rigorous analytical testing for fatty acid profile, moisture, and absence of adulterants.",
    image: "/images/home/lab_testing_scientists.jpg"
  },
  {
    title: "We Quality Check Every Single Batch",
    desc: "Every single lot undergoes dual microscopic and sensory evaluation before bottling.",
    image: "/images/home/lab_microscope_analyst.jpg"
  },
  {
    title: "Purity & Quality Guaranteed",
    desc: "Zero chemical solvent extraction, zero paraffin, and zero artificial aroma enhancers.",
    image: "/images/home/lab_purity_pipette.jpg"
  },
  {
    title: "Lab Reports: Don't Just Trust Us",
    desc: "Every batch report is publicly accessible. Scan the QR on your bottle to verify purity.",
    image: "/images/home/lab_quality_report.jpg"
  }
];

export const QualityAssuranceSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="py-8 sm:py-12 md:py-20 bg-[#E8F4F8] border-b border-[#D2E7ED] relative select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14">
          <p className="text-[10px] sm:text-sm font-black text-[#1A4E5F] tracking-[2.5px] uppercase mb-1">
            Zero Compromise Standard
          </p>
          <h2 className="font-serif text-xl sm:text-3xl md:text-5xl font-extrabold text-[#0D3B2E] tracking-tight">
            Only Perfect Makes The Cut
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-[#0D3B2E]/25 mx-auto mt-2 sm:mt-3 rounded-full" />
        </div>

        {/* Side-by-side Mobile Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {QUALITY_CARDS.map((card, idx) => {
            const isHiddenOnMobile = !showAll && idx >= 2;

            return (
              <div
                key={idx}
                className={cn(
                  "bg-white rounded-xl sm:rounded-3xl overflow-hidden shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D2E7ED] group flex-col justify-between",
                  isHiddenOnMobile ? "hidden sm:flex" : "flex"
                )}
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 320px"
                  />
                </div>

                {/* Text */}
                <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
                  <div>
                    <h3 className="font-serif text-xs sm:text-base font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors leading-tight sm:leading-snug mb-1 sm:mb-2 line-clamp-2">
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[9px] sm:text-xs font-bold text-[#0D3B2E] mt-auto">
                    <span className="truncate">Verify Parameters</span>
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile "See All" Toggle Button */}
        {QUALITY_CARDS.length > 2 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#0D3B2E] hover:text-white"
            >
              <span>{showAll ? "Show Less" : "See All"}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showAll && "rotate-180")} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
