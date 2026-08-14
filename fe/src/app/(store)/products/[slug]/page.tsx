'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '../../../../components/store/product-card';
import { Product, ProductVariant } from '../../../../types';
import { apiFetch } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useCartStore } from '../../../../lib/use-cart-store';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Ruler, Check, ChevronRight, Sparkles } from 'lucide-react';

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
  const { addItem } = useCartStore();

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
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-4">Loading outfit details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Outfit Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for may have been archived or moved.</p>
        <Link href="/products" className="inline-block bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Browse All Products
        </Link>
      </div>
    );
  }

  // Get available sizes & colors
  const availableColors = Array.from(
    new Map(product.variants.map((v) => [v.color.name, v.color])).values(),
  );

  const availableSizesForColor = product.variants
    .filter((v) => v.color.name === selectedColor)
    .map((v) => v.size);

  // Selected variant matched
  const matchedVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.color.name === selectedColor && v.size === selectedSize,
  ) || product.variants[0];

  const price = matchedVariant ? (matchedVariant.compareAtPrice && matchedVariant.compareAtPrice < matchedVariant.price ? matchedVariant.compareAtPrice : matchedVariant.price) : 0;
  const originalPrice = matchedVariant ? matchedVariant.price : 0;
  const hasDiscount = matchedVariant?.compareAtPrice && matchedVariant.compareAtPrice < matchedVariant.price;
  const inStock = matchedVariant ? matchedVariant.stockQuantity > 0 : false;
  const stockQuantity = matchedVariant ? matchedVariant.stockQuantity : 0;

  const handleAddToCart = () => {
    if (!matchedVariant || !inStock) return;

    addItem({
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
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
        <Link href="/" className="hover:text-rose-500">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <Link href="/products" className="hover:text-rose-500">Products</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/5 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'}
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
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.url ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200 opacity-70 hover:opacity-100'
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
          <div>
            <span className="inline-block bg-pink-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
              Age {product.ageRange} Years
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">SKU: {matchedVariant?.sku || 'N/A'}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-slate-100">
            <span className="text-3xl font-extrabold text-slate-900">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-base text-slate-400 line-through font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">VAT Included</span>
          </div>

          {/* Color Selector */}
          {availableColors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Color: <span className="text-rose-600 font-extrabold">{selectedColor}</span>
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
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === c.name ? 'border-rose-500 ring-4 ring-rose-100 scale-110' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector & Size Guide Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                Size: <span className="text-rose-600 font-extrabold">{selectedSize}</span>
              </label>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
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
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : isVariantInStock
                        ? 'bg-white border-slate-200 text-slate-800 hover:border-rose-400'
                        : 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Status Badge */}
          <div>
            {inStock ? (
              stockQuantity <= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ⚠️ Only {stockQuantity} left in stock - Order soon!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> In Stock & Ready to Ship
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Out of Stock in this variant
              </span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity controls */}
              <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={!inStock}
                onClick={handleAddToCart}
                className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Buy Now Direct COD Checkout */}
            <button
              disabled={!inStock}
              onClick={handleBuyNow}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md"
            >
              Buy Now — Cash on Delivery
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
            <div className="p-2 rounded-xl bg-slate-50">
              <Truck className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <span>Doorstep COD</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <RefreshCw className="w-4 h-4 text-sky-500 mx-auto mb-1" />
              <span>Easy Size Exchange</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span>100% Quality Check</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed">
            <h3 className="font-bold text-slate-800 text-sm">Description & Fit</h3>
            <p>{product.description}</p>
          </div>

        </div>

      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Ruler className="w-5 h-5 text-sky-500" /> Kids Size Guide
              </h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <table className="w-full text-xs text-left text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-2">Age Group</th>
                  <th className="p-2">Height (cm)</th>
                  <th className="p-2">Chest (cm)</th>
                  <th className="p-2">Waist (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="p-2 font-bold">0 – 3M</td><td className="p-2">55 - 61</td><td className="p-2">41</td><td className="p-2">42</td></tr>
                <tr><td className="p-2 font-bold">6 – 12M</td><td className="p-2">68 - 78</td><td className="p-2">45</td><td className="p-2">46</td></tr>
                <tr><td className="p-2 font-bold">2Y - 3Y</td><td className="p-2">86 - 98</td><td className="p-2">52</td><td className="p-2">50</td></tr>
                <tr><td className="p-2 font-bold">4Y - 5Y</td><td className="p-2">104 - 110</td><td className="p-2">56</td><td className="p-2">53</td></tr>
                <tr><td className="p-2 font-bold">6Y - 8Y</td><td className="p-2">116 - 128</td><td className="p-2">62</td><td className="p-2">57</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-slate-400">
              Tip: If your child is between sizes, we recommend ordering one size up for room to grow.
            </p>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200/80">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">
            You May Also Like ✨
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
