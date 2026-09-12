"use client";

import React from 'react';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { InteractiveMenu, InteractiveMenuItem } from '@/components/ui/modern-mobile-menu';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartCount }) => {
  const items: InteractiveMenuItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Grid },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'account', label: 'Account', icon: User },
  ];

  const activeIndex = items.findIndex((item) => item.id === activeTab);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <InteractiveMenu
        items={items}
        activeIndex={safeActiveIndex}
        accentColor="#1B5E3B"
        onTabChange={(_index, item) => {
          if (item.id) {
            onTabChange(item.id);
          }
        }}
      />
    </div>
  );
};
