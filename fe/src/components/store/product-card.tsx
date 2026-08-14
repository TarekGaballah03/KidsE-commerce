'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../lib/use-cart-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const mainImage = product.images.find((img) => img.isMain)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600';
  const secondaryImage = product.images[1]?.url || mainImage;

  // Determine active variants & starting price
  const activeVariants = product.variants.filter((v) => v.isActive && v.stockQuantity > 0);
  const isOutOfStock = activeVariants.length === 0;

  const defaultVariant = activeVariants[0] || product.variants[0];
  const price = defaultVariant ? (defaultVariant.compareAtPrice && defaultVariant.compareAtPrice < defaultVariant.price ? defaultVariant.compareAtPrice : defaultVariant.price) : 0;
  const originalPrice = defaultVariant ? defaultVariant.price : 0;
  const hasDiscount = defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice < defaultVariant.price;
  const discountPercent = hasDiscount && originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Extract unique color hexes
  const uniqueColors = Array.from(new Set(product.variants.map((v) => JSON.stringify(v.color)))).map((str) => JSON.parse(str));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant || isOutOfStock) return;

    addItem({
      productId: product._id,
      variantId: defaultVariant._id,
      title: product.title,
      slug: product.slug,
      sku: defaultVariant.sku,
      size: defaultVariant.size,
      color: defaultVariant.color,
      price,
      image: defaultVariant.image || mainImage,
      maxStock: defaultVariant.stockQuantity,
    });
  };

  return (
    <div className="group relative bg-white rounded-3xl p-3 border border-pink-100/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Age Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
          Age {product.ageRange}Y
        </div>

        {/* Hover Quick View Button */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-x-3 bottom-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold py-2 rounded-xl text-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-500 hover:text-white flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> Quick View
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between px-1">
        <div>
          {/* Color Dots */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-1.5">
              {uniqueColors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {uniqueColors.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">+{uniqueColors.length - 4}</span>
              )}
            </div>
          )}

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-slate-800 text-sm hover:text-rose-500 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <div>
            <span className="text-sm font-extrabold text-slate-900">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through ml-1.5 font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white shadow-xs active:scale-95'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Quick Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
