"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Ticker } from '@/components/vivaan/Ticker';
import { Hero } from '@/components/vivaan/Hero';
import { TrustBar } from '@/components/vivaan/TrustBar';
import { ProductCard } from '@/components/vivaan/ProductCard';
import { ProductCarousel } from '@/components/ui/product-carousel';
import { WhyChoose } from '@/components/vivaan/WhyChoose';
import { NativeSection } from '@/components/vivaan/NativeSection';
import { Footer } from '@/components/vivaan/Footer';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { naturalLanguageProductSearch } from '@/ai/flows/natural-language-product-search';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Coins, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { ErrorCard } from '@/components/ui/ErrorCard';

const CATEGORIES = [
  { id: 'all', label: 'All', ico: '🌿' },
  { id: 'ghee', label: 'A2 Ghee', ico: '🐄' },
  { id: 'sweets', label: 'Sweets', ico: '🎁' },
  { id: 'honey', label: 'Honey', ico: '🍯' },
];

export default function VivaanFarms() {
  const router = useRouter();
  const db = useFirestore();
  
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: dbProducts, isLoading: productsLoading, error: productsError } = useCollection(productsRef);

  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();

  const products = useMemo(() => {
    if (!dbProducts) return [];
    
    return dbProducts
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
          reviewCount: Number(p.reviewCount) || 0,
          soldCountLabel: p.soldCountLabel || 'Hot',
          statusBadge: p.statusBadge || '',
          badges: Array.isArray(p.badges) ? p.badges : [],
          description: p.description || '',
          vars: Array.isArray(p.vars) && p.vars.length > 0 
            ? p.vars 
            : [{ s: 'Standard', p: basePrice, on: true }]
        } as Product;
      });
  }, [dbProducts]);

  const handleSearch = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setFilter('all');
      return;
    }
    try {
      const res = await naturalLanguageProductSearch({ query: queryStr });
      if (res.categories.length > 0) {
        setFilter(res.categories[0]);
      }
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategoryFilter = (cat: string) => {
    setFilter(cat);
    const el = document.getElementById('products');
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'cart') {
      setIsCartOpen(true);
      setActiveTab('home');
    } else if (tab === 'shop') {
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveTab('home');
    } else if (tab === 'account') {
      router.push('/track');
    }
  };

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter(p => p.cat === filter);
  }, [products, filter]);

  const gheeProducts = useMemo(() => products.filter(p => p.cat === 'ghee').slice(0, 6), [products]);
  const sweetsProducts = useMemo(() => products.filter(p => p.cat === 'sweets').slice(0, 6), [products]);
  const honeyProducts = useMemo(() => products.filter(p => p.cat === 'honey').slice(0, 6), [products]);

  return (
    <>
      <div className="sticky top-0 z-[900]">
        <Ticker />
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          cartCount={totalQty}
          onFilter={handleCategoryFilter}
          onSearch={handleSearch}
        />
      </div>
      
      <div 
        className={cn(
          "min-h-screen bg-[#F9F6EF] text-[#100C06] overflow-x-hidden pb-[68px] md:pb-0"
        )}
      >
        <main>
          <Hero />
          
          <div className="text-center py-5 md:py-12 px-4 sm:px-5 bg-white border-b border-primary/5">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-6xl font-extrabold text-primary mb-1 leading-tight">
              Welcome To Vivaan Farms!
            </h2>
            <p className="text-[#7A6848] text-xs sm:text-sm md:text-lg font-bold tracking-wide uppercase">
              You&apos;re One Step Closer to Purity
            </p>
            <div className="w-10 h-0.5 bg-primary/10 mx-auto mt-2.5 rounded-full"></div>
          </div>

          <TrustBar />

          <section className="py-4 md:py-16" id="products">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-5 md:px-10">
              <div className="flex justify-center mb-6 md:mb-12 overflow-x-auto no-scrollbar px-2 w-full">
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-full border border-[#DDD0B5]/60 shadow-sm mx-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryFilter(cat.id)}
                      className={cn(
                        "flex items-center gap-1.5 md:gap-2 px-3.5 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold md:font-extrabold transition-all whitespace-nowrap shrink-0 active:scale-95 select-none",
                        filter === cat.id 
                          ? "bg-primary text-white shadow-md shadow-primary/20" 
                          : "text-[#7A6848] hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      <span className="text-sm md:text-base">{cat.ico}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {productsError && (
                <div className="mb-6 max-w-xl mx-auto">
                  <ErrorCard
                    error={productsError}
                    compact
                    title="Live Products Database Notice"
                    message="We couldn't connect to the live product inventory. Showing available items."
                  />
                </div>
              )}

              {productsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 items-stretch">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/50 rounded-2xl md:rounded-3xl aspect-[3/4] animate-pulse border-2 border-dashed border-[#DDD0B5]/30"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 items-stretch">
                    {filteredProducts.map((p) => (
                      <div key={p.id} className="h-full flex flex-col">
                        <ProductCard 
                          product={p} 
                          isInCart={cart.some(c => c.id === p.id)}
                          onOpen={() => router.push(`/product/${p.id}`)}
                          onAdd={() => addToCart(p)}
                        />
                      </div>
                    ))}
                    {filteredProducts.length === 0 && !productsLoading && (
                      <div className="col-span-full py-16 text-center bg-white/50 rounded-[32px] border-2 border-dashed border-primary/10 mx-auto w-full max-w-2xl">
                        <div className="text-4xl mb-4">🍃</div>
                        <h3 className="font-headline text-2xl font-bold text-primary">Harvesting New Batches</h3>
                        <p className="text-muted-foreground mt-2 text-sm font-medium">No products found in this category yet. Check back soon!</p>
                      </div>
                    )}
                  </div>

                  {filteredProducts.length > 0 && (
                    <div className="mt-4 md:mt-8 flex justify-end">
                      <button 
                        onClick={() => handleCategoryFilter('all')}
                        className="h-8 md:h-9 px-4 md:px-5 rounded-full border border-primary text-primary font-bold text-[11px] md:text-xs tracking-wider uppercase hover:bg-primary hover:text-white transition-all shadow-xs flex items-center gap-1.5 group active:scale-95"
                      >
                        See All Products
                        <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="bg-[#0D3520] py-4 md:py-8 flex items-center justify-center text-white px-5 border-y border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex items-center gap-4 md:gap-8 text-center relative z-10">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20">
                <Coins className="text-yellow-400 w-5 h-5 md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <div className="font-headline text-lg md:text-4xl font-extrabold leading-tight">Get Upto 25% Off with Purity Coins! →</div>
                <p className="text-[8px] md:text-xs font-bold text-white/40 uppercase tracking-[2px] mt-1">Collect coins on every order and save big on your next haul</p>
              </div>
            </div>
          </div>

          <WhyChoose />

          <div className="space-y-6 md:space-y-12 py-6 md:py-16 bg-[#FDFBFA]">
            {/* A2 Ghee Carousel Section */}
            {gheeProducts.length > 0 && (
              <div className="max-w-[1400px] mx-auto">
                <ProductCarousel
                  title="A2 Gir Ghee"
                  subtitle="Traditional Roots"
                  products={gheeProducts.map(p => ({
                    ...p,
                    quantity: p.vol || '500 ml',
                    deliveryTime: 'SAME DAY',
                    originalPrice: p.mrpPrice,
                    imageUrl: p.imageUrls?.[0],
                    description: p.description
                  }))}
                  cartIds={cart.map(c => c.id)}
                  onAddToCart={(cp) => {
                    const originalP = gheeProducts.find(p => String(p.id) === String(cp.id));
                    if (originalP) addToCart(originalP);
                  }}
                  onProductClick={(cp) => router.push(`/product/${cp.id}`)}
                  onViewAll={() => handleCategoryFilter('ghee')}
                />
              </div>
            )}

            {/* Farm Sweets Carousel Section */}
            {sweetsProducts.length > 0 && (
              <div className="max-w-[1400px] mx-auto">
                <ProductCarousel
                  title="Farm Sweets"
                  subtitle="Artisanal Treats"
                  products={sweetsProducts.map(p => ({
                    ...p,
                    quantity: p.vol || '500 g',
                    deliveryTime: 'SAME DAY',
                    originalPrice: p.mrpPrice,
                    imageUrl: p.imageUrls?.[0],
                    description: p.description
                  }))}
                  cartIds={cart.map(c => c.id)}
                  onAddToCart={(cp) => {
                    const originalP = sweetsProducts.find(p => String(p.id) === String(cp.id));
                    if (originalP) addToCart(originalP);
                  }}
                  onProductClick={(cp) => router.push(`/product/${cp.id}`)}
                  onViewAll={() => handleCategoryFilter('sweets')}
                />
              </div>
            )}

            {/* Forest Honey Carousel Section */}
            {honeyProducts.length > 0 && (
              <div className="max-w-[1400px] mx-auto">
                <ProductCarousel
                  title="Forest Honey"
                  subtitle="Wild & Raw"
                  products={honeyProducts.map(p => ({
                    ...p,
                    quantity: p.vol || '500 g',
                    deliveryTime: 'SAME DAY',
                    originalPrice: p.mrpPrice,
                    imageUrl: p.imageUrls?.[0],
                    description: p.description
                  }))}
                  cartIds={cart.map(c => c.id)}
                  onAddToCart={(cp) => {
                    const originalP = honeyProducts.find(p => String(p.id) === String(cp.id));
                    if (originalP) addToCart(originalP);
                  }}
                  onProductClick={(cp) => router.push(`/product/${cp.id}`)}
                  onViewAll={() => handleCategoryFilter('honey')}
                />
              </div>
            )}
          </div>

          <NativeSection />
        </main>

        <Footer />
      </div>

      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
