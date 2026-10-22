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
        
        {/* Section Heading with See All button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 sm:mb-6 md:mb-8">
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-sm font-black text-[#6B5A45] tracking-[2px] sm:tracking-[2.5px] uppercase mb-0.5 sm:mb-1">
              Welcome to Vivaan
            </p>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
              Your One-Stop Cleanest Pantry
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#0D3B2E]/20 mt-1.5 rounded-full mx-auto sm:mx-0" />
          </div>

          {/* See All Button linking to Category Page */}
          <button
            type="button"
            onClick={() => router.push(`/category/${selectedCat}`)}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white hover:bg-[#0D3B2E] hover:text-white transition-all text-xs sm:text-sm font-bold tracking-wide shadow-xs cursor-pointer group shrink-0 active:scale-95"
            aria-label={`See all products in ${selectedCat}`}
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Authentic Circular Category Icons Row matching screenshot */}
        <PantryCategoryIcons
          selectedId={selectedCat}
          onSelect={(id) => setSelectedCat(id)}
        />

        {/* Carousel Container with Controls */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next products"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Horizontal Product Cards Row */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-2.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 px-1"
          >
            {filteredProducts.map((p) => {
              const varIdx = selectedVariants[p.id] || 0;
              const currentVar = Array.isArray(p.vars) && p.vars.length > varIdx ? p.vars[varIdx] : null;
              const displayPrice = currentVar?.p ? Number(currentVar.p) : Number(p.price) || 0;
              const displayMrp = currentVar?.mrp ? Number(currentVar.mrp) : Number(p.mrpPrice) || displayPrice;
              const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
              const isWishlisted = !!wishlist[p.id];
              const isAdded = !!justAddedMap[p.id];
              const inCart = cartIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/product/${p.id}`)}
                  className="w-[136px] sm:w-[240px] md:w-[260px] shrink-0 bg-white rounded-xl sm:rounded-2xl border border-[#EBE5DA] hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  {/* Top Image Section */}
                  <div className="relative h-[98px] sm:h-[165px] md:h-[190px] w-full bg-[#FAF8F5] p-1.5 sm:p-3 flex items-center justify-center border-b border-[#F2ECE1] overflow-hidden">
                    {/* Bestseller / Discount Badge */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1 items-start">
                      {discount > 0 ? (
                        <span className="bg-[#B91C1C] text-white text-[7.5px] sm:text-[9px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                          {discount}% OFF
                        </span>
                      ) : (
                        <span className="bg-[#0D3B2E] text-white text-[7.5px] sm:text-[9px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(p.id, e)}
                      className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/80 backdrop-blur-xs border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isWishlisted && "fill-red-500 text-red-500")} />
                    </button>

                    {/* Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={(p.imageUrls && p.imageUrls[0]) || '/images/products/ghee_tin.jpg'}
                        alt={p.name}
                        fill
                        className="object-contain p-1 sm:p-2"
                        sizes="(max-width: 640px) 150px, 280px"
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-2 sm:p-4 flex flex-col flex-1 justify-between gap-1 sm:gap-2">
                    <div className="space-y-1">
                      {/* Purity / Process Tag */}
                      <span className="inline-block text-[7.5px] sm:text-[9px] font-black text-emerald-800 bg-[#E8F5EE] px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider uppercase truncate max-w-full">
                        {p.statusBadge || 'Vedic Bilona · 100% Pure'}
                      </span>

                      {/* Product Name */}
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.4em] leading-tight sm:leading-snug">
                        {p.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[9px] sm:text-xs">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
                          <span className="font-black text-gray-900 ml-0.5 sm:ml-1 text-[9px] sm:text-xs">{p.rating || 4.9}</span>
                        </div>
                        <span className="text-gray-400 text-[8px] sm:text-[11px]">({p.reviewCount || 120})</span>
                      </div>
                    </div>

                    {/* Variant Selector Pills */}
                    {Array.isArray(p.vars) && p.vars.length > 1 && (
                      <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1 overflow-x-auto no-scrollbar">
                        {p.vars.map((v, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => handleVariantSelect(p.id, idx, e)}
                            className={cn(
                              "text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border transition-all cursor-pointer whitespace-nowrap",
                              varIdx === idx
                                ? "bg-[#0D3B2E] text-white border-[#0D3B2E]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                            )}
                          >
                            {v.s}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Price & Add to Cart Button */}
                    <div className="pt-1 sm:pt-2 border-t border-[#F2ECE1] flex items-center justify-between gap-1 mt-auto">
                      <div className="min-w-0">
                        <div className="text-xs sm:text-base font-black text-[#0D3B2E] leading-none">
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </div>
                        {displayMrp > displayPrice && (
                          <div className="text-[9px] sm:text-xs text-gray-400 line-through truncate">
                            ₹{displayMrp.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAdd(p, e)}
                        className={cn(
                          "px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs uppercase tracking-wider flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 shrink-0",
                          isAdded || inCart
                            ? "bg-emerald-700 text-white"
                            : "bg-[#0D3B2E] text-white hover:bg-[#14472D]"
                        )}
                      >
                        {isAdded ? (
                          <>
                            <span className="hidden xs:inline">ADDED</span>
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>ADD</span>
                            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Explore Category Link */}
        <div className="mt-5 sm:mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push(`/category/${selectedCat}`)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-black text-[#0D3B2E] hover:text-[#185338] hover:underline cursor-pointer group"
          >
            <span>Explore All Products in {selectedCat === 'all' ? 'Cleanest Pantry' : selectedCat.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
