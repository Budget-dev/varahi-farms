"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { LoginModal } from '@/components/vivaan/LoginModal';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useCart } from '@/hooks/use-cart';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Package, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorCard } from '@/components/ui/ErrorCard';

export default function TrackOrderPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { totalQty } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid),
      orderBy('orderDate', 'desc')
    );
  }, [db, user]);

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useCollection(ordersQuery);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-secondary" />;
      default: return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'shop') router.push('/#products');
    else if (tab === 'cart') router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-28 md:pb-0">
      <Ticker />
      <Header onOpenCart={() => router.push('/checkout')} cartCount={totalQty} onFilter={() => router.push('/')} onSearch={() => router.push('/')} />

      <main className="max-w-[1000px] mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-10 md:py-16">
        <div className="mb-5 sm:mb-8">
          <h1 className="font-headline text-2xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight">Track Your Package</h1>
          <p className="text-[#7A6848] text-xs sm:text-base font-medium mt-1">View real-time status of your farm-fresh deliveries.</p>
        </div>

        {ordersError && (
          <div className="mb-6">
            <ErrorCard
              error={ordersError}
              title="Unable to Retrieve Your Orders"
              message="We had trouble retrieving your order history from the database at this moment. Please verify your login status or try again."
              showHome={true}
            />
          </div>
        )}

        {isUserLoading || ordersLoading ? (
          <div className="space-y-4 sm:space-y-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 sm:h-40 bg-white rounded-[22px] sm:rounded-[32px]"></div>
            ))}
          </div>
        ) : !user ? (
          <div className="bg-white p-5 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[40px] text-center border border-primary/5 shadow-xl">
             <Package className="w-12 h-12 sm:w-16 sm:h-16 text-primary/20 mx-auto mb-4 sm:mb-6" />
             <h2 className="text-lg sm:text-2xl font-black mb-2">Please Login to track orders</h2>
             <p className="text-[#7A6848] text-xs sm:text-sm font-medium mb-5">Sign in with your email or phone to view live shipments.</p>
             <button onClick={() => setIsLoginOpen(true)} className="h-12 sm:h-14 px-7 sm:px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest active:scale-95 transition-transform min-h-[44px] text-xs sm:text-sm">Login Now</button>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => {
              const trackingUrl = order.trackingId 
                ? `https://ship.nimbuspost.com/shipping/tracking/${order.trackingId}`
                : null;

              return (
                <div key={order.id} className="bg-white rounded-[22px] sm:rounded-[32px] overflow-hidden border border-primary/5 shadow-md hover:shadow-xl transition-all">
                  <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-start md:items-center gap-3.5 sm:gap-5">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F9F6EF] rounded-xl sm:rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">
                          Order ID: #{order.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div className="text-lg sm:text-xl font-headline font-black text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</div>
                        
                        {order.trackingId && (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F9F6EF] border border-[#E8ECE9] rounded-md text-[10px] sm:text-[11px] font-extrabold text-primary">
                            <Truck className="w-3 h-3 text-secondary" />
                            <span>AWB: {order.trackingId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t border-[#F9F6EF] md:border-t-0">
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider",
                        order.status === 'Delivered' ? "bg-primary/10 text-primary" : "bg-orange-100 text-orange-700"
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status || 'Processing'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold">{order.paymentMethod || 'Prepaid'} · {order.paymentStatus || 'Paid'}</div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-3 border-t border-[#F9F6EF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[9px] sm:text-[10px]">🌿</div>
                        ))}
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-[#7A6848] ml-1">Vivaan Farms Package</span>
                    </div>

                    {trackingUrl ? (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-5 sm:px-6 bg-primary text-white text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full hover:bg-secondary transition-all shadow-md active:scale-95 w-full sm:w-auto"
                      >
                        <Truck className="w-3.5 h-3.5 text-secondary" />
                        <span>Track Shipment</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-5 sm:px-6 bg-gray-100 text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full cursor-not-allowed opacity-80 w-full sm:w-auto"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Tracking ID Pending</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-5 sm:p-12 md:p-20 rounded-[24px] sm:rounded-[40px] text-center border border-primary/5 shadow-xl">
             <Package className="w-12 h-12 sm:w-16 sm:h-16 text-primary/20 mx-auto mb-4 sm:mb-6" />
             <h2 className="text-lg sm:text-2xl font-black mb-2">No orders found yet</h2>
             <p className="text-muted-foreground font-medium text-xs sm:text-sm mb-5 sm:mb-8">Start your wellness journey with our pure Gir Cow A2 Ghee.</p>
             <button onClick={() => router.push('/')} className="h-12 sm:h-14 px-8 sm:px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest active:scale-95 transition-transform min-h-[44px] text-xs sm:text-sm">Shop Products</button>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav activeTab="account" onTabChange={handleTabChange} cartCount={totalQty} />
      
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
