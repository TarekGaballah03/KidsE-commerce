'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[680px] flex flex-col justify-end overflow-hidden pb-12 lg:pb-20 px-6 sm:px-12 bg-[#fdf8f8]">
      {/* Background Editorial Image */}
      <img
        src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1600&auto=format&fit=crop&q=80"
        alt="Swan Editorial Kids Fashion"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 filter contrast-[0.95] brightness-[0.95]"
      />

      {/* Subtle Warm Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#fdf8f8] via-[#fdf8f8]/40 to-transparent z-10" />

      {/* Hand-drawn scribble accent 1 (Star doodle) */}
      <svg
        className="scribble-accent top-[15%] right-[10%] w-16 h-16 text-[#1a1a1a]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" strokeLinejoin="round" />
      </svg>

      {/* Hand-drawn scribble accent 2 (Wave doodle) */}
      <svg
        className="scribble-accent top-[35%] left-[6%] w-24 h-12 text-[#1a1a1a]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 100 50"
      >
        <path d="M10 25 Q 30 10 50 25 T 90 25" strokeLinecap="round" />
      </svg>

      {/* Centered Editorial Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4 pt-16">
        <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#5e5f5c] bg-[#ffffff]/80 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#c4c7c7]/40 shadow-xs">
          New Autumn / Winter Drop
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a] uppercase leading-[1.1]">
          Made for Little Adventures.
        </h1>

        <p className="font-sans text-sm sm:text-base text-[#444748] max-w-md mx-auto leading-relaxed">
          Unmatched comfort for every jump, run & story. Mindfully crafted with certified natural fabrics.
        </p>

        {/* CTA Button Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-3">
          <Link
            href="/products"
            className="w-full sm:w-auto flex-1 bg-[#1a1a1a] hover:bg-[#000000] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Shop New Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/products?category=boys"
            className="w-full sm:w-auto flex-1 bg-white/90 hover:bg-white text-[#1a1a1a] border border-[#1a1a1a] text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-lg shadow-xs hover:bg-[#f1edec] transition-all flex items-center justify-center"
          >
            <span>Explore The Drop</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

