'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Star, ShieldCheck } from 'lucide-react';
import { FloatingDoodles } from './floating-doodles';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-100/60 via-amber-50/40 to-sky-50/60 py-12 lg:py-20 rounded-b-[2.5rem] lg:rounded-b-[4rem] border-b border-pink-100">
      <FloatingDoodles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs border border-pink-200 text-rose-600 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>New Summer Collection 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Playful Outfits for{' '}
              <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
                Magical Moments
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Ultra-soft organic cotton, durable twirl dresses, cozy sets, and adorable accessories crafted for happy playdates and everyday adventures across Egypt.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Shop New Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products?category=boys"
                className="w-full sm:w-auto bg-white/90 hover:bg-white text-slate-800 font-bold text-sm px-7 py-3.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Categories</span>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 grid grid-cols-3 gap-2 border-t border-pink-200/60 max-w-md mx-auto lg:mx-0 text-center sm:text-left">
              <div>
                <span className="block font-extrabold text-slate-900 text-base">100% COD</span>
                <span className="text-[11px] text-slate-500 font-medium">Cash on Delivery</span>
              </div>
              <div>
                <span className="block font-extrabold text-slate-900 text-base">Organic</span>
                <span className="text-[11px] text-slate-500 font-medium">Soft Fabrics</span>
              </div>
              <div>
                <span className="block font-extrabold text-slate-900 text-base">2-4 Days</span>
                <span className="text-[11px] text-slate-500 font-medium">Egypt Delivery</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Hero Image Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500 bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800"
                  alt="Kids Fashion Hero"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Highlight Card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-pink-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <span className="block font-extrabold text-xs text-slate-900">Loved by 10k+ Moms</span>
                  <span className="block text-[10px] text-slate-500 font-medium">⭐⭐⭐⭐⭐ Rated 4.9/5</span>
                </div>
              </div>

              {/* Floating Highlight Card 2 */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-sky-100 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-xs font-bold text-slate-800">100% Kids Safe</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
