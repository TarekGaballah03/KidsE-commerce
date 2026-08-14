'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './product-card';
import { Product } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedCollectionsProps {
  featuredProducts: Product[];
  newArrivals: Product[];
}

export function FeaturedCollections({ featuredProducts, newArrivals }: FeaturedCollectionsProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'new'>('featured');

  const displayedProducts = activeTab === 'featured' ? featuredProducts : newArrivals;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
              Handpicked Essentials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Featured Collections
            </h2>
          </div>

          {/* Tab Pill Buttons */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'featured'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Best Sellers
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'new'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">No products found in this collection.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-rose-500 text-white text-xs font-bold px-7 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            <span>Explore All {displayedProducts.length}+ Outfits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
