"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ComboIcon } from './JarIcon';

interface FeaturedBannerProps {
  onCta: () => void;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ onCta }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-0 md:px-10 mb-8 md:mb-20">
      {/* Removed rounded corners on mobile (rounded-none), significantly reduced padding/height */}
      <div className="bg-gradient-to-br from-primary via-[#1A5C38] to-[#3AAA60] rounded-none md:rounded-[40px] overflow-hidden relative group border-y md:border-none border-white/5">
        <div className="absolute top-[-40px] right-[-40px] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_68%)] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="p-6 md:p-20 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-16 items-center relative z-10">
          <div className="flex items-center justify-center order-1 md:order-2">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
               <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full scale-125"></div>
               {/* Smaller icon on mobile */}
               <ComboIcon className="w-[100px] h-[100px] md:w-[320px] md:h-[320px] relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          <div className="text-center md:text-left order-2 md:order-1">
            <div className="text-[7px] md:text-[10px] font-black text-white/50 tracking-[3px] uppercase mb-1 md:mb-5">Limited Offer · Combo Pack</div>
            <h2 className="font-headline text-2xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-1 md:mb-5">
              Desi + Gir<br /><em className="italic text-white underline decoration-white/20 underline-offset-8">Combo Deal</em>
            </h2>
            <p className="hidden md:block text-white/60 text-xs md:text-base leading-relaxed mb-6 md:mb-10 max-w-sm font-light mx-auto md:mx-0">
              Two legendary jars, double the goodness. Save ₹445 on our most-loved combo.
            </p>
            <div className="flex flex-row items-center justify-center md:justify-start gap-4 md:gap-6 mt-3 md:mt-0">
              <Button 
                onClick={onCta}
                className="h-9 md:h-14 px-6 md:px-8 rounded-full bg-white text-primary font-black uppercase tracking-widest shadow-xl hover:translate-y-[-2px] transition-all text-[9px] md:text-sm"
              >
                Shop Combo →
              </Button>
              <div className="font-headline text-lg md:text-3xl font-extrabold text-white">Save 19%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
