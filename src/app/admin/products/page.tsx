"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const router = useRouter();
  
  const sections = [
    { id: 'ghee', label: 'A2 Ghee', desc: 'Traditional Bilona Ghee', icon: 'fa-cow', href: '/admin/products/ghee' },
    { id: 'sweets', label: 'Sweets', desc: 'Artisanal Farm Sweets', icon: 'fa-gift', href: '/admin/products/sweets' },
    { id: 'honey', label: 'Honey', desc: 'Wild Forest Organic Honey', icon: 'fa-jar', href: '/admin/products/honey' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Global Inventory</h1>
        <p className="text-[#7A6848] text-sm mt-2 font-medium">Select a category to manage your Vivaan Farms catalog.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card 
            key={section.id} 
            className="border-none shadow-xl rounded-[32px] overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer bg-white"
            onClick={() => router.push(section.href)}
          >
            <CardContent className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#F9F6EF] rounded-2xl flex items-center justify-center text-primary group-hover:bg-[#1B5E3B] group-hover:text-white transition-all duration-500">
                  <i className={cn("fa-solid text-2xl", section.icon)}></i>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-extrabold mb-1">{section.label}</h3>
                  <p className="text-xs text-[#7A6848] font-medium">{section.desc}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#F9F6EF] flex items-center justify-center text-[#7A6848] group-hover:translate-x-2 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl rounded-[40px] p-10 bg-[#EBF5EE] text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Box className="w-8 h-8" />
        </div>
        <h3 className="font-headline text-3xl font-extrabold text-primary mb-4">Stock Management</h3>
        <p className="text-[#7A6848] text-sm leading-relaxed font-medium">
          Managing your inventory by category helps maintain 100% traceability and accuracy.
          Each batch is tracked from our Gujarat farms to the final customer.
        </p>
      </Card>
    </div>
  );
}
