"use client";

import React from 'react';
import { ProductCategoryManager } from '@/components/admin/ProductCategoryManager';

export default function HoneyManagerPage() {
  return (
    <ProductCategoryManager 
      category="Honey"
      title="Forest Honey"
      description="Manage your organic and wild forest honey collection"
      icon="fa-jar"
    />
  );
}
