"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Check, Tag, ChevronDown } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface HealthyCombosSectionProps {
  products: Product[];
  onAddToCart: (product: Product, variant?: any) => void;
  cartIds?: (string | number)[];
}

const DEFAULT_COMBOS: Product[] = [
  {
    id: 'combo-ghee-twin-pack',
    name: 'A2 Desi Gir Cow Ghee Twin Value Pack (2 x 500ml)',
    cat: 'combo',
    vol: '1000 ml (2 Jars)',
    price: 1750,
    mrpPrice: 2300,
    rating: 5.0,
    reviewCount: 520,
    purityCoins: 175,
    soldCountLabel: '2.4k sold',
    stock: 60,
    statusBadge: 'Save ₹550',
    badges: ['Value Gift Pack'],
    pi: 0,
    imageUrls: ['/images/products/combo_pack.jpg'],
    vars: [
      { s: '2 x 500ml Jars', p: 1750, mrp: 2300, on: true }
    ],
    description: 'Double the goodness. Two premium glass jars of Vedic Bilona A2 Gir Cow Ghee at our lowest combo price.'
  },
  {
    id: 'combo-oil-trio-pack',
    name: 'Daily Cooking Wood-Pressed Oil Trio (Mustard + Groundnut + Sesame)',
    cat: 'combo',
    vol: '3 x 1 L Bottles',
    price: 1399,
    mrpPrice: 1750,
    rating: 4.9,
    reviewCount: 380,
    purityCoins: 140,
    soldCountLabel: '1.8k sold',
    stock: 50,
    statusBadge: 'Save ₹351',
    badges: ['Chef Choice'],
    pi: 1,
    imageUrls: ['/images/products/mustard_oil.jpg'],
    vars: [
      { s: '3 x 1 L Set', p: 1399, mrp: 1750, on: true }
    ],
    description: 'Complete unrefined kitchen oil solution. Healthy monounsaturated fats extracted cold on wooden press.'
  },
  {
    id: 'combo-immunity-duo',
    name: 'Ayurvedic Immunity Duo (A2 Gir Ghee + Wild Forest Honey)',
    cat: 'combo',
    vol: '500ml + 450g',
    price: 1450,
    mrpPrice: 1850,
    rating: 5.0,
    reviewCount: 460,
    purityCoins: 145,
    soldCountLabel: '3.1k sold',
    stock: 75,
    statusBadge: 'Save ₹400',
    badges: ['Immunity Special'],
    pi: 2,
    imageUrls: ['/images/products/honey_jar.jpg'],
    vars: [
      { s: 'Standard Set', p: 1450, mrp: 1850, on: true }
    ],
    description: 'Ancient Ayurvedic Rasayana: Pure A2 cultured ghee paired with raw wild unpasteurized forest honey.'
  },
  {
    id: 'combo-master-pantry-box',
    name: 'Vivaan Vedic Master Pantry Hamper (Ghee + 5L Oil + Honey)',
    cat: 'combo',
    vol: 'Family Hamper',
    price: 3899,
    mrpPrice: 4800,
    rating: 4.9,
    reviewCount: 210,
    purityCoins: 390,
    soldCountLabel: '940+ sold',
    stock: 30,
    statusBadge: 'Save ₹901',
    badges: ['Mega Saver'],
    pi: 3,
    imageUrls: ['/images/products/groundnut_can.jpg'],
    vars: [
      { s: 'Full Pantry Hamper', p: 3899, mrp: 4800, on: true }
    ],
    description: 'Everything your family needs for a month of authentic, 100% pure chemical-free Vedic cooking.'
  }
];

export const HealthyCombosSection: React.FC<HealthyCombosSectionProps> = ({
  products,
  onAddToCart,
  cartIds = []
}) => {
  const router = useRouter();
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const [showAllCombos, setShowAllCombos] = useState(false);

  const comboProducts = React.useMemo(() => {
    const fromProps = products.filter(p => p.cat === 'combo' || p.name.toLowerCase().includes('combo') || p.name.toLowerCase().includes('pack'));
    if (fromProps.length >= 4) return fromProps;
    return [...fromProps, ...DEFAULT_COMBOS.slice(fromProps.length)];
  }, [products]);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = Array.isArray(product.vars) && product.vars.length > 0 ? product.vars[0] : null;

    const itemToAdd: Product = {
      ...product,
      price: variant?.p ? Number(variant.p) : Number(product.price) || 0,
      vol: variant?.s || product.vol || 'Combo Pack'
    };

    onAddToCart(itemToAdd, variant);
    setJustAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#FFFFFF] border-b border-[#EAE3D2] select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-black text-[#6B5A45] tracking-[2.5px] uppercase mb-1">
            Curated Savings
          </p>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] tracking-tight">
            Healthy Combo Packs
          </h2>
          <div className="w-16 h-0.5 bg-[#0D3B2E]/20 mx-auto mt-2 sm:mt-3 rounded-full" />
        </div>

        {/* Side-by-side Mobile Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {comboProducts.slice(0, 4).map((p, idx) => {
            const displayPrice = Number(p.price) || 0;
            const displayMrp = Number(p.mrpPrice) || displayPrice;
            const savings = displayMrp - displayPrice;
            const isAdded = !!justAddedMap[p.id];
            const inCart = cartIds.includes(p.id);
            const isHiddenOnMobile = !showAllCombos && idx >= 2;

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
                  {savings > 0 && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 bg-[#B91C1C] text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider flex items-center gap-1 shadow-xs">
                      <Tag className="w-2.5 h-2.5" />
                      <span>SAVE ₹{savings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={(p.imageUrls && p.imageUrls[0]) || '/images/products/combo_pack.jpg'}
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
                      {p.vol || 'Curated Value Bundle'}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.4em] leading-tight sm:leading-snug">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-black text-gray-900">{p.rating || 4.9}</span>
                      <span className="text-gray-400 text-[9px] sm:text-[11px]">({p.reviewCount || 190})</span>
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

        {/* Mobile "See All" Toggle Button */}
        {comboProducts.length > 2 && (
          <div className="mt-5 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllCombos(!showAllCombos)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#0D3B2E] text-[#0D3B2E] bg-white text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#0D3B2E] hover:text-white"
            >
              <span>{showAllCombos ? "Show Less" : "See All"}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showAllCombos && "rotate-180")} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
