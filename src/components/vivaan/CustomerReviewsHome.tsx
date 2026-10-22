"use client";

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "The aroma of this A2 Bilona Ghee took me back to my grandmother's village. Authentic, rich, and truly pure. Vivaan Farms has completely replaced commercial ghee in our kitchen.",
    name: "Dr. Priya Sharma",
    location: "Mumbai",
    verified: true,
    rating: 5,
    product: "Vedic A2 Buffalo Ghee"
  },
  {
    quote: "Raw forest honey that actually tastes like pure wildflowers! The texture is thick and unpasteurized. You can immediately feel the difference from supermarket honeys.",
    name: "Vikram Malhotra",
    location: "Bengaluru",
    verified: true,
    rating: 5,
    product: "Wild Forest Honey"
  },
  {
    quote: "Their wood-pressed mustard oil has that authentic pungency and golden color. Cooking traditional curries tastes so much better now. Highly recommended!",
    name: "Ananya Mukherjee",
    location: "Kolkata",
    verified: true,
    rating: 5,
    product: "Wood Pressed Mustard Oil"
  }
];

export const CustomerReviewsHome: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-8 sm:py-14 bg-[#F9F6EF] border-b border-[#EAE3D2]">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">
        
        {/* Section Heading matching reference screenshot */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#C85A32] tracking-tight">
            Customer Reviews
          </h2>
          <div className="w-12 h-0.5 bg-[#C85A32]/30 mx-auto mt-2 rounded-full" />
        </div>

        {/* Testimonial Card */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#E5DFD3] shadow-sm relative text-center">
          
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#DF9F3D] fill-current" />
            ))}
          </div>

          {/* Review Text */}
          <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#2D2319] leading-relaxed max-w-xl mx-auto mb-6">
            &ldquo;{current.quote}&rdquo;
          </p>

          {/* Reviewer Details */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-headline font-bold text-xs sm:text-sm text-[#0D3520]">
              {current.name}
            </span>
            <span className="text-xs text-[#8C8275]">·</span>
            <span className="text-xs text-[#5C4524]">{current.location}</span>
            {current.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#1B5E3B] bg-[#E8F3EC] px-2 py-0.5 rounded-full ml-1">
                <CheckCircle2 className="w-3 h-3 text-[#1B5E3B]" />
                Verified Buyer
              </span>
            )}
          </div>

          <div className="text-[10px] sm:text-xs font-bold text-[#DF9F3D] mt-1.5 uppercase tracking-wider">
            Purchased: {current.product}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous Review"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#E0D7C5] flex items-center justify-center text-[#0D3520] hover:bg-[#F3EAD8] transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Review"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#E0D7C5] flex items-center justify-center text-[#0D3520] hover:bg-[#F3EAD8] transition-colors shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-[#C85A32]' : 'w-2 bg-[#D8CEBA] hover:bg-[#C85A32]/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
