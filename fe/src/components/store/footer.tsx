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
    <footer className="bg-[#1a1a1a] text-[#ddd9d8] pt-16 pb-12 mt-20 border-t border-[#313030]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Top Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-[#313030] text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#313030] text-[#fdf8f8] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Swift Doorstep Delivery</h4>
              <p className="text-xs text-[#858383]">Across all Egypt governorates</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#313030] text-[#fdf8f8] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Cash on Delivery</h4>
              <p className="text-xs text-[#858383]">Inspect upon receipt prior to payment</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#313030] text-[#fdf8f8] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Effortless Exchanges</h4>
              <p className="text-xs text-[#858383]">Dedicated customer support team</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                Swan
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#858383] mt-0.5">
                Editorial Kids Commerce
              </span>
            </Link>
            <p className="text-xs text-[#c7c7c3] leading-relaxed max-w-xs">
              Curating elevated play, gentle natural fabrics, and timeless aesthetics for modern families across Egypt.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#313030] hover:bg-[#8fa89b] hover:text-white flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#313030] hover:bg-[#8fa89b] hover:text-white flex items-center justify-center transition-colors text-white"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">Collections</h4>
            <ul className="space-y-2.5 text-xs text-[#c7c7c3]">
              <li>
                <Link href="/products?category=boys" className="hover:text-white transition-colors">
                  Boys Wear
                </Link>
              </li>
              <li>
                <Link href="/products?category=girls" className="hover:text-white transition-colors">
                  Girls Collection
                </Link>
              </li>
              <li>
                <Link href="/products?category=babies" className="hover:text-white transition-colors">
                  Babies Organic Rompers
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-white transition-colors">
                  Accessories & Essentials
                </Link>
              </li>
              <li>
                <Link href="/products?isNewArrival=true" className="hover:text-white transition-colors">
                  New Season Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">Client Care</h4>
            <ul className="space-y-2.5 text-xs text-[#c7c7c3]">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Shipping Rates & Zones
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Account Overview
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors text-[#858383]">
                  Swan Workspace (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">Direct Contact</h4>
            <div className="flex items-center gap-2.5 text-xs text-[#c7c7c3]">
              <Phone className="w-4 h-4 text-[#8fa89b] shrink-0" />
              <span>+20 100 123 4567 (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#c7c7c3]">
              <Mail className="w-4 h-4 text-[#8fa89b] shrink-0" />
              <span>concierge@swan.eg</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#c7c7c3]">
              <MapPin className="w-4 h-4 text-[#8fa89b] shrink-0" />
              <span>Cairo, Egypt</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#313030] text-center sm:flex sm:items-center sm:justify-between text-xs text-[#858383]">
          <p>© {new Date().getFullYear()} Swan Kids Editorial Commerce. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex items-center justify-center gap-2">
            <span className="bg-[#313030] text-[#e5e2e1] px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

