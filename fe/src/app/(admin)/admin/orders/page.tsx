'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Order } from '../../../../types';
import { Search, Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [governorateFilter, setGovernorateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        if (governorateFilter) params.set('governorate', governorateFilter);
        params.set('page', page.toString());
        params.set('limit', '15');

        const res = await apiFetch(`/orders/admin/list?${params.toString()}`);
        setOrders(res.items || res.data || res || []);
        setTotal(res.pagination?.total || (res.items || res).length);
        setPages(res.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [search, statusFilter, governorateFilter, page]);

  const handleExportCsv = () => {
    window.open('http://localhost:4000/api/v1/reports/export?type=orders', '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Order Operations</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Client Dispatches & Orders</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Manage customer COD orders, delivery pipelines, invoices, and fulfillment.</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export Ledger CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#e5e2e1] shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
          />
          <Search className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3" />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 text-xs font-semibold bg-[#f7f3f2] border border-[#e5e2e1] rounded-md px-3 py-2.5 text-[#1a1a1a]"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
        </select>

        {/* Governorate Filter */}
        <select
          value={governorateFilter}
          onChange={(e) => setGovernorateFilter(e.target.value)}
          className="w-full md:w-44 text-xs font-semibold bg-[#f7f3f2] border border-[#e5e2e1] rounded-md px-3 py-2.5 text-[#1a1a1a]"
        >
          <option value="">All Governorates</option>
          <option value="Cairo">Cairo</option>
          <option value="Giza">Giza</option>
          <option value="Alexandria">Alexandria</option>
          <option value="Qalyubia">Qalyubia</option>
          <option value="Sharqia">Sharqia</option>
          <option value="Dakahlia">Dakahlia</option>
          <option value="Suez">Suez</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#1c1b1b]">
            <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Governorate</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Placed Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2e1]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#5e5f5c]">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#5e5f5c]">No orders found matching filters.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#fdf8f8] transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#1a1a1a]">#{ord.orderNumber}</td>
                    <td className="p-4 font-semibold text-[#1a1a1a]">{ord.customerInfo.name}</td>
                    <td className="p-4 text-[#5e5f5c]">{ord.customerInfo.phone}</td>
                    <td className="p-4">{ord.shippingAddress.governorate}</td>
                    <td className="p-4 font-serif font-bold text-[#1a1a1a]">{formatPrice(ord.grandTotal)}</td>
                    <td className="p-4">
                      <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#e5e2e1]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-[#5e5f5c]">{formatDate(ord.createdAt)}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a1a1a] hover:bg-[#ebe7e6] bg-[#f1edec] px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="p-4 border-t border-[#e5e2e1] flex items-center justify-between text-xs text-[#5e5f5c]">
            <span>Showing page {page} of {pages} ({total} total dispatches)</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-md border border-[#e5e2e1] disabled:opacity-40 hover:bg-[#f1edec]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-md border border-[#e5e2e1] disabled:opacity-40 hover:bg-[#f1edec]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

