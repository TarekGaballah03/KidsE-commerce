'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { Product, Category } from '../../../../types';
import { Plus, Search, Edit3, Trash2, Check, X, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<'0-2' | '3-5' | '6-8' | '9+'>('3-5');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  // Variant List State
  const [variants, setVariants] = useState<Array<{
    sku: string;
    size: string;
    colorName: string;
    colorHex: string;
    price: number;
    compareAtPrice: number | null;
    stockQuantity: number;
  }>>([
    { sku: 'HOOD-BLU-3Y', size: '3Y', colorName: 'Sky Blue', colorHex: '#38bdf8', price: 450, compareAtPrice: 550, stockQuantity: 20 },
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch(`/products/admin/list?search=${encodeURIComponent(search)}`),
        apiFetch<Category[]>('/categories'),
      ]);
      setProducts(prodRes.items || prodRes.data || prodRes || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Failed loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setSelectedCategoryIds(categories[0] ? [categories[0]._id] : []);
    setAgeRange('3-5');
    setImageUrl('https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800');
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsPublished(true);
    setVariants([
      { sku: 'PROD-SKU-1', size: '3Y', colorName: 'Sky Blue', colorHex: '#38bdf8', price: 450, compareAtPrice: 550, stockQuantity: 25 },
    ]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setDescription(p.description);
    setSelectedCategoryIds(p.categories ? p.categories.map((c) => typeof c === 'object' ? c._id : c) : []);
    setAgeRange(p.ageRange);
    setImageUrl(p.images[0]?.url || '');
    setIsFeatured(p.isFeatured);
    setIsNewArrival(p.isNewArrival);
    setIsPublished(p.isPublished);
    setVariants(
      p.variants.map((v) => ({
        sku: v.sku,
        size: v.size,
        colorName: v.color.name,
        colorHex: v.color.hex,
        price: v.price,
        compareAtPrice: v.compareAtPrice || null,
        stockQuantity: v.stockQuantity,
      })),
    );
    setDialogOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || variants.length === 0) {
      alert('Product must have a title and at least one variant');
      return;
    }

    const payload = {
      title,
      slug,
      description,
      categories: selectedCategoryIds,
      ageRange,
      images: imageUrl ? [{ url: imageUrl, alt: title, isMain: true }] : [],
      isFeatured,
      isNewArrival,
      isPublished,
      variants: variants.map((v) => ({
        sku: v.sku.toUpperCase(),
        size: v.size,
        color: { name: v.colorName, hex: v.colorHex },
        price: Number(v.price),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
        stockQuantity: Number(v.stockQuantity),
        isActive: true,
      })),
    };

    try {
      if (editingProduct) {
        await apiFetch(`/products/${editingProduct._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to archive product');
    }
  };

  const addVariantRow = () => {
    setVariants([
      ...variants,
      { sku: `SKU-${Date.now().toString().slice(-4)}`, size: '4Y', colorName: 'Soft Pink', colorHex: '#f472b6', price: 450, compareAtPrice: null, stockQuantity: 10 },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products & Variants Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage products, pricing overrides, sizes, colors & stock SKUs.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by title, SKU, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Age</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No products found.</td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalStock = prod.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                  const minPrice = Math.min(...prod.variants.map((v) => v.price));

                  return (
                    <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200'}
                            alt={prod.title}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{prod.title}</span>
                            <span className="text-[11px] text-rose-600 font-extrabold">{formatPrice(minPrice)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold">{prod.ageRange}Y</td>

                      <td className="p-4">
                        <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          {prod.variants.length} variant(s)
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${totalStock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {totalStock} in stock
                        </span>
                      </td>

                      <td className="p-4">
                        {prod.isPublished ? (
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">Published</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded-full">Draft</span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleArchive(prod._id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Archive Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingProduct ? 'Edit Product & Variants' : 'Create New Product'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Product Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Floral Twirl Dress"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    placeholder="floral-twirl-dress"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age Range *</label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="0-2">0 – 2 Years</option>
                    <option value="3-5">3 – 5 Years</option>
                    <option value="6-8">6 – 8 Years</option>
                    <option value="9+">9+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed product fabric, care instructions, fit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-rose-500 w-4 h-4"
                  />
                  <span>Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-rose-500 w-4 h-4"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-rose-500 w-4 h-4"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Variant Manager Table */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Variant SKUs & Inventory ({variants.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Variant Row
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].sku = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <select
                          value={v.size}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].size = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-full px-1.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="6M">6M</option>
                          <option value="12M">12M</option>
                          <option value="2Y">2Y</option>
                          <option value="3Y">3Y</option>
                          <option value="4Y">4Y</option>
                          <option value="6Y">6Y</option>
                          <option value="8Y">8Y</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Color Name"
                          value={v.colorName}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].colorName = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-full px-2 py-1 text-[11px] rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Price"
                          value={v.price}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].price = Number(e.target.value);
                            setVariants(copy);
                          }}
                          className="w-full px-2 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Stock"
                          value={v.stockQuantity}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].stockQuantity = Number(e.target.value);
                            setVariants(copy);
                          }}
                          className="w-full px-2 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      <div className="col-span-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeVariantRow(i)}
                          className="text-rose-500 p-1 hover:bg-rose-100 rounded-md"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
