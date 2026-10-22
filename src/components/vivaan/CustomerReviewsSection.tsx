"use client";

import React, { useState } from 'react';
import { Star, CheckCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const REVIEWS = [
  {
    name: "Dr. Anita Roy",
    city: "New Delhi",
    role: "Verified Buyer · Ayurvedic Practitioner",
    rating: 5,
    title: "Real Vedic Bilona Ghee with therapeutic aroma",
    review: "As an Ayurvedic physician, I am extremely particular about ghee. Most market brands use cream heated at high temperatures. Vivaan's A2 Gir Cow Ghee is genuinely cultured curd bilona. Granular, deeply aromatic, and gentle on the gut.",
    product: "A2 Gir Cow Bilona Ghee"
  },
  {
    name: "Vikram Patel",
    city: "Ahmedabad",
    role: "Verified Buyer · Home Chef",
    rating: 5,
    title: "Best cold-pressed mustard oil in India",
    review: "The pungency of this yellow mustard oil is unbeatable. Traditional kachi ghani slow pressing keeps all the natural aroma intact. Our fish curries and pickles taste authentic like childhood again. Highly recommended!",
    product: "Wood Pressed Mustard Oil"
  },
  {
    name: "Priya Sharma",
    city: "Bengaluru",
    role: "Verified Buyer · Fitness Enthusiast",
    rating: 5,
    title: "Noticeable improvement in family health",
    review: "Switched all our refined oils to Vivaan's wood-pressed groundnut and mustard oils six months ago. No sticky residue in the pan, clean natural flavour, and our lipid profile reports are better than ever.",
    product: "Cooking Oils Trio Pack"
  },
  {
    name: "Rajeshwar Nair",
    city: "Kochi",
    role: "Verified Buyer · Organic Advocate",
    rating: 5,
    title: "Raw honey with real pollen and zero sugar syrup",
    review: "You can taste the wild forest flowers in every spoonful of this honey. It crystallized naturally in winter just like authentic raw honey should. Their transparent lab reports gave us 100% peace of mind.",
    product: "Raw Wild Forest Honey"
  }
];

export const CustomerReviewsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="py-8 sm:py-12 md:py-20 bg-[#FFFFFF] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14">
          <p className="text-[10px] sm:text-sm font-black text-[#6B5A45] tracking-[2.5px] uppercase mb-1">
            Real Experiences
          </p>
          <h2 className="font-serif text-xl sm:text-3xl md:text-5xl font-extrabold text-[#0D3B2E] tracking-tight">
            What Do Our Customers Say
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-[#0D3B2E]/25 mx-auto mt-2 sm:mt-3 rounded-full" />
        </div>

        {/* 2-up on Mobile, 4-up on Desktop Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {REVIEWS.map((rev, idx) => {
            const isHiddenOnMobile = !showAll && idx >= 2;

            return (
              <div
                key={idx}
                className={cn(
                  "bg-[#FAF8F5] rounded-xl sm:rounded-3xl p-2.5 sm:p-6 border border-[#EBE3D3] hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex-col justify-between group",
                  isHiddenOnMobile ? "hidden sm:flex" : "flex"
                )}
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500 mb-1.5 sm:mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  {/* Review Headline */}
                  <h4 className="font-serif text-xs sm:text-base font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors leading-tight sm:leading-snug mb-1 sm:mb-2 line-clamp-2">
                    &ldquo;{rev.title}&rdquo;
                  </h4>

                  {/* Review Body */}
                  <p className="text-[10px] sm:text-[13px] text-[#5C4524] font-normal leading-tight sm:leading-relaxed mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                    {rev.review}
                  </p>
                </div>

                {/* Author & Verified Badge */}
                <div className="pt-2 sm:pt-4 border-t border-[#EAE3D2] flex items-center justify-between mt-auto gap-1">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-900 truncate">
                      {rev.name}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-gray-500 truncate">
                      {rev.city} · <span className="text-emerald-700 font-semibold">{rev.product}</span>
                    </div>
                  </div>

                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0" title="Verified Customer">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile "See All" Toggle Button */}
        {REVIEWS.length > 2 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#0D3B2E] hover:text-white"
            >
              <span>{showAll ? "Show Less" : "See All Reviews"}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showAll && "rotate-180")} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
