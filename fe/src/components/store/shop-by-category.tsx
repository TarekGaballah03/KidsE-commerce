'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Boys Collection',
    slug: 'boys',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    tag: 'Casual & Refined',
  },
  {
    name: 'Girls Collection',
    slug: 'girls',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    tag: 'Twirl & Ease',
  },
  {
    name: 'Babies & Toddlers',
    slug: 'babies',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    tag: 'Pure Cotton',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
    tag: 'Finishing Touches',
  },
];

export function ShopByCategory() {
  return (
    <section className="py-16 sm:py-24 bg-[#f7f3f2] px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block mb-2">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs uppercase tracking-widest font-semibold text-[#1a1a1a] hover:opacity-75 flex items-center gap-1.5 group"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Visual Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative h-96 rounded-lg overflow-hidden shadow-xs hover:shadow-xl transition-all duration-700 block border border-[#e5e2e1]/60"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Minimal Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent transition-opacity" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#fdf8f8]/90 backdrop-blur-xs text-[#1a1a1a] text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-sm shadow-xs">
                  {cat.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#fdf8f8] transition-colors">
                  {cat.name}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

