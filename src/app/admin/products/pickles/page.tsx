"use client";

import React from 'react';
import { ProductCategoryManager } from '@/components/admin/ProductCategoryManager';

export default function PicklesManagerPage() {
  return (
    <ProductCategoryManager 
      category="Pickles"
      title="Handmade Pickles"
      description="Manage your sun-dried and traditional pickle recipes"
      icon="fa-pepper-hot"
    />
  );
}
