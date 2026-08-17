'use client';

import React from 'react';
import { Feather, Sparkles, ShieldCheck } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="py-20 sm:py-28 bg-[#fdf8f8] border-t border-[#e5e2e1]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-[11px] uppercase font-semibold tracking-[0.25em] text-[#5e5f5c] block">
              Ethos & Craft
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a1a] leading-tight">
              Elevated Play, Timeless Memories.
            </h2>
            <p className="text-sm sm:text-base text-[#444748] leading-relaxed">
              Swan bridges the space between high-end editorial fashion and the exuberant spirit of childhood. We believe children’s wear should be exceptionally comfortable, aesthetically harmonious, and designed to endure.
            </p>
            <p className="text-sm sm:text-base text-[#444748] leading-relaxed">
              Every garment is created with premium organic fibers, tagless comfort, and enduring silhouettes tailored for joyful everyday discovery.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-left">
              <div className="bg-[#f7f3f2] p-4 rounded-lg border border-[#e5e2e1]/60 space-y-1">
                <Feather className="w-5 h-5 text-[#1a1a1a]" />
                <h4 className="font-semibold text-xs text-[#1a1a1a] uppercase tracking-wider">Certified Organic</h4>
                <p className="text-[12px] text-[#5e5f5c]">Gentle on sensitive skin</p>
              </div>

              <div className="bg-[#f7f3f2] p-4 rounded-lg border border-[#e5e2e1]/60 space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#1a1a1a]" />
                <h4 className="font-semibold text-xs text-[#1a1a1a] uppercase tracking-wider">Heirloom Quality</h4>
                <p className="text-[12px] text-[#5e5f5c]">Made to pass down</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="aspect-4/5 rounded-lg overflow-hidden shadow-xs bg-[#f1edec] border border-[#e5e2e1]/60">
                <img
                  src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
                  alt="Swan Craft"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-4/5 rounded-lg overflow-hidden shadow-xs bg-[#f1edec] border border-[#e5e2e1]/60 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80"
                  alt="Swan Childhood"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

