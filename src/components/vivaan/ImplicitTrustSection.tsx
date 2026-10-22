"use client";

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

const TRUST_POINTS = [
  "0% Chemicals & Zero Preservatives",
  "100% Traditional Vedic Bilona & Wood-Churned Method",
  "Pure Native Desi Murrah Buffalo & Gir Cow Milk",
  "Direct From Certified Organic Pastures",
  "Complete Transparency from Farm to Doorstep"
];

export const ImplicitTrustSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-14 bg-[#EAF2ED] relative overflow-hidden border-b border-[#D5E5DA]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6">
        
        {/* Main Card with Pastoral Farm Artwork Background */}
        <div className="relative rounded-3xl overflow-hidden border border-[#BDDFCA] shadow-lg bg-white">
          
          {/* Farm Artwork Image as Top / Backdrop */}
          <div className="relative w-full h-48 sm:h-64 md:h-80">
            <Image
              src="/images/home/trust_pastoral_farm.jpg"
              alt="Vivaan Farms - Traditional Pastoral Organic Farm"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 960px"
            />
            {/* Soft gradient fading into content area */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F4F9F5] via-[#F4F9F5]/60 to-transparent" />
          </div>

          {/* Content Card with Checklist */}
          <div className="relative z-10 -mt-16 sm:-mt-20 px-5 sm:px-10 pb-8 sm:pb-12 text-center">
            
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#BDDFCA] shadow-md max-w-xl mx-auto">
              {/* Section Headline matching screenshot */}
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-black text-[#0D3520] leading-tight mb-5">
                The Implicit Trust<br />
                <span className="text-[#1B5E3B]">We&apos;re Building Up</span>
              </h2>

              {/* Checklist Items */}
              <div className="space-y-3 sm:space-y-3.5 text-left">
                {TRUST_POINTS.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E5F3EB] border border-[#1B5E3B]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C85A32] stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#1A1410] leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              {/* Purity Guarantee Note */}
              <div className="mt-6 pt-4 border-t border-[#EAE3D2] text-center">
                <p className="text-[10px] sm:text-xs font-bold text-[#5C4524] uppercase tracking-wider">
                  🌿 100% Tested In NABL Accredited Labs Before Every Dispatch
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
