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
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Operational Exports</h1>
        <p className="text-xs text-slate-500 mt-0.5">Export operational datasets to CSV/Excel for accounting & fulfillment.</p>
      </div>

      {/* CSV Downloads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => downloadReport('orders')}
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">Orders Report</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">CSV download with all customer order lines & statuses</p>
          </div>
          <span className="mt-4 text-xs font-bold text-rose-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download CSV
          </span>
        </button>

        <button
          onClick={() => downloadReport('sales')}
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">Sales & Revenue</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">CSV download for delivered COD order totals</p>
          </div>
          <span className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download CSV
          </span>
        </button>

        <button
          onClick={() => downloadReport('inventory')}
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">Inventory Report</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">CSV download of SKUs, prices & stock balances</p>
          </div>
          <span className="mt-4 text-xs font-bold text-sky-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download CSV
          </span>
        </button>

        <button
          onClick={() => downloadReport('customers')}
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">Customer List</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">CSV export of customer directory & lifetime spend</p>
          </div>
          <span className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download CSV
          </span>
        </button>
      </div>

      {/* Daily Sales Table Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Daily Sales Performance Breakdown
        </div>

        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4 text-right">Delivered Sales Total (EGP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">Loading daily sales analytics...</td>
              </tr>
            ) : salesData.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">No daily sales records available yet.</td>
              </tr>
            ) : (
              salesData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{row.date}</td>
                  <td className="p-4 font-semibold text-slate-700">{row.orders} order(s)</td>
                  <td className="p-4 font-extrabold text-emerald-600 text-right">{formatPrice(row.sales)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
