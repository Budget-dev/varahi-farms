"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const Ticker: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('PURE15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D3B2E] text-white text-[11px] sm:text-xs py-2 px-3 sm:px-6 relative z-50 border-b border-white/10 select-none">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-center font-medium">
        <span className="hidden md:inline-block">✨ Celebrate with Purity</span>
        <span className="hidden md:inline-block text-white/40">|</span>
        <span>
          Get <span className="text-[#F8D279] font-bold">15% OFF</span> on your first order
        </span>
        <button
          onClick={copyCode}
          className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-[#F8D279] px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-all border border-white/20"
          title="Click to copy coupon code"
        >
          <span>CODE: PURE15</span>
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-80" />}
        </button>
        <span className="hidden sm:inline-block text-white/40">|</span>
        <span className="hidden sm:inline-block text-emerald-100/90 font-normal">
          🚚 Free Shipping on orders above ₹499
        </span>
      </div>
    </div>
  );
};