"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface SuperfoodsSectionProps {
  products: Product[];
  onAddToCart: (product: Product, variant?: any) => void;
  cartIds?: (string | number)[];
}

const DEFAULT_SUPERFOODS: Product[] = [
  {
    id: 'honey-wild-forest',
    name: 'Raw Unprocessed Wild Forest Honey',
    cat: 'honey',
    vol: '450 g',
    price: 490,
    mrpPrice: 590,
    rating: 5.0,
    reviewCount: 780,
    purityCoins: 49,
    soldCountLabel: '4.8k sold',
    stock: 90,
    statusBadge: 'Unpasteurized & Raw',
    badges: ['Wild Harvest'],
    pi: 0,
    imageUrls: ['/images/products/honey_jar.jpg'],
    vars: [
      { s: '450 g', p: 490, mrp: 590, on: true },
      { s: '1 kg', p: 950, mrp: 1150, on: false }
    ],
    description: 'Ethically harvested from wild bee colonies in Gujarat and Himachal deciduous forests. Rich pollen enzymes.'
  },
  {
    id: 'honey-multifloral-raw',
    name: 'Raw Multifloral Blossom Honey',
    cat: 'honey',
    vol: '500 g',
    price: 440,
    mrpPrice: 520,
    rating: 4.9,
    reviewCount: 390,
    purityCoins: 44,
    soldCountLabel: '2.1k sold',
    stock: 70,
    statusBadge: 'Nectar Rich',
    badges: ['Pure Forest'],
    pi: 1,
    imageUrls: ['/images/products/honey_jar.jpg'],
    vars: [
      { s: '500 g', p: 440, mrp: 520, on: true }
    ],
    description: 'Collected from mustard, acacia, and wild berry blossom meadows. Light amber hue with delicate floral sweetness.'
  },
  {
    id: 'superfood-jaggery-powder',
    name: 'Organic Vedic Desi Jaggery Powder (Shakkar)',
    cat: 'staples',
    vol: '1 kg',
    price: 180,
    mrpPrice: 240,
    rating: 4.8,
    reviewCount: 460,
    purityCoins: 18,
    soldCountLabel: '6.2k sold',
    stock: 150,
    statusBadge: 'Zero Sulphur',
    badges: ['Everyday Essential'],
    pi: 2,
    imageUrls: ['/images/products/honey_jar.jpg'],
    vars: [
      { s: '1 kg', p: 180, mrp: 240, on: true }
    ],
    description: 'Made from certified organic single-origin sugarcane. Natural mineral-dense sweetener with zero chemical bleaching.'
  },
  {
    id: 'superfood-khandsari-sugar',
    name: 'Traditional Desi Bilona Khandsari Sugar',
    cat: 'staples',
    vol: '1 kg',
    price: 210,
    mrpPrice: 280,
    rating: 4.9,
    reviewCount: 310,
    purityCoins: 21,
    soldCountLabel: '3.4k sold',
    stock: 85,
    statusBadge: 'Unrefined Crystal',
    badges: ['Heritage Sugar'],
    pi: 3,
    imageUrls: ['/images/products/honey_jar.jpg'],
    vars: [
      { s: '1 kg', p: 210, mrp: 280, on: true }
    ],
    description: 'Artisanal unrefined raw sugar crystallized naturally without bone char, chemicals, or synthetic clarifiers.'
  }
];

export const SuperfoodsSection: React.FC<SuperfoodsSectionProps> = ({
  products,
  onAddToCart,
  cartIds = []
}) => {
  const router = useRouter();
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const superfoodProducts = React.useMemo(() => {
    const fromProps = products.filter(p => p.cat === 'honey' || p.cat === 'staples' || p.cat === 'superfoods' || p.name.toLowerCase().includes('honey'));
    if (fromProps.length >= 4) return fromProps;
    return [...fromProps, ...DEFAULT_SUPERFOODS.slice(fromProps.length)];
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = Array.isArray(product.vars) && product.vars.length > 0 ? product.vars[0] : null;

    const itemToAdd: Product = {
      ...product,
      price: variant?.p ? Number(variant.p) : Number(product.price) || 0,
      vol: variant?.s || product.vol || 'Standard'
    };

    onAddToCart(itemToAdd, variant);
    setJustAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section className="py-6 sm:py-10 md:py-16 bg-[#FAF7F2] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Title Header with See All Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-sm font-black text-[#6B5A45] tracking-[2px] sm:tracking-[2.5px] uppercase mb-0.5 sm:mb-1">
              Pure Farm Staples
            </p>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
              Explore Our Superfoods
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#0D3B2E]/20 mt-1.5 rounded-full mx-auto sm:mx-0" />
          </div>

          {/* See All Button redirecting to /category/superfoods */}
          <button
            type="button"
            onClick={() => router.push('/category/superfoods')}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white hover:bg-[#0D3B2E] hover:text-white transition-all text-xs sm:text-sm font-bold tracking-wide shadow-xs cursor-pointer group shrink-0 active:scale-95"
            aria-label="See all superfoods"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel Container with Left/Right Arrows */}
        <div className="relative group/carousel mt-4 sm:mt-6">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous superfoods"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next superfoods"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Horizontal Swipeable Cards Row */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-2.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 px-1"
          >
            {superfoodProducts.map((p) => {
              const displayPrice = Number(p.price) || 0;
              const displayMrp = Number(p.mrpPrice) || displayPrice;
              const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
              const isAdded = !!justAddedMap[p.id];
              const inCart = cartIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/product/${p.id}`)}
                  className="w-[140px] sm:w-[240px] md:w-[260px] shrink-0 bg-white rounded-xl sm:rounded-2xl border border-[#EBE5DA] hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  {/* Image Section */}
                  <div className="relative h-[110px] sm:h-[180px] md:h-[200px] w-full bg-[#FAF8F5] p-2 sm:p-4 flex items-center justify-center border-b border-[#F2ECE1] overflow-hidden">
                    {discount > 0 && (
                      <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 bg-[#B91C1C] text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider">
                        {discount}% OFF
                      </div>
                    )}

                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={(p.imageUrls && p.imageUrls[0]) || '/images/products/honey_jar.jpg'}
                        alt={p.name}
                        fill
                        className="object-contain p-1 sm:p-2"
                        sizes="(max-width: 640px) 150px, 280px"
                      />
                    </div>
                  </div>

                  {/* Body Section */}
                  <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
                    <div className="space-y-1">
                      <span className="inline-block text-[8px] sm:text-[9px] font-black text-amber-800 bg-[#FEF7E6] px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider uppercase border border-amber-300/40 truncate max-w-full">
                        {p.vol || '100% Raw & Natural'}
                      </span>
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.4em] leading-tight sm:leading-snug">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-black text-gray-900">{p.rating || 4.9}</span>
                        <span className="text-gray-400 text-[9px] sm:text-[11px]">({p.reviewCount || 160})</span>
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-1.5 sm:pt-2 border-t border-[#F2ECE1] flex items-center justify-between gap-1 mt-auto">
                      <div>
                        <div className="text-xs sm:text-base font-black text-[#0D3B2E]">
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </div>
                        {displayMrp > displayPrice && (
                          <div className="text-[10px] sm:text-xs text-gray-400 line-through">
                            ₹{displayMrp.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAdd(p, e)}
                        className={cn(
                          "px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-xs active:scale-95",
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

        {/* Explore All Superfoods Link */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => router.push('/category/superfoods')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white hover:bg-[#0D3B2E] hover:text-white transition-all text-xs sm:text-sm font-bold tracking-wide shadow-xs active:scale-95 cursor-pointer"
          >
            <span>Explore All Superfoods</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
