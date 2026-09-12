"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const HERO_BANNERS = [
  {
    id: 'banner-1',
    url: 'https://vivanfa.sirv.com/ChatGPT%20Image%20Sep%208%2C%202026%2C%2008_07_53%20AM.png',
    alt: 'Vivaan Farms - Pure A2 Gir Cow Bilona Ghee & Natural Farm Goods'
  },
  {
    id: 'banner-2',
    url: 'https://vivanfa.sirv.com/ChatGPT%20Image%20Sep%208%2C%202026%2C%2008_07_57%20AM.png',
    alt: 'Vivaan Farms - Traditional Vedic Bilona Method A2 Ghee'
  },
  {
    id: 'banner-3',
    url: 'https://vivanfa.sirv.com/ChatGPT%20Image%20Sep%208%2C%202026%2C%2008_08_08%20AM.png',
    alt: 'Vivaan Farms - Authentic Organic Farm in Gujarat'
  }
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  }, []);

  // Auto-slide interval (5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="w-full bg-[#F9F6EF] px-0 relative overflow-hidden select-none">
      <div className="relative w-full aspect-[16/7] md:aspect-[2.8/1] overflow-hidden shadow-sm bg-[#F9F6EF]">
        {HERO_BANNERS.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={banner.url}
                alt={banner.alt}
                fill
                priority
                loading="eager"
                sizes="100vw"
                className="object-cover object-center w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        {/* Navigation Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

