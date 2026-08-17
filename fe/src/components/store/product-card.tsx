'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../lib/use-cart-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const mainImage =
    product.images.find((img) => img.isMain)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800';

  // Determine active variants & starting price
  const activeVariants = product.variants.filter((v) => v.isActive && v.stockQuantity > 0);
  const isOutOfStock = activeVariants.length === 0;

  const defaultVariant = activeVariants[0] || product.variants[0];
  const price = defaultVariant
    ? defaultVariant.compareAtPrice && defaultVariant.compareAtPrice < defaultVariant.price
      ? defaultVariant.compareAtPrice
      : defaultVariant.price
    : 0;
  const originalPrice = defaultVariant ? defaultVariant.price : 0;
  const hasDiscount = defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice < defaultVariant.price;

  // Unique colors
  const uniqueColors = Array.from(new Set(product.variants.map((v) => JSON.stringify(v.color)))).map((str) =>
    JSON.parse(str)
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant || isOutOfStock) return;

    addItem(
      {
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
      },
      { x: e.clientX, y: e.clientY }
    );
  };

  return (
    <div className="group relative flex flex-col h-full bg-transparent">
      {/* Image Container with 4:5 aspect ratio */}
      <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden bg-[#f1edec] mb-3 border border-[#e5e2e1]/60">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="bg-[#1a1a1a] text-white text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-sm shadow-xs">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#ba1a1a] text-white text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-sm shadow-xs">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#5e5f5c] text-white text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-sm shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add Button on Hover */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`absolute right-3 bottom-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isOutOfStock
              ? 'bg-[#e5e2e1] text-[#747878] cursor-not-allowed'
              : 'bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title={isOutOfStock ? 'Sold Out' : 'Quick Add'}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 text-center px-1">
        {/* Colors */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            {uniqueColors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-[#c4c7c7]"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {uniqueColors.length > 4 && (
              <span className="text-[10px] text-[#5e5f5c]">+{uniqueColors.length - 4}</span>
            )}
          </div>
        )}

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-sans text-sm font-medium text-[#1a1a1a] group-hover:opacity-75 transition-opacity line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="font-serif text-sm sm:text-base font-bold text-[#1a1a1a]">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="font-sans text-xs text-[#747878] line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

