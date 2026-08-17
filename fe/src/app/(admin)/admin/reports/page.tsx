'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { Download, BarChart3, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export default function AdminReportsPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const data = await apiFetch('/reports/sales-chart');
        setSalesData(data || []);
      } catch (err) {
        console.error('Failed loading reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const downloadReport = (type: string) => {
    window.open(`http://localhost:4000/api/v1/reports/export?type=${type}`, '_blank');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Financial & Operational Exports</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Business Intelligence & Reports</h1>
        <p className="text-xs text-[#5e5f5c] mt-0.5">Export operational datasets to CSV/Excel for accounting, stock balancing, and tax audits.</p>
      </div>

      {/* CSV Downloads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => downloadReport('orders')}
          className="p-5 bg-white rounded-lg border border-[#e5e2e1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1a1a1a] text-sm group-hover:text-[#5e5f5c] transition-colors">Dispatches & Orders</h3>
            <p className="text-[11px] text-[#5e5f5c] mt-0.5">Complete client purchase ledger and fulfillment history</p>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </span>
        </button>

        <button
          onClick={() => downloadReport('sales')}
          className="p-5 bg-white rounded-lg border border-[#e5e2e1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1a1a1a] text-sm group-hover:text-[#5e5f5c] transition-colors">Revenue & Settled COD</h3>
            <p className="text-[11px] text-[#5e5f5c] mt-0.5">Delivered cash collections and gross margins</p>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </span>
        </button>

        <button
          onClick={() => downloadReport('inventory')}
          className="p-5 bg-white rounded-lg border border-[#e5e2e1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1a1a1a] text-sm group-hover:text-[#5e5f5c] transition-colors">Warehouse Valuation</h3>
            <p className="text-[11px] text-[#5e5f5c] mt-0.5">SKU quantities, cost prices & stock valuation</p>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </span>
        </button>

        <button
          onClick={() => downloadReport('customers')}
          className="p-5 bg-white rounded-lg border border-[#e5e2e1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1a1a1a] text-sm group-hover:text-[#5e5f5c] transition-colors">Clientele Matrix</h3>
            <p className="text-[11px] text-[#5e5f5c] mt-0.5">Customer spending profiles, contact phones & CRM records</p>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </span>
        </button>
      </div>

      {/* Daily Sales Table Breakdown */}
      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#e5e2e1] font-serif font-bold text-[#1a1a1a] text-base">
          Daily Sales Performance Breakdown
        </div>

        <table className="w-full text-xs text-left text-[#1c1b1b]">
          <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Total Orders Placed</th>
              <th className="p-4 text-right">Settled Revenue Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2e1]">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-[#5e5f5c]">Loading sales metrics...</td>
              </tr>
            ) : salesData.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-[#5e5f5c]">No sales records available yet.</td>
              </tr>
            ) : (
              salesData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#fdf8f8] transition-colors">
                  <td className="p-4 font-semibold text-[#1a1a1a]">{row.date}</td>
                  <td className="p-4 font-semibold text-[#5e5f5c]">{row.orders} order(s)</td>
                  <td className="p-4 font-serif font-bold text-[#1a1a1a] text-right">{formatPrice(row.sales)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

