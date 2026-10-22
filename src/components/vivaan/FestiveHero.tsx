"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FestiveHeroProps {
  onShopClick?: () => void;
}

const DESKTOP_SLIDES = [
  {
    id: 'desktop-banner-1',
    url: 'https://vivanfa.sirv.com/ChatGPT%20Image%20Sep%208%2C%202026%2C%2008_07_57%20AM.png',
    alt: 'Vivaan Farms - Traditional Vedic Ghee & Natural Farm Produce',
  },
  {
    id: 'desktop-banner-2',
    url: 'https://vivanfa.sirv.com/ChatGPT%20Image%20Sep%208%2C%202026%2C%2008_07_53%20AM.png',
    alt: 'Vivaan Farms - Wood Pressed Oils & Pure Vedic Bilona Ghee',
  },
  {
    id: 'desktop-banner-3',
    url: 'https://vivanfa.sirv.com/ChatGPT%20Image%20Sep%208%2C%202026%2C%2008_08_08%20AM.png',
    alt: 'Vivaan Farms - Pure Organic Harvest Direct From Gujarat Pastures',
  },
];

const MOBILE_POSTER = 'https://vivanfa.sirv.com/Vivaan%20Farms%20Traditional%20Bilona%20Ghee%20Poster.png';

export const FestiveHero: React.FC<FestiveHeroProps> = ({ onShopClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % DESKTOP_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + DESKTOP_SLIDES.length) % DESKTOP_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const scrollToPantry = () => {
    if (onShopClick) {
      onShopClick();
      return;
    }
    const el = document.getElementById('cleanest-pantry') || document.getElementById('top-picks');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full relative select-none bg-[#F9F6EF] overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE VIEW (Screen < md)
          9:16 Traditional Bilona Ghee Poster shown completely.
          No overlay clutter or overlapping text on top of the poster.
      ───────────────────────────────────────────────────────────── */}
      <div 
        className="block md:hidden w-full relative bg-[#F9F6EF] cursor-pointer"
        onClick={scrollToPantry}
      >
        <div 
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '941 / 1672' }}
        >
          <Image
            src={MOBILE_POSTER}
            alt="Vivaan Farms Traditional Bilona Ghee - 100% Homemade Desi Ghee"
            fill
            priority
            sizes="100vw"
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP VIEW (Screen >= md)
          Interactive 3-Banner Carousel showing the 3 1983x793 images fully.
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block w-full relative bg-[#F9F6EF] overflow-hidden group">
        <div 
          className="relative w-full cursor-pointer overflow-hidden shadow-sm"
          style={{ aspectRatio: '1983 / 793' }}
          onClick={scrollToPantry}
        >
          {DESKTOP_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover w-full h-full"
                />
              </div>
            );
          })}

          {/* Left Arrow Navigation */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-[#0D3B2E] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Navigation */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-[#0D3B2E] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-full">
            {DESKTOP_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-7 h-2 bg-[#F8D279] shadow-xs' 
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
