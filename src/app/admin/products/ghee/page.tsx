"use client";

import React from 'react';
import { ProductCategoryManager } from '@/components/admin/ProductCategoryManager';

export default function GheeManagerPage() {
  return (
    <ProductCategoryManager 
      category="Ghee"
      title="A2 Ghee"
      description="Manage your traditional Bilona method A2 Ghee collection"
      icon="fa-cow"
    />
  );
}
