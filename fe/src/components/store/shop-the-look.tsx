'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export function ShopTheLook() {
  const lookProducts = [
    {
      title: 'Cozy Fleece Hoodie & Jogger Set',
      slug: 'cozy-fleece-hoodie-jogger-set',
      price: 450,
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400',
      badge: 'Hoodie Set',
    },
    {
      title: 'Little Adventurer Sun Bucket Hat',
      slug: 'little-adventurer-sun-bucket-hat',
      price: 180,
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400',
      badge: 'Sun Hat',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-sky-50/50 to-white border-y border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sky-600 font-bold text-xs uppercase tracking-widest bg-sky-100/80 px-3.5 py-1 rounded-full">
            Style Inspiration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Shop The Look ✨
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Curated playdate outfit pairings designed by our stylists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xl">
          {/* Main Editorial Lifestyle Image */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-16/9 bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1000"
              alt="Weekend Playdate Look"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Weekend Playdate Look</span>
            </div>
          </div>

          {/* Linked Products Beneath / Beside */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Items in this Look
            </h3>

            {lookProducts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-rose-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                      {item.badge}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{item.title}</h4>
                    <span className="font-extrabold text-slate-900 text-xs">{formatPrice(item.price)}</span>
                  </div>
                </div>

                <Link
                  href={`/products/${item.slug}`}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-xs transition-colors shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
