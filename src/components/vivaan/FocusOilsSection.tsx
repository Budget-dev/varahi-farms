"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Check, Heart, ChevronDown } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { OilCategoryIcons } from './FocusSectionIcons';

interface FocusOilsSectionProps {
  products: Product[];
  onAddToCart: (product: Product, variant?: any) => void;
  cartIds?: (string | number)[];
}

const DEFAULT_OILS: Product[] = [
  {
    id: 'oil-mustard-yellow',
    name: 'Wood Pressed Yellow Mustard Oil (Kachi Ghani)',
    cat: 'oils',
    vol: '500 ml',
    price: 360,
    mrpPrice: 450,
    rating: 4.9,
    reviewCount: 420,
    purityCoins: 36,
    soldCountLabel: '2.8k sold',
    stock: 50,
    statusBadge: 'Cold-Pressed < 40°C',
    badges: ['Bestseller'],
    pi: 0,
    imageUrls: ['/images/products/mustard_oil.jpg'],
    vars: [
      { s: '500 ml', p: 360, mrp: 450, on: true },
      { s: '1 L', p: 680, mrp: 850, on: false },
      { s: '5 L Can', p: 3200, mrp: 3900, on: false },
    ],
    description: 'Slow-pressed from indigenous yellow mustard seeds. Rich pungent aroma and natural golden color.'
  },
  {
    id: 'oil-groundnut-cold',
    name: 'Wood Pressed Groundnut Oil (Peanut Oil)',
    cat: 'oils',
    vol: '5 L Can',
    price: 1850,
    mrpPrice: 2200,
    rating: 4.9,
    reviewCount: 310,
    purityCoins: 185,
    soldCountLabel: '1.9k sold',
    stock: 40,
    statusBadge: 'Zero Palm Oil',
    badges: ['Value Pack'],
    pi: 1,
    imageUrls: ['/images/products/groundnut_can.jpg'],
    vars: [
      { s: '1 L', p: 390, mrp: 480, on: false },
      { s: '5 L Can', p: 1850, mrp: 2200, on: true },
    ],
    description: 'Heart-healthy cooking oil extracted from handpicked Saurashtra peanuts on traditional wooden kolhu.'
  },
  {
    id: 'oil-mustard-black',
    name: 'Cold Pressed Black Mustard Oil (Kachi Ghani)',
    cat: 'oils',
    vol: '1 L',
    price: 340,
    mrpPrice: 420,
    rating: 4.8,
    reviewCount: 280,
    purityCoins: 34,
    soldCountLabel: '3.4k sold',
    stock: 65,
    statusBadge: 'High Pungency',
    badges: ['Tradition'],
    pi: 2,
    imageUrls: ['/images/products/mustard_oil.jpg'],
    vars: [
      { s: '500 ml', p: 180, mrp: 220, on: false },
      { s: '1 L', p: 340, mrp: 420, on: true },
    ],
    description: 'Authentic bold pungent black mustard oil, stone-filtered with zero chemicals or artificial color.'
  },
  {
    id: 'oil-virgin-coconut',
    name: 'Extra Virgin Cold Pressed Coconut Oil',
    cat: 'oils',
    vol: '500 ml',
    price: 490,
    mrpPrice: 590,
    rating: 5.0,
    reviewCount: 195,
    purityCoins: 49,
    soldCountLabel: '980+ sold',
    stock: 35,
    statusBadge: 'Raw & Centrifuged',
    badges: ['Multipurpose'],
    pi: 3,
    imageUrls: ['/images/products/mustard_oil.jpg'],
    vars: [
      { s: '500 ml', p: 490, mrp: 590, on: true },
      { s: '1 L', p: 920, mrp: 1100, on: false },
    ],
    description: 'Prepared from fresh mature coconut kernel milk. Suitable for dietary consumption, oil pulling, and skin.'
  },
  {
    id: 'oil-sesame-wood-pressed',
    name: 'Wood Pressed Black Sesame Oil (Til Oil / Gingelly)',
    cat: 'oils',
    vol: '500 ml',
    price: 440,
    mrpPrice: 520,
    rating: 4.9,
    reviewCount: 230,
    purityCoins: 44,
    soldCountLabel: '1.4k sold',
    stock: 55,
    statusBadge: 'Vedic Cold-Pressed',
    badges: ['Pure Gingelly'],
    pi: 4,
    imageUrls: ['/images/products/mustard_oil.jpg'],
    vars: [
      { s: '500 ml', p: 440, mrp: 520, on: true },
      { s: '1 L', p: 850, mrp: 990, on: false },
    ],
    description: 'Cold-pressed from natural unpolished black sesame seeds on wooden churner. Rich in sesamol, zinc, and heart-healthy antioxidants.'
  }
];

