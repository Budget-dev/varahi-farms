"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface OilCategoryIconsProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const OIL_ICONS = [
  {
    id: 'mustard',
    label: 'Mustard',
    renderIcon: () => (
      <svg viewBox="0 0 44 44" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Central stem */}
        <line x1="22" y1="34" x2="22" y2="17" strokeWidth="1.6" />
        {/* Top seed */}
        <circle cx="22" cy="14" r="1.8" fill="currentColor" stroke="none" />
        {/* Upper branch pair */}
        <line x1="22" y1="20" x2="16.5" y2="16" strokeWidth="1.5" />
        <circle cx="15.5" cy="15.2" r="1.6" fill="currentColor" stroke="none" />
        <line x1="22" y1="20" x2="27.5" y2="16" strokeWidth="1.5" />
        <circle cx="28.5" cy="15.2" r="1.6" fill="currentColor" stroke="none" />
        {/* Lower branch pair */}
        <line x1="22" y1="25.5" x2="18" y2="22" strokeWidth="1.5" />
        <circle cx="17" cy="21.2" r="1.5" fill="currentColor" stroke="none" />
        <line x1="22" y1="25.5" x2="26" y2="22" strokeWidth="1.5" />
        <circle cx="27" cy="21.2" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    id: 'groundnut',
    label: 'Groundnut',
    renderIcon: () => (
      <svg viewBox="0 0 44 44" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Peanut shell outline */}
        <path 
          d="M 24.5 13 C 28 15 29.5 18 28 21 C 26.8 23.2 27.2 24.8 28.5 26.5 C 30.5 29 29.5 32.5 26 34 C 22.5 35.5 19 33.5 18 30 C 17.2 27.5 18.2 26 17.5 23.5 C 16.5 20 18.5 16.5 21.5 14.5 C 22.8 13.8 23.5 13 24.5 13 Z" 
          strokeWidth="1.7"
        />
        {/* Inner kernels / seeds */}
        <circle cx="23.5" cy="18" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="22" cy="28.5" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    id: 'coconut',
    label: 'Coconut',
    renderIcon: () => (
      <svg viewBox="0 0 44 44" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Single water drop dripping from above */}
        <path 
          d="M 22 11.5 C 22 11.5 19.8 15 19.8 16.3 C 19.8 17.5 20.8 18.5 22 18.5 C 23.2 18.5 24.2 17.5 24.2 16.3 C 24.2 15 22 11.5 22 11.5 Z" 
          strokeWidth="1.5"
        />
        {/* Coconut cut shell bowl */}
        <path 
          d="M 14 23.5 C 14 29.5 17.5 33.5 22 33.5 C 26.5 33.5 30 29.5 30 23.5" 
          strokeWidth="1.7"
        />
        {/* Outer rim */}
        <ellipse cx="22" cy="23.5" rx="8" ry="2.2" strokeWidth="1.7" />
        {/* Inner water rim */}
        <ellipse cx="22" cy="24" rx="6" ry="1.3" strokeWidth="1.2" />
      </svg>
    )
  },
  {
    id: 'sesame',
    label: 'Sesame',
    renderIcon: () => (
      <svg viewBox="0 0 44 44" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        {/* 4 sesame seeds in radial spray */}
        <g transform="translate(22, 16) rotate(15)">
          <path d="M 0,-3.5 C 1.2,-1.8 1.6,0.6 1.3,1.8 C 1,3 -1,3 -1.3,1.8 C -1.6,0.6 -1.2,-1.8 0,-3.5 Z" fill="currentColor" />
        </g>
        <g transform="translate(16.5, 21.5) rotate(-65)">
          <path d="M 0,-3.5 C 1.2,-1.8 1.6,0.6 1.3,1.8 C 1,3 -1,3 -1.3,1.8 C -1.6,0.6 -1.2,-1.8 0,-3.5 Z" fill="currentColor" />
        </g>
        <g transform="translate(27.5, 22) rotate(65)">
          <path d="M 0,-3.5 C 1.2,-1.8 1.6,0.6 1.3,1.8 C 1,3 -1,3 -1.3,1.8 C -1.6,0.6 -1.2,-1.8 0,-3.5 Z" fill="currentColor" />
        </g>
        <g transform="translate(21.5, 27.5) rotate(195)">
          <path d="M 0,-3.5 C 1.2,-1.8 1.6,0.6 1.3,1.8 C 1,3 -1,3 -1.3,1.8 C -1.6,0.6 -1.2,-1.8 0,-3.5 Z" fill="currentColor" />
        </g>
      </svg>
    )
  }
];

