"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Ticker } from '@/components/vivaan/Ticker';
import { FestiveHero } from '@/components/vivaan/FestiveHero';
import { CleanestPantrySection } from '@/components/vivaan/CleanestPantrySection';
import { NativeIngredientsSection } from '@/components/vivaan/NativeIngredientsSection';
import { FocusOilsSection } from '@/components/vivaan/FocusOilsSection';
import { FocusGheeSection } from '@/components/vivaan/FocusGheeSection';
import { QualityAssuranceSection } from '@/components/vivaan/QualityAssuranceSection';
import { HealthyCombosSection } from '@/components/vivaan/HealthyCombosSection';
import { SuperfoodsSection } from '@/components/vivaan/SuperfoodsSection';
import { CustomerReviewsSection } from '@/components/vivaan/CustomerReviewsSection';
import { CertificationsStrip } from '@/components/vivaan/CertificationsStrip';
import { Footer } from '@/components/vivaan/Footer';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { naturalLanguageProductSearch } from '@/ai/flows/natural-language-product-search';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const DEFAULT_CATALOG: Product[] = [
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
    pi: 1,
    imageUrls: ['/images/products/mustard_oil.jpg'],
    vars: [
      { s: '500 ml', p: 360, mrp: 450, on: true },
      { s: '1 L', p: 680, mrp: 850, on: false },
      { s: '5 L Can', p: 3200, mrp: 3900, on: false },
    ],
    description: 'Slow-pressed from indigenous yellow mustard seeds. Rich pungent aroma and natural golden color.'
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
    pi: 2,
    imageUrls: ['/images/products/ghee_jar.jpg'],
    vars: [
      { s: '250 ml', p: 520, mrp: 600, on: false },
      { s: '500 ml', p: 980, mrp: 1150, on: true },
      { s: '1000 ml (1 L)', p: 1850, mrp: 2200, on: false },
    ],
    description: 'Golden granular texture with intoxicating nutty aroma. High in natural CLA, butyric acid, and fat-soluble vitamins.'
  },
  {
    id: 'oil-groundnut-cold',
    name: 'Wood Pressed Groundnut Oil (Peanut Oil Canister)',
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
    pi: 3,
    imageUrls: ['/images/products/groundnut_can.jpg'],
    vars: [
      { s: '1 L', p: 390, mrp: 480, on: false },
      { s: '5 L Can', p: 1850, mrp: 2200, on: true },
    ],
    description: 'Heart-healthy cooking oil extracted from handpicked Saurashtra peanuts on traditional wooden kolhu.'
  },
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
    pi: 4,
    imageUrls: ['/images/products/honey_jar.jpg'],
    vars: [
      { s: '450 g', p: 490, mrp: 590, on: true },
      { s: '1 kg', p: 950, mrp: 1150, on: false }
    ],
    description: 'Ethically harvested from wild bee colonies in Gujarat and Himachal deciduous forests. Rich pollen enzymes.'
  },
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
    pi: 5,
    imageUrls: ['/images/products/combo_pack.jpg'],
    vars: [
      { s: '2 x 500ml Jars', p: 1750, mrp: 2300, on: true }
    ],
    description: 'Double the goodness. Two premium glass jars of Vedic Bilona A2 Gir Cow Ghee at our lowest combo price.'
  }
];

export default function VivaanFarms() {
  const router = useRouter();
  const db = useFirestore();
  
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: dbProducts } = useCollection(productsRef);

  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();

  const products = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return DEFAULT_CATALOG;
    
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

    // Merge if fewer items
    if (mapped.length < 6) {
      const existingIds = new Set(mapped.map(m => m.id));
      const fallbacksToAdd = DEFAULT_CATALOG.filter(d => !existingIds.has(d.id));
      return [...mapped, ...fallbacksToAdd];
    }

    return mapped;
  }, [dbProducts]);

  const handleSearch = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    try {
      const res = await naturalLanguageProductSearch({ query: queryStr });
      if (res.categories.length > 0) {
        scrollToPantry();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToPantry = () => {
    const el = document.getElementById('cleanest-pantry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryFilter = (catId: string) => {
    if (catId === 'all') {
      scrollToPantry();
    } else if (catId === 'oils') {
      const el = document.getElementById('focus-oils') || document.getElementById('cleanest-pantry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (catId === 'ghee') {
      const el = document.getElementById('focus-ghee') || document.getElementById('cleanest-pantry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (catId === 'combos') {
      const el = document.getElementById('healthy-combos') || document.getElementById('cleanest-pantry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToPantry();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'cart') {
      setIsCartOpen(true);
      setActiveTab('home');
    } else if (tab === 'shop') {
      scrollToPantry();
      setActiveTab('home');
    } else if (tab === 'account') {
      router.push('/track');
    }
  };

  const cartIds = useMemo(() => cart.map(c => c.id), [cart]);

  return (
    <>
      {/* ── 1. Top Announcement Strip & Navigation Header ── */}
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
          "min-h-screen bg-[#FFFFFF] text-[#100C06] overflow-x-hidden pb-24 md:pb-0"
        )}
      >
        <main>
          {/* ── 2. Hero Festive Purity Sale Banner ── */}
          <FestiveHero onShopClick={scrollToPantry} />

          {/* ── 3. Welcome to Vivaan / Your One-Stop Cleanest Pantry ── */}
          <div id="cleanest-pantry">
            <CleanestPantrySection
              products={products}
              cartIds={cartIds}
              onAddToCart={(p, v) => addToCart(p)}
            />
          </div>

          {/* ── 4. Native Ingredients. No Substitutes. ── */}
          <NativeIngredientsSection />

          {/* ── 6. Product in Focus: Explore Our Cold-Pressed Oils ── */}
          <div id="focus-oils">
            <FocusOilsSection
              products={products}
              cartIds={cartIds}
              onAddToCart={(p, v) => addToCart(p)}
            />
          </div>

          {/* ── 7. Product in Focus: Explore Our A2 Desi Ghee ── */}
          <div id="focus-ghee">
            <FocusGheeSection
              products={products}
              cartIds={cartIds}
              onAddToCart={(p, v) => addToCart(p)}
            />
          </div>

          {/* ── 8. Only Perfect Makes The Cut (Lab Quality Testing) ── */}
          <div id="quality-assurance">
            <QualityAssuranceSection />
          </div>

          {/* ── 9. Healthy Combo Packs ── */}
          <div id="healthy-combos">
            <HealthyCombosSection
              products={products}
              cartIds={cartIds}
              onAddToCart={(p, v) => addToCart(p)}
            />
          </div>

          {/* ── 10. Explore Our Superfoods & Staples ── */}
          <div id="superfoods">
            <SuperfoodsSection
              products={products}
              cartIds={cartIds}
              onAddToCart={(p, v) => addToCart(p)}
            />
          </div>

          {/* ── 11. What Do Our Customers Say (Testimonials) ── */}
          <CustomerReviewsSection />

          {/* ── 12. Recognized & Certified Purity Badges Strip ── */}
          <CertificationsStrip />
        </main>

        {/* ── 13. Comprehensive Forest Green Desktop Footer ── */}
        <Footer />
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={totalQty}
      />

      {/* Slide-out Cart Drawer */}
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
