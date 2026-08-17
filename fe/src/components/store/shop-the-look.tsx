'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export function ShopTheLook() {
  const lookProducts = [
    {
      title: 'Cozy Fleece Hoodie & Jogger Set',
      slug: 'cozy-fleece-hoodie-jogger-set',
      price: 450,
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
      badge: 'Editorial Pick',
    },
    {
      title: 'Little Adventurer Sun Bucket Hat',
      slug: 'little-adventurer-sun-bucket-hat',
      price: 180,
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
      badge: 'Accessory',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#f7f3f2] px-6 sm:px-12 border-y border-[#e5e2e1]/60">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block mb-2">
            Style Inspiration
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            The Curated Look
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-lg border border-[#e5e2e1] shadow-xs">
          {/* Main Editorial Lifestyle Image */}
          <div className="lg:col-span-7 relative rounded-lg overflow-hidden aspect-4/3 sm:aspect-16/9 bg-[#f1edec]">
            <img
              src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1200&auto=format&fit=crop&q=80"
              alt="Weekend Editorial Look"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#1a1a1a]/85 backdrop-blur-xs text-white text-[11px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-sm">
              <span>Weekend In The City</span>
            </div>
          </div>

          {/* Linked Products Beside */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg border-b border-[#e5e2e1] pb-3">
              Ensemble Pieces
            </h3>

            {lookProducts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#fdf8f8] border border-[#e5e2e1] hover:border-[#c4c7c7] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-md overflow-hidden bg-[#f1edec] shrink-0 border border-[#e5e2e1]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#5e5f5c] uppercase tracking-wider block">
                      {item.badge}
                    </span>
                    <h4 className="font-serif font-semibold text-[#1a1a1a] text-sm line-clamp-1">{item.title}</h4>
                    <span className="font-serif font-bold text-[#1a1a1a] text-xs">{formatPrice(item.price)}</span>
                  </div>
                </div>

                <Link
                  href={`/products/${item.slug}`}
                  className="bg-[#1a1a1a] hover:bg-[#000000] text-white text-[11px] uppercase tracking-widest font-semibold px-3.5 py-2.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0"
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

