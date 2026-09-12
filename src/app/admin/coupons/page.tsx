"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Ticket, Trash2, Tag, Calendar, Layers, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminCouponsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const couponsRef = useMemoFirebase(() => collection(db, 'universalCoupons'), [db]);
  const { data: coupons, isLoading } = useCollection(couponsRef);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'flat' | 'percentage'>('flat');
  const [value, setValue] = useState('');
  const [limit, setLimit] = useState('100');
  const [expiry, setExpiry] = useState('');

  const handleAdd = () => {
    if (!code || !value) {
      toast({ variant: "destructive", title: "Missing Info" });
      return;
    }

    const newCoupon = {
      code: code.toUpperCase().trim(),
      type,
      value: Number(value),
      usageLimit: Number(limit),
      usedCount: 0,
      expiryDate: expiry || new Date(Date.now() + 30 * 86400000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'universalCoupons'), newCoupon);
    toast({ title: "Coupon Created", description: `${code} is now live.` });
    setIsAddOpen(false);
    setCode(''); setValue('');
  };

  const toggleStatus = (id: string, current: boolean) => {
    updateDocumentNonBlocking(doc(db, 'universalCoupons', id), { isActive: !current });
  };

  if (isLoading) return <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">Loading Coupons...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Global Coupons</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Create and manage universal discount codes for the store.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
              <Ticket className="w-4 h-4" /> Create Coupon
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-[40px] p-10 border-none shadow-2xl font-body">
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="font-headline text-3xl font-extrabold text-primary">New Store Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Coupon Code</label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. FESTIVE20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Type</label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat ₹</SelectItem>
                      <SelectItem value="percentage">Percentage %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Value</label>
                  <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Usage Limit</label>
                  <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Expiry Date</label>
                  <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" />
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full h-14 bg-primary text-white rounded-full font-black uppercase tracking-widest shadow-xl mt-4">Publish Coupon</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons?.map((c) => (
          <Card key={c.id} className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white p-8 relative">
            <div className={`absolute top-4 right-6 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${c.isActive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              {c.isActive ? 'Active' : 'Disabled'}
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F9F6EF] rounded-2xl flex items-center justify-center text-primary">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-black text-primary">{c.code}</h3>
                <p className="text-[10px] text-[#7A6848] font-bold uppercase tracking-widest">{c.type === 'flat' ? `₹${c.value} OFF` : `${c.value}% OFF`}</p>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7A6848] font-medium flex items-center gap-1.5"><Layers className="w-3 h-3" /> Usage</span>
                <span className="font-bold">{c.usedCount} / {c.usageLimit}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7A6848] font-medium flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Expiry</span>
                <span className="font-bold">{new Date(c.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => toggleStatus(c.id, c.isActive)}
                variant="outline" 
                className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-[#DDD0B5]"
              >
                {c.isActive ? 'Disable' : 'Enable'}
              </Button>
              <button 
                onClick={() => deleteDocumentNonBlocking(doc(db, 'universalCoupons', c.id))}
                className="w-10 h-10 rounded-xl bg-destructive/5 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
