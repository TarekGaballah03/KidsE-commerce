'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Truck, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../lib/use-cart-store';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-sky-400 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Free Shipping on orders over 500 EGP 🚚 | Cash on Delivery Available across Egypt</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-amber-300 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 bg-clip-text text-transparent tracking-tight">
                Little Dreamers
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Kids Fashion & Co.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm text-slate-700">
            <Link href="/" className="hover:text-rose-500 transition-colors">
              Home
            </Link>
            <Link href="/products?category=boys" className="hover:text-rose-500 transition-colors">
              Boys
            </Link>
            <Link href="/products?category=girls" className="hover:text-rose-500 transition-colors">
              Girls
            </Link>
            <Link href="/products?category=babies" className="hover:text-rose-500 transition-colors">
              Babies
            </Link>
            <Link href="/products?category=accessories" className="hover:text-rose-500 transition-colors">
              Accessories
            </Link>
            <Link href="/products" className="text-rose-600 font-semibold hover:text-rose-700 transition-colors">
              All Products
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
              <input
                type="text"
                placeholder="Search outfits, shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-56 pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-100 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Track Order Link */}
            <Link
              href="/orders/track"
              className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors"
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>

            {/* Account / Admin Link */}
            <Link
              href="/account"
              className="p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="My Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search kids fashion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-slate-100 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-300"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50">
              Home
            </Link>
            <Link href="/products?category=boys" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50">
              Boys Fashion
            </Link>
            <Link href="/products?category=girls" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50">
              Girls Fashion
            </Link>
            <Link href="/products?category=babies" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50">
              Babies & Toddlers
            </Link>
            <Link href="/products?category=accessories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50">
              Accessories
            </Link>
            <Link href="/orders/track" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-pink-50 text-rose-600 font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4" /> Track Order
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
