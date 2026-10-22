"use client";

import React from 'react';

const MEDIA_MENTIONS = [
  { name: "THE TIMES OF INDIA", font: "font-serif font-black tracking-widest" },
  { name: "YOURSTORY", font: "font-sans font-black tracking-wider" },
  { name: "The Indian EXPRESS", font: "font-serif italic font-bold tracking-tight" },
  { name: "Hindustan Times", font: "font-serif font-bold tracking-normal" },
  { name: "ORGANIC DAILY", font: "font-mono font-bold tracking-widest" }
];

export const FeaturedInStrip: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#E5A844] via-[#DF9F3D] to-[#E5A844] py-4 sm:py-5 border-y border-[#D1922E] shadow-inner select-none overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-black text-[#382607] uppercase tracking-[3px] mb-3">
          Featured In
        </h3>

        {/* Media Logos / Brand Marks */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap opacity-90">
          {MEDIA_MENTIONS.map((media, i) => (
            <div 
              key={i} 
              className={`text-[#261A05] text-xs sm:text-sm md:text-base ${media.font} drop-shadow-xs whitespace-nowrap hover:opacity-100 transition-opacity`}
            >
              {media.name}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
