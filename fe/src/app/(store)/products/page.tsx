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
    <div className="py-10 lg:py-16 max-w-7xl mx-auto px-6 sm:px-12 bg-[#fdf8f8]">
      {/* Header Breadcrumbs & Title */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase font-semibold tracking-[0.25em] text-[#5e5f5c] block mb-2">
          Swan Curated Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1a1a1a]">
          {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Outfits` : 'All Garments & Accessories'}
        </h1>
        <p className="text-[#5e5f5c] text-xs sm:text-sm mt-2">
          {total} curated items crafted for comfort and memorable moments.
        </p>
      </div>

      {/* Top Filter Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 bg-white p-4 rounded-lg border border-[#e5e2e1] shadow-xs">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 bg-[#f1edec] hover:bg-[#e5e2e1] text-[#1a1a1a] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4 text-[#1a1a1a]" />
          <span>Filter Selection</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs text-[#5e5f5c]">
          <span className="font-semibold uppercase tracking-wider text-[11px]">Active Filters:</span>
          {selectedCategory && (
            <span className="bg-[#f1edec] text-[#1a1a1a] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-[#e5e2e1]">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer hover:text-[#ba1a1a]" onClick={() => updateFilter('category', '')} />
            </span>
          )}
          {selectedAge && (
            <span className="bg-[#f1edec] text-[#1a1a1a] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-[#e5e2e1]">
              Age: {selectedAge}Y
              <X className="w-3 h-3 cursor-pointer hover:text-[#ba1a1a]" onClick={() => updateFilter('ageRange', '')} />
            </span>
          )}
          {(selectedCategory || selectedAge || searchKeyword) && (
            <button
              onClick={clearAllFilters}
              className="text-[#747878] hover:text-[#ba1a1a] text-xs underline flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" /> Reset all
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#5e5f5c] hidden sm:inline">Sort:</span>
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-xs font-semibold bg-[#f7f3f2] border border-[#e5e2e1] rounded-lg px-3 py-2 text-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a]"
          >
            <option value="newest">Newest Drops</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#1a1a1a]" /> Filters
            </h3>
            {(selectedCategory || selectedAge || inStockFilter) && (
              <button onClick={clearAllFilters} className="text-xs text-[#5e5f5c] hover:text-[#ba1a1a] font-medium underline">
                Reset
              </button>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c] mb-3">Categories</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  !selectedCategory ? 'bg-[#1a1a1a] text-white font-semibold' : 'text-[#1c1b1b] hover:bg-[#f1edec]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === cat.slug ? 'bg-[#1a1a1a] text-white font-semibold' : 'text-[#1c1b1b] hover:bg-[#f1edec]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c] mb-3">Shop by Age</h4>
            <div className="grid grid-cols-2 gap-2">
              {['0-2', '3-5', '6-8', '9-12'].map((age) => (
                <button
                  key={age}
                  onClick={() => updateFilter('ageRange', selectedAge === age ? '' : age)}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border transition-all ${
                    selectedAge === age
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                      : 'bg-[#f7f3f2] border-[#e5e2e1] text-[#1c1b1b] hover:border-[#c4c7c7]'
                  }`}
                >
                  {age}Y
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e2e1]">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#1c1b1b]">
              <input
                type="checkbox"
                checked={inStockFilter}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                className="rounded border-[#c4c7c7] text-[#1a1a1a] focus:ring-[#1a1a1a] w-4 h-4"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div
              onClick={() => setFilterDrawerOpen(false)}
              className="absolute inset-0 bg-[#1a1a1a]/50 backdrop-blur-xs"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-xs bg-[#fdf8f8] p-6 shadow-2xl space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-4">
                  <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Filters</h3>
                  <button onClick={() => setFilterDrawerOpen(false)} className="p-1 text-[#5e5f5c]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c] mb-3">Categories</h4>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => { updateFilter('category', ''); setFilterDrawerOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md ${!selectedCategory ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]'}`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => { updateFilter('category', cat.slug); setFilterDrawerOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md ${selectedCategory === cat.slug ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-full bg-[#1a1a1a] text-white text-xs uppercase tracking-widest py-3 rounded-lg font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog Grid */}
        <main className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#f1edec] rounded-lg aspect-4/5 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => updateFilter('page', (currentPage - 1).toString())}
                    className="p-2.5 rounded-lg bg-white border border-[#e5e2e1] disabled:opacity-40 hover:bg-[#f1edec] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#1a1a1a]" />
                  </button>
                  <span className="text-xs font-semibold text-[#1a1a1a] px-4">
                    Page {currentPage} of {pages}
                  </span>
                  <button
                    disabled={currentPage >= pages}
                    onClick={() => updateFilter('page', (currentPage + 1).toString())}
                    className="p-2.5 rounded-lg bg-white border border-[#e5e2e1] disabled:opacity-40 hover:bg-[#f1edec] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[#1a1a1a]" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-[#c4c7c7] p-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#f1edec] text-[#5e5f5c] flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">No items found</h3>
              <button
                onClick={clearAllFilters}
                className="bg-[#1a1a1a] hover:bg-[#000000] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Reset Filters
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
    <Suspense fallback={<div className="py-20 text-center text-xs text-[#5e5f5c]">Loading collection...</div>}>
      <ProductsListingContent />
    </Suspense>
  );
}

