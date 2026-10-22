"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Check, ChevronDown } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { GheeCategoryIcons } from './FocusSectionIcons';

interface FocusGheeSectionProps {
  products: Product[];
  onAddToCart: (product: Product, variant?: any) => void;
  cartIds?: (string | number)[];
}

const DEFAULT_GHEE: Product[] = [
  {
    id: 'ghee-gir-tin-1l',
    name: 'A2 Desi Gir Cow Cultured Bilona Ghee (Heritage Tin)',
    cat: 'ghee',
    vol: '1000 ml (1 L)',
    price: 1850,
    mrpPrice: 2200,
    rating: 5.0,
    reviewCount: 940,
    purityCoins: 185,
    soldCountLabel: '5.2k sold',
    stock: 80,
    statusBadge: 'Traditional Metal Tin',
    badges: ['Top Rated'],
    pi: 0,
    imageUrls: ['/images/products/ghee_tin.jpg'],
    vars: [
      { s: '500 ml', p: 980, mrp: 1150, on: false },
      { s: '1000 ml (1 L)', p: 1850, mrp: 2200, on: true },
      { s: '5000 ml (5 L)', p: 8900, mrp: 10500, on: false },
    ],
    description: 'Slow-cooked over slow wood fire in earthen pots, made from cultured A2 Gir curd using the two-way wooden bilona.'
  },
  {
    id: 'ghee-gir-jar-500ml',
    name: 'A2 Desi Gir Cow Cultured Bilona Ghee (Glass Jar)',
    cat: 'ghee',
    vol: '500 ml',
    price: 980,
    mrpPrice: 1150,
    rating: 4.9,
    reviewCount: 1420,
    purityCoins: 98,
    soldCountLabel: '8.4k sold',
    stock: 120,
    statusBadge: 'Golden Granular Danedar',
    badges: ['Bestseller'],
    pi: 1,
    imageUrls: ['/images/products/ghee_jar.jpg'],
    vars: [
      { s: '250 ml', p: 520, mrp: 600, on: false },
      { s: '500 ml', p: 980, mrp: 1150, on: true },
      { s: '1000 ml (1 L)', p: 1850, mrp: 2200, on: false },
    ],
    description: 'Golden granular texture with intoxicating nutty aroma. High in natural CLA, butyric acid, and fat-soluble vitamins.'
  },
  {
    id: 'ghee-buffalo-murrah-1l',
    name: 'Vedic Pure Desi Murrah Buffalo Ghee (Bilona)',
    cat: 'ghee',
    vol: '1000 ml (1 L)',
    price: 1350,
    mrpPrice: 1600,
    rating: 4.9,
    reviewCount: 680,
    purityCoins: 135,
    soldCountLabel: '3.1k sold',
    stock: 90,
    statusBadge: 'High Smoke Point',
    badges: ['Heritage'],
    pi: 2,
    imageUrls: ['/images/products/ghee_tin.jpg'],
    vars: [
      { s: '500 ml', p: 720, mrp: 850, on: false },
      { s: '1000 ml (1 L)', p: 1350, mrp: 1600, on: true },
    ],
    description: 'Handcrafted from grass-fed Murrah buffalo whole milk curd. Creamy white granular texture with deep richness.'
  },
  {
    id: 'ghee-hallikar-cow-500ml',
    name: 'Native Hallikar Cow Vedic Ghee (Rare Breed)',
    cat: 'ghee',
    vol: '500 ml',
    price: 1150,
    mrpPrice: 1350,
    rating: 4.9,
    reviewCount: 290,
    purityCoins: 115,
    soldCountLabel: '1.1k sold',
    stock: 45,
    statusBadge: 'Rare Indigenous Breed',
    badges: ['Artisanal'],
    pi: 3,
    imageUrls: ['/images/products/ghee_jar.jpg'],
    vars: [
      { s: '500 ml', p: 1150, mrp: 1350, on: true },
      { s: '1000 ml (1 L)', p: 2150, mrp: 2500, on: false },
    ],
    description: 'Sourced from agile indigenous Hallikar cows grazing on wild herbal shrubs. Intense therapeutic qualities.'
  }
];

export const FocusGheeSection: React.FC<FocusGheeSectionProps> = ({
  products,
  onAddToCart,
  cartIds = []
}) => {
  const router = useRouter();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const [filterType, setFilterType] = useState('all');
  const [showAllGhee, setShowAllGhee] = useState(false);

  const gheeProducts = React.useMemo(() => {
    let pool = products.filter(p => p.cat === 'ghee' || p.name.toLowerCase().includes('ghee'));
    if (pool.length < 4) {
      pool = [...pool, ...DEFAULT_GHEE.slice(pool.length)];
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
    <section className="py-8 sm:py-12 md:py-16 bg-[#FAF7F2] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-xs sm:text-sm font-black text-[#6B5A45] tracking-[2.5px] uppercase mb-1">
            Product In Focus
          </p>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
            Explore Our A2 Desi Ghee
          </h2>
          <div className="w-16 h-0.5 bg-[#0D3B2E]/20 mx-auto mt-2 sm:mt-3 rounded-full" />
        </div>

        {/* Ghee Category Circular Icons */}
        <GheeCategoryIcons
          selected={filterType}
          onSelect={(id) => setFilterType(id)}
        />

        {/* Side-by-side Mobile Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {gheeProducts.slice(0, 4).map((p, idx) => {
            const varIdx = selectedVariants[p.id] || 0;
            const currentVar = Array.isArray(p.vars) && p.vars.length > varIdx ? p.vars[varIdx] : null;
            const displayPrice = currentVar?.p ? Number(currentVar.p) : Number(p.price) || 0;
            const displayMrp = currentVar?.mrp ? Number(currentVar.mrp) : Number(p.mrpPrice) || displayPrice;
            const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
            const isAdded = !!justAddedMap[p.id];
            const inCart = cartIds.includes(p.id);
            const isHiddenOnMobile = !showAllGhee && idx >= 2;

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
                      src={(p.imageUrls && p.imageUrls[0]) || '/images/products/ghee_tin.jpg'}
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
                    <span className="inline-block text-[8px] sm:text-[9px] font-black text-amber-800 bg-[#FEF7E6] px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider uppercase border border-amber-300/40">
                      Vedic Bilona · Earthen Pot
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.4em] leading-tight sm:leading-snug">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-black text-gray-900">{p.rating || 5.0}</span>
                      <span className="text-gray-400 text-[9px] sm:text-[11px]">({p.reviewCount || 340})</span>
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
        {gheeProducts.length > 2 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllGhee(!showAllGhee)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#0D3B2E] hover:text-white"
            >
              <span>{showAllGhee ? "Show Less" : "See All"}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showAllGhee && "rotate-180")} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
