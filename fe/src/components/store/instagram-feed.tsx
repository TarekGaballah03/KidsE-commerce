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
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
    likes: '1.2k',
    tag: '@littledreamers_eg',
  },
  {
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600',
    likes: '980',
    tag: '@littledreamers_eg',
  },
  {
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
    likes: '2.4k',
    tag: '@littledreamers_eg',
  },
  {
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600',
    likes: '1.5k',
    tag: '@littledreamers_eg',
  },
];

export function InstagramFeed() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Community Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            As Seen on Instagram 📸
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Follow <span className="font-bold text-rose-500">@littledreamers_eg</span> on Instagram & tag us for a chance to be featured!
          </p>
        </div>

        {/* 4 Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTA_PHOTOS.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={item.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
                <span className="text-xs font-bold">{item.tag}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" />
                  {item.likes}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
