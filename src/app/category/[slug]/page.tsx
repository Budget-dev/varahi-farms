"use client";

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Check, 
  SlidersHorizontal, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Header } from '@/components/vivaan/Header';
import { Ticker } from '@/components/vivaan/Ticker';
import { Footer } from '@/components/vivaan/Footer';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CertificationsStrip } from '@/components/vivaan/CertificationsStrip';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { CATEGORIES, ALL_PRODUCTS, getCategoryProducts } from '@/lib/catalog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const activeSlug = (resolvedParams?.slug || 'all').toLowerCase();

  const db = useFirestore();
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: dbProducts } = useCollection(productsRef);

  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();
  const cartIds = useMemo(() => cart.map(c => c.id), [cart]);

  // Merge Firestore products with rich default catalog
  const masterProducts = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return ALL_PRODUCTS;
    const mapped = dbProducts
      .filter(p => p.isLive !== false)
      .map((p, i) => {
        const catId = (p.categoryId || 'uncategorized').toLowerCase();
        const basePrice = Number(p.basePrice) || 0;
        return {
          ...p,
          cat: catId,
          price: basePrice,
          mrpPrice: Number(p.mrpPrice) || basePrice,
          vol: p.vol || (Array.isArray(p.vars) && p.vars.find((v: any) => v.on)?.s) || (p.volumeValue ? `${p.volumeValue}${p.volumeUnit || ''}` : 'Standard'),
          pi: i,
          rating: Number(p.rating) || 4.9,
          reviewCount: Number(p.reviewCount) || 120,
          soldCountLabel: p.soldCountLabel || 'Hot',
          statusBadge: p.statusBadge || 'Vedic Purity',
          badges: Array.isArray(p.badges) ? p.badges : [],
          description: p.description || '',
          imageUrls: Array.isArray(p.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls : ['/images/products/ghee_tin.jpg'],
          vars: Array.isArray(p.vars) && p.vars.length > 0 
            ? p.vars 
            : [{ s: 'Standard', p: basePrice, on: true }]
        } as Product;
      });

    const existingIds = new Set(mapped.map(m => m.id));
    const fallbacks = ALL_PRODUCTS.filter(d => !existingIds.has(d.id));
    return [...mapped, ...fallbacks];
  }, [dbProducts]);

  // Find active category metadata
  const currentCategory = useMemo(() => {
    return CATEGORIES.find(c => c.slug === activeSlug || c.id === activeSlug) || CATEGORIES[0];
  }, [activeSlug]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let list = getCategoryProducts(activeSlug, masterProducts);

    // Apply sort
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return list;
  }, [activeSlug, masterProducts, sortBy]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVariantSelect = (productId: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariants(prev => ({ ...prev, [productId]: idx }));
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const varIdx = selectedVariants[product.id] || 0;
    const variant = Array.isArray(product.vars) && product.vars.length > varIdx ? product.vars[varIdx] : null;

    const itemToAdd: Product = {
      ...product,
      price: variant?.p ? Number(variant.p) : Number(product.price) || 0,
      vol: variant?.s || product.vol || 'Standard'
    };

    addToCart(itemToAdd, variant);
    setJustAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <>
      {/* ── 1. Announcement Ticker & Header ── */}
      <div className="sticky top-0 z-[900]">
        <Ticker />
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          cartCount={totalQty}
          onFilter={(cat) => router.push(`/category/${cat}`)}
          onSearch={(q) => router.push(`/category/all?q=${encodeURIComponent(q)}`)}
        />
      </div>

      <div className="min-h-screen bg-[#FBF9F5] text-[#100C06] pb-24 md:pb-0">
        <main className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12 py-4 sm:py-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-[#0D3B2E] transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Categories</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-[#0D3B2E]">{currentCategory.name}</span>
          </nav>

          {/* Mobile Category Scrollable Pill Tabs */}
          <div className="lg:hidden mb-5 overflow-x-auto no-scrollbar -mx-3 px-3 py-1 flex items-center gap-2">
            {CATEGORIES.map(cat => {
              const isActive = cat.slug === activeSlug || cat.id === activeSlug;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={cn(
                    "text-xs font-serif font-bold whitespace-nowrap px-4 py-2 rounded-full transition-all shrink-0",
                    isActive
                      ? "bg-[#EAE5D9] text-[#0D3B2E] font-black shadow-xs ring-1 ring-[#0D3B2E]/20"
                      : "bg-white text-[#2C4A3E] border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Main 2-Column Layout */}
          <div className="flex items-start gap-8 lg:gap-12">
            
            {/* ── Left Sidebar (Desktop - Matching Screenshot 1) ── */}
            <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[130px] bg-white rounded-2xl p-5 border border-[#EAE3D2] shadow-xs">
              <div className="flex flex-col space-y-2">
                {CATEGORIES.map(cat => {
                  const isActive = cat.slug === activeSlug || cat.id === activeSlug;

                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={cn(
                        "block font-serif text-[16px] px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#EFECE6] text-[#0D3B2E] font-extrabold shadow-2xs"
                          : "text-[#1C3A27] hover:text-[#0D3B2E] hover:bg-[#F9F7F2] font-semibold"
                      )}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

              {/* Purity Guarantee Trust Badge in Sidebar */}
              <div className="mt-8 pt-6 border-t border-[#EAE3D2] text-center">
                <div className="w-10 h-10 rounded-full bg-[#0D3B2E]/10 flex items-center justify-center text-[#0D3B2E] mx-auto mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#0D3B2E]" />
                </div>
                <p className="font-serif font-extrabold text-xs text-[#0D3B2E]">100% Vedic Guarantee</p>
                <p className="text-[11px] text-[#6B5A45] mt-1 leading-snug">
                  Zero preservatives, chemicals, or synthetic additives.
                </p>
              </div>
            </aside>

            {/* ── Right Content Area ── */}
            <div className="flex-1 min-w-0">
              
              {/* Category Header Banner */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-[#EAE3D2] mb-6 sm:mb-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] sm:text-xs font-black text-[#6B5A45] tracking-[2.5px] uppercase">
                      Farm Fresh Organic Goods
                    </span>
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3B2E] mt-1 tracking-tight">
                      {currentCategory.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-2xl leading-relaxed">
                      {currentCategory.description}
                    </p>
                  </div>

                  {/* Filter & Sort Controls */}
                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                    <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                    </span>
                    
                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0D3B2E]">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#0D3B2E]" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-xs font-bold text-[#0D3B2E] focus:outline-none cursor-pointer"
                        aria-label="Sort products"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-6">
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
                        className="bg-white rounded-xl sm:rounded-2xl border border-[#EBE5DA] hover:border-[#0D3B2E]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                      >
                        {/* Top Image Section */}
                        <div className="relative h-[120px] sm:h-[180px] md:h-[210px] w-full bg-[#FAF8F5] p-2 sm:p-4 flex items-center justify-center border-b border-[#F2ECE1] overflow-hidden">
                          {/* Discount / Bestseller Badge */}
                          <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1 items-start">
                            {discount > 0 ? (
                              <span className="bg-[#B91C1C] text-white text-[8px] sm:text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                                {discount}% OFF
                              </span>
                            ) : (
                              <span className="bg-[#0D3B2E] text-white text-[8px] sm:text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                                BESTSELLER
                              </span>
                            )}
                          </div>

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleWishlist(p.id, e)}
                            className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-xs border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
                              className="object-contain p-1.5 sm:p-3"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                            />
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
                          <div className="space-y-1">
                            {/* Purity / Process Tag */}
                            <span className="inline-block text-[8px] sm:text-[9.5px] font-black text-emerald-800 bg-[#E8F5EE] px-2 py-0.5 rounded-md tracking-wider uppercase truncate max-w-full">
                              {p.statusBadge || 'Vedic Bilona · 100% Pure'}
                            </span>

                            {/* Product Name */}
                            <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D3B2E] transition-colors line-clamp-2 min-h-[2.4em] leading-tight sm:leading-snug">
                              {p.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                              <div className="flex items-center text-amber-500">
                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                                <span className="font-black text-gray-900 ml-1 text-[10px] sm:text-xs">{p.rating || 4.9}</span>
                              </div>
                              <span className="text-gray-400 text-[9px] sm:text-[11px]">({p.reviewCount || 120})</span>
                            </div>
                          </div>

                          {/* Variant Pills */}
                          {Array.isArray(p.vars) && p.vars.length > 1 && (
                            <div className="flex items-center gap-1 sm:gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                              {p.vars.map((v, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => handleVariantSelect(p.id, idx, e)}
                                  className={cn(
                                    "text-[8.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer whitespace-nowrap",
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
                          <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between gap-1 mt-auto">
                            <div className="min-w-0">
                              <div className="text-xs sm:text-base font-black text-[#0D3B2E] leading-none">
                                ₹{displayPrice.toLocaleString('en-IN')}
                              </div>
                              {displayMrp > displayPrice && (
                                <div className="text-[9.5px] sm:text-xs text-gray-400 line-through truncate">
                                  ₹{displayMrp.toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleAdd(p, e)}
                              className={cn(
                                "px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[9.5px] sm:text-xs uppercase tracking-wider flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 shrink-0",
                                isAdded || inCart
                                  ? "bg-emerald-700 text-white"
                                  : "bg-[#0D3B2E] text-white hover:bg-[#14472D]"
                              )}
                            >
                              {isAdded ? (
                                <>
                                  <span className="hidden xs:inline">ADDED</span>
                                  <Check className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  <span>ADD</span>
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE3D2]">
                  <Sparkles className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-[#0D3B2E]">No products found in this category</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-5">
                    We are harvesting and preparing new batches from the farm.
                  </p>
                  <Link
                    href="/category/all"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D3B2E] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    View All Products
                  </Link>
                </div>
              )}

            </div>
          </div>

        </main>

        <CertificationsStrip />
        <Footer />
      </div>

      <BottomNav 
        activeTab="shop" 
        onTabChange={(tab) => {
          if (tab === 'cart') setIsCartOpen(true);
          else if (tab === 'home') router.push('/');
          else if (tab === 'account') router.push('/track');
        }}
        cartCount={totalQty}
      />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />
    </>
  );
}
