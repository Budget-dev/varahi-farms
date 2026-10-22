"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const NewsletterStrip: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <section className="bg-[#0D3520] py-6 sm:py-8 px-4 border-t border-[#1B4332] text-white">
      <div className="max-w-[700px] mx-auto text-center space-y-3">
        <h3 className="font-headline text-sm sm:text-base md:text-lg font-bold tracking-wide">
          Sign up for our farm fresh news & offers
        </h3>
        <p className="text-[11px] sm:text-xs text-white/70 font-medium">
          Receive exclusive farm harvest updates, member discounts, and pure living tips.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-[#8CD790]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you for joining our farm community!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center max-w-md mx-auto gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-[#DF9F3D]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#DF9F3D] hover:bg-[#C98A28] text-[#1A1410] font-black text-xs uppercase px-4 py-2.5 rounded-xl transition-all active:scale-95 shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
