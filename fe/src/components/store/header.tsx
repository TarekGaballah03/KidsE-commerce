'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Truck, Menu, X } from 'lucide-react';
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
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fdf8f8]/95 backdrop-blur-md border-b border-[#e5e2e1] shadow-[0_4px_20px_rgba(26,26,26,0.02)]">
      {/* Top Announcement Bar */}
      <div className="bg-[#ebe7e6] text-[#1c1b1b] text-[11px] font-semibold uppercase tracking-widest py-2 px-4 text-center border-b border-[#c4c7c7]/20">
        Free Shipping Over 1000 EGP &nbsp;|&nbsp; Cash on Delivery Available across Egypt
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#1c1b1b] hover:bg-[#f1edec] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a] group-hover:opacity-80 transition-opacity">
              Swan
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-[0.2em] text-[#5e5f5c] border-l border-[#c4c7c7] pl-2.5">
              Editorial Kids
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm text-[#1c1b1b]">
            <Link href="/" className="hover:text-[#8fa89b] transition-colors">
              Home
            </Link>
            <Link href="/products?category=boys" className="hover:text-[#8fa89b] transition-colors">
              Boys
            </Link>
            <Link href="/products?category=girls" className="hover:text-[#8fa89b] transition-colors">
              Girls
            </Link>
            <Link href="/products?category=babies" className="hover:text-[#8fa89b] transition-colors">
              Babies
            </Link>
            <Link href="/products?category=accessories" className="hover:text-[#8fa89b] transition-colors">
              Accessories
            </Link>
            <Link href="/products" className="text-[#ba1a1a] font-semibold hover:opacity-80 transition-opacity">
              All Products
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
              <input
                type="text"
                placeholder="Search outfits, shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-56 pl-9 pr-3 py-2 text-xs rounded-full bg-[#f1edec] border-none focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] text-[#1c1b1b] placeholder:text-[#5e5f5c]/70 transition-all"
              />
              <Search className="w-4 h-4 text-[#5e5f5c] absolute left-3 pointer-events-none" />
            </form>

            {/* Track Order Link */}
            <Link
              href="/orders"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#1c1b1b] bg-[#f1edec] hover:bg-[#e5e2e1] px-4 py-2 rounded-full transition-colors"
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 text-[#5e5f5c]" />
              <span>Track Order</span>
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 rounded-full text-[#1c1b1b] hover:bg-[#f1edec] transition-colors"
              title="My Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-[#1c1b1b] hover:bg-[#f1edec] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fdf8f8] border-b border-[#e5e2e1] px-5 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search outfits, shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-full bg-[#f1edec] border-none focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] text-[#1c1b1b]"
            />
            <Search className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3" />
          </form>

          <nav className="flex flex-col space-y-1 text-sm font-medium text-[#1c1b1b]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-[#f1edec]">
              Home
            </Link>
            <Link href="/products?category=boys" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-[#f1edec]">
              Boys
            </Link>
            <Link href="/products?category=girls" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-[#f1edec]">
              Girls
            </Link>
            <Link href="/products?category=babies" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-[#f1edec]">
              Babies
            </Link>
            <Link href="/products?category=accessories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-[#f1edec]">
              Accessories
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-[#ba1a1a] font-semibold hover:bg-[#f1edec]">
              All Products
            </Link>
            <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-[#f1edec] font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#5e5f5c]" /> Track Order
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

