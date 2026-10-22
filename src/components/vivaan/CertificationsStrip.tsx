"use client";

import React, { useRef } from 'react';
import { useAutoScroll } from '@/hooks/use-auto-scroll';

const CERTS = [
  {
    code: "ISO 9001:2015",
    label: "Quality Certified",
    sub: "Certified Management System"
  },
  {
    code: "ISO 22000",
    label: "Food Safety",
    sub: "FSMS Standards"
  },
  {
    code: "JAIVIK BHARAT",
    label: "India Organic",
    sub: "Organic Certification"
  },
  {
    code: "US FDA",
    label: "Registered Facility",
    sub: "US Food & Drug Admin"
  },
  {
    code: "FSSAI",
    label: "Central License",
    sub: "Lic. No. 10822003000214"
  },
  {
    code: "100% ORGANIC",
    label: "NPOP Standards",
    sub: "Pesticide & Chemical Free"
  },
  {
    code: "CRUELTY FREE",
    label: "Vedic Ahimsa Dairy",
    sub: "Calf-First Ethic"
  },
  {
    code: "NON-GMO",
    label: "Native Seeds",
    sub: "Heirloom Crop Varieties"
  }
];

export const CertificationsStrip: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useAutoScroll(scrollRef, {
    interval: 3000,
    resumeDelay: 3000,
    stepDistance: 135
  });

  // Repeated list for continuous, seamless loop-around on wide displays
  const displayCerts = [...CERTS, ...CERTS];

  return (
    <section className="py-8 sm:py-12 bg-[#FAF7F2] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        <div className="text-center mb-6">
          <p className="text-[11px] sm:text-xs font-black text-[#6B5A45] tracking-[3px] uppercase">
            Recognized & Certified For Complete Food Purity
          </p>
        </div>

        {/* Badges Auto-scrolling Strip on Mobile and Desktop */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth gap-3 sm:gap-4 md:gap-5 items-center py-2 px-1"
        >
          {displayCerts.map((cert, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-[#EBE3D3] hover:border-[#0D3B2E]/40 hover:shadow-md transition-all duration-300 text-center group h-24 sm:h-28 w-[110px] sm:w-[130px] md:w-[140px] shrink-0 cursor-pointer"
            >
              {/* Outer Seal Ring */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-[#0D3B2E]/40 flex flex-col items-center justify-center mb-1 group-hover:border-[#0D3B2E] transition-colors bg-[#FAF8F5]">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0D3B2E]/10 flex items-center justify-center">
                  <span className="text-[7.5px] sm:text-[8px] font-black text-[#0D3B2E] tracking-tighter uppercase leading-none text-center">
                    {cert.code.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="text-[9px] sm:text-[10px] font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors leading-tight truncate w-full px-1">
                {cert.label}
              </div>
              <div className="text-[7.5px] sm:text-[8px] text-gray-500 truncate w-full px-1">
                {cert.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
