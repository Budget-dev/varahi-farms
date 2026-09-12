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
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => router.push('/checkout')} cartCount={totalQty} onFilter={() => router.push('/')} onSearch={() => router.push('/')} />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight">Track Your Package</h1>
          <p className="text-[#7A6848] text-sm sm:text-base font-medium mt-2">View real-time status of your farm-fresh deliveries.</p>
        </div>

        {ordersError && (
          <div className="mb-8">
            <ErrorCard
              error={ordersError}
              title="Unable to Retrieve Your Orders"
              message="We had trouble retrieving your order history from the database at this moment. Please verify your login status or try again."
              showHome={true}
            />
          </div>
        )}

        {isUserLoading || ordersLoading ? (
          <div className="space-y-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-[28px] sm:rounded-[32px]"></div>
            ))}
          </div>
        ) : !user ? (
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[28px] sm:rounded-[40px] text-center border border-primary/5 shadow-xl">
             <Package className="w-14 h-14 sm:w-16 sm:h-16 text-primary/20 mx-auto mb-5 sm:mb-6" />
             <h2 className="text-xl sm:text-2xl font-black mb-3">Please Login to track orders</h2>
             <p className="text-[#7A6848] text-sm font-medium mb-6">Sign in with your email or phone to view live shipments.</p>
             <button onClick={() => setIsLoginOpen(true)} className="h-13 sm:h-14 px-8 sm:px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest active:scale-95 transition-transform min-h-[48px]">Login Now</button>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const trackingUrl = order.trackingId 
                ? `https://ship.nimbuspost.com/shipping/tracking/${order.trackingId}`
                : null;

              return (
                <div key={order.id} className="bg-white rounded-[32px] overflow-hidden border border-primary/5 shadow-xl group hover:shadow-2xl transition-all">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start md:items-center gap-5">
                      <div className="w-16 h-16 bg-[#F9F6EF] rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                        <Package className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Order ID: #{order.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div className="text-xl font-headline font-black text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-muted-foreground font-medium mt-1">Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</div>
                        
                        {order.trackingId && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F6EF] border border-[#E8ECE9] rounded-lg text-[11px] font-extrabold text-primary">
                            <Truck className="w-3.5 h-3.5 text-secondary" />
                            <span>AWB: {order.trackingId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider self-start md:self-auto",
                        order.status === 'Delivered' ? "bg-primary/10 text-primary" : "bg-orange-100 text-orange-700"
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status || 'Processing'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold">{order.paymentMethod || 'Prepaid'} · {order.paymentStatus || 'Paid'}</div>
                    </div>
                  </div>

                  <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 border-t border-[#F9F6EF] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px]">🌿</div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#7A6848] ml-1">Vivaan Farms Package</span>
                    </div>

                    {trackingUrl ? (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-secondary transition-all shadow-md active:scale-95"
                      >
                        <Truck className="w-4 h-4 text-secondary" />
                        <span>Track Shipment</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 h-11 px-6 bg-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest rounded-full cursor-not-allowed opacity-80"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Tracking ID Pending</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-12 md:p-20 rounded-[28px] sm:rounded-[40px] text-center border border-primary/5 shadow-xl">
             <Package className="w-14 h-14 sm:w-16 sm:h-16 text-primary/20 mx-auto mb-5 sm:mb-6" />
             <h2 className="text-xl sm:text-2xl font-black mb-3">No orders found yet</h2>
             <p className="text-muted-foreground font-medium text-sm mb-6 sm:mb-8">Start your wellness journey with our pure Gir Cow A2 Ghee.</p>
             <button onClick={() => router.push('/')} className="h-13 sm:h-14 px-8 sm:px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest active:scale-95 transition-transform min-h-[48px]">Shop Products</button>
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
