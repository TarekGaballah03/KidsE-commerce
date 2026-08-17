'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '../../../../components/store/product-card';
import { Product, ProductVariant } from '../../../../types';
import { apiFetch } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useCartStore } from '../../../../lib/use-cart-store';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Ruler, Check, ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await apiFetch<Product>(`/products/slug/${slug}`);
        setProduct(prod);

        if (prod.images && prod.images.length > 0) {
          const main = prod.images.find((i) => i.isMain) || prod.images[0];
          setSelectedImage(main.url);
        }

        // Set default variant selections
        if (prod.variants && prod.variants.length > 0) {
          const first = prod.variants[0];
          setSelectedColor(first.color.name);
          setSelectedSize(first.size);
        }

        // Fetch related products
        if (prod.categories && prod.categories.length > 0) {
          const categoryId = typeof prod.categories[0] === 'object' ? prod.categories[0]._id : prod.categories[0];
          const related = await apiFetch(`/products?category=${categoryId}&limit=4`);
          const items = related.items || related.data || related || [];
          setRelatedProducts(items.filter((p: Product) => p._id !== prod._id));
        }
      } catch (err) {
        console.error('Failed loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center">
        <div className="w-10 h-10 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5e5f5c] mt-4 uppercase tracking-widest">Loading outfit details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">Garment Not Found</h2>
        <p className="text-xs text-[#5e5f5c]">The requested item may have been archived or is temporarily unavailable.</p>
        <Link href="/products" className="inline-block bg-[#1a1a1a] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg">
          Browse All Collections
        </Link>
      </div>
    );
  }

  // Get available sizes & colors
  const availableColors = Array.from(
    new Map(product.variants.map((v) => [v.color.name, v.color])).values(),
  );

  // Selected variant matched
  const matchedVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.color.name === selectedColor && v.size === selectedSize,
  ) || product.variants[0];

  const price = matchedVariant ? (matchedVariant.compareAtPrice && matchedVariant.compareAtPrice < matchedVariant.price ? matchedVariant.compareAtPrice : matchedVariant.price) : 0;
  const originalPrice = matchedVariant ? matchedVariant.price : 0;
  const hasDiscount = matchedVariant?.compareAtPrice && matchedVariant.compareAtPrice < matchedVariant.price;
  const inStock = matchedVariant ? matchedVariant.stockQuantity > 0 : false;
  const stockQuantity = matchedVariant ? matchedVariant.stockQuantity : 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (!matchedVariant || !inStock) return;

    addItem(
      {
        productId: product._id,
        variantId: matchedVariant._id,
        title: product.title,
        slug: product.slug,
        sku: matchedVariant.sku,
        size: matchedVariant.size,
        color: matchedVariant.color,
        price,
        image: matchedVariant.image || selectedImage,
        quantity,
        maxStock: matchedVariant.stockQuantity,
      },
      e ? { x: e.clientX, y: e.clientY } : undefined
    );
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    handleAddToCart(e);
    router.push('/checkout');
  };

  return (
    <div className="py-10 lg:py-16 max-w-7xl mx-auto px-6 sm:px-12 bg-[#fdf8f8]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#5e5f5c] font-medium mb-8">
        <Link href="/" className="hover:text-[#1a1a1a]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#c4c7c7]" />
        <Link href="/products" className="hover:text-[#1a1a1a]">Collection</Link>
        <ChevronRight className="w-3 h-3 text-[#c4c7c7]" />
        <span className="text-[#1a1a1a] font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/5 rounded-lg overflow-hidden bg-[#f1edec] border border-[#e5e2e1]/80 shadow-xs">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Selector */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-24 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.url ? 'border-[#1a1a1a]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Variant Selector Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c]">
              Age {product.ageRange} Years
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a] leading-snug">
              {product.title}
            </h1>
            <p className="text-xs text-[#747878] font-mono">SKU: {matchedVariant?.sku || 'N/A'}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#e5e2e1]">
            <span className="font-serif text-3xl font-bold text-[#1a1a1a]">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="font-sans text-sm text-[#747878] line-through font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-[11px] text-[#5e5f5c] uppercase tracking-wider">Taxes included</span>
          </div>

          {/* Color Selector */}
          {availableColors.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider mb-2.5">
                Color: <span className="text-[#5e5f5c] font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      const matchingSizes = product.variants.filter((v) => v.color.name === c.name);
                      if (matchingSizes.length > 0 && !matchingSizes.some((v) => v.size === selectedSize)) {
                        setSelectedSize(matchingSizes[0].size);
                      }
                    }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name ? 'border-[#1a1a1a] ring-2 ring-[#1a1a1a]/30 scale-110' : 'border-[#c4c7c7]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector & Size Guide */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider">
                Size: <span className="text-[#5e5f5c] font-normal">{selectedSize}</span>
              </label>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-medium text-[#1a1a1a] underline flex items-center gap-1 hover:opacity-75"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {['0-3M', '3-6M', '6-12M', '12-18M', '2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y', 'S', 'M', 'L'].map((sz) => {
                const variantForSize = product.variants.find(
                  (v) => v.color.name === selectedColor && v.size === sz,
                );
                if (!variantForSize) return null;

                const isSelected = selectedSize === sz;
                const isVariantInStock = variantForSize.stockQuantity > 0;

                return (
                  <button
                    key={sz}
                    disabled={!isVariantInStock}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-md border transition-all ${
                      isSelected
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : isVariantInStock
                        ? 'bg-white border-[#e5e2e1] text-[#1a1a1a] hover:border-[#1a1a1a]'
                        : 'bg-[#f7f3f2] border-[#e5e2e1] text-[#c4c7c7] line-through cursor-not-allowed'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {inStock ? (
              stockQuantity <= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#ba1a1a] bg-[#ffdad6]/40 px-3 py-1 rounded-sm">
                  Limited Availability — Only {stockQuantity} remaining
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a1a1a] bg-[#f1edec] px-3 py-1 rounded-sm">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready for Dispatch
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#747878] bg-[#f1edec] px-3 py-1 rounded-sm">
                Sold Out in this selection
              </span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#e5e2e1] rounded-md bg-[#f7f3f2] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-[#1a1a1a] hover:bg-[#e5e2e1] rounded-xs font-medium"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-[#1a1a1a]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                  className="px-3 py-1 text-[#1a1a1a] hover:bg-[#e5e2e1] rounded-xs font-medium"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={!inStock}
                onClick={handleAddToCart}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#000000] disabled:bg-[#e5e2e1] disabled:text-[#747878] text-white text-xs uppercase tracking-widest font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Buy Now Direct COD Button */}
            <button
              disabled={!inStock}
              onClick={handleBuyNow}
              className="w-full bg-white hover:bg-[#f1edec] disabled:bg-[#f7f3f2] text-[#1a1a1a] border border-[#1a1a1a] text-xs uppercase tracking-widest font-semibold py-4 rounded-lg transition-all"
            >
              Order with Cash on Delivery
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#e5e2e1] text-center text-[11px] text-[#5e5f5c]">
            <div className="p-3 rounded-md bg-[#f7f3f2]">
              <Truck className="w-4 h-4 text-[#1a1a1a] mx-auto mb-1" />
              <span>Doorstep COD</span>
            </div>
            <div className="p-3 rounded-md bg-[#f7f3f2]">
              <RefreshCw className="w-4 h-4 text-[#1a1a1a] mx-auto mb-1" />
              <span>Easy Exchanges</span>
            </div>
            <div className="p-3 rounded-md bg-[#f7f3f2]">
              <ShieldCheck className="w-4 h-4 text-[#1a1a1a] mx-auto mb-1" />
              <span>Organic Fabric</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-[#e5e2e1] space-y-2 text-xs text-[#444748] leading-relaxed">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-sm">Description & Silhouette</h3>
            <p>{product.description}</p>
          </div>
        </div>

      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/50 backdrop-blur-xs">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 border border-[#e5e2e1]">
            <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-3">
              <h3 className="font-serif font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#1a1a1a]" /> Garment Measurement Guide
              </h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-[#5e5f5c] hover:text-[#1a1a1a] p-1">
                ✕
              </button>
            </div>

            <table className="w-full text-xs text-left text-[#444748] border-collapse">
              <thead>
                <tr className="bg-[#f1edec] text-[#1a1a1a] font-semibold border-b border-[#e5e2e1]">
                  <th className="p-2.5">Age Range</th>
                  <th className="p-2.5">Height (cm)</th>
                  <th className="p-2.5">Chest (cm)</th>
                  <th className="p-2.5">Waist (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                <tr><td className="p-2.5 font-semibold text-[#1a1a1a]">0 – 3M</td><td className="p-2.5">55 - 61</td><td className="p-2.5">41</td><td className="p-2.5">42</td></tr>
                <tr><td className="p-2.5 font-semibold text-[#1a1a1a]">6 – 12M</td><td className="p-2.5">68 - 78</td><td className="p-2.5">45</td><td className="p-2.5">46</td></tr>
                <tr><td className="p-2.5 font-semibold text-[#1a1a1a]">2Y - 3Y</td><td className="p-2.5">86 - 98</td><td className="p-2.5">52</td><td className="p-2.5">50</td></tr>
                <tr><td className="p-2.5 font-semibold text-[#1a1a1a]">4Y - 5Y</td><td className="p-2.5">104 - 110</td><td className="p-2.5">56</td><td className="p-2.5">53</td></tr>
                <tr><td className="p-2.5 font-semibold text-[#1a1a1a]">6Y - 8Y</td><td className="p-2.5">116 - 128</td><td className="p-2.5">62</td><td className="p-2.5">57</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-[#5e5f5c]">
              Note: Designed with comfortable ease. If in-between sizes, choosing the larger size gives growing room.
            </p>
          </div>
        </div>
      )}

      {/* Related Outfits */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-16 border-t border-[#e5e2e1]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-8 tracking-tight">
            Complete the Look
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

