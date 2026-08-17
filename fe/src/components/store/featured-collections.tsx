'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './product-card';
import { Product } from '../../types';
import { ArrowRight } from 'lucide-react';

interface FeaturedCollectionsProps {
  featuredProducts: Product[];
  newArrivals: Product[];
}

export function FeaturedCollections({ featuredProducts, newArrivals }: FeaturedCollectionsProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'new'>('featured');

  const displayedProducts = activeTab === 'featured' ? featuredProducts : newArrivals;

  return (
    <section className="py-16 sm:py-24 bg-[#fdf8f8] px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 sm:mb-14 gap-6">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block mb-2">
            Selected Drops
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Curated Essentials
          </h2>
        </div>

        {/* Minimalist Tab Pill Buttons */}
        <div className="flex items-center bg-[#f1edec] p-1 rounded-full border border-[#e5e2e1]">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'featured'
                ? 'bg-[#1a1a1a] text-white shadow-xs'
                : 'text-[#5e5f5c] hover:text-[#1a1a1a]'
            }`}
          >
            Best Sellers
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'new'
                ? 'bg-[#1a1a1a] text-white shadow-xs'
                : 'text-[#5e5f5c] hover:text-[#1a1a1a]'
            }`}
          >
            New Arrivals
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#f7f3f2] rounded-lg border border-dashed border-[#c4c7c7]">
          <p className="text-[#5e5f5c] text-sm">No products found in this collection.</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center mt-12 sm:mt-16">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-lg transition-all shadow-xs hover:shadow-md group"
        >
          <span>View All {displayedProducts.length}+ Outfits</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

