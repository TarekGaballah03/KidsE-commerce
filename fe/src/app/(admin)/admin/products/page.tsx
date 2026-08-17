'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { Product, Category } from '../../../../types';
import { Plus, Search, Edit3, Trash2 } from 'lucide-react';

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
    if (!confirm('Are you sure you want to archive this garment?')) return;
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
      { sku: `SKU-${Date.now().toString().slice(-4)}`, size: '4Y', colorName: 'Sage Green', colorHex: '#8fa89b', price: 450, compareAtPrice: null, stockQuantity: 10 },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Catalogue Management</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Garments & Outfits</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Manage products, variants, SKU inventory, and price tags.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Garment
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#e5e2e1] shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search catalogue by title, SKU, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
          />
          <Search className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3" />
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#1c1b1b]">
            <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
              <tr>
                <th className="p-4">Garment</th>
                <th className="p-4">Age Bracket</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2e1]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5e5f5c]">Loading collection...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5e5f5c]">No garments found in database.</td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalStock = prod.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                  const minPrice = Math.min(...prod.variants.map((v) => v.price));

                  return (
                    <tr key={prod._id} className="hover:bg-[#fdf8f8] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200'}
                            alt={prod.title}
                            className="w-11 h-14 rounded-md object-cover border border-[#e5e2e1]"
                          />
                          <div>
                            <span className="font-serif font-semibold text-sm text-[#1a1a1a] block">{prod.title}</span>
                            <span className="font-serif font-bold text-xs text-[#5e5f5c]">{formatPrice(minPrice)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-[#1a1a1a]">{prod.ageRange}Y</td>

                      <td className="p-4">
                        <span className="bg-[#f1edec] font-semibold px-2.5 py-1 rounded-md text-[11px] text-[#1a1a1a] border border-[#e5e2e1]">
                          {prod.variants.length} SKU(s)
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`font-semibold px-2.5 py-1 rounded-full text-[11px] border ${totalStock <= 5 ? 'bg-[#ffdad6]/40 text-[#ba1a1a] border-[#ba1a1a]/30' : 'bg-[#f1edec] text-[#1a1a1a] border-[#e5e2e1]'}`}>
                          {totalStock} in stock
                        </span>
                      </td>

                      <td className="p-4">
                        {prod.isPublished ? (
                          <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#e5e2e1]">Live</span>
                        ) : (
                          <span className="bg-[#ebe7e6] text-[#5e5f5c] font-semibold px-2.5 py-1 rounded-full text-[11px]">Draft</span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 rounded-md bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] transition-colors"
                          title="Edit Garment"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleArchive(prod._id)}
                          className="p-2 rounded-md bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors"
                          title="Archive"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-[#e5e2e1]">
            <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-4">
              <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">
                {editingProduct ? 'Edit Garment & Variants' : 'Add New Garment to Collection'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="text-[#5e5f5c] hover:text-[#1a1a1a] p-1">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Product Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linen Heirloom Romper"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Slug Identifier</label>
                  <input
                    type="text"
                    placeholder="linen-heirloom-romper"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Age Range Bracket *</label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                  >
                    <option value="0-2">0 – 2 Years</option>
                    <option value="3-5">3 – 5 Years</option>
                    <option value="6-8">6 – 8 Years</option>
                    <option value="9+">9+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Primary Photography URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Description & Fit</label>
                <textarea
                  rows={2}
                  placeholder="Fabric narrative, care instructions, silhouette..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-[#1a1a1a] w-4 h-4"
                  />
                  <span>Published on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#1a1a1a] w-4 h-4"
                  />
                  <span>Featured in Curated Row</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-[#1a1a1a] w-4 h-4"
                  />
                  <span>New Drop Badge</span>
                </label>
              </div>

              {/* Variant Manager Table */}
              <div className="space-y-3 pt-4 border-t border-[#e5e2e1]">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-[#1a1a1a] text-sm">
                    Variant SKUs & Inventory Stock ({variants.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="text-xs font-semibold text-[#1a1a1a] underline flex items-center gap-1 hover:opacity-75"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add SKU Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#f7f3f2] p-3 rounded-md border border-[#e5e2e1]">
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].sku = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-full px-2.5 py-1.5 text-[11px] font-mono rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
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
                          className="w-full px-2 py-1.5 text-[11px] font-semibold rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
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
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={v.price}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[i].price = Number(e.target.value);
                            setVariants(copy);
                          }}
                          className="w-full px-2.5 py-1.5 text-[11px] font-semibold rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
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
                          className="w-full px-2.5 py-1.5 text-[11px] font-semibold rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
                        />
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeVariantRow(i)}
                          className="text-[#ba1a1a] p-1 hover:bg-[#ffdad6] rounded-md"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e2e1]">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

