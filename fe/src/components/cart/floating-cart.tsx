'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '../../lib/use-cart-store';
import { formatPrice } from '../../lib/utils';

export function FloatingCart() {
  const {
    items,
    isOpen,
    openCart,
    lastAddedItem,
    lastAddedTimestamp,
    isBumping,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const [showExpandedPreview, setShowExpandedPreview] = useState(false);

  const totalCount = getItemCount();
  const subtotal = getSubtotal();
  const primaryItem = items[0] || lastAddedItem;
  const additionalItemsCount = Math.max(0, items.length - 1);

  // When a new item is added, expand briefly for 2.8 seconds, then collapse to the circular photo orb
  useEffect(() => {
    if (lastAddedTimestamp && Date.now() - lastAddedTimestamp < 3000) {
      setShowExpandedPreview(true);
      const timer = setTimeout(() => {
        setShowExpandedPreview(false);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTimestamp, lastAddedItem]);

  // If cart drawer is open, hide or reduce prominence
  if (isOpen) return null;

  return (
    <div
      id="floating-cart-anchor"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none"
    >
      {/* 1. Expanded Floating Banner (Shows for a couple of seconds right after Add to Cart) */}
      {showExpandedPreview && lastAddedItem && (
        <div
          onClick={openCart}
          className="absolute bottom-0 right-0 w-72 sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#1a1a1a]/15 shadow-2xl flex items-center gap-3 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300 hover:scale-[1.02] transition-transform ring-4 ring-[#1a1a1a]/5"
        >
          {/* Thumbnail */}
          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#f1edec] border border-[#e5e2e1] shrink-0">
            <img
              src={lastAddedItem.image}
              alt={lastAddedItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1a1a1a]/10 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-white text-[#1a1a1a] flex items-center justify-center shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5e5f5c] block">
              Added to Bag
            </span>
            <h4 className="font-serif font-bold text-xs text-[#1a1a1a] truncate">
              {lastAddedItem.title}
            </h4>
            <p className="text-[11px] text-[#5e5f5c] font-medium mt-0.5">
              {lastAddedItem.size} • {formatPrice(lastAddedItem.price)}
            </p>
          </div>

          {/* Action indicator */}
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* 2. Floating Circular Cart Widget (Default resting state & collapsed state) */}
      <div className={`${showExpandedPreview ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'} transition-all duration-500 ease-out`}>
        <button
          onClick={openCart}
          aria-label="Open Shopping Bag"
          className={`group relative flex items-center justify-center transition-all duration-300 ${
            isBumping ? 'animate-cart-bounce animate-cart-glow' : 'animate-float-subtle hover:scale-110 active:scale-95'
          }`}
        >
          {totalCount > 0 && primaryItem ? (
            /* Circular Photo Orb Containing Garment Photo */
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-white shadow-2xl border-2 border-white ring-2 ring-[#1a1a1a]/20 group-hover:ring-[#1a1a1a] overflow-visible transition-all">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#f1edec] relative">
                <img
                  src={primaryItem.image}
                  alt={primaryItem.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Number Badge for Multiple Products (+N) */}
              {additionalItemsCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1a1a1a] text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-white tracking-tight transform group-hover:scale-110 transition-transform">
                  +{additionalItemsCount}
                </span>
              ) : (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1a1a1a] text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  {totalCount}
                </span>
              )}

              {/* Little Shopping Bag Icon floating indicator in bottom-left */}
              <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-md border-2 border-white">
                <ShoppingBag className="w-3 h-3" />
              </div>
            </div>
          ) : (
            /* Minimalist Charcoal Circular Bag for Empty Cart */
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-2xl border-2 border-white ring-2 ring-[#1a1a1a]/15 group-hover:bg-[#000000] group-hover:ring-[#1a1a1a]/30 transition-all">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          )}

          {/* Hover Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center gap-2 bg-[#1a1a1a] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="font-serif font-normal">Shopping Bag</span>
            {totalCount > 0 && (
              <>
                <span className="text-[#8fa89b]">•</span>
                <span className="font-serif">{formatPrice(subtotal)}</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
