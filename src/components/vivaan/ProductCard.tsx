"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Leaf } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
import { cn } from '@/lib/utils';

// Default descriptions by category for products missing a description
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ghee: 'Pure A2 Gir Cow Bilona Ghee, hand-churned from farm-fresh curd using traditional methods.',
  honey: 'Raw unprocessed forest honey, ethically harvested from wild bee colonies in Gujarat.',
  sweets: 'Artisanal farm sweets made with pure A2 ghee, jaggery & love — no preservatives.',
  combo: 'Curated combo pack of our finest farm-fresh products at special savings.',
  default: 'Farm-fresh, naturally pure & crafted with tradition. No chemicals, no shortcuts.',
};

function getSmartDescription(product: Product): string {
  if (product.description && product.description.trim() && product.description.trim() !== product.name.trim()) {
    return product.description;
  }
  return CATEGORY_DESCRIPTIONS[product.cat] || CATEGORY_DESCRIPTIONS['default'];
}

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, onOpen, onAdd }) => {
  const router = useRouter();
  
  // Ensure we have numbers to work with
  const price = Number(product.price) || 0;
  const mrpPrice = Number(product.mrpPrice) || price;

  const discount = mrpPrice > price 
    ? Math.round(((mrpPrice - price) / mrpPrice) * 100)
    : 0;

  const description = getSmartDescription(product);

  const getIcon = () => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return (
        <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
          <Image 
            src={product.imageUrls[0]} 
            alt={product.name} 
            fill 
            className={cn(
              "object-cover transition-opacity duration-500",
              product.imageUrls.length > 1 ? "group-hover:opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 768px) 150px, 220px"
          />
          
          {product.imageUrls.length > 1 && (
            <Image 
              src={product.imageUrls[1]} 
              alt={`${product.name} alternate`} 
              fill 
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 768px) 150px, 220px"
            />
          )}
        </div>
      );
    }
    
    if (product.cat === 'combo') return <ComboIcon className="scale-75 md:scale-90" />;
    return (
      <JarIcon 
        c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} 
        c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} 
        sub="" 
        idSuffix={product.id} 
        className="scale-75 md:scale-90" 
      />
    );
  };

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  const [justAdded, setJustAdded] = React.useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div 
      onClick={handleNavigate}
      className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-[#E8ECE9] cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary/20 group relative flex flex-col h-[370px] sm:h-[400px] md:h-[430px] w-full mx-auto shadow-xs transform-gpu translate-z-0 select-none"
    >
      {/* Top Section: Square Image Area with Fixed Ratio/Height */}
      <div className="relative h-[150px] sm:h-[175px] md:h-[200px] w-full bg-[#FAF8F5] p-2 md:p-3 flex items-center justify-center overflow-hidden border-b border-[#F2ECE1] shrink-0">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-1.5 left-1.5 z-20 bg-primary text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full tracking-tight shadow-sm">
            {discount}% OFF
          </div>
        )}

        {/* Top Badge */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-1.5 right-1.5 z-20 bg-[#D4A017] text-white px-1.5 py-0.5 rounded-full text-[7px] md:text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
            {product.badges[0]}
          </div>
        )}

        {/* Product Image / Icon */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-2.5 sm:p-3 md:p-4 bg-white flex flex-col flex-1 justify-between gap-1 overflow-hidden">
        {/* Top Content Block */}
        <div className="space-y-1 md:space-y-1.5 flex-1 min-h-0">
          {/* Subheader: Volume & Rating */}
          <div className="flex items-center justify-between text-[10px] md:text-xs font-bold text-[#7A6848] h-5">
            <span className="uppercase tracking-wider font-extrabold text-[9px] md:text-[11px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-md truncate max-w-[60%]">
              {product.vol || (product.vars && product.vars.find(v => v.on)?.s) || (product.vars && product.vars[0]?.s) || '500 ml'}
            </span>
            <div className="flex items-center gap-0.5 bg-[#FFF8E7] px-1.5 py-0.5 rounded-md border border-[#F5D110]/30 shrink-0">
              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#F5D110] fill-current" />
              <span className="font-black text-[#100C06] text-[10px] md:text-xs">{product.rating || '4.9'}</span>
              {product.reviewCount ? <span className="opacity-50 text-[8px] md:text-[10px]">({product.reviewCount})</span> : null}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-headline text-[11px] sm:text-xs md:text-sm font-bold text-[#100C06] leading-snug line-clamp-2 h-[2.4em] md:h-[2.6em] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Description — fills the white gap */}
          <p className="text-[9px] sm:text-[10px] md:text-[11px] text-[#8C8275] font-medium leading-relaxed line-clamp-2 h-[2.6em] md:h-[2.8em]">
            {description}
          </p>

          {/* Purity Indicator */}
          <div className="flex items-center gap-1 pt-0.5">
            <Leaf className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
            <span className="text-[8px] sm:text-[9px] font-bold text-emerald-700 uppercase tracking-wider truncate">
              100% Natural · Farm Fresh
            </span>
          </div>
        </div>

        {/* Price & Action Row - Fixed to Bottom */}
        <div className="pt-1.5 border-t border-[#F3F0E9] flex items-center justify-between gap-1.5 mt-auto shrink-0">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-sm md:text-base font-black text-primary leading-none">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {mrpPrice > price && (
                <span className="text-[10px] md:text-xs text-[#8C8275] line-through font-semibold">
                  ₹{mrpPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.soldCountLabel ? (
              <span className="text-[8px] md:text-[9px] font-bold text-amber-800 mt-0.5 truncate max-w-[85px] md:max-w-[110px]">
                🔥 {product.soldCountLabel}
              </span>
            ) : (
              <span className="text-[8px] md:text-[9px] font-medium text-emerald-700 mt-0.5">
                In Stock
              </span>
            )}
          </div>

          <button 
            type="button"
            onClick={handleAddClick}
            className={cn(
              "min-h-[38px] px-3 md:px-3.5 rounded-xl flex items-center justify-center gap-1.5 font-black text-[10px] md:text-[11px] uppercase tracking-wider transition-all active:scale-90 shrink-0 shadow-xs border-none cursor-pointer",
              (justAdded || isInCart) 
                ? "bg-emerald-700 text-white" 
                : "bg-primary text-white hover:bg-secondary"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <span>{justAdded ? 'ADDED ✓' : isInCart ? 'IN CART' : 'ADD'}</span>
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
