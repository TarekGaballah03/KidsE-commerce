'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t-4 border-rose-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast COD Delivery</h4>
              <p className="text-xs text-slate-400">Doorstep delivery across all Egypt Governorates</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Cash on Delivery</h4>
              <p className="text-xs text-slate-400">Inspect product upon delivery before payment</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Exchanges</h4>
              <p className="text-xs text-slate-400">Hassle-free size exchange policy</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white font-bold">
                ✨
              </div>
              <span className="font-extrabold text-xl text-white">Little Dreamers</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Egypt's favorite boutique brand for comfortable, stylish, high quality kids apparel & essentials. Designed for play, twirls, and happy memories.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products?category=boys" className="hover:text-rose-400 transition-colors">
                  Boys Wear (0-9+ Yrs)
                </Link>
              </li>
              <li>
                <Link href="/products?category=girls" className="hover:text-rose-400 transition-colors">
                  Girls Dresses & Outfits
                </Link>
              </li>
              <li>
                <Link href="/products?category=babies" className="hover:text-rose-400 transition-colors">
                  Babies Organic Rompers
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-rose-400 transition-colors">
                  Kids Accessories & Hats
                </Link>
              </li>
              <li>
                <Link href="/products?isNewArrival=true" className="hover:text-rose-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/orders/track" className="hover:text-rose-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-rose-400 transition-colors">
                  Shipping Rates & Zones
                </Link>
              </li>
              <li>
                <Link href="/account/login" className="hover:text-rose-400 transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-rose-400 transition-colors text-slate-500">
                  Admin Dashboard Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm mb-4">Contact Us</h4>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-rose-400 shrink-0" />
              <span>+20 100 123 4567 (WhatsApp Available)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-rose-400 shrink-0" />
              <span>hello@littledreamers.eg</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Cairo, Egypt</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Little Dreamers Kids Fashion & Co. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex items-center justify-center gap-2">
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Cash On Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