export const OilCategoryIcons: React.FC<OilCategoryIconsProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-6 md:gap-9 pb-2 sm:pb-4 mb-4 sm:mb-6 overflow-x-auto no-scrollbar px-2">
      {OIL_ICONS.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(isSelected ? 'all' : item.id)}
            className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer focus:outline-none shrink-0"
          >
            <div
              className={cn(
                "w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300",
                isSelected
                  ? "border-[2px] border-[#2A4B42] bg-[#EAF2ED] text-[#2A4B42] shadow-xs scale-105 ring-2 ring-[#2A4B42]/20"
                  : "border-[1.6px] border-[#385A52]/80 text-[#385A52] hover:border-[#2A4B42] hover:bg-[#F4F8F6] hover:scale-105"
              )}
            >
              {item.renderIcon()}
            </div>
            <span
              className={cn(
                "text-[10px] sm:text-xs md:text-[13px] font-serif font-bold tracking-tight transition-colors",
                isSelected ? "text-[#1C352D] font-extrabold" : "text-[#2A4B42] group-hover:text-[#1C352D]"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

interface GheeCategoryIconsProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const GHEE_ICONS = [
  {
    id: 'gir',
    label: 'Desi Gir Cow',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Cow head outline */}
        <path d="M16 16c-3-4-5-8-3-9s5 3 6 6" strokeWidth="2" />
        <path d="M32 16c3-4 5-8 3-9s-5 3-6 6" strokeWidth="2" />
        <path d="M19 19c-3 1-5 4-5 8 0 7 4 13 10 13s10-6 10-13c0-4-2-7-5-8" strokeWidth="2" />
        <circle cx="20" cy="27" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="28" cy="27" r="1.5" fill="currentColor" stroke="none" />
        <ellipse cx="24" cy="35" rx="4" ry="2" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'bilona',
    label: 'Vedic Bilona',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Curd churning pot with bilona churner */}
        <ellipse cx="24" cy="18" rx="10" ry="3" strokeWidth="2" />
        <path d="M14 18c0 8 3 17 10 17s10-9 10-17" strokeWidth="2.2" />
        <line x1="24" y1="8" x2="24" y2="28" strokeWidth="2.5" />
        <line x1="19" y1="12" x2="29" y2="12" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'murrah',
    label: 'Murrah Buffalo',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Curved buffalo horns */}
        <path d="M14 20c-5-6-4-11 0-11s6 6 8 8" strokeWidth="2.2" />
        <path d="M34 20c5-6 4-11 0-11s-6 6-8 8" strokeWidth="2.2" />
        <path d="M19 21c-2 2-3 5-3 8 0 6 3.5 11 8 11s8-5 8-11c0-3-1-6-3-8" strokeWidth="2" />
        <ellipse cx="24" cy="34" rx="3.5" ry="2" strokeWidth="1.5" />
      </svg>
    )
  }
];

export const GheeCategoryIcons: React.FC<GheeCategoryIconsProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 pb-2 sm:pb-4 mb-4 sm:mb-6 overflow-x-auto no-scrollbar px-2">
      {GHEE_ICONS.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(isSelected ? 'all' : item.id)}
            className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer focus:outline-none shrink-0"
          >
            <div
              className={cn(
                "w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300",
                isSelected
                  ? "border-2 border-[#0D3B2E] bg-[#EAF2ED] text-[#0D3B2E] shadow-xs scale-105"
                  : "border-2 border-[#0D3B2E]/60 text-[#0D3B2E] hover:border-[#0D3B2E] hover:bg-[#F4F9F5] hover:scale-105"
              )}
            >
              {item.renderIcon()}
            </div>
            <span
              className={cn(
                "text-[10px] sm:text-xs font-serif font-bold tracking-tight transition-colors",
                isSelected ? "text-[#0D3B2E] font-black" : "text-gray-700 group-hover:text-[#0D3B2E]"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
