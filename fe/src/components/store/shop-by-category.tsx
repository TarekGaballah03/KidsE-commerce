'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Boys Collection',
    slug: 'boys',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
    count: '30+ Outfits',
    tag: 'Cool & Durable',
    gradient: 'from-blue-600/80 to-sky-900/90',
  },
  {
    name: 'Girls Collection',
    slug: 'girls',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600',
    count: '25+ Twirl Dresses',
    tag: 'Charming & Stylish',
    gradient: 'from-pink-600/80 to-purple-900/90',
  },
  {
    name: 'Babies & Toddlers',
    slug: 'babies',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
    count: '20+ Organic Onesies',
    tag: 'Ultra-Soft Cotton',
    gradient: 'from-amber-600/80 to-yellow-900/90',
  },
  {
    name: 'Kids Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600',
    count: '15+ Sun Hats & Bibs',
    tag: 'Cute Essentials',
    gradient: 'from-emerald-600/80 to-teal-900/90',
  },
];

export function ShopByCategory() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-sky-600 font-bold text-xs uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full">
              Explore Wardrobe
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Visual Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 block"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-75 group-hover:opacity-85 transition-opacity`} />

              {/* Top Tag */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {cat.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs text-slate-200 font-medium">{cat.count}</span>
                <h3 className="text-xl font-extrabold mt-0.5 tracking-tight group-hover:text-amber-200 transition-colors">
                  {cat.name}
                </h3>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Shop Collection</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
