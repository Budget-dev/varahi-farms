"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PantryCategoryIconsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CATEGORY_ICONS_DATA = [
  {
    id: 'ghee',
    label: 'Ghee',
    image: '/images/categories/ghee.png',
  },
  {
    id: 'oils',
    label: 'Oil',
    image: '/images/categories/oils.png',
  },
  {
    id: 'atta',
    label: 'Atta',
    image: '/images/categories/atta.png',
  },
  {
    id: 'superfoods',
    label: 'Superfoods',
    image: '/images/categories/superfoods.png',
  },
  {
    id: 'gift-card',
    label: 'Gift Card',
    image: '/images/categories/gift-card.png',
  },
  {
    id: 'combos',
    label: 'Combo',
    image: '/images/categories/combos.png',
  },
  {
    id: 'all',
    label: 'All',
    image: '/images/categories/all.png',
  }
];

export const PantryCategoryIcons: React.FC<PantryCategoryIconsProps> = ({
  selectedId,
  onSelect
}) => {
  return (
    <div className="w-full py-1 sm:py-3 mb-2 sm:mb-5">
      <div className="max-w-[1000px] mx-auto px-1 sm:px-2">
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-4 md:gap-7 overflow-x-auto no-scrollbar py-1 px-1">
          {CATEGORY_ICONS_DATA.map((cat) => {
            const isSelected = selectedId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className="w-[52px] sm:w-[68px] md:w-[76px] flex flex-col items-center gap-1 group cursor-pointer focus:outline-none shrink-0"
              >
                {/* Compact, crisp circular icon on mobile */}
                <div
                  className={cn(
                    "w-[46px] h-[46px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px] rounded-full flex items-center justify-center transition-all duration-300 relative p-1 shrink-0",
                    isSelected
                      ? "bg-[#EAF2ED] shadow-xs scale-105 ring-2 ring-[#0D3B2E]/25"
                      : "bg-transparent hover:bg-[#F4F9F5] hover:scale-105"
                  )}
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    width={46}
                    height={46}
                    className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Text Label Underneath */}
                <span
                  className={cn(
                    "text-[9.5px] sm:text-xs md:text-sm font-serif font-bold tracking-tight text-center truncate max-w-full leading-tight transition-colors duration-200",
                    isSelected
                      ? "text-[#0D3B2E] font-black"
                      : "text-[#2A231C] group-hover:text-[#0D3B2E]"
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

