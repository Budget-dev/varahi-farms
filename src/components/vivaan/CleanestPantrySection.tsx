"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { PantryCategoryIcons } from './PantryCategoryIcons';
import { useAutoScroll } from '@/hooks/use-auto-scroll';

interface CleanestPantrySectionProps {
  products: Product[];
  onAddToCart: (product: Product, variant?: any) => void;
  cartIds?: (string | number)[];
}

const PANTRY_CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'ghee', label: 'A2 Ghee', icon: '🐄' },
  { id: 'sweets', label: 'Sweets', icon: '🍬' },
  { id: 'honey', label: 'Raw Honey', icon: '🍯' },
  { id: 'oils', label: 'Wood Pressed Oils', icon: '🫒' },
  { id: 'staples', label: 'Stone Ground Staples', icon: '🌾' },
  { id: 'combos', label: 'Healthy Combos', icon: '🎁' },
];

export const CleanestPantrySection: React.FC<CleanestPantrySectionProps> = ({
  products,
  onAddToCart,
  cartIds = []
}) => {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { pause: pauseAutoScroll } = useAutoScroll(scrollRef, {
    interval: 3500,
    resumeDelay: 3000
  });

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    pauseAutoScroll();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scroll = (direction: 'left' | 'right') => {
    pauseAutoScroll();
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    pauseAutoScroll();
    const varIdx = selectedVariants[product.id] || 0;
    const variant = Array.isArray(product.vars) && product.vars.length > varIdx ? product.vars[varIdx] : null;

    const itemToAdd: Product = {
      ...product,
      price: variant?.p ? Number(variant.p) : Number(product.price) || 0,
      vol: variant?.s || product.vol || '500 ml'
    };

    onAddToCart(itemToAdd, variant);
    setJustAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleVariantSelect = (productId: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    pauseAutoScroll();
    setSelectedVariants(prev => ({ ...prev, [productId]: idx }));
  };

  const filteredProducts = products.filter(p => {
    if (selectedCat === 'all') return true;
    if (selectedCat === 'oils') return p.cat === 'oils' || p.name.toLowerCase().includes('oil');
    if (selectedCat === 'ghee') return p.cat === 'ghee' || p.name.toLowerCase().includes('ghee');
    if (selectedCat === 'sweets') return p.cat === 'sweets' || p.name.toLowerCase().includes('sweet') || p.name.toLowerCase().includes('ladoo') || p.name.toLowerCase().includes('peda');
    if (selectedCat === 'honey') return p.cat === 'honey' || p.name.toLowerCase().includes('honey');
    if (selectedCat === 'superfoods') return p.cat === 'superfoods' || p.name.toLowerCase().includes('chyawanprash') || p.name.toLowerCase().includes('butter') || p.name.toLowerCase().includes('makkhan');
    if (selectedCat === 'atta' || selectedCat === 'staples') {
      return p.cat === 'staples' || p.name.toLowerCase().includes('atta') || p.name.toLowerCase().includes('flour') || p.name.toLowerCase().includes('sugar') || p.name.toLowerCase().includes('jaggery') || p.name.toLowerCase().includes('wheat');
    }
    if (selectedCat === 'combos' || selectedCat === 'gift-card') {
      return p.cat === 'combo' || p.cat === 'combos' || p.name.toLowerCase().includes('combo') || p.name.toLowerCase().includes('pack') || p.name.toLowerCase().includes('hamper') || p.name.toLowerCase().includes('trio');
    }
    return p.cat === selectedCat;
  });

  return (
    <section id="cleanest-pantry" className="py-6 sm:py-10 md:py-16 bg-[#FFFFFF] border-b border-[#EAE3D2] relative select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Section Heading with Centered See All button matching reference screenshot */}
        <div className="text-center mb-3 sm:mb-6 md:mb-7">
          <p className="text-[10px] sm:text-xs md:text-sm font-serif font-black text-[#6B5A45] tracking-[2.5px] uppercase mb-1">
            WELCOME TO VIVAAN
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
            Your One-Stop Cleanest Pantry
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#0D3B2E]/25 mx-auto my-2 rounded-full" />

          {/* Centered See All Pill Button */}
          <div className="mt-2.5 sm:mt-3">
            <button
              type="button"
              onClick={() => router.push(`/category/${selectedCat === 'all' ? 'all' : selectedCat}`)}
              className="inline-flex items-center gap-2 px-5 py-1.5 sm:py-2 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white hover:bg-[#0D3B2E] hover:text-white transition-all text-xs sm:text-sm font-serif font-bold tracking-wide shadow-xs cursor-pointer active:scale-95 group"
              aria-label="See all products in cleanest pantry"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Authentic Circular Category Icons Row matching screenshot */}
        <PantryCategoryIcons
          selectedId={selectedCat}
          onSelect={(id) => setSelectedCat(prev => prev === id ? 'all' : id)}
        />

        {/* Carousel Container with Controls */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next products"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Horizontal Product Cards Row */}
          <div
            ref={scrollRef}
            onScroll={() => {
              if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                if (maxScroll > 0) {
                  setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
                }
              }
            }}
            className="flex items-stretch gap-2.5 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-5 pt-1 px-1"
          >
            {filteredProducts.map((p) => {
              const varIdx = selectedVariants[p.id] || 0;
              const currentVar = Array.isArray(p.vars) && p.vars.length > varIdx ? p.vars[varIdx] : null;
              const displayPrice = currentVar?.p ? Number(currentVar.p) : Number(p.price) || 0;
              const displayMrp = currentVar?.mrp ? Number(currentVar.mrp) : Number(p.mrpPrice) || displayPrice;
              const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
              const isAdded = !!justAddedMap[p.id];
              const inCart = cartIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/product/${p.id}`)}
                  className="w-[155px] sm:w-[240px] md:w-[260px] shrink-0 bg-white rounded-2xl border border-gray-200 hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-visible cursor-pointer group relative"
                >
                  {/* Top Image Section */}
                  <div className="relative h-[175px] sm:h-[220px] md:h-[250px] w-full bg-[#FAF8F5] p-2.5 sm:p-4 flex items-center justify-center border-b border-[#F2ECE1] rounded-t-2xl">
                    {/* Hanging FLAT 30% OFF Maroon Badge */}
                    <div className="absolute top-0 left-2.5 z-10 bg-[#8B264E] text-white rounded-b-xl px-2 pt-1 pb-1.5 text-center shadow-xs flex flex-col items-center justify-center leading-none select-none pointer-events-none">
                      <span className="text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider">FLAT</span>
                      <span className="text-[11px] sm:text-xs font-black tracking-tight my-0.5">{discount > 0 ? discount : 30}%</span>
                      <span className="text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider">OFF</span>
                    </div>

                    {/* Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={(p.imageUrls && p.imageUrls[0]) || '/images/products/ghee_tin.jpg'}
                        alt={p.name}
                        fill
                        className="object-contain p-2 sm:p-3"
                        sizes="(max-width: 640px) 180px, 280px"
                      />
                    </div>

                    {/* Floating ADD Button positioned right on the seam */}
                    <button
                      type="button"
                      onClick={(e) => handleAdd(p, e)}
                      className={cn(
                        "absolute right-2.5 -bottom-3.5 sm:right-3 sm:-bottom-4 z-20 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md active:scale-95",
                        isAdded || inCart
                          ? "bg-emerald-700 text-white"
                          : "bg-[#1B4D3E] text-white hover:bg-[#0D3B2E]"
                      )}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <span>{isAdded ? 'ADDED' : inCart ? 'IN CART' : 'ADD'}</span>
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-3 pt-4 sm:p-4 sm:pt-5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
                    <div className="space-y-1">
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.6em] leading-snug">
                        {p.name}
                      </h3>

                      <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623] shrink-0" />
                        <span className="font-black text-gray-900">{p.rating || 4.8}</span>
                        <span className="text-gray-500 text-[10px] sm:text-[11px]">({p.reviewCount || 1323} reviews)</span>
                      </div>
                    </div>

                    {/* Price Row (NO PURPLE BOX) */}
                    <div className="pt-1.5 sm:pt-2 flex items-baseline gap-1.5 mt-auto">
                      <span className="text-sm sm:text-base font-black text-gray-900 leading-none">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </span>
                      {displayMrp > displayPrice && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through font-semibold">
                          ₹{displayMrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Progress Bar & See All Button matching reference screenshot */}
        <div className="flex items-center justify-between mt-3 sm:mt-5 px-1 sm:px-2">
          {/* Scroll Progress Indicator */}
          <div className="w-24 sm:w-36 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gray-800 rounded-full transition-all duration-150"
              style={{
                width: '35%',
                transform: `translateX(${scrollProgress * 185}%)`
              }}
            />
          </div>

          {/* See All Button */}
          <button
            type="button"
            onClick={() => router.push(`/category/${selectedCat === 'all' ? 'ghee' : selectedCat}`)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all text-xs font-bold shadow-xs cursor-pointer active:scale-95"
            aria-label="See all products"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
