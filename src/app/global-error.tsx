'use client';

import React, { useEffect } from 'react';
import { ErrorCard } from '@/components/ui/ErrorCard';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Layout Error]:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Vivaan Farms - Application Notice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#F9F6EF] min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-sans antialiased text-center">
        <div className="mb-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1B5E3B]/10 border border-[#1B5E3B]/20 flex items-center justify-center shadow-inner">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B5E3B] uppercase tracking-wide mt-2">
            Vivaan Farms
          </h1>
          <p className="text-xs text-[#7A6848] uppercase tracking-widest">
            Service Notice
          </p>
        </div>

        <div className="w-full max-w-xl">
          <ErrorCard
            error={error}
            reset={reset}
            showHome={true}
            title="Application Encountered a Hiccup"
            message="The page encountered a temporary initialization issue. You can click 'Try Again' or reload to safely restore your session."
            extraActions={
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider hover:bg-amber-200 transition-all cursor-pointer"
              >
                Reload Page
              </button>
            }
          />
        </div>
      </body>
    </html>
  );
}
