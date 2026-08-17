'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Search, Edit } from 'lucide-react';

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Warehouse Stock</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Stock Levels & Inventory</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Real-time SKU quantities, replenish threshold alerts, and ledger history.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-white p-1 rounded-lg border border-[#e5e2e1] shadow-xs">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'stock' ? 'bg-[#1a1a1a] text-white shadow-xs' : 'text-[#5e5f5c] hover:text-[#1a1a1a]'
            }`}
          >
            Variant Stock
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'logs' ? 'bg-[#1a1a1a] text-white shadow-xs' : 'text-[#5e5f5c] hover:text-[#1a1a1a]'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <>
          {/* Search & Low Stock Toggle Bar */}
          <div className="bg-white p-4 rounded-lg border border-[#e5e2e1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search inventory by Garment title or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
              />
              <Search className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1a1a] shrink-0">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="rounded border-[#c4c7c7] text-[#1a1a1a] focus:ring-[#1a1a1a] w-4 h-4"
              />
              <span>Low Stock Alerts (≤ 5 units)</span>
            </label>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left text-[#1c1b1b]">
              <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
                <tr>
                  <th className="p-4">Garment</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Stock on Hand</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">Loading variant stock...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">No inventory records found.</td>
                  </tr>
                ) : (
                  items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#fdf8f8] transition-colors">
                      <td className="p-4 font-serif font-semibold text-[#1a1a1a]">{row.productTitle}</td>
                      <td className="p-4 font-mono font-semibold text-[#1a1a1a]">{row.sku}</td>
                      <td className="p-4 font-semibold text-[#1a1a1a]">{row.size}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-3 h-3 rounded-full border border-[#c4c7c7]" style={{ backgroundColor: row.color?.hex }} />
                          {row.color?.name}
                        </span>
                      </td>
                      <td className="p-4 font-serif font-bold text-[#1a1a1a]">{formatPrice(row.price)}</td>
                      <td className="p-4">
                        <span className={`font-semibold px-2.5 py-1 rounded-full text-xs border ${row.stockQuantity <= 5 ? 'bg-[#ffdad6]/40 text-[#ba1a1a] border-[#ba1a1a]/30' : 'bg-[#f1edec] text-[#1a1a1a] border-[#e5e2e1]'}`}>
                          {row.stockQuantity} units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(row)}
                          className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5"
                        >
                          <Edit className="w-3 h-3" /> Adjust
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
        <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left text-[#1c1b1b]">
            <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Prior</th>
                <th className="p-4">New</th>
                <th className="p-4">Variance</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2e1]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">No stock changes recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td className="p-4 text-[#5e5f5c]">{formatDate(log.createdAt)}</td>
                    <td className="p-4 font-mono font-semibold text-[#1a1a1a]">{log.sku}</td>
                    <td className="p-4">{log.previousStock}</td>
                    <td className="p-4 font-semibold text-[#1a1a1a]">{log.newStock}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${log.difference >= 0 ? 'text-[#1a1a1a]' : 'text-[#ba1a1a]'}`}>
                        {log.difference > 0 ? `+${log.difference}` : log.difference}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2 py-0.5 rounded-md text-[11px] border border-[#e5e2e1]">
                        {log.reason}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#1a1a1a]">{log.performedByName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 border border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">Adjust Stock Count</h3>

            <div className="p-3.5 bg-[#f7f3f2] rounded-md border border-[#e5e2e1] text-xs space-y-1">
              <p className="font-serif font-bold text-[#1a1a1a]">{selectedItem.productTitle}</p>
              <p className="text-[#5e5f5c]">SKU: <strong className="text-[#1a1a1a]">{selectedItem.sku}</strong> • Size: {selectedItem.size} • Color: {selectedItem.color?.name}</p>
              <p className="text-[#5e5f5c]">Current Balance: <strong className="text-[#1a1a1a]">{selectedItem.stockQuantity} units</strong></p>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">New Stock Count *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Adjustment Rationale *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                >
                  <option value="New Stock">New Stock Received</option>
                  <option value="Manual Correction">Manual Physical Inventory Correction</option>
                  <option value="Returned Order">Returned Order Restock</option>
                  <option value="Damaged Product">Damaged Garment Write-off</option>
                  <option value="Order Adjustment">Order Adjustment</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e2e1]">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs"
                >
                  {adjusting ? 'Saving...' : 'Confirm Count'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

