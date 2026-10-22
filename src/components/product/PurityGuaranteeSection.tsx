import React from 'react';
import Image from 'next/image';

export const PurityGuaranteeSection: React.FC = () => {
  const points = [
    "Made from A2 Desi Buffalo Milk",
    "Traditional Slow Cooking",
    "Thick & Creamy Texture",
    "Rich Aroma & Deep Taste",
    "No Chemicals or Preservatives",
    "100% Pure & Natural"
  ];

  return (
    <section className="relative bg-[#6E1E14] text-white py-12 md:py-20 px-4 overflow-hidden">
      {/* Background Pot & Bilona Pattern Watermarks */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 C35 10 38 15 42 22 C45 28 45 35 42 42 C38 48 35 50 30 50 C25 50 22 48 18 42 C15 35 15 28 18 22 C22 15 25 10 30 10 Z' stroke='%23FFFFFF' stroke-width='1.5' fill='none'/%3E%3Cline x1='24' y1='8' x2='36' y2='8' stroke='%23FFFFFF' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            How Do You Know<br className="hidden sm:block" /> It’s Safe & Pure?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-2 font-medium">
            Every batch is tested twice - once at source and again at our warehouse
          </p>
        </div>

        {/* Jar and Bullet List (Matching reference_mobile.png and reference_desktop.png) */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-10">
          
          {/* Center/Left: Pure Glass Jar Packshot */}
          <div className="md:col-span-6 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl">
              <Image 
                src="/products/buffalo-ghee/pure_jar.jpg"
                alt="Vivaan A2 Desi Buffalo Ghee Safe & Pure Jar"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </div>

          {/* Right: Bullet points with white circular dots */}
          <div className="md:col-span-6 flex flex-col justify-center">
            <ul className="space-y-3.5 sm:space-y-4 max-w-md mx-auto md:mx-0">
              {points.map((pt, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 shadow-sm" />
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {pt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
