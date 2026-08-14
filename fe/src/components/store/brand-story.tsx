'use client';

import React from 'react';
import { Heart, ShieldCheck, Sparkles, Feather } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="py-16 bg-gradient-to-r from-amber-50/50 via-pink-50/50 to-sky-50/50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="text-rose-500 font-bold text-xs uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full shadow-2xs">
              Our Story & Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed for Happy Play, Soft Comfort & Cherished Childhoods 🎈
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Little Dreamers started as a boutique Instagram brand in Cairo with a simple mission: create children's apparel that feels ultra-soft against delicate skin, looks effortlessly stylish, and withstands hundreds of washing machine cycles.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every dress, hoodie, onesie, and jogger is crafted with nickel-free snaps, itch-free tagless necklines, and breathable cotton tailored for active Egyptian kids.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-left">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
                <Feather className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Soft Combed Cotton</h4>
                  <p className="text-[11px] text-slate-500">Hypoallergenic & gentle</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-sky-100 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Tagless Comfort</h4>
                  <p className="text-[11px] text-slate-500">No scratching or irritation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-lg bg-slate-200">
                <img src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600" alt="Brand Craft" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-lg bg-slate-200 mt-6">
                <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600" alt="Childhood Happiness" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
