'use client';

import React from 'react';
import { Sparkles, Cloud, Sun, Heart, Star } from 'lucide-react';

export function FloatingDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 opacity-45">
      <div className="absolute top-12 left-6 text-pink-300 animate-float">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute top-36 right-10 text-sky-200 animate-float" style={{ animationDelay: '1s' }}>
        <Cloud className="w-12 h-12" />
      </div>
      <div className="absolute top-96 left-16 text-amber-200 animate-float" style={{ animationDelay: '2s' }}>
        <Sun className="w-10 h-10" />
      </div>
      <div className="absolute top-[480px] right-20 text-rose-200 animate-float" style={{ animationDelay: '1.5s' }}>
        <Heart className="w-6 h-6 fill-rose-100" />
      </div>
      <div className="absolute top-[800px] left-10 text-emerald-200 animate-float" style={{ animationDelay: '0.8s' }}>
        <Star className="w-8 h-8 fill-emerald-100" />
      </div>
    </div>
  );
}