export const FocusOilsSection: React.FC<FocusOilsSectionProps> = ({
  products,
  onAddToCart,
  cartIds = []
}) => {
  const router = useRouter();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const [filterType, setFilterType] = useState('all');
  const [showAllOils, setShowAllOils] = useState(false);

  // Merge real oil products with default display products & filter by selected icon
  const oilProducts = React.useMemo(() => {
    let pool = products.filter(p => p.cat === 'oils' || p.name.toLowerCase().includes('oil'));
    if (pool.length < 4) {
      pool = [...pool, ...DEFAULT_OILS.slice(pool.length)];
    }
    if (filterType === 'all') return pool;
    const filtered = pool.filter(p => p.name.toLowerCase().includes(filterType) || p.id.includes(filterType));
    return filtered.length > 0 ? filtered : pool;
  }, [products, filterType]);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
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
    setSelectedVariants(prev => ({ ...prev, [productId]: idx }));
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#FFFFFF] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-xs sm:text-sm font-black text-[#6B5A45] tracking-[2.5px] uppercase mb-1">
            Product In Focus
          </p>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
            Explore Our Cold-Pressed Oils
          </h2>
          <div className="w-16 h-0.5 bg-[#0D3B2E]/20 mx-auto mt-2 sm:mt-3 rounded-full" />
        </div>

        {/* Oil Category Circular Icons */}
        <OilCategoryIcons
          selected={filterType}
          onSelect={(id) => setFilterType(id)}
        />

        {/* Side-by-side Mobile Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {oilProducts.slice(0, 4).map((p, idx) => {
            const varIdx = selectedVariants[p.id] || 0;
            const currentVar = Array.isArray(p.vars) && p.vars.length > varIdx ? p.vars[varIdx] : null;
            const displayPrice = currentVar?.p ? Number(currentVar.p) : Number(p.price) || 0;
            const displayMrp = currentVar?.mrp ? Number(currentVar.mrp) : Number(p.mrpPrice) || displayPrice;
            const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
            const isAdded = !!justAddedMap[p.id];
            const inCart = cartIds.includes(p.id);
            const isHiddenOnMobile = !showAllOils && idx >= 2;

            return (
              <div
                key={p.id}
                onClick={() => router.push(`/product/${p.id}`)}
                className={cn(
                  "bg-white rounded-xl sm:rounded-2xl border border-[#EBE5DA] hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex-col justify-between overflow-hidden cursor-pointer group",
                  isHiddenOnMobile ? "hidden sm:flex" : "flex"
                )}
              >
                {/* Image Section */}
                <div className="relative h-[130px] sm:h-[220px] w-full bg-[#FAF8F5] p-2 sm:p-4 flex items-center justify-center border-b border-[#F2ECE1] overflow-hidden">
                  {discount > 0 && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 bg-[#B91C1C] text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider">
                      {discount}% OFF
                    </div>
                  )}

                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={(p.imageUrls && p.imageUrls[0]) || '/images/products/mustard_oil.jpg'}
                      alt={p.name}
                      fill
                      className="object-contain p-1 sm:p-2"
                      sizes="(max-width: 640px) 50vw, 300px"
                    />
                  </div>
                </div>

                {/* Body Section */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
                  <div className="space-y-1">
                    <span className="inline-block text-[8px] sm:text-[9px] font-black text-emerald-800 bg-[#E8F5EE] px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider uppercase">
                      Wood-Pressed · Unrefined
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.4em] leading-tight sm:leading-snug">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-black text-gray-900">{p.rating || 4.9}</span>
                      <span className="text-gray-400 text-[9px] sm:text-[11px]">({p.reviewCount || 150})</span>
                    </div>
                  </div>

                  {/* Variant Pills */}
                  {Array.isArray(p.vars) && p.vars.length > 1 && (
                    <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1 overflow-x-auto no-scrollbar">
                      {p.vars.map((v, vIdx) => (
                        <button
                          key={vIdx}
                          type="button"
                          onClick={(e) => handleVariantSelect(p.id, vIdx, e)}
                          className={cn(
                            "text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border transition-all cursor-pointer whitespace-nowrap",
                            varIdx === vIdx
                              ? "bg-[#0D3B2E] text-white border-[#0D3B2E]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                          )}
                        >
                          {v.s}
                        </button>
                      ))}
                    </div>
                  )}

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

        {/* Mobile "See All" Toggle Button */}
        {oilProducts.length > 2 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllOils(!showAllOils)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#0D3B2E] hover:text-white"
            >
              <span>{showAllOils ? "Show Less" : "See All"}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showAllOils && "rotate-180")} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
