"use client";

import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Landmark, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, itemCount, onSuccess }) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'net' | 'cod'>('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-md p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-[28px] max-w-[540px] w-full max-h-[calc(100vh-64px)] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-br from-primary via-secondary to-[#2A7A50] p-8 relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-[140px] h-[140px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_68%)] pointer-events-none"></div>
          <div className="text-[10px] text-white/40 font-black uppercase tracking-[3px] mb-2">Amount to Pay</div>
          <div className="font-headline text-6xl font-extrabold text-white leading-none">₹{total.toLocaleString('en-IN')}</div>
          <div className="text-[13px] text-white/50 mt-3 font-medium">{itemCount} items from Vivaan Farms</div>
        </div>

        <div className="p-8">
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[2.5px] mb-4">Payment Method</div>
          
          <div className="space-y-3 mb-8">
            {[
              { id: 'upi', icon: '📱', bg: '#EEF2FF', title: 'UPI / GPay / PhonePe', desc: 'Instant · Most secure' },
              { id: 'card', icon: '💳', bg: '#FFF0F0', title: 'Credit / Debit Card', desc: 'Visa · Mastercard · RuPay' },
              { id: 'net', icon: '🏦', bg: '#F0FFF5', title: 'Net Banking', desc: 'All major Indian banks' },
              { id: 'cod', icon: '💵', bg: '#FFFBEF', title: 'Cash on Delivery', desc: 'Pay when it arrives' },
            ].map((opt) => (
              <div 
                key={opt.id}
                onClick={() => setMethod(opt.id as any)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${method === opt.id ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border bg-card hover:border-muted-foreground/30'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${method === opt.id ? 'border-primary' : 'border-border'}`}>
                  {method === opt.id && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: opt.bg }}>
                  {opt.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground font-medium">{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {method === 'upi' && (
            <div className="mb-6 animate-in slide-in-from-top-2 duration-200">
              <Input className="h-13 rounded-full border-2 border-border focus-visible:border-primary px-5 text-base" placeholder="Enter UPI ID (e.g. name@upi)" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-[#EEF9F0] rounded-2xl p-3 border border-primary/10 text-center">
              <ShieldCheck className="w-5 h-5 mx-auto mb-1.5 text-primary" />
              <div className="text-[9px] font-bold text-primary leading-tight">SSL Secured</div>
            </div>
            <div className="bg-[#EEF9F0] rounded-2xl p-3 border border-primary/10 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1.5 text-primary" />
              <div className="text-[9px] font-bold text-primary leading-tight">RBI Approved</div>
            </div>
            <div className="bg-[#EEF9F0] rounded-2xl p-3 border border-primary/10 text-center">
              <Banknote className="w-5 h-5 mx-auto mb-1.5 text-primary" />
              <div className="text-[9px] font-bold text-primary leading-tight">Trusted Pay</div>
            </div>
          </div>

          <Button 
            onClick={handlePay}
            disabled={loading}
            className="w-full h-14 bg-primary text-white rounded-full text-base font-black uppercase tracking-wider shadow-xl transition-all hover:translate-y-[-2px]"
          >
            {loading ? '⏳ Verifying Payment...' : `🔒 Pay ₹${total.toLocaleString('en-IN')} Securely`}
          </Button>
        </div>
      </div>
    </div>
  );
};
