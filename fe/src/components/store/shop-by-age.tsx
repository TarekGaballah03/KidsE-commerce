'use client';

import React from 'react';
import Link from 'next/link';

const AGE_GROUPS = [
  {
    range: '0-2',
    name: 'Tiny Beginnings',
    ageLabel: '0–2Y',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
  },
  {
    range: '3-5',
    name: 'Little Explorers',
    ageLabel: '3–5Y',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
  },
  {
    range: '6-8',
    name: 'Growing Legends',
    ageLabel: '6–8Y',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
  },
  {
    range: '9-12',
    name: 'Young Creatives',
    ageLabel: '9–12Y',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&auto=format&fit=crop&q=80',
  },
];

export function ShopByAge() {
  return (
    <section className="py-16 sm:py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Editorial Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block mb-2">
          Milestone Sizing
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
          Shop by Age
        </h2>
      </div>

      {/* Grid with 4:5 Aspect Ratio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {AGE_GROUPS.map((item) => (
          <Link
            key={item.range}
            href={`/products?ageRange=${encodeURIComponent(item.range)}`}
            className="group block cursor-pointer"
          >
            <div className="relative aspect-4/5 rounded-lg overflow-hidden bg-[#f1edec] mb-3 shadow-[0_4px_20px_rgba(26,26,26,0.03)] border border-[#e5e2e1]/60">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="text-center space-y-0.5">
              <p className="font-medium text-sm sm:text-base text-[#1a1a1a] group-hover:opacity-75 transition-opacity">
                {item.name}
              </p>
              <p className="text-[11px] uppercase font-semibold tracking-widest text-[#5e5f5c]">
                {item.ageLabel}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

