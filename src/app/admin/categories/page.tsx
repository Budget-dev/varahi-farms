"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function AdminCategoriesPage() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  if (isLoading) {
    return <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">Loading Categories...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Store Categories</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Organize and segment your product collections.</p>
        </div>
        <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories && categories.length > 0 ? categories.map((cat) => (
          <Card key={cat.id} className="border-none shadow-xl rounded-[32px] overflow-hidden group hover:scale-[1.05] transition-all cursor-pointer">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white mb-6 transition-transform group-hover:rotate-12 bg-primary">
                <i className={cn("fa-solid text-2xl", cat.name?.toLowerCase().includes('ghee') ? 'fa-cow' : 'fa-tags')}></i>
              </div>
              <h3 className="font-headline text-2xl font-extrabold mb-1">{cat.name}</h3>
              <p className="text-[10px] text-[#7A6848] font-black uppercase tracking-[2px]">Managed Collection</p>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-10 bg-white/50 rounded-[32px] border-2 border-dashed border-[#DDD0B5] text-center text-[#7A6848] font-medium">
            No categories defined yet.
          </div>
        )}
      </div>

      <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9F6EF]">
            <TableRow className="border-b-[#DDD0B5]/30">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Category Info</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Description</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.length > 0 ? categories.map((cat) => (
              <TableRow key={cat.id} className="border-b-[#DDD0B5]/20 hover:bg-primary/[0.02] transition-colors group">
                <TableCell className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm bg-primary">
                      <i className="fa-solid fa-tags"></i>
                    </div>
                    <span className="text-sm font-bold text-[#100C06]">{cat.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-bold text-[#7A6848] truncate max-w-[200px]">{cat.description || 'No description'}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary">Active</span>
                </TableCell>
                <TableCell className="text-right px-8 space-x-2">
                  <button className="w-9 h-9 rounded-xl bg-[#F9F6EF] text-[#7A6848] hover:bg-primary/10 hover:text-primary transition-all">
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-destructive/5 text-destructive/40 hover:bg-destructive hover:text-white transition-all shadow-sm">
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center text-[#7A6848] font-medium italic">
                  Create your first category to organize products.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
