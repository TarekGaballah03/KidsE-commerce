'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const AGE_RANGES = [
  {
    range: '0-2',
    label: '0 – 2 Years',
    title: 'Babies & Toddlers',
    desc: 'Soft organic onesies, rompers & cozy sleepwear',
    color: 'from-pink-400 to-rose-400',
    bgColor: 'bg-pink-50 hover:bg-pink-100/80',
    borderColor: 'border-pink-200',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
  },
  {
    range: '3-5',
    label: '3 – 5 Years',
    labelShort: 'Little Explorers',
    title: 'Preschoolers',
    desc: 'Play-friendly sets, t-shirts & twirl dresses',
    color: 'from-sky-400 to-blue-400',
    bgColor: 'bg-sky-50 hover:bg-sky-100/80',
    borderColor: 'border-sky-200',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500',
  },
  {
    range: '6-8',
    label: '6 – 8 Years',
    title: 'Junior Playmakers',
    desc: 'Durable fashion, hoodies, joggers & activewear',
    color: 'from-amber-400 to-orange-400',
    bgColor: 'bg-amber-50 hover:bg-amber-100/80',
    borderColor: 'border-amber-200',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500',
  },
  {
    range: '9+',
    label: '9+ Years',
    title: 'Pre-Teens',
    desc: 'Trendy streetwear, stylish jackets & cool outfits',
    color: 'from-emerald-400 to-teal-400',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
    borderColor: 'border-emerald-200',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500',
  },
];

export function ShopByAge() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-rose-500 font-bold text-xs uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
            Tailored Fit Selection
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Shop by Age Group
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Find perfect sizes designed for every developmental milestone.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGE_RANGES.map((item) => (
            <Link
              key={item.range}
              href={`/products?ageRange=${encodeURIComponent(item.range)}`}
              className={`group relative rounded-3xl p-5 border ${item.borderColor} ${item.bgColor} transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
            >
              {/* Top Age Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-extrabold text-white px-3 py-1 rounded-full bg-gradient-to-r ${item.color} shadow-xs`}>
                  {item.label}
                </span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Desc */}
              <div className="mb-6">
                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Photo Thumbnail */}
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-white/60 shadow-xs">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
