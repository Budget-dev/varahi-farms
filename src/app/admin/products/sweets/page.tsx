"use client";

import React from 'react';
import { ProductCategoryManager } from '@/components/admin/ProductCategoryManager';

export default function SweetsManagerPage() {
  return (
    <ProductCategoryManager 
      category="Sweets"
      title="Artisanal Sweets"
      description="Manage your farm-fresh sweets and traditional mithai"
      icon="fa-gift"
    />
  );
}
