"use client";

import React from 'react';

const HoneyLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-md rounded-[32px] border border-accent/20 shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="relative w-[120px] h-[120px]">
        {/* Honey Drips */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col gap-1 w-full">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 via-accent to-yellow-600 border border-yellow-800/20 shadow-inner"
              style={{
                width: `${90 - i * 10}%`,
                margin: '0 auto',
                animation: `honey-flow 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Animated Bees */}
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute z-10 text-xl"
            style={{
              animation: `bee-fly-${i+1} ${4 + i}s linear infinite`,
            }}
          >
            🐝
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="text-[10px] font-black text-accent uppercase tracking-[4px] mb-2">Harvesting Purity</div>
        <div className="font-headline text-2xl font-extrabold text-primary">Collecting Forest Honey...</div>
      </div>

      <style jsx>{`
        @keyframes honey-flow {
          0%, 100% { transform: scaleX(0.95); opacity: 0.8; }
          50% { transform: scaleX(1.1); opacity: 1; }
        }
        @keyframes bee-fly-1 {
          0% { transform: translate(-40px, 20px) scaleX(1); }
          50% { transform: translate(40px, -20px) scaleX(1); }
          51% { transform: translate(40px, -20px) scaleX(-1); }
          100% { transform: translate(-40px, 20px) scaleX(-1); }
        }
        @keyframes bee-fly-2 {
          0% { transform: translate(30px, -30px) rotate(10deg); }
          50% { transform: translate(-30px, 30px) rotate(-10deg); }
          100% { transform: translate(30px, -30px) rotate(10deg); }
        }
        @keyframes bee-fly-3 {
          0% { transform: translate(0, 40px); }
          33% { transform: translate(40px, 0); }
          66% { transform: translate(-40px, -40px); }
          100% { transform: translate(0, 40px); }
        }
      `}</style>
    </div>
  );
};

export default HoneyLoader;
