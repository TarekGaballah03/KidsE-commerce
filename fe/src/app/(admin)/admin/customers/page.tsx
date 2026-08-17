'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { Search, Edit } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [notes, setNotes] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/customers/admin/list?search=${encodeURIComponent(search)}`);
      setCustomers(res.items || res.data || res || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      await apiFetch(`/customers/${editingCustomer._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
      setEditingCustomer(null);
      loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Failed to update customer notes');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Client Directory</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Clientele & Concierge Ledger</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">View customer lifetime spend, dispatch counts, delivery preferences, and notes.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-[#e5e2e1] shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search clientele by full name, phone number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
          />
          <Search className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left text-[#1c1b1b]">
          <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
            <tr>
              <th className="p-4">Client Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Lifetime Spend</th>
              <th className="p-4">Concierge Notes</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2e1]">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">Loading clientele records...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">No client records found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="hover:bg-[#fdf8f8] transition-colors">
                  <td className="p-4 font-semibold text-[#1a1a1a]">{c.name}</td>
                  <td className="p-4 text-[#5e5f5c] font-mono">{c.phone}</td>
                  <td className="p-4 text-[#5e5f5c]">{c.email || '—'}</td>
                  <td className="p-4 font-semibold text-[#1a1a1a]">{c.totalOrders || 0}</td>
                  <td className="p-4 font-serif font-bold text-[#1a1a1a]">{formatPrice(c.totalSpent || 0)}</td>
                  <td className="p-4 text-[#5e5f5c] truncate max-w-xs">{c.notes || '—'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setEditingCustomer(c);
                        setNotes(c.notes || '');
                      }}
                      className="p-2 rounded-md bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] transition-colors"
                      title="Edit Notes"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 border border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">Concierge Notes: {editingCustomer.name}</h3>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Client Profile Notes</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery timing preferences, sizing notes, VIP considerations..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e2e1]">
                <button type="button" onClick={() => setEditingCustomer(null)} className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs">Save Notes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

