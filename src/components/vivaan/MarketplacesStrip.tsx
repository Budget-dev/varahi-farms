"use client";

import React from 'react';

export const MarketplacesStrip: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#DF9F3D] via-[#E5A844] to-[#DF9F3D] py-4 sm:py-5 border-y border-[#D1922E] select-none">
      <div className="max-w-[800px] mx-auto px-4 text-center">
        
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-black text-[#2D1F06] uppercase tracking-[3px] mb-3">
          Also Available On
        </h3>

        {/* Marketplaces Badges */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          
          {/* Amazon Badge */}
          <div className="bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-[#382607]/20 shadow-xs flex items-center gap-1.5">
            <span className="font-sans font-black text-xs sm:text-sm text-[#111]">amazon</span>
            <span className="text-[10px] text-[#FF9900] font-black">.in</span>
          </div>

          {/* Flipkart Badge */}
          <div className="bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-[#382607]/20 shadow-xs flex items-center gap-1.5">
            <span className="font-sans font-black text-xs sm:text-sm text-[#2874F0]">Flipkart</span>
            <span className="text-[10px] text-[#FFE500] font-black">✦</span>
          </div>

          {/* Blinkit Badge */}
          <div className="bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-[#382607]/20 shadow-xs flex items-center gap-1.5">
            <span className="font-sans font-black text-xs sm:text-sm text-[#0C831F]">blink<span className="text-[#F8CB46]">it</span></span>
            <span className="text-[9px] bg-[#0C831F] text-white px-1 rounded-sm font-bold">10 MIN</span>
          </div>

        </div>

      </div>
    </section>
  );
};
