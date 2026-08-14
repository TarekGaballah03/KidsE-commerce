'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Search, Warehouse, AlertTriangle, Edit, History } from 'lucide-react';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stock' | 'logs'>('stock');
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Adjustment Modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [newStock, setNewStock] = useState(0);
  const [reason, setReason] = useState<'New Stock' | 'Manual Correction' | 'Returned Order' | 'Damaged Product' | 'Order Adjustment'>('Manual Correction');
  const [adjusting, setAdjusting] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stock') {
        const res = await apiFetch(`/inventory?search=${encodeURIComponent(search)}&lowStock=${lowStockOnly ? 'true' : ''}`);
        setItems(res.items || res.data || res || []);
      } else {
        const res = await apiFetch('/inventory/logs');
        setLogs(res.items || res.data || res || []);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [search, lowStockOnly, activeTab]);

  const handleOpenAdjust = (item: any) => {
    setSelectedItem(item);
    setNewStock(item.stockQuantity);
    setReason('Manual Correction');
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || newStock < 0) return;

    setAdjusting(true);
    try {
      await apiFetch('/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          productId: selectedItem.productId,
          variantId: selectedItem.variantId,
          newStock: Number(newStock),
          reason,
        }),
      });
      setSelectedItem(null);
      loadInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dedicated Inventory Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">Variant-level stock quantities, low stock alerts & adjustment audit logs.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'stock' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Variant Stock
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'logs' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <>
          {/* Search & Low Stock Toggle Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search inventory by Product title or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 shrink-0">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-300 w-4 h-4"
              />
              <span>⚠️ Show Low Stock Only (≤ 5 units)</span>
            </label>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Product Title</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">Loading variant inventory...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">No inventory items found.</td>
                  </tr>
                ) : (
                  items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{row.productTitle}</td>
                      <td className="p-4 font-mono font-bold text-rose-600">{row.sku}</td>
                      <td className="p-4 font-bold">{row.size}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: row.color?.hex }} />
                          {row.color?.name}
                        </span>
                      </td>
                      <td className="p-4 font-bold">{formatPrice(row.price)}</td>
                      <td className="p-4">
                        <span className={`font-extrabold px-2.5 py-1 rounded-full text-xs ${row.stockQuantity <= 5 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-50 text-emerald-800'}`}>
                          {row.stockQuantity} units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(row)}
                          className="bg-slate-900 hover:bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Audit Logs Table */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Prev Stock</th>
                <th className="p-4">New Stock</th>
                <th className="p-4">Diff</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading adjustment logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No stock adjustment logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td className="p-4 text-slate-500">{formatDate(log.createdAt)}</td>
                    <td className="p-4 font-mono font-bold text-rose-600">{log.sku}</td>
                    <td className="p-4">{log.previousStock}</td>
                    <td className="p-4 font-bold">{log.newStock}</td>
                    <td className="p-4">
                      <span className={`font-bold ${log.difference >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {log.difference > 0 ? `+${log.difference}` : log.difference}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                        {log.reason}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{log.performedByName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Adjust Variant Stock</h3>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedItem.productTitle}</p>
              <p className="text-slate-500">SKU: <strong className="text-rose-600">{selectedItem.sku}</strong> • Size: {selectedItem.size} • Color: {selectedItem.color?.name}</p>
              <p className="text-slate-500">Current Stock: <strong className="text-slate-900">{selectedItem.stockQuantity} units</strong></p>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs font-extrabold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adjustment Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                >
                  <option value="New Stock">New Stock Received</option>
                  <option value="Manual Correction">Manual Inventory Correction</option>
                  <option value="Returned Order">Returned Order Restock</option>
                  <option value="Damaged Product">Damaged Product Write-off</option>
                  <option value="Order Adjustment">Order Adjustment</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md"
                >
                  {adjusting ? 'Saving...' : 'Confirm Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
