'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ErrorCard } from '@/components/ui/ErrorCard';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Page Error Caught by Next.js]:', error);
  }, [error]);

  return (
    <div className="min-h-[85vh] bg-[#F9F6EF] flex flex-col items-center justify-center p-4 md:p-8 text-center">
      <div className="mb-4 flex items-center justify-center">
        {/* Vivaan Farms Brand Emblem */}
        <div className="w-14 h-14 rounded-full bg-[#1B5E3B]/10 border border-[#1B5E3B]/20 flex items-center justify-center shadow-inner">
          <span className="text-2xl">🌱</span>
        </div>
      </div>

      <h1 className="font-headline text-2xl md:text-3xl font-black text-[#1B5E3B] uppercase tracking-wide mb-1">
        Vivaan Farms
      </h1>
      <p className="text-xs font-medium text-[#7A6848] uppercase tracking-widest mb-4">
        Pure • Traditional • Authentic
      </p>

      {/* Nice Error Card with Plain English Explanation */}
      <div className="w-full max-w-xl">
        <ErrorCard
          error={error}
          reset={reset}
          showHome={true}
          className="shadow-lg border-[#E2D6C0]"
        />
      </div>
    </div>
  );
}
