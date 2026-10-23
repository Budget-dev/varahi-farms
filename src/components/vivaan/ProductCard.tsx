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
      className="bg-white rounded-2xl overflow-visible border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#0D3B2E]/30 group relative flex flex-col w-full mx-auto select-none"
    >
      {/* Top Section: Tall Image Area */}
      <div className="relative h-[175px] sm:h-[220px] md:h-[250px] w-full bg-[#FAF8F5] p-2.5 sm:p-4 flex items-center justify-center border-b border-[#F2ECE1] rounded-t-2xl shrink-0">
        {/* Hanging FLAT 30% OFF Maroon Badge */}
        <div className="absolute top-0 left-2.5 z-10 bg-[#8B264E] text-white rounded-b-xl px-2 pt-1 pb-1.5 text-center shadow-xs flex flex-col items-center justify-center leading-none select-none pointer-events-none">
          <span className="text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider">FLAT</span>
          <span className="text-[11px] sm:text-xs font-black tracking-tight my-0.5">{discount > 0 ? discount : 30}%</span>
          <span className="text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider">OFF</span>
        </div>

        {/* Product Image / Icon */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Floating ADD Button positioned right on the boundary */}
        <button 
          type="button"
          onClick={handleAddClick}
          className={cn(
            "absolute right-2.5 -bottom-3.5 sm:right-3 sm:-bottom-4 z-20 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md active:scale-95",
            (justAdded || isInCart) 
              ? "bg-emerald-700 text-white" 
              : "bg-[#1B4D3E] text-white hover:bg-[#0D3B2E]"
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <span>{justAdded ? 'ADDED' : isInCart ? 'IN CART' : 'ADD'}</span>
          {justAdded ? (
            <span className="text-xs">✓</span>
          ) : (
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3 pt-4 sm:p-4 sm:pt-5 bg-white flex flex-col flex-1 justify-between gap-1.5 sm:gap-2 rounded-b-2xl">
        <div className="space-y-1">
          {/* Title */}
          <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-[#0D3B2E] transition-colors capitalize">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
            <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623] shrink-0" />
            <span className="font-black text-gray-900">{product.rating || '4.8'}</span>
            <span className="text-gray-500 text-[10px] sm:text-[11px]">({product.reviewCount || 1323} reviews)</span>
          </div>
        </div>

        {/* Price Row (NO PURPLE BOX) */}
        <div className="pt-1.5 sm:pt-2 flex items-baseline gap-1.5 mt-auto">
          <span className="text-sm sm:text-base font-black text-gray-900 leading-none">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {mrpPrice > price && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-semibold">
              ₹{mrpPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
