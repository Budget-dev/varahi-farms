"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBannersPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">
      Redirecting to Dashboard...
    </div>
  );
}