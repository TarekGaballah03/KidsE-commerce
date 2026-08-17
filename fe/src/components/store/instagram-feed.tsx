'use client';

import React from 'react';
import { Heart } from 'lucide-react';

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const INSTA_PHOTOS = [
  {
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    likes: '1.2k',
    tag: '@swan_editorial',
  },
  {
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    likes: '980',
    tag: '@swan_editorial',
  },
  {
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    likes: '2.4k',
    tag: '@swan_editorial',
  },
  {
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&auto=format&fit=crop&q=80',
    likes: '1.5k',
    tag: '@swan_editorial',
  },
];

export function InstagramFeed() {
  return (
    <section className="py-16 sm:py-24 bg-[#fdf8f8] px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block mb-2">
          Community Moments
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
          As Seen on Instagram
        </h2>
        <p className="text-[#5e5f5c] text-xs sm:text-sm mt-2">
          Tag <span className="font-semibold text-[#1a1a1a]">@swan_editorial</span> to share your little adventures.
        </p>
      </div>

      {/* 4 Photo Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {INSTA_PHOTOS.map((item, idx) => (
          <a
            key={idx}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square rounded-lg overflow-hidden bg-[#f1edec] shadow-xs hover:shadow-xl transition-all duration-500 block border border-[#e5e2e1]/60"
          >
            <img
              src={item.image}
              alt="Instagram post"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
              <span className="text-xs font-medium">{item.tag}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-white">
                <Heart className="w-3.5 h-3.5 fill-white" />
                {item.likes}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

