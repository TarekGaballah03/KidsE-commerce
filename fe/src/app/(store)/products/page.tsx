'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '../../../components/store/product-card';
import { Product, Category } from '../../../types';
import { apiFetch } from '../../../lib/api';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';

function ProductsListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const selectedAge = searchParams.get('ageRange') || '';
  const searchKeyword = searchParams.get('search') || '';
  const isNewArrivalFilter = searchParams.get('isNewArrival') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;
  const inStockFilter = searchParams.get('inStock') === 'true';

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await apiFetch<Category[]>('/categories');
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedAge) params.set('ageRange', selectedAge);
        if (searchKeyword) params.set('search', searchKeyword);
        if (isNewArrivalFilter) params.set('isNewArrival', isNewArrivalFilter);
        if (inStockFilter) params.set('inStock', 'true');
        if (selectedSort) params.set('sort', selectedSort);
        params.set('page', currentPage.toString());
        params.set('limit', '12');

        const res = await apiFetch(`/products?${params.toString()}`);
        setProducts(res.items || res.data || res || []);
        setTotal(res.pagination?.total || (res.items || res).length);
        setPages(res.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed loading products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, selectedAge, searchKeyword, isNewArrivalFilter, inStockFilter, selectedSort, currentPage]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  return (
    <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Breadcrumbs & Title */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {selectedCategory ? `${selectedCategory.toUpperCase()} Outfits` : 'All Kids Collection'}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Showing {total} adorable items ready for fast Cash on Delivery shipping across Egypt.
        </p>
      </div>

      {/* Top Filter Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Filter className="w-4 h-4 text-rose-500" />
          <span>Filters & Categories</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Active Filters:</span>
          {selectedCategory && (
            <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
            </span>
          )}
          {selectedAge && (
            <span className="bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              Age: {selectedAge}Y
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('ageRange', '')} />
            </span>
          )}
          {(selectedCategory || selectedAge || searchKeyword) && (
            <button
              onClick={clearAllFilters}
              className="text-slate-400 hover:text-rose-500 text-xs underline flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort by:</span>
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-300"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-rose-500" /> Filter Outfits
            </h3>
            {(selectedCategory || selectedAge || inStockFilter) && (
              <button onClick={clearAllFilters} className="text-xs text-rose-500 font-bold hover:underline">
                Reset
              </button>
            )}
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
            <div className="space-y-1.5 text-xs font-medium">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                  !selectedCategory ? 'bg-rose-500 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                    selectedCategory === cat.slug ? 'bg-rose-500 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Shop by Age</h4>
            <div className="grid grid-cols-2 gap-2">
              {['0-2', '3-5', '6-8', '9+'].map((age) => (
                <button
                  key={age}
                  onClick={() => updateFilter('ageRange', selectedAge === age ? '' : age)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    selectedAge === age
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-300'
                  }`}
                >
                  {age} Years
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={inStockFilter}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-300 w-4 h-4"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        <main className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-200/60 rounded-3xl h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => updateFilter('page', (currentPage - 1).toString())}
                    className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold text-slate-700 px-4">
                    Page {currentPage} of {pages}
                  </span>
                  <button
                    disabled={currentPage >= pages}
                    onClick={() => updateFilter('page', (currentPage + 1).toString())}
                    className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">No outfits match your filters</h3>
              <button
                onClick={clearAllFilters}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsListingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading outfits...</div>}>
      <ProductsListingContent />
    </Suspense>
  );
}
