"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/toaster';
import { useUser } from '@/firebase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';

  useEffect(() => {
    if (!isUserLoading && (!user || user.email !== ADMIN_EMAIL) && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router, pathname]);

  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  if (isUserLoading) {
    return <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center font-headline text-3xl font-extrabold text-primary animate-pulse">Loading Dashboard...</div>;
  }

  // Final gate check for authorized email
  if (!user || user.email !== ADMIN_EMAIL) {
    return null; // The useEffect will handle redirect
  }

  return (
    <div className="flex min-h-screen bg-[#F9F6EF] font-body text-[#100C06]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto overflow-hidden">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
