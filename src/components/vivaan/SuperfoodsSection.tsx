"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Check, Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const superfoodProducts = React.useMemo(() => {
    const fromProps = products.filter(p => p.cat === 'honey' || p.cat === 'staples' || p.cat === 'superfoods' || p.name.toLowerCase().includes('honey'));
    if (fromProps.length >= 4) return fromProps;
    return [...fromProps, ...DEFAULT_SUPERFOODS.slice(fromProps.length)];
  }, [products]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
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
            className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous superfoods"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next superfoods"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Horizontal Swipeable Cards Row */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-2.5 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-5 pt-1 px-1"
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
                  className="w-[155px] sm:w-[240px] md:w-[260px] shrink-0 bg-white rounded-2xl border border-gray-200 hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-visible cursor-pointer group relative"
                >
                  {/* Image Section */}
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
                        src={(p.imageUrls && p.imageUrls[0]) || '/images/products/honey_jar.jpg'}
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

                  {/* Body Section */}
                  <div className="p-3 pt-4 sm:p-4 sm:pt-5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
                    <div className="space-y-1">
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.6em] leading-snug">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623] shrink-0" />
                        <span className="font-black text-gray-900">{p.rating || 4.9}</span>
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
            onClick={() => router.push('/category/superfoods')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all text-xs font-bold shadow-xs cursor-pointer active:scale-95"
            aria-label="See all superfoods"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
