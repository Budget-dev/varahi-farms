import React from 'react';

const tickerItems = [
  { ico: '🌿', txt: 'CODE PURE15 → 15% OFF' },
  { ico: '🐄', txt: 'A2 Gir Bilona Ghee' },
  { ico: '🚚', txt: 'Free Delivery ₹999+' },
  { ico: '🧈', txt: 'Farm-Direct · Gujarat' },
  { ico: '🔬', txt: '70+ NABL Lab Tests' },
  { ico: '🪙', txt: 'Earn Purity Coins' },
  { ico: '🎁', txt: 'Combo Packs · Save 19%' },
  { ico: '🌾', txt: 'Bilona Method · Ancient' },
  { ico: '⭐', txt: '4.9★ · 12,000+ Reviews' },
];

export const Ticker: React.FC = () => {
  return (
    <div className="bg-[#0D3520] h-9 flex items-center justify-center text-[10px] font-black text-white tracking-[2.5px] overflow-hidden relative z-50 border-b border-white/5">
      <div className="flex flex-col items-center ticker-vertical-animation will-change-transform">
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {tickerItems.map((item, i) => (
              <div key={i} className="h-9 flex items-center justify-center gap-3.5 px-7 whitespace-nowrap uppercase">
                <span className="text-sm">{item.ico}</span>
                <span>{item.txt}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};