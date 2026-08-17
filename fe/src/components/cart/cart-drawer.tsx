'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../lib/use-cart-store';
import { formatPrice } from '../../lib/utils';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    freeShippingThreshold,
  } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-[#1a1a1a]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdf8f8] shadow-2xl flex flex-col border-l border-[#e5e2e1]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#e5e2e1] flex items-center justify-between bg-[#f7f3f2]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#1a1a1a]" />
              <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Shopping Bag ({items.length})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-[#5e5f5c] hover:text-[#1a1a1a] hover:bg-[#e5e2e1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#ebe7e6] p-4 border-b border-[#e5e2e1]">
            {amountForFreeShipping > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-[#1c1b1b]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#5e5f5c]" />
                    <span>Add {formatPrice(amountForFreeShipping)} more for complimentary shipping</span>
                  </span>
                  <span className="font-semibold">{Math.round(freeShippingPercent)}%</span>
                </div>
                <div className="w-full bg-[#ddd9d8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1a1a1a] h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#1a1a1a] bg-[#e0e0dc] py-1.5 px-3 rounded-lg border border-[#c4c7c7]">
                <Truck className="w-4 h-4 text-[#1a1a1a]" />
                <span>Complimentary Delivery Unlocked</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#f1edec] text-[#5e5f5c] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1a1a1a]">Your bag is empty</h3>
                  <p className="text-xs text-[#5e5f5c] mt-1">Explore our latest drops to curate outfits.</p>
                </div>
                <button
                  onClick={closeCart}
                  className="bg-[#1a1a1a] hover:bg-[#000000] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3.5 p-3.5 rounded-lg border border-[#e5e2e1] bg-white hover:border-[#c4c7c7] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-md overflow-hidden bg-[#f1edec] border border-[#e5e2e1] shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-semibold text-[#1a1a1a] text-sm line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-[#747878] hover:text-[#ba1a1a] transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#5e5f5c] mt-1">
                        <span>Size: <strong className="text-[#1a1a1a]">{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Color:
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#c4c7c7] inline-block"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <strong className="text-[#1a1a1a]">{item.color.name}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-serif font-bold text-[#1a1a1a] text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#e5e2e1] rounded-md bg-[#f7f3f2]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="p-1 text-[#5e5f5c] hover:text-[#1a1a1a] hover:bg-[#e5e2e1] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#1a1a1a]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="p-1 text-[#5e5f5c] hover:text-[#1a1a1a] hover:bg-[#e5e2e1] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#e5e2e1] bg-white space-y-3">
              <div className="flex items-center justify-between text-[#5e5f5c] text-xs">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1a1a1a]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#5e5f5c] text-xs">
                <span>Shipping</span>
                <span className="font-semibold text-[#1a1a1a]">
                  {amountForFreeShipping === 0 ? 'Complimentary' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#1a1a1a] font-bold text-base pt-2 border-t border-[#e5e2e1]">
                <span className="font-serif">Estimated Total</span>
                <span className="font-serif">{formatPrice(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#1a1a1a] hover:bg-[#000000] text-white text-xs uppercase tracking-widest font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

