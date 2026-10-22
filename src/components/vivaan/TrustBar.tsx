"use client";

import React from 'react';
import { Truck, ShieldCheck, Heart, Star } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export const TrustBar: React.FC = () => {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => (db ? doc(db, 'siteSettings', 'main') : null), [db]);
  const { data: settings } = useDoc(settingsRef);

  const ratingEnabled = settings?.trustBarRatingEnabled === true && !!settings?.trustBarRatingText;

  const trustItems = [
    { ico: <Truck className="w-4 h-4 md:w-6 md:h-6 text-secondary" />, t: 'Free Delivery', s: '₹999+', sub: 'Orders above ₹999' },
    { ico: <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-secondary" />, t: '30-Day Returns', s: 'Easy', sub: 'No questions asked' },
    { ico: <Heart className="w-4 h-4 md:w-6 md:h-6 text-secondary" />, t: 'Farm Direct', s: 'Pure', sub: 'Zero middlemen' },
  ];

  if (ratingEnabled) {
    trustItems.push({
      ico: <Star className="w-4 h-4 md:w-6 md:h-6 text-secondary" />,
      t: settings.trustBarRatingText,
      s: settings.trustBarReviewsText || 'Verified',
      sub: settings.trustBarReviewsText || 'Verified',
    });
  }

  const gridColsClass = trustItems.length === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="bg-white border-b border-border py-3 md:py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-2 md:px-10">
        <div className={`grid ${gridColsClass} gap-1 md:flex md:items-center md:justify-between md:gap-6`}>
          {trustItems.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3.5 group text-center md:text-left">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-[#D0EDDF]/50 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {item.ico}
              </div>
              <div className="flex flex-col">
                <div className="text-[8px] md:text-sm font-black text-foreground leading-tight whitespace-nowrap">{item.t}</div>
                <div className="hidden md:block text-[11px] text-[#7A6A52] mt-0.5 font-medium leading-tight">{item.sub}</div>
                <div className="md:hidden text-[7px] text-[#7A6A52] font-medium leading-tight uppercase opacity-60 tracking-tighter">{item.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
