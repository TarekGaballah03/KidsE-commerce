'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { Category } from '../../../../types';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Category[]>('/categories?includeInactive=true');
      setCategories(data || []);
    } catch (err) {
      console.error('Failed loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600');
    setSortOrder(categories.length + 1);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setSortOrder(cat.sortOrder || 1);
    setDialogOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const payload = {
      name,
      slug,
      description,
      image,
      sortOrder: Number(sortOrder),
    };

    try {
      if (editingCategory) {
        await apiFetch(`/categories/${editingCategory._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setDialogOpen(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Taxonomy Structure</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Curated Categories</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Organize store collections (Girls, Boys, Knitwear, Heirlooms, Footwear).</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left text-[#1c1b1b]">
          <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Slug Identifier</th>
              <th className="p-4">Sort Sequence</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2e1]">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#5e5f5c]">Loading categories...</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-[#fdf8f8] transition-colors">
                  <td className="p-4 font-semibold text-[#1a1a1a] flex items-center gap-3.5">
                    <img src={cat.image || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200'} alt={cat.name} className="w-10 h-10 rounded-md object-cover border border-[#e5e2e1]" />
                    <span className="font-serif text-sm">{cat.name}</span>
                  </td>
                  <td className="p-4 font-mono text-[#5e5f5c]">{cat.slug}</td>
                  <td className="p-4 font-semibold text-[#1a1a1a]">{cat.sortOrder}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(cat)} className="p-2 rounded-md bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 rounded-md bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 border border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heirlooms & Sets"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Slug</label>
                <input
                  type="text"
                  placeholder="heirlooms"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Display Sort Sequence</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e2e1]">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

